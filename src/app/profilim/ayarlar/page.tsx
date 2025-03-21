"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { FullPageLoader } from "@/components/ui/loading";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Kullanıcı bilgilerini form alanlarına yerleştir
  React.useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);
  
  // Eğer kullanıcı giriş yapmamışsa, giriş sayfasına yönlendir
  React.useEffect(() => {
    if (!isLoggedIn) {
      router.push("/giris");
    }
  }, [isLoggedIn, router]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsUpdating(true);
    
    // Burada gerçek bir API isteği yapılacaktı, şimdilik simüle ediyoruz
    setTimeout(() => {
      setSuccess("Profil bilgileriniz başarıyla güncellendi.");
      setIsUpdating(false);
    }, 1000);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsUpdating(true);
    
    // Şifrelerin eşleşip eşleşmediğini kontrol et
    if (newPassword !== confirmNewPassword) {
      setError("Yeni şifreler eşleşmiyor.");
      setIsUpdating(false);
      return;
    }
    
    // Burada gerçek bir API isteği yapılacaktı, şimdilik simüle ediyoruz
    setTimeout(() => {
      setSuccess("Şifreniz başarıyla güncellendi.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsUpdating(false);
    }, 1000);
  };

  if (!isLoggedIn || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <FullPageLoader size="lg" text="Hesap ayarları yükleniyor..." />
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hesap Ayarları</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Hesap bilgilerinizi güncelleyin
              </p>
            </div>
            <Link href="/profilim">
              <Button variant="outline">Profil Sayfasına Dön</Button>
            </Link>
          </div>
        </div>

        {success && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-600 dark:bg-green-900/20 dark:text-green-400">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {isUpdating && (
          <div className="mb-6 flex justify-center">
            <FullPageLoader size="sm" text="Bilgileriniz güncelleniyor..." />
          </div>
        )}

        <div className="mx-auto max-w-3xl space-y-8">
          {/* Profil Bilgileri Formu */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Profil Bilgileri
            </h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <Input
                label="Kullanıcı Adı"
                type="text"
                placeholder="Kullanıcı adınızı girin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isUpdating}
              />

              <Input
                label="E-posta Adresi"
                type="email"
                placeholder="E-posta adresinizi girin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isUpdating}
              />

              <Button type="submit" className="w-full" disabled={isUpdating}>
                Bilgileri Güncelle
              </Button>
            </form>
          </div>

          {/* Şifre Değiştirme Formu */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Şifre Değiştir
            </h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <Input
                label="Mevcut Şifre"
                type="password"
                placeholder="Mevcut şifrenizi girin"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={isUpdating}
              />

              <Input
                label="Yeni Şifre"
                type="password"
                placeholder="Yeni şifrenizi girin"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isUpdating}
              />

              <Input
                label="Yeni Şifre Tekrar"
                type="password"
                placeholder="Yeni şifrenizi tekrar girin"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                disabled={isUpdating}
              />

              <Button type="submit" className="w-full" disabled={isUpdating}>
                Şifreyi Güncelle
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
} 