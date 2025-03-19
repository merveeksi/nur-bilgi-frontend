"use client"

import dynamic from 'next/dynamic'
import { useEffect } from 'react'



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
  // Sayfa yüklendiğinde sayfanın en üstüne scroll yap
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-center mb-4 text-emerald-800 dark:text-emerald-300">
          İslami Chatbot
        </h1>
        
        {/* Açıklama metni */}
        <p className="text-center text-lg mb-8 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          İslami konularda sorularınızı yanıtlayan, Kuran ve sünnete dayalı bilgiler sunan yapay zeka asistanımız.
        </p>
        
        <div className="max-w-4xl mx-auto">
          {/* Arka plan ışık efekti */}
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/40 via-emerald-300/40 to-emerald-500/40 rounded-2xl blur-xl opacity-70 animate-pulse"></div>
            
            {/* Chatbot kartı */}
            <div className="relative border border-emerald-100 dark:border-emerald-900/30 rounded-2xl shadow-xl overflow-hidden 
                            transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-[1.02]">
              <IslamicChatbot />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 