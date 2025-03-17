'use client'

import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import { useState, useEffect } from 'react'

export default function NotFound() {
  const { theme } = useTheme()
  const [randomQuote, setRandomQuote] = useState({ text: '', source: '' })
  
  // Quotes from Quran and Hadith about patience and guidance
  const quotes = [
    { 
      text: "Allah kimseye gücünün yeteceğinden fazlasını yüklemez.", 
      source: "Bakara Suresi, 2:286" 
    },
    { 
      text: "Şüphesiz zorlukla beraber bir kolaylık vardır.", 
      source: "İnşirah Suresi, 94:6" 
    },
    { 
      text: "Allah'ın rahmetinden ümidinizi kesmeyin.", 
      source: "Zümer Suresi, 39:53" 
    },
    { 
      text: "Sabredenlerle beraberim.", 
      source: "Bakara Suresi, 2:153" 
    },
    { 
      text: "Her zorluktan sonra Allah bir kolaylık verir.", 
      source: "Talak Suresi, 65:7" 
    }
  ]
  
  useEffect(() => {
    // Select a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setRandomQuote(quotes[randomIndex])
  }, [])

  // Colors based on theme - match with the namaz page
  const primaryColor = theme === 'dark' ? 'bg-emerald-800' : 'bg-emerald-700'
  const primaryTextColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'
  const primaryBorderColor = theme === 'dark' ? 'border-emerald-700' : 'border-emerald-500'
  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-white'
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800'
  const secondaryTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className={`max-w-lg w-full p-8 ${bgColor} rounded-lg shadow-xl border ${primaryBorderColor}`}>
        <div className="text-center">
          {/* Islamic geometric pattern as 404 symbol */}
          <div className="mx-auto w-32 h-32 mb-6">
            <svg viewBox="0 0 100 100" className={primaryTextColor}>
              <path d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M25 12.5 L75 12.5 L100 50 L75 87.5 L25 87.5 L0 50 Z" fill="none" stroke="currentColor" strokeWidth="2" />
              <text x="50" y="55" textAnchor="middle" fontSize="24" fontWeight="bold" fill="currentColor">404</text>
            </svg>
          </div>
          
          <h1 className={`text-3xl font-bold mb-2 ${primaryTextColor}`}>Sayfa Bulunamadı</h1>
          <p className={`mb-8 ${secondaryTextColor}`}>
            Aradığınız sayfa mevcut değil veya başka bir adrese taşınmış olabilir.
          </p>
          
          {/* Inspirational Islamic quote */}
          <div className={`my-8 p-4 border ${primaryBorderColor} rounded-lg bg-opacity-10 ${primaryColor} bg-opacity-5`}>
            <p className={`italic ${textColor} mb-2`}>"{randomQuote.text}"</p>
            <p className={`text-sm ${secondaryTextColor}`}>— {randomQuote.source}</p>
          </div>
          
          <Link href="/">
            <button className={`px-6 py-3 ${primaryColor} text-white rounded-md hover:opacity-90 transition-opacity`}>
              Ana Sayfaya Dön
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
} 