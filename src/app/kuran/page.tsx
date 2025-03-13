import dynamic from 'next/dynamic'

// Navbar bileşenini dinamik olarak import ediyoruz
const Navbar = dynamic(() => import('@/components/navbar-demo'), {
  ssr: false
})

// Kur'an okuyucu bileşenini dinamik olarak import ediyoruz
const QuranReader = dynamic(() => import('./quran-reader'), { 
  ssr: false,
  loading: () => (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md animate-pulse h-[500px]">
      <div className="h-8 bg-gray-100 dark:bg-slate-700 rounded w-3/4 mb-6"></div>
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-6 bg-gray-100 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    </div>
  )
})

export default function KuranPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      {/* Navbar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <Navbar />
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-center mb-8 text-emerald-800 dark:text-emerald-300">
          Kur'an-ı Kerim
        </h1>
        
        {/* Kur'an okuyucu kartı - ışık efekti ve animasyon ile */}
        <div className="max-w-4xl mx-auto relative">
          {/* Arka plan ışık efekti */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 rounded-lg blur-lg opacity-75 animate-pulse"></div>
          
          {/* Kur'an okuyucu kartı */}
          <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-emerald-200 dark:border-emerald-800 transition-all duration-300 hover:scale-[1.005] hover:shadow-2xl">
            <QuranReader />
          </div>
        </div>
        
        {/* Bilgi Bölümü */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-emerald-800 dark:text-emerald-300">Kur'an-ı Kerim Hakkında</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Kur'an-ı Kerim, İslam dininin kutsal kitabıdır. Allah tarafından Cebrail aracılığıyla Hz. Muhammed'e (s.a.v.) 23 yıllık bir süre içinde vahyedilmiştir. 114 sure ve 6236 ayetten oluşmaktadır.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-emerald-800 dark:text-emerald-300">Nasıl Kullanılır?</h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li>Sure seçmek için üstteki sure adına tıklayın</li>
                <li>Sureler arasında gezinmek için ok işaretlerini kullanın</li>
                <li>Ayet dinlemek için ayet üzerine gelip ses ikonuna tıklayın</li>
                <li>Yer imi eklemek için yer imi ikonuna tıklayın</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 