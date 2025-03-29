"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Check, Eye, EyeOff } from "lucide-react";
import { FullPageLoader } from "@/components/ui/loading";
import { useAuth } from "@/contexts/AuthContext";

export default function SifreSifirlama() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { forgotPassword, resetPassword, isLoading, error, clearError } = useAuth();
  
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Token yoksa email giriş ekranını, varsa şifre belirleme ekranını göster
  const isResetMode = !!token;

  // Email gönderme işlemi
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setInternalError(null);
    clearError();
    
    try {
      await forgotPassword(email);
      setSuccess("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.");
    } catch (error) {
      // Error is handled by auth context
    }
  };

  // Şifre sıfırlama işlemi
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setInternalError(null);
    
    // Şifre kontrolü
    if (newPassword !== confirmPassword) {
      setInternalError("Şifreler eşleşmiyor.");
      return;
    }

    if (newPassword.length < 6) {
      setInternalError("Şifre en az 6 karakter olmalıdır.");
      return;
    }
    
    try {
      await resetPassword(token!, newPassword);
      setSuccess("Şifreniz başarıyla güncellenmiştir. Şimdi giriş yapabilirsiniz.");
      
      // 3 saniye sonra giriş sayfasına yönlendir
      setTimeout(() => {
        router.push("/giris");
      }, 3000);
    } catch (error) {
      // Error is handled by auth context
    }
  };

  // Form inputları değiştiğinde hata mesajını temizle
  const clearErrorOnChange = () => {
    if (error) clearError();
    if (internalError) setInternalError(null);
  };

  // Gösterilecek hata mesajı
  const displayError = internalError || error;

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isResetMode ? "Yeni Şifre Belirleyin" : "Şifre Sıfırlama"}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isResetMode
              ? "Lütfen yeni şifrenizi girin"
              : "Şifrenizi sıfırlamak için e-posta adresinizi girin"}
          </p>
        </div>
        
        {displayError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <p>{displayError}</p>
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-500 dark:bg-green-900/20 dark:text-green-400">
            <Check className="h-5 w-5" />
            <p>{success}</p>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-4">
            <FullPageLoader size="sm" text={isResetMode ? "Şifreniz değiştiriliyor..." : "İstek gönderiliyor..."} />
          </div>
        )}

        {isResetMode ? (
          // Şifre belirleme formu
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="w-full space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Yeni Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Yeni şifrenizi girin"
                  value={newPassword}
                  onChange={(e) => {
                    clearErrorOnChange();
                    setNewPassword(e.target.value);
                  }}
                  required
                  disabled={isLoading}
                  className="flex h-12 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-emerald-400 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="w-full space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Şifre Tekrar
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifrenizi tekrar girin"
                  value={confirmPassword}
                  onChange={(e) => {
                    clearErrorOnChange();
                    setConfirmPassword(e.target.value);
                  }}
                  required
                  disabled={isLoading}
                  className="flex h-12 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-emerald-400 pr-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || success !== null}
            >
              Şifremi Güncelle
            </Button>
            
            <div className="text-center">
              <Link
                href="/giris"
                className="inline-flex items-center gap-1 text-sm font-medium text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Giriş sayfasına dön
              </Link>
            </div>
          </form>
        ) : (
          // Email formu
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <Input
              label="E-posta Adresi"
              type="email"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) => {
                clearErrorOnChange();
                setSuccess(null);
                setEmail(e.target.value);
              }}
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              Şifre Sıfırlama Bağlantısı Gönder
            </Button>
            
            <div className="text-center">
              <Link
                href="/giris"
                className="inline-flex items-center gap-1 text-sm font-medium text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Giriş sayfasına dön
              </Link>
            </div>
          </form>
        )}
      </div>
    </section>
  );
} 