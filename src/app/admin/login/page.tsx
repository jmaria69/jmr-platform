'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { login } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function AdminLoginPage() {
    const [state, formAction, pending] = useFormState(login, { error: '' });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <Card className="card-admin w-full max-w-md">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl">Praxia Labs Admin</CardTitle>
                    <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@praxialabs.com"
                                disabled={pending}
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
                                disabled={pending}
                                className="border-slate-700 focus:border-purple-500"
                                required
                            />
                        </div>

                        {state?.error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                                {state.error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={pending}
                            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                        >
                            {pending ? 'Ingresando...' : 'Ingresar'}
                        </Button>
                    </form>
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