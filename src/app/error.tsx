'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { theme } = useTheme()
  const [randomDua, setRandomDua] = useState({ text: '', translation: '' })
  
  // Selection of duas for difficult situations
  const duas = [
    { 
      text: "رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا",
      translation: "Rabbimiz! Unutur ya da yanılırsak bizi sorumlu tutma." 
    },
    { 
      text: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ",
      translation: "Rabbimiz! Üzerimize sabır yağdır ve bizi Müslüman olarak vefat ettir." 
    },
    { 
      text: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
      translation: "Allah bize yeter, O ne güzel vekildir!" 
    },
    { 
      text: "لا إله إلا أنت سبحانك إني كنت من الظالمين",
      translation: "Senden başka ilah yoktur. Seni tesbih ederim. Gerçekten ben zalimlerden oldum." 
    },
    { 
      text: "رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
      translation: "Rabbim! Bana indireceğin her hayra muhtacım." 
    }
  ]
  
  useEffect(() => {
    // Get a random dua on component mount
    const randomIndex = Math.floor(Math.random() * duas.length)
    setRandomDua(duas[randomIndex])
    
    // Log the error to console for debugging
    console.error('Application error:', error)
  }, [error])

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
          {/* Islamic decoration */}
          <div className="mx-auto w-24 h-24 mb-6">
            <svg viewBox="0 0 100 100" className={primaryTextColor}>
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="50" cy="50" r="10" fill="currentColor" />
            </svg>
          </div>
          
          <h1 className={`text-2xl font-bold mb-2 ${primaryTextColor}`}>Bir Hata Oluştu</h1>
          <p className={`mb-4 ${secondaryTextColor}`}>
            Beklenmeyen bir hata oluştu. Bu geçici bir sorun olabilir.
          </p>
          
          {/* Dua section */}
          <div className={`my-6 p-4 border ${primaryBorderColor} rounded-lg ${primaryColor} bg-opacity-5`}>
            <p className={`text-xl font-arabic mb-3 ${textColor}`} dir="rtl">
              {randomDua.text}
            </p>
            <p className={`text-sm italic ${secondaryTextColor}`}>
              {randomDua.translation}
            </p>
          </div>
          
          <button
            onClick={() => reset()}
            className={`px-6 py-3 ${primaryColor} text-white rounded-md hover:opacity-90 transition-opacity mb-4 w-full`}
          >
            Tekrar Dene
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className={`px-6 py-3 bg-transparent border ${primaryBorderColor} ${primaryTextColor} rounded-md hover:bg-opacity-10 hover:bg-gray-100 transition-colors w-full`}
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  )
} 