"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, Settings, Bell, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserProfileMenu() {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push("/");
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
        <span className="max-w-[80px] truncate">{user?.name}</span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-lg bg-white p-2 shadow-lg ring-1 ring-gray-200 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
          <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-700">
            <p className="font-medium text-gray-900 dark:text-white">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>

          <div className="py-1">
            <Link
              href="/profil"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-4 w-4" />
              Profilim
            </Link>
            <Link
              href="/ayarlar"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Ayarlar
            </Link>
            <Link
              href="/favorilerim"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart className="h-4 w-4" />
              Favorilerim
            </Link>
            <Link
              href="/bildirimler"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <Bell className="h-4 w-4" />
              Bildirimler
            </Link>
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