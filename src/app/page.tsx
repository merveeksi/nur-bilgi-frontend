import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

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

// Navbar bileşenini dinamik olarak import ediyoruz
const NavbarComponent = dynamic(() => import('@/components/navbar-demo'), {
  ssr: false
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

const FloatingNavDemo = dynamic(() => import('@/components/floating-nav-demo'), {
  ssr: false
})

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      {/* Navbar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <NavbarComponent />
      </div>
      
      {/* Ana içerik */}
      <div className="container mx-auto pt-32 p-4">
        <h1 className="text-4xl font-bold text-emerald-800 dark:text-emerald-300 mb-6 text-center">
          Nur Bilgi - İslami Bilgi ve İbadet Destek Platformu
        </h1>
        
        <p className="text-lg text-emerald-700 dark:text-emerald-400 max-w-3xl mx-auto mb-10 text-center">
          Dini sorularınızı sorun, ibadetlerinizi takip edin, Kur'an-ı Kerim okuyun ve daha fazlası için tek adresiniz.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-10">
            <Link href="/chatbot" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-lg transition-colors">
              Sorularınızı Sorun
            </Link>
            <Link href="/namaz-vakitleri" className="px-6 py-3 border border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg shadow-lg transition-colors">
              Namaz Vakitleri
            </Link>
          </div>
        
        {/* AI Chatbot Bölümü */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-6 text-center">
            İslami Chatbot
          </h2>
          <p className="text-lg text-emerald-700 dark:text-emerald-400 max-w-2xl mx-auto mb-8 text-center">
            Dini sorularınızı yapay zeka destekli chatbot'umuza sorabilir, anında cevaplar alabilirsiniz.
          </p>
          
          {/* Chatbot kartı - ışık efekti ve animasyon ile */}
          <div className="max-w-4xl mx-auto relative">
            {/* Arka plan ışık efekti */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 rounded-lg blur-lg opacity-75 animate-pulse"></div>
            
            {/* Chatbot kartı */}
            <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl p-4 border border-emerald-200 dark:border-emerald-800 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
              <IslamicChatbot />
            </div>
          </div>
        </div>
        
        {/* Özellikler Bölümü */}
        <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-8 text-center">Platformumuzun Özellikleri</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Özellik 1 - AI Chatbot */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4 text-emerald-600 dark:text-emerald-400">🤖</div>
            <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-300">İslami Chatbot</h3>
            <p className="text-gray-700 dark:text-gray-300">Dini sorularınızı anında yanıtlayan yapay zeka destekli chatbot.</p>
          </div>
          
          {/* Özellik 2 */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4 text-emerald-600 dark:text-emerald-400">🕌</div>
            <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-300">Namaz Vakitleri</h3>
            <p className="text-gray-700 dark:text-gray-300">Bulunduğunuz konuma göre güncel namaz vakitleri.</p>
          </div>
          
          {/* Özellik 3 */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4 text-emerald-600 dark:text-emerald-400">📖</div>
            <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-300">Kur'an-ı Kerim</h3>
            <p className="text-gray-700 dark:text-gray-300">Kur'an-ı Kerim'i okuyun, dinleyin ve ayetleri inceleyin.</p>
          </div>
          
          {/* Özellik 4 */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4 text-emerald-600 dark:text-emerald-400">📚</div>
            <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-300">İlmihal Bilgileri</h3>
            <p className="text-gray-700 dark:text-gray-300">Kapsamlı ilmihal bilgileri ve dini konularda detaylı açıklamalar.</p>
          </div>
          
          {/* Özellik 5 */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4 text-emerald-600 dark:text-emerald-400">🤲</div>
            <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-300">Dua ve Zikirler</h3>
            <p className="text-gray-700 dark:text-gray-300">Günlük dualar, zikirler ve tesbihatlar.</p>
          </div>
          
          {/* Özellik 6 */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4 text-emerald-600 dark:text-emerald-400">📝</div>
            <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-300">Notlar ve Favoriler</h3>
            <p className="text-gray-700 dark:text-gray-300">Kişisel notlar tutun ve favori içeriklerinizi kaydedin.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
