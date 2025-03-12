"use client"

import React from "react"
import { FloatingNav } from "@/components/ui/floating-navbar"
import { Home, MessageSquare, Clock, BookOpen, BookMarked } from "lucide-react"

export default function FloatingNavDemo() {
  const navItems = [
    {
      name: "Ana Sayfa",
      link: "/",
      icon: <Home className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      name: "Chatbot",
      link: "/chatbot",
      icon: <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      name: "Namaz Vakitleri",
      link: "/prayer-times",
      icon: <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      name: "Kur'an",
      link: "/quran",
      icon: <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      name: "İlmihal",
      link: "/ilmihal",
      icon: <BookMarked className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
    },
  ]

  return (
    <div className="w-full">
      <FloatingNav navItems={navItems} />
    </div>
  )
} 