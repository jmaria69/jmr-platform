"use server";

import { redirect } from "next/navigation";
import { compare, hash } from "bcryptjs";
import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "../../lib/prisma";
import { createSession, deleteSession, getSession } from "@/lib/auth";
import { logThreatAwait, checkRateLimit } from "@/lib/security-logger";



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