'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { login, verify2FA, type AuthState } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function AdminLoginPage() {
    const [loginState, loginAction, loginPending] = useFormState(login, { error: '' });
    const [verifyState, verifyAction, verifyPending] = useFormState(verify2FA, { error: '' });

    return (
        <div className="flex items-center justify-center min-h-screen bg-transparent">
            <Card className="card-admin w-full max-w-md">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl">Praxia Labs Admin</CardTitle>
                    <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
                </CardHeader>
                <CardContent>
                    {loginState?.requires2FA ? (
                        // 2FA Verification Form
                        <form action={verifyAction} className="space-y-4">
                            {/* Error message */}
                            {verifyState?.error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                                    {verifyState.error}
                                </div>
                            )}
                            {/* Success message */}
                            {verifyState?.success && (
                                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-sm">
                                    Verificación exitosa. Redirigiendo...
                                </div>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="token" className="text-sm font-medium">
                                    Código de verificación
                                </label>
                                <Input
                                    id="token"
                                    name="token"
                                    type="text"
                                    placeholder="Ingrese el código 2FA"
                                    required
                                    autoComplete="one-time-code"
                                    className="border-slate-700 focus:border-purple-500"
                                />
                                {/* Hidden userId */}
                                <input type="hidden" name="userId" defaultValue={loginState?.userId ?? ""} />
                            </div>

                            <Button
                                type="submit"
                                disabled={verifyPending}
                                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                            >
                                {verifyPending ? 'Verificando...' : 'Verificar'}
                            </Button>
                            <div className="mt-4 text-center">
                                <Link href="/admin/login" className="text-sm text-purple-400 hover:text-purple-300">
                                    ← Volver al inicio de sesión
                                </Link>
                            </div>
                        </form>
                    ) : (
                        // Login Form
                        <form action={loginAction} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="admin@praxialabs.com"
                                    disabled={loginPending}
                                    className="border-slate-700 focus:border-purple-500"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">
                                    Contraseña
                                </label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    disabled={loginPending}
                                    className="border-slate-700 focus:border-purple-500"
                                    required
                                />
                            </div>

                            {loginState?.error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                                    {loginState.error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loginPending}
                                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                            >
                                {loginPending ? 'Ingresando...' : 'Ingresar'}
                            </Button>
                        </form>
                    )}
                    <div className="mt-6 text-center">
                        <Link href="/" className="text-sm text-purple-400 hover:text-purple-300">
                            ← Volver a Home
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}