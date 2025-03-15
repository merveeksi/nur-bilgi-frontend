"use client"

import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import Image from 'next/image'

// ----- Tipler -----
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
  revelationType: string;
  verses: Verse[];
}

// QuranReader bileşeninden dışarı açılan metodlar
interface QuranReaderMethods {
  fetchSurahDetail: (surah: Surah) => Promise<void>;
  changeTranslation: (translationId: string) => Promise<void>;
  navigateToPage: (pageNumber: number) => Promise<void>;
  scrollToAyah: (verseNumber: number) => void;
}

// Yer imi tipi
interface BookmarkItem {
  id: string;
  page: number;
  surahId: number;
  verse: number;
  title: string;
  addedAt: Date;
}

// Navbar'ı ve QuranReader'ı dinamik import
const Navbar = dynamic(() => import('@/components/navbar-demo'), { ssr: false })
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

// Örnek kâriler (Quran.com v4 API'de karşılıkları)
const qaris = [
  { id: 7, name: "Mishary Rashid Alafasy" },
  { id: 1, name: "Abdul Rahman Al-Sudais" },
  { id: 10, name: "Saud Al-Shuraim" },
];

// Mealler
const translations = [
  { id: "22", name: "Elmalılı (Yazır) Meali" },  // Quran.com API v4 ID'si
  { id: "77", name: "Diyanet Meali" },           // Quran.com API v4 ID'si
  { id: "81", name: "Yıldırım Meali" },          // Quran.com API v4 ID'si
  { id: "31", name: "Edip Yüksel Meali" },       // Quran.com API v4 ID'si
];

export default function KuranPage() {
  // ----- State'ler -----
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentAyah, setCurrentAyah] = useState(1);
  const [selectedQari, setSelectedQari] = useState(qaris[2].id);
  const [selectedTranslation, setSelectedTranslation] = useState(translations[0].id);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isQuranReaderInitialized, setIsQuranReaderInitialized] = useState(false);
  const [jumpToPageInput, setJumpToPageInput] = useState('');
  const [showQuickNav, setShowQuickNav] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);

  // QuranReader ref
  const quranReaderRef = useRef<QuranReaderMethods>(null);

  // Toplam sayfa (mushaf formatı)
  const totalPages = 620;

  // ----- Audio Ref ve URL -----
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // sayfa yüklenince audio elementi hazırlıyoruz
  useEffect(() => {
    if (!audioRef.current) {
      const newAudio = new Audio();
      audioRef.current = newAudio;
      // Oynatma/duraklatma durumunu yakalamak için
      newAudio.onplay = () => setIsAudioPlaying(true);
      newAudio.onpause = () => setIsAudioPlaying(false);
    }
  }, []);

  // Seçilen kâri, sure, sayfa vb. değiştiğinde audio URL (örnek) hesapla
  useEffect(() => {
    if (!audioRef.current) return;
    if (!selectedSurah) {
      audioRef.current.src = '';
      return;
    }

    // Quran.com v4 API'den ses URL'i
    // Not: sayfa yerine sure:ayet formatını kullanıyoruz
    // Sayfa başlangıç ayetini kullanıyoruz
    if (selectedSurah && currentAyah) {
      const audioUrl = `https://api.quran.com/api/v4/recitations/${selectedQari}/by_ayah/${selectedSurah.id}:${currentAyah}`;
      audioRef.current.src = audioUrl;
    }
  }, [selectedQari, selectedSurah, currentAyah, currentPage]);

  // Audio aç/kapa
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  // localStorage'den yer imlerini yükle
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('quran-bookmarks');
    if (savedBookmarks) {
      try {
        const parsedBookmarks = JSON.parse(savedBookmarks);
        setBookmarks(parsedBookmarks);
      } catch (e) {
        console.error('Yer imleri yüklenirken hata:', e);
      }
    }
  }, []);

  // QuranReader'dan gelen verileri izleme
  const handleQuranReaderData = (data: {
    surahs: Surah[];
    selectedSurah: Surah | null;
    loading: boolean;
    errorMessage: string | null;
  }) => {
    if (data) {
      setSurahs(data.surahs || []);
      setSelectedSurah(data.selectedSurah);
      setLoading(data.loading);
      setErrorMessage(data.errorMessage);
      setIsQuranReaderInitialized(true);
    }
  };

  // Seçili ayet değiştiğinde QuranReader'a kaydırma komutu gönder
  useEffect(() => {
    if (quranReaderRef.current && selectedSurah) {
      quranReaderRef.current.scrollToAyah(currentAyah);
    }
  }, [currentAyah, selectedSurah]);

  // Belirli bir sayfaya git
  const setPageAndNavigate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);

    // QuranReader'da sayfa navigasyonu
    if (quranReaderRef.current) {
      quranReaderRef.current.navigateToPage(pageNumber);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setPageAndNavigate(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setPageAndNavigate(currentPage + 1);
    }
  };

  // Sure değiştirme
  const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const surahId = Number(e.target.value);
    const surahToSelect = surahs.find(s => s.id === surahId);
    
    if (surahToSelect && quranReaderRef.current) {
      quranReaderRef.current.fetchSurahDetail(surahToSelect);
    }
  };

  // Meal değiştirme
  const handleTranslationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const translationId = e.target.value;
    setSelectedTranslation(translationId);
    if (quranReaderRef.current) {
      quranReaderRef.current.changeTranslation(translationId);
    }
  };

  // Belirli bir sayfaya hızlı git
  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpToPageInput);
    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
      alert(`Lütfen 1-${totalPages} arasında bir sayfa numarası girin.`);
      return;
    }
    setPageAndNavigate(pageNumber);
    setJumpToPageInput('');
    setShowQuickNav(false);
  };

  // 10'ar sayfa atlama
  const jumpMultiplePages = (increment: number) => {
    const newPage = Math.max(1, Math.min(totalPages, currentPage + increment));
    setPageAndNavigate(newPage);
  };

  // Yer imi ekle/kaldır
  const toggleBookmark = () => {
    const existingBookmarkIndex = bookmarks.findIndex(b => b.page === currentPage);
    
    if (existingBookmarkIndex !== -1) {
      // Zaten ekli, kaldır
      const updatedBookmarks = [...bookmarks];
      updatedBookmarks.splice(existingBookmarkIndex, 1);
      setBookmarks(updatedBookmarks);
      localStorage.setItem('quran-bookmarks', JSON.stringify(updatedBookmarks));
    } else {
      // Yeni ekle
      const newBookmark: BookmarkItem = {
        id: `bookmark-${Date.now()}`,
        page: currentPage,
        surahId: selectedSurah?.id || 1,
        verse: currentAyah,
        title: selectedSurah 
          ? `${selectedSurah.name} - Sayfa ${currentPage}` 
          : `Sayfa ${currentPage}`,
        addedAt: new Date()
      };
      const updatedBookmarks = [...bookmarks, newBookmark];
      setBookmarks(updatedBookmarks);
      localStorage.setItem('quran-bookmarks', JSON.stringify(updatedBookmarks));
    }
  };

  // Yer imine git
  const jumpToBookmark = (bookmark: BookmarkItem) => {
    setPageAndNavigate(bookmark.page);
    setShowBookmarks(false);
  };

  const removeBookmark = (bookmarkId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
    setBookmarks(updatedBookmarks);
    localStorage.setItem('quran-bookmarks', JSON.stringify(updatedBookmarks));
  };

  const isCurrentPageBookmarked = bookmarks.some(b => b.page === currentPage);

  // Tam ekran örneği (opsiyonel)
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Hata: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#f9f8f4] dark:bg-slate-900">
      {/* ÜST NAVIGATION BAR */}
      <div className="bg-emerald-700 text-white p-3 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <h1 className="text-2xl font-bold uppercase tracking-wide">
            KUR'AN-I KERİM
          </h1>

          {!loading && (
            <div className="flex items-center space-x-2">
              {/* Sure Seçimi */}
              <select
                className="bg-emerald-600 text-white border border-emerald-500 rounded px-2 py-1"
                value={selectedSurah?.id || 1}
                onChange={handleSurahChange}
                disabled={loading}
              >
                {surahs.map(surah => (
                  <option key={surah.id} value={surah.id}>
                    {surah.id}. {surah.name}
                  </option>
                ))}
              </select>

              {/* Ayet Seçimi */}
              <select
                className="bg-emerald-600 text-white border border-emerald-500 rounded px-2 py-1"
                value={currentAyah}
                onChange={(e) => setCurrentAyah(Number(e.target.value))}
                disabled={loading || !selectedSurah}
              >
                {selectedSurah && [...Array(selectedSurah.versesCount)].map((_, i) => (
                  <option key={i+1} value={i+1}>
                    {i+1}. Ayet
                  </option>
                ))}
              </select>

              {/* SAYFA GEZİNTİ BUTONLARI */}
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

                <button
                  onClick={() => setShowQuickNav(!showQuickNav)}
                  className="bg-emerald-600 px-3 py-1 border-x border-emerald-500 hover:bg-emerald-500 transition-colors"
                >
                  {currentPage} / {totalPages}
                </button>

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

              {/* Meal Seçimi */}
              <select
                className="bg-emerald-600 text-white border border-emerald-500 rounded px-2 py-1"
                value={selectedTranslation}
                onChange={handleTranslationChange}
                disabled={loading}
              >
                {translations.map(translation => (
                  <option key={translation.id} value={translation.id}>
                    {translation.name}
                  </option>
                ))}
              </select>

              {/* Yer İmi Butonu */}
              <button
                onClick={toggleBookmark}
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded"
                title={isCurrentPageBookmarked ? "Yer İmini Kaldır" : "Yer İmi Ekle"}
              >
                {isCurrentPageBookmarked ? (
                  <BookmarkCheck className="w-5 h-5" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>

              {/* Yer İmleri Aç */}
              <button
                onClick={() => setShowBookmarks(!showBookmarks)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded"
              >
                Yer İmleri ({bookmarks.length})
              </button>
            </div>
          )}
        </div>

        {/* Hızlı Sayfa Geçiş */}
        {showQuickNav && (
          <div className="absolute top-full left-0 right-0 bg-emerald-700 border-t border-emerald-600 p-3 shadow-md z-20">
            <div className="flex justify-center items-center space-x-2">
              <span className="text-white">Sayfaya Git:</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={jumpToPageInput}
                onChange={(e) => setJumpToPageInput(e.target.value)}
                className="bg-white text-emerald-800 border border-emerald-400 rounded px-3 py-1 w-20 text-center"
                placeholder="1-620"
              />
              <button
                onClick={handleJumpToPage}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded"
              >
                Git
              </button>

              {/* Sık kullanılan sayfa kısayolları (opsiyonel) */}
              <div className="flex space-x-1 ml-4">
                {[1, 100, 200, 300, 400, 500, 600].map(page => (
                  <button
                    key={page}
                    onClick={() => {
                      setPageAndNavigate(page);
                      setShowQuickNav(false);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded text-sm"
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Yer İmleri Menüsü */}
        {showBookmarks && (
          <div className="absolute top-full left-0 right-0 bg-emerald-700 border-t border-emerald-600 p-3 shadow-md z-20">
            <div className="container mx-auto">
              <h3 className="text-white font-medium mb-2">Yer İmleri</h3>
              {bookmarks.length === 0 ? (
                <p className="text-emerald-200 text-sm">Henüz yer imi eklenmemiş.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {bookmarks.map(bookmark => (
                    <div
                      key={bookmark.id}
                      onClick={() => jumpToBookmark(bookmark)}
                      className="bg-emerald-600 hover:bg-emerald-500 rounded p-2 cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <div className="text-white font-medium">{bookmark.title}</div>
                        <div className="text-emerald-200 text-xs">
                          {new Date(bookmark.addedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={(e) => removeBookmark(bookmark.id, e)}
                        className="text-emerald-300 hover:text-white p-1"
                        title="Yer İmini Kaldır"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ALTTAKİ SAĞDA HIZLI SAYFA BUTONLARI */}
      <div className="fixed bottom-20 right-6 z-20">
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => jumpMultiplePages(-1)}
            disabled={currentPage <= 1}
            className="bg-emerald-600 hover:bg-emerald-500 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center disabled:opacity-50 disabled:hover:bg-emerald-600"
            title="Önceki Sayfa"
          >
            ◀
          </button>
          <button
            onClick={() => setShowQuickNav(true)}
            className="bg-emerald-700 hover:bg-emerald-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
            title="Sayfaya Git"
          >
            {currentPage}
          </button>
          <button
            onClick={() => jumpMultiplePages(1)}
            disabled={currentPage >= totalPages}
            className="bg-emerald-600 hover:bg-emerald-500 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center disabled:opacity-50 disabled:hover:bg-emerald-600"
            title="Sonraki Sayfa"
          >
            ▶
          </button>
        </div>
      </div>

      {/* ANA İÇERİK */}
      <div className="container mx-auto px-4 py-8">
        <QuranReader
          ref={quranReaderRef}
          onDataUpdate={handleQuranReaderData}
          currentTranslation={selectedTranslation}
          initialPage={currentPage}
        />
      </div>

      {/* ALTAKİ ÇAĞRI ÇUBUĞU (SESLİ OKUMA VB.) */}
      <div className="bg-emerald-700 text-white sticky bottom-0 p-3 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          {/* SES KONTROL */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleAudio}
              className="bg-emerald-600 hover:bg-emerald-500 rounded-full w-16 h-16 flex items-center justify-center"
            >
              {isAudioPlaying ? (
                // Pause icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              ) : (
                // Play icon
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
            
            <button onClick={toggleAudio} className="text-lg hover:underline">
              Açık/Kapalı
            </button>
          </div>
          
          {/* Kâri Seçimi */}
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

          {/* Diğer Ayarlar (örnek) */}
          <div className="flex space-x-4">
            <button className="hover:text-emerald-300 text-2xl" title="Ayarlar">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none"
                viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0
                  a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37
                  a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35
                  a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37
                  a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0
                  a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37
                  a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35
                  a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37
                  .996.608 2.296.07 2.572-1.065z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
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

      {/* Görünmez audio elemanı */}
      <audio ref={audioRef} hidden />
    </main>
  )
}
