"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FullPageLoader } from "@/components/ui/loading";
import { getCurrentUser, isAuthenticated, Subscription } from '@/services/authService';

// Uygulama özgü kullanıcı tipi
interface AppUser {
  id: string; // string olarak tanımlayalım
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  questionCredits?: number;
  subscription?: Subscription;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, isLoggedIn } = useAuth();
  const [user, setUser] = useState<AppUser | null>(null);

  // Eğer kullanıcı giriş yapmamışsa, giriş sayfasına yönlendir
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/giris");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
    if (!isAuthenticated()) {
      router.push('/giris?redirect=profilim');
      return;
    }
    
    // Kullanıcı bilgilerini al
    const currentUser = getCurrentUser();
    if (currentUser) {
      // Kullanıcı tipi dönüşümü
      const appUser: AppUser = {
        id: String(currentUser.id), // ID'yi string'e çevirelim
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email,
        username: currentUser.username,
        questionCredits: currentUser.questionCredits,
        subscription: currentUser.subscription
      };
      setUser(appUser);
    }
  }, [router]);

  if (!isLoggedIn || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <FullPageLoader size="lg" text="Profil bilgileri yükleniyor..." />
      </div>
    );
  }

  // Abonelik planı adını getiren yardımcı fonksiyon
  const getPlanName = (planId: string): string => {
    switch (planId) {
      case 'basic':
        return 'Temel Plan';
      case 'premium':
        return 'Premium Plan';
      case 'yearly':
        return 'Yıllık Plan';
      default:
        return 'Bilinmeyen Plan';
    }
  };
  
  // Tarih formatını düzenleyen yardımcı fonksiyon
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Geçersiz tarih';
    }
  };
  
  // Kalan gün sayısını hesaplayan yardımcı fonksiyon
  const getRemainingDays = (endDateString: string): number => {
    try {
      const endDate = new Date(endDateString);
      const today = new Date();
      
      // Milisaniye cinsinden farkı hesapla ve günlere çevir
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      return 0;
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profilim</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Kişisel bilgilerinizi görüntüleyin ve yönetin
          </p>
        </div>

        <div className="mx-auto max-w-3xl rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center gap-4 border-b border-gray-200 pb-6 dark:border-gray-800 md:flex-row md:items-start md:justify-start">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
              <User className="h-12 w-12" />
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-500 dark:text-gray-400">Kullanıcı</p>
            </div>

            <div className="ml-auto">
              <Link href="/profilim/ayarlar">
                <Button variant="outline">Profili Düzenle</Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg border bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-500 dark:text-gray-400">Kullanıcı Adı</h3>
                  <p className="text-gray-900 dark:text-white">@{authUser?.username}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-500 dark:text-gray-400">E-posta Adresi</h3>
                  <p className="text-gray-900 dark:text-white">{user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <AtSign className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-500 dark:text-gray-400">Kullanıcı ID</h3>
                  <p className="text-gray-900 dark:text-white">{user.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 