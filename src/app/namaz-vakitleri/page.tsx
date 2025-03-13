import dynamic from 'next/dynamic'

// Dynamically import client components to avoid server/client mismatch
const PrayerTimes = dynamic(() => import('./prayer-times'), { 
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
const Navbar = dynamic(() => import('@/components/navbar-demo'), {
  ssr: false
})

export default function NamazVakitleriPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      {/* Navbar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <Navbar />
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-center mb-8 text-emerald-800 dark:text-emerald-300">
          Namaz Vakitleri
        </h1>
        
        {/* Namaz vakitleri kartı - ışık efekti ve animasyon ile */}
        <div className="max-w-md mx-auto relative">
          {/* Arka plan ışık efekti */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 rounded-lg blur-lg opacity-75 animate-pulse"></div>
          
          {/* Namaz vakitleri kartı */}
          <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-emerald-200 dark:border-emerald-800 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
            <PrayerTimes />
          </div>
        </div>
      </div>
    </main>
  )
} 