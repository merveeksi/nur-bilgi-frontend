'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { ChevronLeft, ChevronRight, Search, Book, Bookmark, PlayCircle, Wifi, WifiOff } from 'lucide-react';

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

interface PageMapping {
  page: number;
  surahId: number;
  startVerse: number;
  endVerse: number;
}

// Bileşen prop'ları
interface QuranReaderProps {
  onDataUpdate?: (data: {
    surahs: Surah[];
    selectedSurah: Surah | null;
    loading: boolean;
    errorMessage: string | null;
  }) => void;
  currentTranslation?: string;
  initialPage?: number;
}

export interface QuranReaderMethods {
  fetchSurahDetail: (surah: Surah) => Promise<void>;
  changeTranslation: (translationId: string) => Promise<void>;
  navigateToPage: (pageNumber: number) => Promise<void>;
  scrollToAyah: (verseNumber: number) => void;
}

// ----- Fallback sureler (API yoksa) -----
const fallbackSurahs: Surah[] = [
  {
    id: 1,
    name: 'Fatiha',
    arabicName: 'الفاتحة',
    versesCount: 7,
    revelationType: 'Mekki',
    verses: [
      { number: 1, arabic: 'بِسْمِ اللَّهِ...', translation: 'Rahman ve Rahim...' },
      { number: 2, arabic: 'الْحَمْدُ...', translation: 'Hamd alemlerin...' },
      { number: 3, arabic: 'الرَّحْمَٰنِ...', translation: 'O Rahman...' },
      { number: 4, arabic: 'مَالِكِ...', translation: 'Din gününün...' },
      { number: 5, arabic: 'إِيَّاكَ...', translation: 'Yalnız sana...' },
      { number: 6, arabic: 'اهْدِنَا...', translation: 'Bizi doğru...' },
      { number: 7, arabic: 'صِرَاطَ...', translation: 'Nimet verdiklerinin...' },
    ]
  },
  {
    id: 2,
    name: 'Bakara',
    arabicName: 'البقرة',
    versesCount: 286,
    revelationType: 'Medeni',
    verses: [
      { number: 1, arabic: 'الم', translation: 'Elif, Lâm, Mîm.' },
      { number: 2, arabic: 'ذَٰلِكَ...', translation: 'Bu, kendisinde...' },
      { number: 3, arabic: '...', translation: 'Devamı fallback...' }
    ]
  },
  {
    id: 3,
    name: 'Ali Imran',
    arabicName: 'آل عمران',
    versesCount: 200,
    revelationType: 'Medeni',
    verses: [
      { number: 1, arabic: 'الم', translation: 'Elif, Lâm, Mîm.' },
      { number: 2, arabic: 'اللَّهُ...', translation: 'Allah, kendisinden...' },
      { number: 3, arabic: '...', translation: 'Devamı fallback...' }
    ]
  }
];

// ----- ÖRNEK pageToSurahMapping -----
// Mushaf'a uygun şekilde 620 satırı doldurmanız gerekir.
// Şimdilik sadece ilk birkaç sayfa örnek:
const pageToSurahMapping: PageMapping[] = [
  { page: 1, surahId: 1, startVerse: 1, endVerse: 7 },   // Fatiha (1-7)
  { page: 2, surahId: 2, startVerse: 1, endVerse: 5 },   // Bakara 1-5
  { page: 3, surahId: 2, startVerse: 6, endVerse: 16 },
  { page: 4, surahId: 2, startVerse: 17, endVerse: 24 },
  { page: 5, surahId: 2, startVerse: 25, endVerse: 29 },
  // ...
  // 620'ye kadar doldurmanız gerekir.
];

// Bu fonksiyon, parametre olarak gelen sayfa için hangi sure/ayet aralığının gösterileceğini döndürüyor.
// Gerçekte tam 620 sayfayı doldurmalısınız.
function getPageMapping(pageNumber: number): PageMapping | null {
  const direct = pageToSurahMapping.find(p => p.page === pageNumber);
  if (direct) return direct;

  // Bulunamazsa basit bir tahmin:
  let estimatedSurahId = Math.ceil((pageNumber / 620) * 114);
  if (estimatedSurahId < 1) estimatedSurahId = 1;
  if (estimatedSurahId > 114) estimatedSurahId = 114;
  return {
    page: pageNumber,
    surahId: estimatedSurahId,
    startVerse: 1,
    endVerse: 10
  };
}

const QuranReader = forwardRef<QuranReaderMethods, QuranReaderProps>(
  function QuranReader({ onDataUpdate, currentTranslation = 'tr.yazir', initialPage = 1 }, ref) {
    const [loading, setLoading] = useState(true);
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
    const [usingFallback, setUsingFallback] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [translationId, setTranslationId] = useState<string>(currentTranslation);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);

    // Bu ikisi sayesinde "bu sayfada hangi ayetler görünsün" slice yapacağız.
    const [currentStartVerse, setCurrentStartVerse] = useState<number>(1);
    const [currentEndVerse, setCurrentEndVerse] = useState<number>(7);

    // Hangisi highlight edilecek
    const [currentVerseHighlight, setCurrentVerseHighlight] = useState<number | null>(null);

    // Sure listesi aç/ara (opsiyonel)
    const [showSurahList, setShowSurahList] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingSurah, setLoadingSurah] = useState(false);

    // API v4'e göre bazı sabitleri güncelleyelim
    const apiBaseUrl = 'https://api.quran.com/api/v4';
    
    // Meal ID'leri için quran.com v4 uyumlu değerlerin map'i
    const translationMap: Record<string, number> = {
      'tr.yazir': 22, // Elmalılı Hamdi Yazır
      'tr.diyanet': 77, // Diyanet İşleri
      'tr.yildirim': 81, // Suat Yıldırım
      'tr.yuksel': 31  // Edip Yüksel
    };

    // Ref metodlarını parent'a aç
    useImperativeHandle(ref, () => ({
      fetchSurahDetail,
      changeTranslation: async (newTranslationId: string) => {
        setTranslationId(newTranslationId);
        if (selectedSurah) {
          await fetchSurahDetailWithTranslation(selectedSurah, newTranslationId);
        }
      },
      navigateToPage: async (pageNumber: number) => {
        await handlePageNavigation(pageNumber);
      },
      scrollToAyah: (verseNumber: number) => {
        setCurrentVerseHighlight(verseNumber);
        // Biraz bekleyip scroll yapalım
        setTimeout(() => {
          const verseElement = document.getElementById(`verse-${verseNumber}`);
          if (verseElement) {
            verseElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }));

    // İlk yükte sureleri çekmeyi deneyelim
    useEffect(() => {
      const fetchSurahs = async () => {
        try {
          setLoading(true);
          setErrorMessage(null);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          // API'den sure listesi - v4 API kullanıyoruz
          const response = await fetch(`${apiBaseUrl}/chapters?language=tr`, {
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`API yanıt hatası: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.chapters) {
            const formattedSurahs: Surah[] = data.chapters.map((s: any) => ({
              id: s.id,
              name: s.translated_name.name, // İngilizce adı
              arabicName: s.name_arabic,
              versesCount: s.verses_count,
              revelationType: s.revelation_place === 'makkah' ? 'Mekki' : 'Medeni',
              verses: []
            }));

            setSurahs(formattedSurahs);

            // İlki ile başlayalım
            if (formattedSurahs.length > 0) {
              await fetchSurahDetail(formattedSurahs[0]);
            }
            setUsingFallback(false);
          } else {
            throw new Error('API veri formatı hatası');
          }
        } catch (error) {
          console.error('Sureler çekilirken hata:', error);
          setErrorMessage('Sureler yüklenemedi. Fallback veri kullanılıyor.');
          // fallback'e geç
          setSurahs(fallbackSurahs);
          setSelectedSurah(fallbackSurahs[0]);
          setUsingFallback(true);
        } finally {
          setLoading(false);
        }
      };

      fetchSurahs();
    }, []);

    // parent'a durumu bildir
    useEffect(() => {
      if (onDataUpdate) {
        onDataUpdate({
          surahs,
          selectedSurah,
          loading,
          errorMessage
        });
      }
    }, [surahs, selectedSurah, loading, errorMessage, onDataUpdate]);

    // İlk render sonrasında initialPage varsa oraya gidelim
    useEffect(() => {
      if (initialPage > 1 && surahs.length > 0 && !loading) {
        handlePageNavigation(initialPage);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialPage, surahs, loading]);

    // Bir sayfaya git
    const handlePageNavigation = async (pageNumber: number) => {
      const pageMapping = getPageMapping(pageNumber);
      if (!pageMapping) {
        setErrorMessage(`Sayfa ${pageNumber} için bilgi bulunamadı.`);
        return;
      }
      setCurrentPage(pageNumber);
      setCurrentStartVerse(pageMapping.startVerse);
      setCurrentEndVerse(pageMapping.endVerse);

      // Hangi sure?
      const targetSurah = surahs.find(s => s.id === pageMapping.surahId);
      if (!targetSurah) {
        setErrorMessage(`Sure #${pageMapping.surahId} bulunamadı (mapping tahmini).`);
        return;
      }

      // Sure yüklenmiş mi?
      if (!targetSurah.verses || targetSurah.verses.length === 0) {
        await fetchSurahDetail(targetSurah);
      } else {
        setSelectedSurah(targetSurah);
      }

      // Bu sayfanın ilk ayetini highlight edelim
      setCurrentVerseHighlight(pageMapping.startVerse);
      // Scroll
      setTimeout(() => {
        const verseElement = document.getElementById(`verse-${pageMapping.startVerse}`);
        if (verseElement) {
          verseElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    };

    // Sure detaylarını ve meali çekme (seçilmiş surenin)
    const fetchSurahDetailWithTranslation = async (surah: Surah, translationId: string) => {
      if (usingFallback) {
        // Fallback modda, verileri zaten local'de tutuyoruz
        setSelectedSurah(surah);
        return;
      }

      try {
        setLoadingSurah(true);
        setErrorMessage(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // Quran.com API v4 formatına göre meal/çeviri ID'sini belirle
        const translationIdNumber = translationMap[translationId] || 77; // Varsayılan: Diyanet

        // Arapça ayetler ve çevirileri tek bir endpointten alabiliyoruz
        const verseResponse = await fetch(`${apiBaseUrl}/verses/by_chapter/${surah.id}?language=en&words=true&translations=${translationIdNumber}&fields=text_uthmani,chapter_id,verse_number,verse_key`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!verseResponse.ok) {
          throw new Error(`API yanıt hatası (verses): ${verseResponse.status}`);
        }

        const versesData = await verseResponse.json();
        
        if (versesData.verses) {
          // Ayet verilerini birleştir
          const verses: Verse[] = versesData.verses.map((verse: any) => {
            // Çeviri metnini al
            let translationText = "";
            if (verse.translations && verse.translations.length > 0) {
              translationText = verse.translations[0].text;
            }
            
            return {
              number: verse.verse_number,
              arabic: verse.text_uthmani, // Uthmani metni kullan
              translation: translationText
            };
          });

          const updatedSurah: Surah = {
            ...surah,
            verses
          };

          // surahs dizisinde güncelle
          setSurahs(prev => prev.map(s => s.id === updatedSurah.id ? updatedSurah : s));
          setSelectedSurah(updatedSurah);
        } else {
          throw new Error('API veri formatı hatası (verses).');
        }
      } catch (error) {
        console.error(`${surah.name} suresi çekilirken hata:`, error);
        setErrorMessage(`${surah.name} suresi yüklenemedi. API erişim hatası.`);

        // Fallback
        if (!usingFallback) {
          setUsingFallback(true);
          setSurahs(fallbackSurahs);
          const fallbackS = fallbackSurahs.find(s => s.id === surah.id) || fallbackSurahs[0];
          setSelectedSurah(fallbackS);
        } else {
          const fbS = fallbackSurahs.find(s => s.id === surah.id);
          setSelectedSurah(fbS || fallbackSurahs[0]);
        }
      } finally {
        setLoadingSurah(false);
      }
    };

    const fetchSurahDetail = async (surah: Surah) => {
      await fetchSurahDetailWithTranslation(surah, translationId);
    };

    // Sure arama + filtre
    const filteredSurahs = surahs.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.arabicName.includes(searchQuery)
    );

    const handleSurahSelect = (surah: Surah) => {
      fetchSurahDetail(surah);
      setShowSurahList(false);
    };

    const goToPreviousSurah = () => {
      if (selectedSurah && selectedSurah.id > 1) {
        const prev = surahs.find(s => s.id === selectedSurah.id - 1);
        if (prev) fetchSurahDetail(prev);
      }
    };

    const goToNextSurah = () => {
      if (selectedSurah && selectedSurah.id < surahs.length) {
        const next = surahs.find(s => s.id === selectedSurah.id + 1);
        if (next) fetchSurahDetail(next);
      }
    };

    const reconnect = () => {
      window.location.reload();
    };

    // Qari ID'lerini Quran.com v4 API formatına dönüştürme
    const qariMap: Record<number, number> = {
      1: 7,  // Mishary Rashid Alafasy
      2: 1,  // Abdul Rahman Al-Sudais
      3: 10, // Saud Al-Shuraim
    };

    // Ayet sesini getir
    const getAudioUrl = (surahId: number, verseNumber: number, qariId: number) => {
      // Quran.com API'den ayet sesi URL'i
      const mappedQariId = qariMap[qariId] || 7; // 7 = Mishary Rashid Alafasy
      return `${apiBaseUrl}/recitations/${mappedQariId}/by_ayah/${surahId}:${verseNumber}`;
    };

    if (loading) {
      return (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md animate-pulse">
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
      );
    }

    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md">
        {/* Fallback Uyarısı */}
        {usingFallback && (
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-amber-700 dark:text-amber-300 flex items-start text-sm">
            <WifiOff className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">API bağlantısı kurulamadı</p>
              <p className="mt-1">Sınırlı sayıda sure gösteriliyor.</p>
              <button 
                onClick={reconnect}
                className="mt-1 px-2 py-1 bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-700 inline-flex items-center"
              >
                <Wifi className="w-3 h-3 mr-1" />
                Yeniden Bağlan
              </button>
            </div>
          </div>
        )}

        {errorMessage && !usingFallback && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 text-sm">
            {errorMessage}
          </div>
        )}

        {selectedSurah && (
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/10 text-center text-sm text-emerald-700 dark:text-emerald-300 sticky top-0 z-10 border-b border-emerald-100 dark:border-emerald-900/30">
            <div className="flex justify-between items-center">
              <div className="px-2">
                {selectedSurah.id}. {selectedSurah.name}
              </div>
              <div>
                Sayfa {currentPage} / 620
              </div>
              <div className="px-2">
                {selectedSurah.revelationType === 'Meccan' ? 'Mekki' : 'Medeni'}
              </div>
            </div>
          </div>
        )}

        {/* Başlık (Sure seçimi) */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setShowSurahList(!showSurahList)}
              className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
            >
              <Book className="w-5 h-5 mr-1" />
              <span className="font-medium">
                {selectedSurah ? `${selectedSurah.id}. ${selectedSurah.name} (${selectedSurah.arabicName})` : 'Sure Seçin'}
              </span>
              <ChevronRight className={`w-5 h-5 transition-transform ${showSurahList ? 'rotate-90' : ''}`} />
            </button>
            
            <div className="flex space-x-2">
              <button 
                onClick={goToPreviousSurah}
                disabled={selectedSurah?.id === 1}
                className={`p-1 rounded-full ${
                  selectedSurah?.id === 1 
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                    : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={goToNextSurah}
                disabled={selectedSurah?.id === surahs.length}
                className={`p-1 rounded-full ${
                  selectedSurah?.id === surahs.length 
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                    : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sure Listesi */}
          {showSurahList && (
            <div className="mt-2 border border-gray-200 dark:border-slate-700 rounded-md max-h-60 overflow-y-auto">
              <div className="p-2 sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                  <input
                    type="text"
                    placeholder="Sure ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                  />
                </div>
              </div>
              <ul>
                {filteredSurahs.map((surah) => (
                  <li key={surah.id}>
                    <button
                      onClick={() => handleSurahSelect(surah)}
                      className={`w-full text-left px-4 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 ${
                        selectedSurah?.id === surah.id 
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{surah.id}. {surah.name}</span>
                        <span className="text-sm font-arabic">{surah.arabicName}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {surah.versesCount} ayet • {surah.revelationType}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* SURE İÇERİĞİ */}
        {selectedSurah && (
          <div className="p-4">
            {loadingSurah ? (
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-6 bg-gray-100 dark:bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Besmele (1 ve 9 hariç) */}
                {selectedSurah.id !== 1 && selectedSurah.id !== 9 && (
                  <div className="text-center mb-6">
                    <p className="font-arabic text-emerald-800 dark:text-emerald-300 mb-2">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Rahman ve Rahim olan Allah'ın adıyla
                    </p>
                  </div>
                )}

                {/* Ayetleri slice(currentStartVerse-1, currentEndVerse) ile kısıtlıyoruz */}
                <div className="space-y-6">
                  {selectedSurah.verses
                    .slice(currentStartVerse - 1, currentEndVerse)
                    .map((verse) => (
                      <div 
                        key={verse.number} 
                        id={`verse-${verse.number}`}
                        className={`verse-container group ${
                          currentVerseHighlight === verse.number 
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border-l-4 border-emerald-500'
                            : ''
                        }`}
                      >
                        <div className="flex items-start mb-2">
                          <div className="flex items-center justify-center min-w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-sm mr-2">
                            {verse.number}
                          </div>
                          <div className="flex-1">
                            <p className="font-arabic mb-4 text-gray-800 dark:text-gray-200">
                              {verse.arabic}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                              {verse.translation}
                            </p>
                          </div>
                        </div>
                        <div className="hidden group-hover:flex justify-end space-x-2 text-gray-500 dark:text-gray-400">
                          <button 
                            className="p-1 hover:text-emerald-600 dark:hover:text-emerald-400" 
                            title="Dinle"
                            onClick={() => {
                              if (selectedSurah) {
                                const audioUrl = getAudioUrl(selectedSurah.id, verse.number, 1); // Default: Mishary Rashid Alafasy
                                const audio = new Audio(audioUrl);
                                audio.play().catch(err => console.error('Ses oynatma hatası:', err));
                              }
                            }}
                          >
                            <PlayCircle size={18} />
                          </button>
                          <button className="p-1 hover:text-emerald-600 dark:hover:text-emerald-400" title="Yer İmi Ekle">
                            <Bookmark size={18} />
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default QuranReader;
