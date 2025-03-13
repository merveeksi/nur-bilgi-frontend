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
} 