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
    <header className="w-full max-w-full">
      {!showExpandableTabs ? (
        <nav className="flex flex-wrap items-center justify-between bg-emerald-600 w-full dark:bg-emerald-700 rounded-xl shadow-lg px-3 py-2">
          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-wrap items-center space-x-1 md:space-x-3 lg:space-x-6 px-2 md:px-4 lg:px-6 flex-grow justify-center">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap px-1 py-1 rounded-md ${
                    isActive 
                      ? "text-white bg-emerald-500/30" 
                      : "text-white hover:bg-emerald-500/20"
                  }`}
                >
                  <link.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Auth Links */}
            <div className="flex items-center border-l pl-2 md:pl-4 lg:pl-6 border-white/40">
              {!isLoggedIn ? (
                // Show login and register links if not logged in
                authLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1 ml-2 md:ml-3 text-sm font-medium text-white hover:text-yellow-200 transition-colors whitespace-nowrap"
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
                className="ml-2 md:ml-4 p-2 rounded-full hover:bg-emerald-500 text-white"
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
                className="ml-2 md:ml-4 p-2 rounded-full hover:bg-emerald-500 text-white"
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
              className="mr-2 p-2 rounded-full hover:bg-emerald-500 text-white"
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
              className="text-white p-2 rounded-full hover:bg-emerald-500"
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
        <div className="bg-emerald-600 dark:bg-emerald-700 rounded-full shadow-md p-1 flex items-center overflow-hidden">
          <div className="flex-1 overflow-x-auto">
            <ExpandableTabs 
              tabs={tabs} 
              activeTab={activeTab}
              onChange={handleTabChange}
              activeColor="text-yellow-300" 
              className="border-emerald-500 dark:border-emerald-600"
            />
          </div>
          
          <div className="flex items-center space-x-2 px-3">
            {isLoggedIn && (
              <UserProfileMenu />
            )}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-emerald-500 text-white"
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
              className="p-2 rounded-full hover:bg-emerald-500 text-white"
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
          className={`md:hidden absolute top-full left-0 right-0 mt-2 p-4 bg-emerald-600 dark:bg-emerald-700 rounded-lg shadow-lg transition-all duration-200 ${
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
                      ? "bg-emerald-500/20 text-yellow-300" 
                      : "text-white hover:bg-emerald-500/50 hover:text-yellow-200"
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
                <div className="border-t border-white/40 my-2"></div>
                {authLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-2 p-2 rounded-lg text-white hover:bg-emerald-500/50 hover:text-yellow-200"
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