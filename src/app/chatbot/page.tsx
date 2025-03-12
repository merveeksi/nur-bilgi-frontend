import dynamic from 'next/dynamic'

// Navbar bileşenini dinamik olarak import ediyoruz
const NavbarComponent = dynamic(() => import('@/components/navbar-demo'), {
  ssr: false
})

// AI Chatbot bileşenini dinamik olarak import ediyoruz
const IslamicChatbot = dynamic(() => import('./islamic-chatbot'), { 
  ssr: false,
  loading: () => (
    <div className="flex flex-col h-[500px] bg-white dark:bg-slate-800 rounded-lg shadow-md animate-pulse">
      <div className="bg-emerald-700 dark:bg-emerald-800 h-16"></div>
      <div className="flex-1 p-4"></div>
      <div className="p-4 h-16 border-t border-gray-200 dark:border-slate-700"></div>
    </div>
  )
})

export default function ChatbotPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      {/* Navbar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <NavbarComponent />
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-center mb-8 text-emerald-800 dark:text-emerald-300">
          İslami Chatbot
        </h1>
        
        <div className="max-w-3xl mx-auto">
          <IslamicChatbot />
        </div>
      </div>
    </main>
  )
} 