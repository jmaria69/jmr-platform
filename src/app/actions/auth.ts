"use server";

/**
 * Auth Server Actions — login, logout, change password
 *
 * These run exclusively on the server and handle
 * credential verification + session management.
 */

import { redirect } from "next/navigation";
import { compare, hash } from "bcryptjs";
import { z } from "zod";
import { createSession, deleteSession, getSession } from "@/lib/auth";

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

// ─── DB access helpers (lazy import to support no-DB mode) ───

async function getAdminByEmail(email: string) {
  if (!process.env.DATABASE_URL) {
    // Env-based admin — credentials MUST be set via environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      // Fail securely: never fall back to hardcoded credentials
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD env vars are required");
    }

    if (email !== adminEmail) return null;

    const passwordHash = await hash(adminPassword, 12);
    return {
      id: "env-admin",
      email: adminEmail,
      name: "Admin",
      passwordHash,
      role: "admin",
    };
  }

  const { getDb } = await import("@/lib/db");
  const { adminUsers } = await import("@/lib/db/schema");
  const { eq } = await import("drizzle-orm");

  const db = getDb();
  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email));

  return rows[0] ?? null;
}

async function updateAdminPassword(userId: string, newHash: string) {
  if (!process.env.DATABASE_URL) {
    // In env mode, can't persist password changes
    return;
  }

  const { getDb } = await import("@/lib/db");
  const { adminUsers } = await import("@/lib/db/schema");
  const { eq } = await import("drizzle-orm");

  const db = getDb();
  await db
    .update(adminUsers)
    .set({ passwordHash: newHash, updatedAt: new Date() })
    .where(eq(adminUsers.id, userId));
}

async function updateLastLogin(userId: string) {
  if (!process.env.DATABASE_URL) return;

  const { getDb } = await import("@/lib/db");
  const { adminUsers } = await import("@/lib/db/schema");
  const { eq } = await import("drizzle-orm");

  const db = getDb();
  await db
    .update(adminUsers)
    .set({ lastLoginAt: new Date() })
    .where(eq(adminUsers.id, userId));
}

// ─── Login ───

export async function login(
  _prevState: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validated = loginSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { email, password } = validated.data;

  try {
    const admin = await getAdminByEmail(email);
    if (!admin) {
      return { error: "Credenciales inválidas" };
    }

    const passwordValid = await compare(password, admin.passwordHash);
    if (!passwordValid) {
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
): Promise<AuthState> {
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
