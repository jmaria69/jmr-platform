"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, resetPassword, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeft, CheckCircle2, KeyRound, Loader2 } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [requestState, requestAction, requestPending] = useActionState<AuthState | undefined, FormData>(requestPasswordReset, undefined);
  const [resetState, resetAction, resetPending] = useActionState<AuthState | undefined, FormData>(resetPassword, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl glass-strong border-gradient p-8">
        <div className="text-center mb-8">
          <KeyRound className="mx-auto mb-4 h-10 w-10 text-indigo-400" />
          <h1 className="text-2xl font-bold">Restablecer contraseña</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {token ? "Elige una nueva contraseña." : "Te enviaremos un enlace seguro por correo."}
          </p>
        </div>

        {!token ? (
          <form action={requestAction} className="space-y-5">
            {requestState?.success && (
              <div className="flex items-center gap-2 rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                Si el correo existe, recibirás un enlace para continuar.
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required placeholder="admin@praxialabs.com" />
            </div>
            <Button type="submit" disabled={requestPending} className="w-full">
              {requestPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enviar enlace
            </Button>
          </form>
        ) : (
          <form action={resetAction} className="space-y-5">
            {resetState?.error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4" />
                {resetState.error}
              </div>
            )}
            {resetState?.success && (
              <div className="flex items-center gap-2 rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                Contraseña actualizada. Ya puedes iniciar sesión.
              </div>
            )}
            <input type="hidden" name="token" value={token} readOnly />
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" required minLength={8} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required minLength={8} />
            </div>
            <Button type="submit" disabled={resetPending} className="w-full">
              {resetPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Cambiar contraseña
            </Button>
          </form>
        )}

        <Link href="/login" className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver al login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
