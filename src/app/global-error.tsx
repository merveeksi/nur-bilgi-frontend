'use client'

import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Fixed primary colors since we can't access the theme context in global error
  const primaryColor = 'bg-emerald-700'
  const primaryTextColor = 'text-emerald-700'
  const primaryBorderColor = 'border-emerald-500'
  
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-gray-50`}>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-emerald-200 p-8">
            <div className="text-center">
              {/* Islamic inspired geometric pattern */}
              <div className="mx-auto w-24 h-24 mb-6">
                <svg viewBox="0 0 100 100" className={primaryTextColor}>
                  <path d="M50,10 L90,30 L90,70 L50,90 L10,70 L10,30 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M50,10 L50,90 M10,30 L90,30 M10,70 L90,70" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>
              
              <h1 className={`text-2xl font-bold ${primaryTextColor} mb-2`}>Uygulama Hatası</h1>
              <p className="text-gray-600 mb-6">
                Uygulama çalışırken beklenmeyen bir hata oluştu. Sorun için özür dileriz.
              </p>
              
              {/* Dua */}
              <div className={`p-4 mb-6 ${primaryColor} bg-opacity-5 border ${primaryBorderColor} rounded-lg`}>
                <p className="text-lg font-medium text-center mb-2" dir="rtl">
                  اللهم صل على سيدنا محمد وعلى آله وصحبه وسلم
                </p>
                <p className="text-sm text-gray-600 italic">
                  "Allah'ım, Efendimiz Muhammed'e, ailesine ve ashabına salat ve selam eyle."
                </p>
              </div>
              
              <button
                onClick={() => reset()}
                className={`w-full ${primaryColor} text-white py-3 px-6 rounded-md hover:opacity-90 transition-opacity mb-3`}
              >
                Tekrar Dene
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className={`w-full bg-white text-gray-700 border border-gray-300 py-3 px-6 rounded-md hover:bg-gray-50 transition-colors`}
              >
                Ana Sayfaya Dön
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 