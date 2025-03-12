'use client'

import { useState, useEffect } from 'react'
import { fetchIlmihalList, fetchIlmihalById } from '@/services/ilmihalApi'
import { Ilmihal, IlmihalSection } from '@/app/ilmihal/ilmihalData'

export default function IlmihalPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ilmihalList, setIlmihalList] = useState<Ilmihal[]>([])
  const [activeIlmihalId, setActiveIlmihalId] = useState<string>('')
  const [activeIlmihal, setActiveIlmihal] = useState<Ilmihal | null>(null)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  // 1) Tüm listeyi çek
  useEffect(() => {
    const loadList = async () => {
      setLoading(true)
      setError(null)
      try {
        const list = await fetchIlmihalList() // /api/ilmihal
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
        const data = await fetchIlmihalById(activeIlmihalId) // /api/ilmihal/:id
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

  if (loading && !activeIlmihal) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!activeIlmihal) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>İlmihal bilgisi yüklenemedi. Lütfen daha sonra tekrar deneyin.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-6 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-emerald-500">İlmihal Bilgileri</h1>

        {/* İlmihal tab butonları */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {ilmihalList.map(ilmihal => (
            <button 
              key={ilmihal.id} 
              onClick={() => setActiveIlmihalId(ilmihal.id)}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeIlmihalId === ilmihal.id 
                  ? 'bg-emerald-600 text-white font-medium' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {ilmihal.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Bölümler listesi - sol taraf */}
          <div className="md:col-span-1 bg-white p-4 rounded-lg border border-gray-100">
            <h3 className="text-lg font-medium mb-4 text-emerald-700">Bölümler</h3>
            <ul className="space-y-2">
              {activeIlmihal.sections.map(sec => (
                <li key={sec.id}>
                  <button 
                    onClick={() => setActiveSection(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded ${
                      activeSection === sec.id 
                        ? 'bg-emerald-50 text-emerald-700 font-medium' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {sec.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* İçerik - sağ taraf */}
          <div className="md:col-span-3">
            <div className="bg-white p-6 rounded-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-2 text-emerald-700">{activeIlmihal.title}</h2>
              <p className="text-sm text-gray-500 mb-4">Yazar: {activeIlmihal.author}</p>
              <p className="mb-6 text-gray-700">{activeIlmihal.description}</p>

              {/* Seçili section içeriği */}
              {activeSection && activeIlmihal.sections
                .filter(s => s.id === activeSection)
                .map(s => (
                  <div key={s.id} className="mt-6">
                    <h3 className="text-xl font-semibold mb-4 text-emerald-600">{s.title}</h3>
                    <div className="prose max-w-none prose-emerald">
                      <p className="text-gray-700">{s.content}</p>
                    </div>
                    
                    {/* Alt bölümler varsa göster */}
                    {s.subsections && s.subsections.length > 0 && (
                      <div className="mt-6">
                        {s.subsections.map(sub => (
                          <div key={sub.id} className="mt-4">
                            <h4 className="text-lg font-medium mb-2 text-emerald-500">{sub.title}</h4>
                            <p className="text-gray-700">{sub.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
