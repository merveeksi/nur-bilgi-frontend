import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import LandingHero from '@/components/Home/landing-hero'
import PageSection from '@/components/ui/page-section'
import FeatureCard from '@/components/ui/feature-card'


// Dynamically import client components to avoid server/client mismatch
const PrayerTimes = dynamic(() => import('./namaz-vakitleri/prayer-times'), { 
  ssr: false,
  loading: () => (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md animate-pulse h-[400px]">
      <div className="h-6 bg-gray-100 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  )
})

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
    description: "Dini sorularınızı anında yanıtlayan yapay zeka destekli chatbot."
  },
  {
    emoji: "🕌",
    title: "Namaz Vakitleri",
    description: "Bulunduğunuz konuma göre güncel namaz vakitleri."
  },
  {
    emoji: "📖",
    title: "Kur'an-ı Kerim",
    description: "Kur'an-ı Kerim'i okuyun, dinleyin ve ayetleri inceleyin."
  },
  {
    emoji: "📚",
    title: "İlmihal Bilgileri",
    description: "Kapsamlı ilmihal bilgileri ve dini konularda detaylı açıklamalar."
  },
  {
    emoji: "🤲",
    title: "Dua ve Zikirler",
    description: "Günlük dualar, zikirler ve tesbihatlar."
  },
  {
    emoji: "📝",
    title: "Notlar ve Favoriler",
    description: "Kişisel notlar tutun ve favori içeriklerinizi kaydedin."
  }
];

{/*const Navbar = dynamic(() => import('@/components/Headers/navbar'), {
  ssr: false,
  loading: () => (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md animate-pulse h-[400px]">
      <div className="h-6 bg-gray-100 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  )
}) */}





export default function Home() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              emoji={feature.emoji}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </PageSection>
      
      {/* You can easily add more sections using PageSection component */}
      {/* Example:
      <PageSection 
        variant="highlight"
        title="Yeni Bir Bölüm"
        subtitle="Bu yeni bir bölüm açıklaması"
      >
        <div>İçerik burada...</div>
      </PageSection>
      */}
    </main>
  )
}
