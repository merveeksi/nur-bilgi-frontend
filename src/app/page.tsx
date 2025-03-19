'use client'

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import LandingHero from '@/components/Home/landing-hero'
import PageSection from '@/components/ui/page-section'
import FeatureCard from '@/components/ui/feature-card'
import { HoverEffect } from '@/components/ui/hover-effect'
import { Metadata } from 'next'
import { useEffect } from 'react'
// Dinamik Sözler Componenti
const DynamicQuotes = dynamic(() => import('@/components/DynamicQuotes'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-60">
      <div className="animate-pulse text-3xl text-emerald-600">
        <div className="h-20 w-20 rounded-full bg-emerald-200 dark:bg-emerald-900 flex items-center justify-center">
           ☾﷽
        </div>
      </div>
    </div>
  )
});

// AI Chatbot bileşenini dinamik olarak import ediyoruz
const IslamicChatbot = dynamic(() => import('./chatbot/islamic-chatbot'), { 
  ssr: false,
  loading: () => (
    <div className="flex flex-col h-[500px] bg-white dark:bg-slate-800 rounded-lg shadow-md animate-pulse">
      <div className="bg-emerald-700 dark:bg-emerald-800 h-16"></div>
      <div className="flex-1 p-4"></div>
      <div className="p-4 h-16 border-t border-gray-200 dark:border-slate-700"></div>
    </div>
  )
})

// Define the features data
const features = [
  {
    emoji: "🤖",
    title: "İslami Chatbot",
    description: "Dini sorularınızı anında yanıtlayan yapay zeka destekli chatbot.",
    link: "/chatbot"
  },
  {
    emoji: "🕌",
    title: "Namaz Vakitleri",
    description: "Bulunduğunuz konuma göre güncel namaz vakitleri.",
    link: "/namaz-vakitleri"
  },
  {
    emoji: "📖",
    title: "Kur'an-ı Kerim",
    description: "Kur'an-ı Kerim'i okuyun, dinleyin ve ayetleri inceleyin.",
    link: "/kuran"
  },
  {
    emoji: "📜",
    title: "Hadisler",
    description: "Hadisleri okuyun ve inceleyin.",
    link: "/hadisler"
  },
  {
    emoji: "📚",
    title: "İlmihal Bilgileri",
    description: "Kapsamlı ilmihal bilgileri ve dini konularda detaylı açıklamalar.",
    link: "/ilmihal"
  },
  {
    emoji: "🧭",
    title: "Kıble",
    description: "Kıble ve kıble yönünüzü hesaplayın.",
    link: "/diger-hizmetler/kible-pusulasi"
  },

  {
    emoji: "🤲",
    title: "Dua ve Zikirler",
    description: "Günlük dualar, zikirler ve tesbihatlar.",
    link: "/dua"
  },
  {
    emoji: "📝",
    title: "Notlar ve Favoriler",
    description: "Kişisel notlar tutun ve favori içeriklerinizi kaydedin.",
    link: "/favorilerim"
  },
  {
    emoji: "📿",
    title: "Zikirmatik",
    description: "Zikir ve tesbihatlarınızı saymanız için dijital zikirmatik.",
    link: "/diger-hizmetler/zikirmatik"
  },
  {
    emoji: "✨ﷲ",
    title: "Esmaül Hüsna",
    description: "Allah'ın 99 ismini öğrenin ve anlamlarını inceleyin.",
    link: "/diger-hizmetler/esmaul-husna"
  },
  {
    emoji: "💰",
    title: "Zekat Hesaplama",
    description: "Güncel altın ve gümüş fiyatlarıyla zekat hesaplaması yapın.",
    link: "/diger-hizmetler/zekat-hesapla"
  },
  {
    emoji: "⏰",
    title: "Namaz Hatırlatıcı",
    description: "Namaz vakitlerinde hatırlatma alın ve takip edin.",
    link: "/diger-hizmetler/namaz-hatirlatici"
  },
  {
    emoji: "🗓️",
    title: "Kaza Namazları",
    description: "Kaza namazlarınızı takip edin ve planlamanızı yapın.",
    link: "/diger-hizmetler/kaza-namazlari"
  },
  {
    emoji: "🌙",
    title: "Dini Günler ve Geceler",
    description: "Önemli dini gün ve geceleri takviminizde görün ve bilgi edinin.",
    link: "/diger-hizmetler/dini-gunler"
  },
  {
    emoji: "🔍",
    title: "Yakındaki Camiler",
    description: "Konumunuza en yakın camileri bulun ve rota çıkarın.",
    link: "/diger-hizmetler/yakin-camiler"
  }
];

export default function Home() {
  // Sayfa yüklendiğinde sayfanın en üstüne scroll yap
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <PageSection variant="alternate">
        <LandingHero />
      </PageSection>
      
      {/* Chatbot Section */}
      <PageSection 
        variant="default"
        title="İslami Chatbot"
        subtitle="Dini sorularınızı yapay zeka destekli chatbot'umuza sorabilir, anında cevaplar alabilirsiniz."
      >
        {/* Chatbot kartı - ışık efekti ve animasyon ile */}
        <div className="max-w-4xl mx-auto relative">
          {/* Arka plan ışık efekti */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 rounded-lg blur-lg opacity-75 animate-pulse"></div>
          
          {/* Chatbot kartı */}
          <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl p-4 border border-emerald-200 dark:border-emerald-800 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
            <IslamicChatbot />
          </div>
        </div>
      </PageSection>
      
      {/* Features Section */}
      <PageSection 
        variant="alternate"
        title="Platformumuzun Özellikleri"
      >
        <HoverEffect items={features.map(feature => ({
          title: feature.title,
          description: feature.description,
          link: feature.link,
          emoji: feature.emoji
        }))} />
      </PageSection>
      
      {/* İslami Motive Edici Söz Bölümü - Dinamik Değişim */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <DynamicQuotes />
          </div>
        </div>
      </section>
    </main>
  )
}

