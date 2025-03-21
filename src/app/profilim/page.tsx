"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FullPageLoader } from "@/components/ui/loading";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();

  // Eğer kullanıcı giriş yapmamışsa, giriş sayfasına yönlendir
  React.useEffect(() => {
    if (!isLoggedIn) {
      router.push("/giris");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <FullPageLoader size="lg" text="Profil bilgileri yükleniyor..." />
      </div>
    );
  }

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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
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
                  <p className="text-gray-900 dark:text-white">@{user.username}</p>
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