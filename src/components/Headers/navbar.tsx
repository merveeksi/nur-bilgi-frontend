"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { Book, BookOpen, HandHeart, Heart, HelpCircle, Home, MessageSquare, Clock, Shield, Notebook, LogIn, UserPlus, Sun, Moon, Info, LucideIcon } from "lucide-react";
import Logo from "./logo";
import { useAuth } from "@/contexts/AuthContext";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import UserProfileMenu from "@/components/UserProfileMenu";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [showExpandableTabs, setShowExpandableTabs] = useState(false);
  
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
    { name: "Kaydol", href: "/kayit", icon: UserPlus },
  ];

  // Set up tabs for ExpandableTabs component
  const tabs = [
    ...links.map(link => ({ title: link.name, icon: link.icon, route: link.href })),
    { type: "separator" as const },
    ...authLinks.map(link => ({ title: link.name, icon: link.icon, route: link.href })),
  ];

  // Set active tab based on current pathname
  useEffect(() => {
    const index = tabs.findIndex(tab => 
      'route' in tab && tab.route === pathname
    );
    setActiveTab(index !== -1 ? index : null);
  }, [pathname, tabs]);

  // Handle tab change
  const handleTabChange = (index: number | null) => {
    if (index !== null && 'route' in tabs[index]) {
      router.push(tabs[index].route);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="top-6 inset-x-0 z-40 mx-auto px-2 w-full max-w-full">
      {!showExpandableTabs ? (
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
                      ? "text-yellow-500" 
                      : "text-slate-200 hover:text-emerald-400"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Auth Links */}
            <div className="flex items-center border-l pl-6 border-slate-600/40">
              {!isLoggedIn ? (
                // Show login and register links if not logged in
                authLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1 ml-3 text-sm font-medium text-slate-200 hover:text-emerald-400 transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                ))
              ) : (
                // Show user profile menu if logged in
                <div className="ml-3">
                  <UserProfileMenu />
                </div>
              )}
              
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
              
              {/* Toggle tabs button */}
              <button
                onClick={() => setShowExpandableTabs(true)}
                className="ml-4 p-2 rounded-full hover:bg-slate-700/30 text-slate-200 border border-slate-700/40"
                title="Sekmeli görünüme geç"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                </svg>
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
            
            {/* User Profile Menu for Mobile if logged in */}
            {isLoggedIn && (
              <div className="mr-2">
                <UserProfileMenu />
              </div>
            )}
            
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
      ) : (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full shadow-md border border-slate-200 dark:border-slate-700 p-1 flex items-center">
          <div className="flex-1">
            <ExpandableTabs 
              tabs={tabs} 
              activeTab={activeTab}
              onChange={handleTabChange}
              activeColor="text-emerald-500" 
              className="border-emerald-200 dark:border-emerald-800"
            />
          </div>
          
          <div className="flex items-center space-x-2 px-3">
            {isLoggedIn && (
              <UserProfileMenu />
            )}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-200"
              aria-label={theme === 'dark' ? 'Aydınlık temaya geç' : 'Karanlık temaya geç'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-yellow-300" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            
            <button
              onClick={() => setShowExpandableTabs(false)}
              className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-200"
              title="Standart görünüme geç"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu (only for standard view) */}
      {!showExpandableTabs && (
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
              <div>
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
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 