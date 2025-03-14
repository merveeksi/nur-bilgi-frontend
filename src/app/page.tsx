import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import LandingHero from '@/components/Home/landing-hero'
import PageSection from '@/components/ui/page-section'
import FeatureCard from '@/components/ui/feature-card'
import { Metadata } from 'next'

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

// İslami Motive Edici Sözler
export const inspirationalQuotes = [
  { 
    quote: "En hayırlınız, Kur'an'ı öğrenen ve öğretendir.", 
    source: "Hadis-i Şerif"
  },
  { 
    quote: "Her zorlukla beraber muhakkak bir kolaylık vardır.", 
    source: "İnşirah Suresi, 6. Ayet" 
  },
  { 
    quote: "Allah, sabredenlerle beraberdir.", 
    source: "Bakara Suresi, 153. Ayet" 
  },
  { 
    quote: "İlim öğrenmek, her Müslüman erkek ve kadına farzdır.", 
    source: "Hadis-i Şerif" 
  },
  { 
    quote: "Kim bir hayra vesile olursa, o hayrı yapan gibi sevap kazanır.", 
    source: "Hadis-i Şerif" 
  },
  { 
    quote: "Gerçek zenginlik, mal çokluğu değil, gönül tokluğudur.", 
    source: "Hadis-i Şerif" 
  },
  { 
    quote: "Allah'ın rahmeti, öfkesini geçmiştir.", 
    source: "Hadis-i Şerif" 
  },
  { 
    quote: "Rabbinizden bağışlanma dileyin; O, çok bağışlayıcıdır.", 
    source: "Nuh Suresi, 10. Ayet" 
  },
  { 
    quote: "Şüphesiz hardal tanesi ağırlığınca da olsa, Allah onu getirir.", 
    source: "Lokman Suresi, 16. Ayet" 
  }
];

// Random quote seçen fonksiyon
const getRandomQuote = () => {
  // Server Component olduğu için bu kısım server tarafında çalışacak
  // Her sayfa yüklendiğinde rastgele bir söz gösterilecek
  const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
  return inspirationalQuotes[randomIndex];
};

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
  // Rastgele bir söz seç - keeping this for server-side fallback
  const randomQuote = getRandomQuote();
  
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

