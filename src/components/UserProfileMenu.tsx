"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext";
import { User, LogOut, Settings, Bell, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserProfileMenu() {
  const { user, isLoggedIn, logout } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get display name based on available user fields
  const displayName = user?.fullName || 
                      (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 
                      user?.firstName || user?.lastName || user?.name || user?.username || 'Kullanıcı');

  const handleLogout = () => {
    showLoading("Çıkış yapılıyor...");
    logout();
    setIsMenuOpen(false);
    
    setTimeout(() => {
      hideLoading();
      router.push("/");
    }, 500);
  };

  const handleNavigation = (path: string) => {
    showLoading("Sayfa yükleniyor...");
    setIsMenuOpen(false);
    
    setTimeout(() => {
      hideLoading();
      router.push(path);
    }, 500);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/giris">
          <Button variant="ghost" size="sm" className="h-8 px-3 py-1">
            Giriş Yap
          </Button>
        </Link>
        <Link href="/kayit">
          <Button size="sm" className="h-8 px-3 py-1">
            Kaydol
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 rounded-full bg-white p-1 pr-3 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300">
          <User className="h-3 w-3" />
        </span>
        <span className="max-w-[80px] truncate">{displayName}</span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-lg bg-white p-2 shadow-lg ring-1 ring-gray-200 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
          <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-700">
            <p className="font-medium text-gray-900 dark:text-white">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>

          <div className="py-1">
            <button
              onClick={() => handleNavigation("/profilim")}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <User className="h-4 w-4" />
              Profilim
            </button>
            <button
              onClick={() => handleNavigation("/profilim/ayarlar")}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Settings className="h-4 w-4" />
              Ayarlar
            </button>
            <button
              onClick={() => handleNavigation("/profilim/uyelik")}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <CreditCard className="h-4 w-4" />
              Üyelik
            </button>
            <button
              onClick={() => handleNavigation("/bildirimler")}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Bell className="h-4 w-4" />
              Bildirimler
            </button>
          </div>

          <div className="border-t border-gray-100 pt-1 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4" />
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 