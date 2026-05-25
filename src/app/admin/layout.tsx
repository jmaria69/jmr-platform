'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

function PraxiaLabLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="al-go" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <filter id="al-fc"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#22d3ee" floodOpacity="1" /></filter>
        <filter id="al-fp"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f472b6" floodOpacity="1" /></filter>
        <filter id="al-fv"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#a78bfa" floodOpacity="1" /></filter>
        <filter id="al-fg"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#34d399" floodOpacity="1" /></filter>
        <filter id="al-core"><feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#a78bfa" floodOpacity="0.9" /></filter>
      </defs>
      <ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#al-go)" strokeWidth="1.3" fill="none" opacity="0.45" />
      <ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#al-go)" strokeWidth="1.3" fill="none" opacity="0.45" transform="rotate(60 36 36)" />
      <ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#al-go)" strokeWidth="1.3" fill="none" opacity="0.45" transform="rotate(120 36 36)" />
      <circle cx="36" cy="36" r="5.5" fill="url(#al-go)" filter="url(#al-core)" />
      <circle cx="36" cy="36" r="2.5" fill="white" opacity="0.95" />
      <circle fill="#22d3ee" filter="url(#al-fc)">
        <animate attributeName="cx" dur="5s" repeatCount="indefinite" calcMode="linear" values="70;60;36;12;2;12;36;60;70" />
        <animate attributeName="cy" dur="5s" repeatCount="indefinite" calcMode="linear" values="36;44;47;44;36;28;25;28;36" />
        <animate attributeName="r" dur="2.1s" repeatCount="indefinite" values="2.4;4.2;2.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </circle>
      <circle fill="#38bdf8" filter="url(#al-fc)" opacity="0.85">
        <animate attributeName="cx" dur="5s" begin="-2.5s" repeatCount="indefinite" calcMode="linear" values="70;60;36;12;2;12;36;60;70" />
        <animate attributeName="cy" dur="5s" begin="-2.5s" repeatCount="indefinite" calcMode="linear" values="36;44;47;44;36;28;25;28;36" />
        <animate attributeName="r" dur="1.7s" begin="-0.9s" repeatCount="indefinite" values="1.4;3.1;1.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </circle>
      <circle fill="#f472b6" filter="url(#al-fp)">
        <animate attributeName="cx" dur="7s" repeatCount="indefinite" calcMode="linear" values="53;41;27;17;19;31;46;55;53" />
        <animate attributeName="cy" dur="7s" repeatCount="indefinite" calcMode="linear" values="65;61;42;19;7;11;31;53;65" />
        <animate attributeName="r" dur="2.5s" begin="-0.5s" repeatCount="indefinite" values="2.4;4.2;2.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </circle>
      <circle fill="#e879f9" filter="url(#al-fp)" opacity="0.85">
        <animate attributeName="cx" dur="7s" begin="-3.5s" repeatCount="indefinite" calcMode="linear" values="53;41;27;17;19;31;46;55;53" />
        <animate attributeName="cy" dur="7s" begin="-3.5s" repeatCount="indefinite" calcMode="linear" values="65;61;42;19;7;11;31;53;65" />
        <animate attributeName="r" dur="1.9s" begin="-1.2s" repeatCount="indefinite" values="1.4;3.1;1.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </circle>
      <circle fill="#a78bfa" filter="url(#al-fv)">
        <animate attributeName="cx" dur="6s" repeatCount="indefinite" calcMode="linear" values="19;17;27;41;53;55;46;31;19" />
        <animate attributeName="cy" dur="6s" repeatCount="indefinite" calcMode="linear" values="65;53;31;11;7;19;42;61;65" />
        <animate attributeName="r" dur="2.3s" begin="-1.1s" repeatCount="indefinite" values="2.4;4.2;2.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </circle>
      <circle fill="#34d399" filter="url(#al-fg)" opacity="0.9">
        <animate attributeName="cx" dur="6s" begin="-3s" repeatCount="indefinite" calcMode="linear" values="19;17;27;41;53;55;46;31;19" />
        <animate attributeName="cy" dur="6s" begin="-3s" repeatCount="indefinite" calcMode="linear" values="65;53;31;11;7;19;42;61;65" />
        <animate attributeName="r" dur="2.0s" begin="-0.3s" repeatCount="indefinite" values="1.4;3.1;1.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </circle>
    </svg>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      setLoggingOut(false);
    }
  };

  return (
    <div>
      {/* Navbar única con logo animado */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-950/50 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo animado + nombre */}
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="transition-transform group-hover:scale-110 group-hover:rotate-3">
              <PraxiaLabLogo size={36} />
            </div>
            <span className="font-bold text-lg hidden sm:inline">Praxia Labs</span>
          </Link>

          {/* Botón logout */}
          <Button
            onClick={handleLogout}
            disabled={loggingOut}
            variant="outline"
            size="sm"
            className="border-purple-500/30 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {loggingOut ? 'Saliendo...' : 'Salir'}
          </Button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="pt-16 max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}