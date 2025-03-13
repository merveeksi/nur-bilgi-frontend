"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { Book, BookOpen, HandHeart, Heart, HelpCircle, Home, MessageSquare, Clock, Shield, Notebook, LogIn, UserPlus, Sun, Moon, Info } from "lucide-react";
import Logo from "./logo";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const links = [
    { name: "AnaSayfa", href: "/", icon: Home },
    { name: "Hakkımızda", href: "/hakkimizda", icon: Info },
    { name: "Chatbot", href: "/chatbot", icon: MessageSquare },
    { name: "NamazVakitleri", href: "/namaz-vakitleri", icon: Clock },
    { name: "Kur'an", href: "/kuran", icon: Book },
    { name: "Hadis", href: "/hadis", icon: BookOpen },
    { name: "İlmihal", href: "/ilmihal", icon: Shield },
    { name: "Dua", href: "/dua", icon: HandHeart },
    { name: "Notlarım", href: "/notlarim", icon: Notebook },
    { name: "Favorilerim", href: "/favorilerim", icon: Heart },
    { name: "SSS", href: "/sss", icon: HelpCircle },
  ];
  
  const authLinks = [
    { name: "Giriş", href: "/giris", icon: LogIn },
    { name: "Kaydol", href: "/kaydol", icon: UserPlus },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="top-6 inset-x-0 z-40 mx-auto px-2 w-full max-w-full">
      <nav className="flex items-center justify-between backdrop-blur-md bg-emerald-600/90 w-full dark:bg-slate-900/90 rounded-2xl shadow-lg border border-slate-700/30 px-2">
        {/* Logo */}
        <Logo />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 px-8 flex-grow justify-center">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isActive 
                    ? "text-gray-600" 
                    : "text-slate-200 hover:text-gray-600"
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          {/* Auth Links */}
          <div className="flex items-center border-l pl-6 border-slate-600/40">
            {!isLoggedIn && authLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1 ml-3 pr-6 text-sm font-medium text-slate-200 hover:text-gray-600 transition-colors"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-4 p-2 rounded-full hover:bg-slate-700/30 text-slate-200 border border-slate-700/40"
              aria-label={theme === 'dark' ? 'Aydınlık temaya geç' : 'Karanlık temaya geç'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-yellow-300" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          {/* Theme Toggle for Mobile */}
          <button
            onClick={toggleTheme}
            className="mr-2 p-2 rounded-full hover:bg-slate-700/30 text-slate-200"
            aria-label={theme === 'dark' ? 'Aydınlık temaya geç' : 'Karanlık temaya geç'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-300" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          
          <button 
            onClick={toggleMobileMenu}
            className="text-white p-2 rounded-full hover:bg-slate-700/50"
            aria-expanded={isMobileMenuOpen}
            aria-label="Ana menüyü açın"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 mt-2 p-4 bg-slate-800 dark:bg-slate-900 rounded-lg shadow-lg border border-slate-700/30 transition-all duration-200 ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col space-y-3">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={`flex items-center space-x-2 p-2 rounded-lg ${
                  isActive 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : "text-slate-200 hover:bg-slate-700/50 hover:text-emerald-400"
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          
          {/* Auth Links for Mobile */}
          {!isLoggedIn && (
            <>
              <div className="border-t border-slate-700 my-2"></div>
              {authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-2 p-2 rounded-lg text-slate-200 hover:bg-slate-700/50 hover:text-emerald-400"
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </header>
  );
} 