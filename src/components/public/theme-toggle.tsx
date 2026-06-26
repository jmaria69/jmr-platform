'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [isIvory, setIsIvory] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('praxia-theme');
    if (saved === 'ivory') {
      document.documentElement.classList.add('ivory');
      setIsIvory(true);
    }
  }, []);

  const toggle = () => {
    if (isIvory) {
      document.documentElement.classList.remove('ivory');
      localStorage.setItem('praxia-theme', 'dark');
      setIsIvory(false);
    } else {
      document.documentElement.classList.add('ivory');
      localStorage.setItem('praxia-theme', 'ivory');
      setIsIvory(true);
    }
  };

  // Evita hydration mismatch
  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={toggle}
      aria-label={isIvory ? 'Cambiar a tema oscuro' : 'Cambiar a tema marfil'}
      className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
    >
      {isIvory ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
}
