import dynamic from 'next/dynamic'

// Navbar bileşenini dinamik olarak import ediyoruz
const NavbarComponent = dynamic(() => import('@/components/navbar-demo'), {
  ssr: false
})

export default function IlmihalPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      {/* Navbar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <NavbarComponent />
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-center mb-8 text-emerald-800 dark:text-emerald-300">
          İlmihal Bilgileri
        </h1>
        
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
            Bu sayfa yapım aşamasındadır. Yakında kapsamlı ilmihal bilgileri ve dini konularda detaylı açıklamalar eklenecektir.
          </p>
          
          <div className="flex justify-center">
            <div className="text-6xl text-emerald-600 dark:text-emerald-400">📚</div>
          </div>
        </div>
      </div>
    </main>
  )
} 