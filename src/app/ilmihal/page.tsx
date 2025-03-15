'use client'

import { useState, useEffect } from 'react'
import { fetchIlmihalList, fetchIlmihalById } from '@/services/ilmihalApi'
import { Ilmihal, IlmihalSection } from '@/app/ilmihal/ilmihalData'
import Image from 'next/image'

export default function IlmihalPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ilmihalList, setIlmihalList] = useState<Ilmihal[]>([])
  const [activeIlmihalId, setActiveIlmihalId] = useState<string>('')
  const [activeIlmihal, setActiveIlmihal] = useState<Ilmihal | null>(null)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  
  // Ana renk tonu - Tüm yeşiller bu değişkenler üzerinden kontrol edilecek
  const primaryColor = 'bg-emerald-700'
  const primaryHoverColor = 'hover:bg-emerald-800'
  const primaryTextColor = 'text-emerald-700'
  const primaryLightBgColor = 'bg-emerald-50'
  const primaryBorderColor = 'border-emerald-500'
  const primaryLightTextColor = 'text-emerald-100'

  // 1) Tüm listeyi çek
  useEffect(() => {
    const loadList = async () => {
      setLoading(true)
      setError(null)
      try {
        const list = await fetchIlmihalList()
        setIlmihalList(list)

        // Varsayılan olarak ilk ilmihali seçmek isterseniz
        if (list.length > 0) {
          setActiveIlmihalId(list[0].id)
        }
      } catch (err) {
        console.error('Liste yüklenirken hata:', err)
        setError('İlmihal listesi yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.')
      } finally {
        setLoading(false)
      }
    }
    loadList()
  }, [])

  // 2) Seçilen ilmihali çek
  useEffect(() => {
    if (!activeIlmihalId) return

    const loadIlmihal = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchIlmihalById(activeIlmihalId)
        setActiveIlmihal(data)
        // Varsayılan bölüm seçimi
        if (data.sections?.length > 0) {
          setActiveSection(data.sections[0].id)
        }
      } catch (err) {
        console.error('İlmihal yüklenirken hata:', err)
        setError('İlmihal bilgisi yüklenirken bir hata oluştu. Lütfen tekrar deneyin.')
      } finally {
        setLoading(false)
      }
    }
    loadIlmihal()
  }, [activeIlmihalId])

  // Arama filtreleme fonksiyonu
  const filteredSections = activeIlmihal?.sections.filter(section => {
    if (!searchQuery) return true;
    return (
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      section.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }) || [];

  // Yükleme durumu
  if (loading && !activeIlmihal) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4`}></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  // Hata durumu
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-lg">
          <h3 className="text-lg font-semibold mb-2">Hata</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    )
  }

  // Veri yok durumu
  if (!activeIlmihal) {
    return (
      <div className="flex justify-center items-center h-screen p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg">
          <p>İlmihal bilgisi yüklenemedi. Lütfen daha sonra tekrar deneyin.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Üst Başlık Alanı */}
      <div className={`${primaryColor} shadow-md py-4 px-6 sticky top-16 z-10`}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-white">{activeIlmihal.title}</h1>
              <p className={`${primaryLightTextColor} text-sm mt-1`}>
                {activeIlmihal.author} tarafından hazırlanmıştır
              </p>
            </div>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full border-none focus:ring-2 focus:ring-emerald-300 focus:outline-none"
              />
              <div className="absolute right-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* İlmihal Kitapları Seçim Alanı */}
      <div className="bg-white shadow-sm py-3 px-6 border-b border-gray-200 overflow-x-auto whitespace-nowrap">
        <div className="container mx-auto">
          <div className="flex space-x-2">
            {ilmihalList.map(ilmihal => (
              <button 
                key={ilmihal.id} 
                onClick={() => setActiveIlmihalId(ilmihal.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeIlmihalId === ilmihal.id 
                    ? `${primaryColor} text-white` 
                    : `bg-gray-50 ${primaryTextColor} hover:bg-gray-100`
                }`}
              >
                {ilmihal.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ana İçerik Alanı - Sidebar ve İçerik */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Ana bölüm seçimi */}
          <div className={`lg:w-1/4 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-36">
              <div className={`${primaryColor} py-3 px-4 text-white flex justify-between items-center`}>
                <h2 className="font-semibold">Bölümler</h2>
                <button 
                  className="lg:hidden text-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(100vh-180px)]">
                <nav className="p-2">
                  <ul className="space-y-1">
                    {activeIlmihal.sections.map(section => (
                      <li key={section.id}>
                        <button
                          onClick={() => {
                            setActiveSection(section.id);
                            setSidebarOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                            activeSection === section.id 
                              ? `${primaryLightBgColor} ${primaryTextColor} font-medium` 
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {section.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          {/* Mobil görünümde sidebar toggle butonu */}
          <div className="lg:hidden sticky top-36 z-10">
            {!isSidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className={`mb-4 p-2 rounded-md shadow-md ${primaryColor} text-white`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            )}
          </div>

          {/* İçerik Alanı */}
          <div className="lg:w-3/4">
            {/* Arama sonuçları veya seçili bölüm içeriği */}
            {searchQuery ? (
              <>
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  "{searchQuery}" için arama sonuçları
                </h2>
                
                {filteredSections.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
                    <p>Aramanıza uygun sonuç bulunamadı.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredSections.map(section => (
                      <div 
                        key={section.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                      >
                        <div className={`${primaryColor} px-4 py-3 text-white`}>
                          <h3 className="text-lg font-semibold">{section.title}</h3>
                        </div>
                        <div className="p-5">
                          <div className="prose max-w-none text-gray-700">
                            <p>{section.content}</p>
                          </div>
                          
                          {section.subsections && section.subsections.length > 0 && (
                            <div className="mt-6 space-y-4">
                              <h4 className={`text-lg font-medium ${primaryTextColor} border-b ${primaryBorderColor} pb-2`}>
                                Alt Bölümler
                              </h4>
                              {section.subsections.map(sub => (
                                <div key={sub.id} className={`${primaryLightBgColor} p-4 rounded-lg mt-4`}>
                                  <h5 className={`text-lg font-medium mb-2 ${primaryTextColor}`}>{sub.title}</h5>
                                  <p className="text-gray-700">{sub.content}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : activeSection ? (
              // Seçili bölüm içeriği
              (() => {
                const section = activeIlmihal.sections.find(s => s.id === activeSection);
                
                if (!section) return (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
                    <p>Seçili bölüm bulunamadı.</p>
                  </div>
                );
                
                return (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className={`${primaryColor} px-6 py-4 text-white`}>
                      <h2 className="text-xl font-bold">{section.title}</h2>
                    </div>
                    <div className="p-6">
                      <div className="prose max-w-none text-gray-700 mb-8">
                        <p>{section.content}</p>
                      </div>
                      
                      {/* Alt bölümler */}
                      {section.subsections && section.subsections.length > 0 && (
                        <div className="space-y-6 mt-8">
                          <h3 className={`text-lg font-semibold ${primaryTextColor} border-b ${primaryBorderColor} pb-2`}>
                            Alt Bölümler
                          </h3>
                          {section.subsections.map(sub => (
                            <div key={sub.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                              <h4 className={`text-lg font-medium mb-3 ${primaryTextColor}`}>{sub.title}</h4>
                              <div className="prose max-w-none text-gray-700">
                                <p>{sub.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Navigasyon Butonları */}
                      <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
                        {getPreviousSection() && (
                          <button
                            onClick={() => setActiveSection(getPreviousSection()?.id || null)}
                            className={`flex items-center ${primaryTextColor} ${primaryHoverColor.replace('bg', 'hover:text')} font-medium transition-colors`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Önceki: {getPreviousSection()?.title}
                          </button>
                        )}
                        
                        {getNextSection() && (
                          <button
                            onClick={() => setActiveSection(getNextSection()?.id || null)}
                            className={`flex items-center ml-auto ${primaryTextColor} ${primaryHoverColor.replace('bg', 'hover:text')} font-medium transition-colors`}
                          >
                            Sonraki: {getNextSection()?.title}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              // Hiçbir bölüm seçili değil
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">İlmihal İçeriği</h2>
                <p className="text-gray-600 mb-4">{activeIlmihal.description}</p>
                <p className="text-gray-600">Sol taraftan konuları inceleyebilirsiniz.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  // Yardımcı fonksiyonlar
  function getPreviousSection() {
    if (!activeSection || !activeIlmihal) return null;
    
    const currentIndex = activeIlmihal.sections.findIndex(s => s.id === activeSection);
    if (currentIndex <= 0) return null;
    
    return activeIlmihal.sections[currentIndex - 1];
  }
  
  function getNextSection() {
    if (!activeSection || !activeIlmihal) return null;
    
    const currentIndex = activeIlmihal.sections.findIndex(s => s.id === activeSection);
    if (currentIndex === -1 || currentIndex >= activeIlmihal.sections.length - 1) return null;
    
    return activeIlmihal.sections[currentIndex + 1];
  }
}
