"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, User, Mail, AlertCircle } from "lucide-react";
import { FullPageLoader } from "@/components/ui/loading";

export default function RegisterPage() {
  const router = useRouter();
  const { register, error, clearError, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (password !== confirmPassword) {
      setFormError("Şifreler eşleşmiyor.");
      return;
    }

    try {
      await register(name, email, password);
      router.push("/");
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Yeni Hesap Oluşturun
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Nur Bilgi platformuna kaydolun
          </p>
        </div>

        {(error || formError) && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <p>{error || formError}</p>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-4">
            <FullPageLoader size="sm" text="Hesabınız oluşturuluyor..." />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Ad Soyad"
            type="text"
            placeholder="Ad Soyad"
            value={name}
            onChange={(e) => {
              clearError();
              setName(e.target.value);
            }}
            required
            disabled={isLoading}
          />

          <Input
            label="E-posta Adresi"
            type="email"
            placeholder="ornek@mail.com"
            value={email}
            onChange={(e) => {
              clearError();
              setEmail(e.target.value);
            }}
            required
            disabled={isLoading}
          />

          <Input
            label="Şifre"
            type="password"
            placeholder="Şifrenizi girin"
            value={password}
            onChange={(e) => {
              clearError();
              setFormError("");
              setPassword(e.target.value);
            }}
            required
            disabled={isLoading}
          />

          <Input
            label="Şifre (Tekrar)"
            type="password"
            placeholder="Şifrenizi tekrar girin"
            value={confirmPassword}
            onChange={(e) => {
              clearError();
              setFormError("");
              setConfirmPassword(e.target.value);
            }}
            required
            disabled={isLoading}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms"
              className="h-4 w-4 rounded border-gray-300 text-emerald-500"
              required
              disabled={isLoading}
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              <span>
                <Link
                  href="/kullanim-sartlari"
                  className="font-medium text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Kullanım Şartları
                </Link>{" "}
                ve{" "}
                <Link
                  href="/gizlilik-politikasi"
                  className="font-medium text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Gizlilik Politikası
                </Link>
                'nı kabul ediyorum
              </span>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            <User className="h-5 w-5" />
            Kaydol
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Zaten hesabınız var mı?{" "}
            <Link
              href="/giris"
              className="font-medium text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Giriş yapın
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
} 