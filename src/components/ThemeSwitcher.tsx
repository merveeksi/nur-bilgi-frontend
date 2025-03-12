"use client";

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // hydration hatalarını önlemek için client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 bg-white dark:bg-slate-800 p-2 rounded-full shadow-md transition-all duration-300 hover:scale-110"
      aria-label={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}
    </button>
  );
} 