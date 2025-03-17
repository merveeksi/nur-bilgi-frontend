'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { ChevronLeft, ChevronRight, Search, Book, Bookmark, PlayCircle, Wifi, WifiOff } from 'lucide-react';
import pageMappingData from '../../../pageMapping.json';

// Type definitions
interface Verse {
  id: number;
  number: number;
  arabic: string;
  translation: string;
  transcription: string;
  audio?: string;
}

interface Surah {
  id: number;
  name: string;
  arabicName: string;
  versesCount: number;
  revelationType?: string;
  verses: Verse[];
  audio?: {
    mp3: string;
    duration: number;
  };
}

interface Author {
  id: number;
  name: string;
  description: string;
  language: string;
}

interface PageMapping {
  page: number;
  surahId: number;
  startVerse: number;
  endVerse: number;
}

// Component props definition
export interface QuranReaderProps {
  onDataUpdate?: (data: {
    surahs: Surah[];
    selectedSurah: Surah | null;
    loading: boolean;
    errorMessage: string | null;
  }) => void;
  currentTranslation?: number;
  initialPage?: number;
}

// Methods that will be exposed via ref
export interface QuranReaderMethods {
  fetchSurahDetail: (surahOrId: Surah | number) => Promise<void>;
  changeTranslation: (authorId: number) => Promise<void>;
  navigateToPage: (pageNumber: number) => Promise<void>;
  scrollToAyah: (verseNumber: number) => void;
  playVerseAudio: (surahId: number, verseNumber: number) => void;
}

// ----- Fallback sureler (API yoksa) -----
const fallbackSurahs: Surah[] = [
  {
    id: 1,
    name: 'Fatiha',
    arabicName: 'سُورَةُ ٱلْفَاتِحَةِ',
    versesCount: 7,
    verses: [
      { id: 1, number: 1, arabic: 'بِسْمِ اللَّهِ...', translation: 'Rahman ve Rahim...', transcription: 'Bismillahir rahmanir rahim.' },
      { id: 2, number: 2, arabic: 'الْحَمْدُ...', translation: 'Hamd alemlerin...', transcription: 'Elhamdulillahi rabbil alemin.' },
      { id: 3, number: 3, arabic: 'الرَّحْمَٰنِ...', translation: 'O Rahman...', transcription: 'Errahmanir rahim.' },
      { id: 4, number: 4, arabic: 'مَالِكِ...', translation: 'Din gününün...', transcription: 'Maliki yevmiddin.' },
      { id: 5, number: 5, arabic: 'إِيَّاكَ...', translation: 'Yalnız sana...', transcription: "İyyake na'budu ve iyyake nestein." },
      { id: 6, number: 6, arabic: 'اهْدِنَا...', translation: 'Bizi doğru...', transcription: 'İhdinas sıratel mustekim.' },
      { id: 7, number: 7, arabic: 'صِرَاطَ...', translation: 'Nimet verdiklerinin...', transcription: 'Sıratel lezine en\'amte aleyhim ğayril mağdubi aleyhim ve leddâllîn.' },
    ],
    audio: {
      mp3: 'https://audio.acikkuran.com/tr/1.mp3',
      duration: 38
    }
  },
  {
    id: 2,
    name: 'Bakara',
    arabicName: 'سورة البقرة',
    versesCount: 286,
    verses: [
      { id: 1, number: 1, arabic: 'الم', translation: 'Elif, Lâm, Mîm.', transcription: 'Elif, Lâm, Mîm.' },
      { id: 2, number: 2, arabic: 'ذَٰلِكَ...', translation: 'Bu, kendisinde...', transcription: 'Zalikel kitabu la raybe fih...' },
      { id: 3, number: 3, arabic: '...', translation: 'Devamı fallback...', transcription: '...' }
    ],
    audio: {
      mp3: 'https://audio.acikkuran.com/tr/2.mp3',
      duration: 5982
    }
  }
];

// ----- ÖRNEK pageToSurahMapping -----
const pageToSurahMapping: PageMapping[] = pageMappingData.flat();

// Bu fonksiyon, parametre olarak gelen sayfa için hangi sure/ayet aralığının gösterileceğini döndürüyor.
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

// QuranReader component with forwardRef applied correctly
const QuranReader = forwardRef<QuranReaderMethods, QuranReaderProps>(
  function QuranReader({ onDataUpdate, currentTranslation = 105, initialPage = 1 }, ref) {
    const [loading, setLoading] = useState(true);
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
    const [usingFallback, setUsingFallback] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [authorId, setAuthorId] = useState<number>(currentTranslation);
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

    // Açık Kuran API
    const apiBaseUrl = 'https://api.acikkuran.com';
    
    // Ref metodlarını parent'a aç
    useImperativeHandle(ref, () => ({
      fetchSurahDetail: async (surahOrId: Surah | number) => {
        // surahOrId bir sayı ise, ona göre işlem yap
        if (typeof surahOrId === 'number') {
          const surahId = surahOrId;
          const targetSurah = surahs.find(s => s.id === surahId);
          if (targetSurah) {
            await fetchSurahDetail(targetSurah);
          } else {
            // Surah listesi boşsa veya hedef sure listede yoksa
            console.log(`Fetching surah with ID: ${surahId} directly`);
            try {
              const response = await fetch(`${apiBaseUrl}/surah/${surahId}?author=${authorId}`);
              if (response.ok) {
                const data = await response.json();
                if (data.data) {
                  const newSurah = {
                    id: data.data.id,
                    name: data.data.name,
                    arabicName: data.data.name_original,
                    versesCount: data.data.verse_count,
                    verses: [], // Boş başlat, cevap içindeki ayetleri daha sonra işleyeceğiz
                    audio: data.data.audio
                  };
                  await fetchSurahDetail(newSurah);
                }
              }
            } catch (error) {
              console.error('Failed to fetch surah by ID:', error);
              setErrorMessage(`Failed to fetch surah with ID: ${surahId}`);
            }
          }
        } else {
          // Zaten bir Surah objesi aldık, normal şekilde işleyelim
          await fetchSurahDetail(surahOrId);
        }
      },
      changeTranslation: async (newAuthorId: number) => {
        setAuthorId(newAuthorId);
        if (selectedSurah) {
          await fetchSurahDetailWithAuthor(selectedSurah, newAuthorId);
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
      },
      playVerseAudio: (surahId: number, verseNumber: number) => {
        playVerseAudio(surahId, verseNumber);
      }
    }));

    // İlk yükte çevirmenleri ve sureleri çekmeyi deneyelim
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          setErrorMessage(null);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          // Çevirmenleri çek
          const authorsResponse = await fetch(`${apiBaseUrl}/authors`, {
            signal: controller.signal
          });
          
          if (!authorsResponse.ok) {
            throw new Error(`API yanıt hatası (authors): ${authorsResponse.status}`);
          }
          
          const authorsData = await authorsResponse.json();
          
          if (authorsData.data) {
            setAuthors(authorsData.data);
            
            // Varsayılan çevirmen ID'si geçerli değilse ilk Türkçe çevirmenin ID'sini kullan
            if (!authorsData.data.some((a: Author) => a.id === authorId)) {
              const firstTurkishAuthor = authorsData.data.find((a: Author) => a.language === 'tr');
              if (firstTurkishAuthor) {
                setAuthorId(firstTurkishAuthor.id);
              }
            }
          }
          
          // Sureleri çek
          const surahsResponse = await fetch(`${apiBaseUrl}/surahs`, {
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);

          if (!surahsResponse.ok) {
            throw new Error(`API yanıt hatası (surahs): ${surahsResponse.status}`);
          }
          
          const surahsData = await surahsResponse.json();
          
          if (surahsData.data) {
            const formattedSurahs: Surah[] = surahsData.data.map((s: any) => ({
              id: s.id,
              name: s.name,
              arabicName: s.name_original,
              versesCount: s.verse_count,
              verses: [],
              audio: s.audio
            }));

            setSurahs(formattedSurahs);

            // İlk sayfaya gidelim
            if (formattedSurahs.length > 0) {
              if (initialPage > 1) {
                handlePageNavigation(initialPage);
              } else {
                await fetchSurahDetail(formattedSurahs[0]);
              }
            }
            setUsingFallback(false);
          } else {
            throw new Error('API veri formatı hatası');
          }
        } catch (error) {
          console.error('Veriler çekilirken hata:', error);
          setErrorMessage('Veriler yüklenemedi. Fallback veri kullanılıyor.');
          // fallback'e geç
          setSurahs(fallbackSurahs);
          setSelectedSurah(fallbackSurahs[0]);
          setUsingFallback(true);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [initialPage]);

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
    const fetchSurahDetailWithAuthor = async (surah: Surah, authorId: number) => {
      if (usingFallback) {
        // Fallback modda, verileri zaten local'de tutuyoruz
        setSelectedSurah(surah);
        return;
      }

      try {
        setLoadingSurah(true);
        setErrorMessage(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        // Açık Kuran API ile sure detaylarını çek
        const surahResponse = await fetch(`${apiBaseUrl}/surah/${surah.id}?author=${authorId}`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!surahResponse.ok) {
          throw new Error(`API yanıt hatası (surah): ${surahResponse.status}`);
        }

        const surahData = await surahResponse.json();
        
        if (surahData.data && surahData.data.verses) {
          // Ayet verilerini birleştir
          const verses: Verse[] = surahData.data.verses.map((verse: any) => {
            return {
              id: verse.id,
              number: verse.verse_number,
              arabic: verse.verse,
              translation: verse.translation?.text || 'Çeviri yüklenemedi',
              transcription: verse.transcription || '',
            };
          });

          const updatedSurah: Surah = {
            ...surah,
            verses,
            audio: surahData.data.audio
          };

          // surahs dizisinde güncelle
          setSurahs(prev => prev.map(s => s.id === updatedSurah.id ? updatedSurah : s));
          setSelectedSurah(updatedSurah);
        } else {
          throw new Error('API veri formatı hatası (surah).');
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
      await fetchSurahDetailWithAuthor(surah, authorId);
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

    // Sus-i verseyu oynatma
    const playVerseAudio = (surahId: number, verseNumber: number) => {
      // Açık Kuran API ses formatı ile Alafasy'nin sesli okuyuşu
      // Not: Bu endpoint API tarafından sağlanıyorsa, diğer ses kaynakları da test edilebilir
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${((surahId-1)*1000) + verseNumber}.mp3`;
      
      console.log(`Playing audio for surah ${surahId}, verse ${verseNumber}: ${audioUrl}`);
      
      const audio = new Audio(audioUrl);
      audio.play().catch(error => {
        console.error('Ayet ses dosyası oynatılamadı:', error);
        setErrorMessage('Ayet ses dosyası oynatılamadı.');
      });
    };

    // Surenin tamamını oynatma
    const playSurahAudio = () => {
      if (selectedSurah?.audio?.mp3) {
        const audio = new Audio(selectedSurah.audio.mp3);
        audio.play().catch(error => {
          console.error('Sure ses dosyası oynatılamadı:', error);
          setErrorMessage('Sure ses dosyası oynatılamadı.');
        });
      }
    };

    // Navigation buttons render
    const renderNavigationButtons = () => (
      <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-gray-800 rounded-lg mb-4">
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700"
            onClick={() => setShowSurahList(!showSurahList)}
            aria-label="Sure listesi"
          >
            <Book size={20} />
          </button>
          
          <button
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700"
            onClick={goToPreviousSurah}
            disabled={selectedSurah?.id === 1}
            aria-label="Önceki sure"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700"
            onClick={goToNextSurah}
            disabled={selectedSurah?.id === surahs.length}
            aria-label="Sonraki sure"
          >
            <ChevronRight size={20} />
          </button>
          
          {selectedSurah?.audio?.mp3 && (
            <button
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700"
              onClick={playSurahAudio}
              aria-label="Sureyi dinle"
            >
              <PlayCircle size={20} />
            </button>
          )}
        </div>
        
        <div>
          {errorMessage && (
            <button
              className="flex items-center gap-1 text-sm text-red-500"
              onClick={reconnect}
            >
              <WifiOff size={16} /> Yeniden bağlan
            </button>
          )}
          
          {!errorMessage && usingFallback && (
            <button
              className="flex items-center gap-1 text-sm text-yellow-500"
              onClick={reconnect}
            >
              <Wifi size={16} /> API bağlantısı yok
            </button>
          )}
        </div>

        <div className="text-gray-600 dark:text-gray-300 font-semibold">
          Sayfa: {currentPage}
        </div>
      </div>
    );

    // Sure selection dropdown render
    const renderSurahList = () => (
      <div className={`bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg absolute left-0 right-0 z-10 max-h-96 overflow-y-auto ${!showSurahList && 'hidden'}`}>
        <div className="sticky top-0 bg-white dark:bg-gray-900 p-3 border-b dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              className="w-full p-2 pl-8 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800"
              placeholder="Sure ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
          </div>
        </div>
        
        <ul className="divide-y dark:divide-gray-700">
          {filteredSurahs.map(surah => (
            <li key={surah.id}>
              <button
                className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 flex justify-between items-center"
                onClick={() => handleSurahSelect(surah)}
              >
                <span>
                  <span className="font-bold mr-2">{surah.id}.</span>
                  <span>{surah.name}</span>
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-sm">{surah.arabicName}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );

    // Surah content render
    const renderSurahContent = () => {
      if (loading || loadingSurah) {
        return (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        );
      }

      if (!selectedSurah) {
        return (
          <div className="text-center p-8 text-gray-500">
            Sure seçilmedi
          </div>
        );
      }

      // Sayfada gösterilecek ayetleri filtrele
      // currentStartVerse ve currentEndVerse kullanarak
      const displayedVerses = selectedSurah.verses.filter(
        verse => verse.number >= currentStartVerse && verse.number <= currentEndVerse
      );

      return (
        <div>
          <h2 className="text-center my-4">
            <span className="text-xl font-bold">{selectedSurah.name}</span>
            <span className="mx-3 text-2xl font-bold text-gray-600 dark:text-gray-400">
              {selectedSurah.arabicName}
            </span>
            <span className="text-sm text-gray-500">({selectedSurah.versesCount} ayet)</span>
          </h2>

          <div className="space-y-8 py-4">
            {/* Besmele */}
            {selectedSurah.id !== 9 && (
              <div className="text-center my-8">
                <p className="arabic-font text-2xl leading-loose mb-2 text-gray-900 dark:text-gray-100">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  Bismillâhirrahmânirrahîm
                </p>
                <p className="text-gray-800 dark:text-gray-300 mt-1">
                  Rahman ve Rahim olan Allah'ın adıyla
                </p>
              </div>
            )}

            {/* Ayetler */}
            {displayedVerses.map(verse => (
              <div 
                key={verse.id}
                id={`verse-${verse.number}`}
                className={`p-4 rounded-lg ${
                  currentVerseHighlight === verse.number 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800' 
                    : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium mr-3">
                    {verse.number}
                  </span>
                  
                  <div className="flex-1">
                    <p className="arabic-font text-2xl leading-loose text-right mb-4 whitespace-pre-line text-gray-900 dark:text-gray-100">
                      {verse.arabic}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 italic text-sm mb-2">
                      {verse.transcription}
                    </p>
                    <p className="text-gray-800 dark:text-gray-300 whitespace-pre-line">
                      {verse.translation}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => playVerseAudio(selectedSurah.id, verse.number)}
                    className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    aria-label="Ayeti dinle"
                  >
                    <PlayCircle size={18} className="text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="quran-reader relative max-w-4xl mx-auto">
        {renderNavigationButtons()}
        {renderSurahList()}
        {renderSurahContent()}
      </div>
    );
  }
);

export default QuranReader;
