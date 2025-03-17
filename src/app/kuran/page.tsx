"use client"

import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'
import { BookmarkCheck } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMediaQuery } from "@/hooks/use-media-query"
import CuzOverview from './cuz-overview'
import { Suspense } from 'react'

// Import types but not the actual component (will be lazy loaded)
import type { QuranReaderMethods } from './quran-reader'

// Define simplified types for the QuranReader data
interface Verse {
  number: number;
  arabic: string;
  translation: string;
}

interface Surah {
  id: number;
  name: string;
  arabicName: string;
  versesCount: number;
  verses: Verse[];
}

interface QuranReaderData {
  surahs: Surah[];
  selectedSurah: Surah | null;
  loading: boolean;
  errorMessage: string | null;
}

// Lazy load the QuranReader component with proper forwardRef support
const LazyQuranReader = dynamic(() => import('./quran-reader'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
})

// Render fallback while loading
function QuranReaderLoading() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
}

// Mealler
const translations = [
  { id: "105", name: "Elmalılı (Yazır) Meali" },
  { id: "77", name: "Diyanet Meali" },
  { id: "81", name: "Yıldırım Meali" },
  { id: "31", name: "Edip Yüksel Meali" },
]

// Kâriler
const qaris = [
  { id: 7, name: "Mishary Rashid Alafasy" },
  { id: 1, name: "Abdul Rahman Al-Sudais" },
  { id: 10, name: "Saud Al-Shuraim" },
]

export default function KuranPage() {
  // States
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedTranslation, setSelectedTranslation] = useState(translations[0].id)
  const [selectedQari, setSelectedQari] = useState(qaris[0].id)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [viewMode, setViewMode] = useState<"mushaf" | "cuz">("mushaf")
  
  // Total pages
  const totalPages = 604
  
  // Media query for responsive design
  const isDesktop = useMediaQuery("(min-width: 768px)")
  
  // Add states for QuranReader functionality
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Create a ref to hold the QuranReader methods
  const quranReaderRef = useRef<QuranReaderMethods | null>(null)
  
  // Function to handle data updates from QuranReader
  const handleQuranReaderData = (data: QuranReaderData) => {
    setSurahs(data.surahs || [])
    setSelectedSurah(data.selectedSurah)
    setLoading(data.loading)
    setErrorMessage(data.errorMessage)
  }
  
  // Navigation functions
  const setPageAndNavigate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return
    setCurrentPage(pageNumber)
    
    // Update QuranReader if it's initialized
    if (quranReaderRef.current) {
      quranReaderRef.current.navigateToPage(pageNumber)
    }
  }
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setPageAndNavigate(currentPage - 1)
    }
  }
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setPageAndNavigate(currentPage + 1)
    }
  }
  
  const jumpMultiplePages = (increment: number) => {
    const newPage = Math.max(1, Math.min(totalPages, currentPage + increment))
    setPageAndNavigate(newPage)
  }
  
  // Translation change
  const handleTranslationChange = (value: string) => {
    setSelectedTranslation(value)
    
    // Update QuranReader translation
    if (quranReaderRef.current) {
      quranReaderRef.current.changeTranslation(parseInt(value, 10))
    }
  }
  
  // Full screen toggle
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }
  
  // Audio toggle - update this function to use QuranReader's audio functionality
  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying)
    
    // Use the current surah and verse from QuranReader
    if (quranReaderRef.current && selectedSurah) {
      const verseNumber = 1; // Default to first verse if not specified
      quranReaderRef.current.playVerseAudio(selectedSurah.id, verseNumber);
    }
  }
  
  // Handle surah selection
  const handleSurahSelection = (surahId: number, verseNumber?: number) => {
    setViewMode("mushaf")
    
    // Use QuranReader to fetch surah if it's initialized
    if (quranReaderRef.current) {
      quranReaderRef.current.fetchSurahDetail(surahId).then(() => {
        // Scroll to specific verse if provided
        if (verseNumber && quranReaderRef.current) {
          quranReaderRef.current.scrollToAyah(verseNumber)
        }
      })
    }
  }
  
  return (
    <main className="min-h-screen bg-[#f9f8f4] dark:bg-slate-900">
      {/* Top Navigation Bar */}
      <div className="bg-emerald-700 text-white p-3 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <h1 className="text-2xl font-bold uppercase tracking-wide">
            KUR'AN-I KERİM
          </h1>
          
          <div className="flex items-center space-x-2">
            {/* Translation Selection */}
            <Select 
              value={selectedTranslation}
              onValueChange={handleTranslationChange}
            >
              <SelectTrigger className="bg-emerald-600 text-white border border-emerald-500 h-9 py-1 px-3 w-auto min-w-[180px]">
                <SelectValue placeholder="Meal seçin" />
              </SelectTrigger>
              <SelectContent>
                {translations.map(translation => (
                  <SelectItem key={translation.id} value={translation.id}>
                    {translation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Page Navigation */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setPageAndNavigate(1)}
                disabled={currentPage <= 1 || loading}
                className="bg-emerald-600 text-white px-2 py-1 rounded-l disabled:opacity-50"
                title="İlk Sayfa"
              >
                ◀◀
              </button>
              <button
                onClick={() => jumpMultiplePages(-10)}
                disabled={currentPage <= 1 || loading}
                className="bg-emerald-600 text-white px-2 py-1 disabled:opacity-50"
                title="10 Sayfa Geri"
              >
                -10
              </button>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage <= 1 || loading}
                className="bg-emerald-600 text-white px-2 py-1 disabled:opacity-50"
              >
                ◀
              </button>
              
              <div className="bg-emerald-600 px-3 py-1 border-x border-emerald-500">
                {currentPage} / {totalPages}
              </div>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage >= totalPages || loading}
                className="bg-emerald-600 text-white px-2 py-1 disabled:opacity-50"
              >
                ▶
              </button>
              <button
                onClick={() => jumpMultiplePages(10)}
                disabled={currentPage >= totalPages || loading}
                className="bg-emerald-600 text-white px-2 py-1 disabled:opacity-50"
                title="10 Sayfa İleri"
              >
                +10
              </button>
              <button
                onClick={() => setPageAndNavigate(totalPages)}
                disabled={currentPage >= totalPages || loading}
                className="bg-emerald-600 text-white px-2 py-1 rounded-r disabled:opacity-50"
                title="Son Sayfa"
              >
                ▶▶
              </button>
            </div>
            
            {/* Bookmark Button */}
            <button
              onClick={() => {}}
              className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded"
              title="Yer İmi"
            >
              <BookmarkCheck className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="mushaf" className="w-full" onValueChange={(value) => setViewMode(value as "mushaf" | "cuz")}>
          <div className="mb-6">
            <TabsList>
              <TabsTrigger value="mushaf">Mushaf Görünümü</TabsTrigger>
              <TabsTrigger value="cuz">Cüz Görünümü</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mushaf" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Page navigation (desktop) */}
                <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow ${isDesktop ? 'block' : 'hidden'}`}>
                  <h3 className="font-bold mb-3 text-gray-800 dark:text-gray-200">Sayfa Seçimi</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {[...Array(30)].map((_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        className="h-10 p-0"
                        onClick={() => setPageAndNavigate(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Mobile page navigation */}
                {!isDesktop && (
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        onClick={() => currentPage > 1 && setPageAndNavigate(currentPage - 1)}
                        disabled={currentPage <= 1}
                      >
                        Önceki
                      </Button>
                      <span className="font-bold">Sayfa {currentPage}</span>
                      <Button
                        variant="outline"
                        onClick={() => currentPage < 604 && setPageAndNavigate(currentPage + 1)}
                        disabled={currentPage >= 604}
                      >
                        Sonraki
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Quran Reader Component - Replace the placeholder */}
                <div className={`${isDesktop ? 'col-span-2' : 'col-span-1'} bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-auto`}>
                  <Suspense fallback={<QuranReaderLoading />}>
                    <LazyQuranReader
                      key="quran-reader"
                      // We use a callback ref to avoid issues with the component
                      ref={(instance) => {
                        if (instance) {
                          quranReaderRef.current = instance
                        }
                      }}
                      currentTranslation={parseInt(selectedTranslation, 10)}
                      initialPage={currentPage}
                      onDataUpdate={handleQuranReaderData}
                    />
                  </Suspense>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="cuz" className="mt-0">
              <CuzOverview onSurahSelect={handleSurahSelection} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      {/* Bottom Audio Controls */}
      <div className="bg-emerald-700 text-white sticky bottom-0 p-3 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          {/* Audio Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleAudio}
              className="bg-emerald-600 hover:bg-emerald-500 rounded-full w-16 h-16 flex items-center justify-center"
            >
              {isAudioPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263
                      a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              )}
            </button>
          </div>
          
          {/* Qari Selection */}
          <div className="flex items-center">
            <span className="mr-2 text-lg">Kari:</span>
            <select
              className="bg-emerald-600 text-white border border-emerald-500 rounded px-4 py-2 text-lg"
              value={selectedQari}
              onChange={(e) => setSelectedQari(Number(e.target.value))}
            >
              {qaris.map(qari => (
                <option key={qari.id} value={qari.id}>
                  {qari.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Other Settings */}
          <div className="flex space-x-4">
            <button 
              onClick={toggleFullScreen}
              className="hover:text-emerald-300 text-2xl" 
              title="Tam Ekran"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none"
                viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5
                  M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
