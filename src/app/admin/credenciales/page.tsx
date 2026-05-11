"use client";

import { useActionState, useState } from "react";
import { changePassword, type AuthState } from "@/app/actions/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Shield,
  ShieldCheck,
} from "lucide-react";

export default function CredentialsPage() {
  const [state, action, pending] = useActionState<AuthState | undefined, FormData>(
    changePassword,
    undefined
  );

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  function toggleVisibility(field: "current" | "new" | "confirm") {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Credenciales</h2>
        <p className="text-muted-foreground">
          Gestiona tu contraseña y la seguridad de tu cuenta.
        </p>
      </div>

      {/* Security overview */}
      <Card className="rounded-2xl glass border-gradient">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/10 p-2.5">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <CardTitle className="text-base">Estado de seguridad</CardTitle>
              <CardDescription>Tu cuenta está protegida</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/3">
              <Shield className="h-4 w-4 text-green-400" />
              <div>
                <p className="text-xs text-muted-foreground">Autenticación</p>
                <Badge variant="outline" className="mt-0.5 border-green-500/30 text-green-400 text-xs">
                  Activa
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/3">
              <KeyRound className="h-4 w-4 text-amber-400" />
              <div>
                <p className="text-xs text-muted-foreground">Sesión</p>
                <Badge variant="outline" className="mt-0.5 border-amber-500/30 text-amber-400 text-xs">
                  JWT / 7 días
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/3">
              <Shield className="h-4 w-4 text-cyan-400" />
              <div>
                <p className="text-xs text-muted-foreground">Cookies</p>
                <Badge variant="outline" className="mt-0.5 border-cyan-500/30 text-cyan-400 text-xs">
                  HttpOnly + Secure
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change password form */}
      <Card className="rounded-2xl glass border-gradient">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-500/10 p-2.5">
              <KeyRound className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-base">Cambiar contraseña</CardTitle>
              <CardDescription>
                Mínimo 8 caracteres, una mayúscula y un número.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-5">
            {/* Status messages */}
            {state?.error && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}
            {state?.success && (
              <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Contraseña actualizada correctamente.</span>
              </div>
            )}

            {/* Current password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña actual</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="pr-10 h-11 bg-white/3 border-white/10 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility("current")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  className="pr-10 h-11 bg-white/3 border-white/10 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  className="pr-10 h-11 bg-white/3 border-white/10 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={pending}
              className="w-full sm:w-auto shimmer-btn rounded-xl"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Actualizando...
                </>
              ) : (
                "Actualizar contraseña"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
