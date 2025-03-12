"use client";
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex w-full fixed top-0 inset-x-0 bg-white dark:bg-slate-900 border-b border-emerald-100 dark:border-emerald-800/30 shadow-sm z-[5000] py-4 px-6 items-center justify-between",
        className
      )}
    >
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
            <span className="text-xl text-emerald-600">☪️</span>
          </div>
          <span className="ml-3 text-xl font-bold text-emerald-700 dark:text-emerald-400">Nur Bilgi</span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-10">
        {navItems.map((navItem: any, idx: number) => (
          <Link
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              "text-emerald-700 dark:text-emerald-300 items-center flex space-x-1 hover:text-emerald-500 dark:hover:text-emerald-400 text-base"
            )}
          >
            {navItem.icon && <span className="block sm:hidden">{navItem.icon}</span>}
            <span>{navItem.name}</span>
          </Link>
        ))}
      </div>
      
      <div className="flex items-center space-x-4">
        <Link href="/login" className="text-base font-medium text-emerald-700 dark:text-emerald-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
          Giriş Yap
        </Link>
        <Link href="/register" className="text-base font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 px-6 py-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
          Kayıt Ol
        </Link>
      </div>
    </div>
  );
};
