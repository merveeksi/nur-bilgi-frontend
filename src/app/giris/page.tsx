"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, User, AlertCircle } from "lucide-react";
import { FullPageLoader } from "@/components/ui/loading";

export default function LoginPage() {
  const router = useRouter();
  const { login, error, clearError, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
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
            Hesabınıza Giriş Yapın
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Nur Bilgi platformuna hoş geldiniz
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-4">
            <FullPageLoader size="sm" text="Giriş yapılıyor..." />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
              setPassword(e.target.value);
            }}
            required
            disabled={isLoading}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-emerald-500"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Beni hatırla
              </span>
            </label>
            <Link
              href="/sifre-sifirlama"
              className="text-sm font-medium text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Şifremi unuttum
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            <LogIn className="h-5 w-5" />
            Giriş Yap
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Hesabınız yok mu?{" "}
            <Link
              href="/kayit"
              className="font-medium text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Hemen kaydolun
            </Link>
          </p>
        </div>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-50 px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
              veya
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              // Demo mode - log in with a test account
              setEmail("ahmet@example.com");
              setPassword("password");
            }}
            disabled={isLoading}
          >
            <User className="h-5 w-5" />
            Demo Hesabıyla Giriş Yap
          </Button>
        </div>
      </div>
    </section>
  );
} 