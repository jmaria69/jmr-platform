'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function DashboardLink() {
    const [href, setHref] = useState('/admin/demo');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch('/api/auth/check', { credentials: 'include' });
                const { hasSession } = await res.json();
                setHref(hasSession ? '/admin/dashboard' : '/admin/demo');
            } catch {
                setHref('/admin/demo');
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    if (isLoading) {
        return (
            <div className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 font-semibold text-center opacity-50">
                🚀 Cargando...
            </div>
        );
    }

    return (
        <Link
            href={href}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-105 text-center"
        >
            🚀 Ir al Dashboard
        </Link>
    );
}