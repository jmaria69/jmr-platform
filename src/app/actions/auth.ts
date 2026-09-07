"use server";

import { redirect } from "next/navigation";
import { compare, hash } from "bcryptjs";
import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "../../lib/prisma";
import { createSession, deleteSession, getSession } from "@/lib/auth";
import { logThreatAwait, checkRateLimit } from "@/lib/security-logger";
import { createHmac, timingSafeEqual } from "node:crypto";

// ─── TOTP helpers (RFC 6238) ───

function isValidBase32(str: string): boolean {
  return /^[A-Z2-7]+=*$/.test(str.toUpperCase());
}

function base32Decode(encoded: string): Buffer {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const clean = encoded.toUpperCase().replace(/=+$/, "").replace(/[^A-Z2-7]/g, "");
  if (clean.length === 0) return Buffer.alloc(0);

  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (const char of clean) {
    const idx = alphabet.indexOf(char);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      output.push((value >>> bits) & 0xff);
    }
  }
  return Buffer.from(output);
}

function generateTOTP(secret: string, epoch: number, period = 30, digits = 6): string {
  const key = base32Decode(secret);
  const counter = Math.floor(epoch / period);
  const counterBuf = Buffer.alloc(8);
  counterBuf.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  counterBuf.writeUInt32BE(counter % 0x100000000, 4);

  const hmac = createHmac("sha1", key).update(counterBuf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return (code % 10 ** digits).toString().padStart(digits, "0");
}

function verifyTOTP(secret: string, token: string, window = 2): boolean {
  const cleanToken = token.trim();
  if (!/^\d{6}$/.test(cleanToken)) return false;

  const now = Math.floor(Date.now() / 1000);
  for (let delta = -window; delta <= window; delta++) {
    try {
      const expected = generateTOTP(secret, now + delta * 30);
      if (expected.length === cleanToken.length) {
        if (timingSafeEqual(Buffer.from(expected), Buffer.from(cleanToken))) {
          return true;
        }
      }
    } catch {
      continue;
    }
  }
  return false;
}

// ─── Validation schemas ───

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Contraseña obligatoria"),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Contraseña actual obligatoria"),
  newPassword: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Al menos una mayúscula")
    .regex(/[0-9]/, "Al menos un número"),
  confirmPassword: z.string(),
});

// ─── Types ───

export interface AuthState {
  error?: string;
  success?: boolean;
  requires2FA?: boolean;
  userId?: string;
}

// ─── DB access helpers ───

async function getAdminByEmail(email: string) {
  const admin = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase() },
  });
  return admin;
}

async function updateAdminPassword(userId: string, newHash: string) {
  await prisma.adminUser.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });
}

async function updateLastLogin(userId: string) {
  await prisma.adminUser.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });
}

// ─── Login ───

export async function login(
  _prevState: AuthState | undefined,
  formData: FormData
) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validated = loginSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }
  const { email, password } = validated.data;

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim()
    || hdrs.get("x-real-ip") || "unknown";
  const ua = hdrs.get("user-agent") || "";

  const { blocked, count } = checkRateLimit(ip, "login");
  if (blocked) {
    await logThreatAwait({
      type: "brute_force",
      ip,
      path: "/login",
      userAgent: ua,
      details: `Brute force: ${count} intentos de login en 1 min`,
    });
    return { error: "Demasiados intentos. Espera 1 minuto." };
  }

  try {
    const admin = await getAdminByEmail(email);

    if (!admin) {
      await logThreatAwait({
        type: "suspicious",
        ip,
        path: "/login",
        userAgent: ua,
        details: `Login fallido: email no encontrado (${email.slice(0, 3)}***)`,
      });
      return { error: "Credenciales inválidas" };
    }

    const passwordValid = await compare(password, admin.passwordHash);

    if (!passwordValid) {
      await logThreatAwait({
        type: "brute_force",
        ip,
        path: "/login",
        userAgent: ua,
        details: `Login fallido: contraseña incorrecta para ${admin.email.slice(0, 3)}***`,
      });
      return { error: "Credenciales inválidas" };
    }

    // Check if 2FA is enabled for this user
    if (admin.totpEnabled && admin.totpSecret) {
      // Require 2FA verification
      return {
        requires2FA: true,
        userId: admin.id,
        success: false // Not fully authenticated yet
      };
    }

    await createSession({
      userId: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    await updateLastLogin(admin.id);
  } catch (err) {
    console.error("Login error:", err);
    return { error: "Error interno. Inténtalo de nuevo." };
  }

  redirect("/admin/dashboard");
}

// ─── Logout ───

export async function logout() {
  await deleteSession();
  redirect("/login");
}

// ─── Change password ───

export async function verify2FA(
  _prevState: AuthState | undefined,
  formData: FormData
) {
  const raw = {
    userId: formData.get("userId") as string,
    token: formData.get("token") as string,
  };

  const userId = raw.userId;
  const token = raw.token;

  if (!userId || !token) {
    return { error: "Datos incompletos" };
  }

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim()
    || hdrs.get("x-real-ip") || "unknown";
  const ua = hdrs.get("user-agent") || "";

  try {
    const admin = await prisma.adminUser.findUnique({
      where: { id: userId },
    });

    if (!admin) {
      await logThreatAwait({
        type: "suspicious",
        ip,
        path: "/verify-2fa",
        userAgent: ua,
        details: `2FA fallido: usuario no encontrado (ID: ${userId})`,
      });
      return { error: "Usuario no encontrado" };
    }

    if (!admin.totpEnabled || !admin.totpSecret) {
      await logThreatAwait({
        type: "suspicious",
        ip,
        path: "/verify-2fa",
        userAgent: ua,
        details: `2FA fallido: 2FA no habilitado para usuario ${admin.email.slice(0, 3)}***`,
      });
      return { error: "2FA no habilitado para este usuario" };
    }

    if (!isValidBase32(admin.totpSecret)) {
      console.error(`Secret inválido para usuario ${admin.email}: ${admin.totpSecret.slice(0, 5)}...`);
      return { error: "Error de configuración 2FA. Contacta al administrador." };
    }

    const isValid = verifyTOTP(admin.totpSecret, token, 1);

    if (!isValid) {
      await logThreatAwait({
        type: "suspicious",
        ip,
        path: "/verify-2fa",
        userAgent: ua,
        details: `Código 2FA incorrecto para usuario ${admin.email.slice(0, 3)}***`,
      });
      return { error: "Código 2FA incorrecto" };
    }

    // Create session
    await createSession({
      userId: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    await updateLastLogin(admin.id);
  } catch (err) {
    // Re-throw Next.js redirect errors so they work properly
    if (err instanceof Error && err.message === "NEXT_REDIRECT") {
      throw err;
    }
    console.error("2FA verification error:", err);
    return { error: "Error interno. Inténtalo de nuevo." };
  }

  redirect("/admin/dashboard");
}

// ─── Change password ───

export async function changePassword(
  _prevState: AuthState | undefined,
  formData: FormData
) {
  const session = await getSession();
  if (!session) {
    return { error: "No autenticado" };
  }

  const raw = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validated = changePasswordSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { currentPassword, newPassword, confirmPassword } = validated.data;

  if (newPassword !== confirmPassword) {
    return { error: "Las contraseñas no coinciden" };
  }

  try {
    const admin = await getAdminByEmail(session.email);
    if (!admin) {
      return { error: "Usuario no encontrado" };
    }

    const passwordValid = await compare(currentPassword, admin.passwordHash);
    if (!passwordValid) {
      return { error: "Contraseña actual incorrecta" };
    }

    const newHash = await hash(newPassword, 12);
    await updateAdminPassword(admin.id, newHash);

    return { success: true };
  } catch (err) {
    console.error("Change password error:", err);
    return { error: "Error interno. Inténtalo de nuevo." };
  }
}