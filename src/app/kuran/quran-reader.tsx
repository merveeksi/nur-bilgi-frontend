'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Book, Bookmark, PlayCircle, Wifi, WifiOff } from 'lucide-react';

// Ayet arayüzü
interface Verse {
  number: number;
  arabic: string;
  translation: string;
}

// Sure arayüzü
interface Surah {
  id: number;
  name: string;
  arabicName: string;
  versesCount: number;
  revelationType: string;
  verses: Verse[];
}

// Yerel yedek veriler - sadece ilk 3 sure
const fallbackSurahs: Surah[] = [
  {
    id: 1,
    name: 'Fatiha',
    arabicName: 'الفاتحة',
    versesCount: 7,
    revelationType: 'Mekki',
    verses: [
      { 
        number: 1, 
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', 
        translation: 'Rahman ve Rahim olan Allah\'ın adıyla.' 
      },
      { 
        number: 2, 
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', 
        translation: 'Hamd, âlemlerin Rabbi Allah\'a mahsustur.' 
      },
      { 
        number: 3, 
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', 
        translation: 'O, Rahman\'dır, Rahim\'dir.' 
      },
      { 
        number: 4, 
        arabic: 'مَالِكِ يَوْمِ الدِّينِ', 
        translation: 'Din (hesap) gününün sahibidir.' 
      },
      { 
        number: 5, 
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', 
        translation: 'Yalnız sana ibadet ederiz ve yalnız senden yardım dileriz.' 
      },
      { 
        number: 6, 
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', 
        translation: 'Bizi doğru yola ilet.' 
      },
      { 
        number: 7, 
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', 
        translation: 'Kendilerine nimet verdiklerinin yoluna; gazaba uğrayanların ve sapkınların yoluna değil.' 
      }
    ]
  },
  {
    id: 2,
    name: 'Bakara',
    arabicName: 'البقرة',
    versesCount: 286,
    revelationType: 'Medeni',
    verses: [
      { 
        number: 1, 
        arabic: 'الم', 
        translation: 'Elif, Lâm, Mîm.' 
      },
      { 
        number: 2, 
        arabic: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ', 
        translation: 'Bu, kendisinde şüphe olmayan kitaptır. Allah\'a karşı gelmekten sakınanlar için yol göstericidir.' 
      },
      // Bakara suresinin geri kalanı için özet
      { number: 3, arabic: '...', translation: 'Diğer ayetler için API' }
    ]
  },
  {
    id: 3,
    name: 'Ali Imran',
    arabicName: 'آل عمران',
    versesCount: 200,
    revelationType: 'Medeni',
    verses: [
      { 
        number: 1, 
        arabic: 'الم', 
        translation: 'Elif, Lâm, Mîm.' 
      },
      { 
        number: 2, 
        arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', 
        translation: 'Allah, kendisinden başka hiçbir ilâh olmayandır. Diridir, kayyumdur.' 
      },
      // Ali Imran suresinin geri kalanı için özet
      { number: 3, arabic: '...', translation: 'Diğer ayetler için API' }
    ]
  }
];

export default function QuranReader() {
  const [loading, setLoading] = useState(true);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [showSurahList, setShowSurahList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [usingFallback, setUsingFallback] = useState(false);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sureleri API'den çek
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        
        // API isteği için timeout (3 saniye)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        try {
          const response = await fetch('https://api.alquran.cloud/v1/surah', {
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`API yanıt hatası: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.code === 200 && data.status === 'OK') {
            // API'den gelen verileri dönüştür
            const apiSurahs: Array<{
              number: number;
              name: string;
              englishName: string;
              numberOfAyahs: number;
              revelationType: string;
            }> = data.data;
            
            const formattedSurahs: Surah[] = apiSurahs.map(surah => ({
              id: surah.number,
              name: surah.englishName,
              arabicName: surah.name,
              versesCount: surah.numberOfAyahs,
              revelationType: surah.revelationType,
              verses: [] // Başlangıçta boş, sure seçildiğinde doldurulacak
            }));
            
            setSurahs(formattedSurahs);
            
            // İlk sureyi seç ve detaylarını getir
            if (formattedSurahs.length > 0) {
              fetchSurahDetail(formattedSurahs[0]);
            }
            
            setUsingFallback(false);
          } else {
            throw new Error('API veri formatı hatası');
          }
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      } catch (error) {
        console.error('Sureler çekilirken hata:', error);
        setErrorMessage('Sureler yüklenemedi. Lütfen internet bağlantınızı kontrol edin.');
        
        // Fallback verileri kullan
        setSurahs(fallbackSurahs);
        setSelectedSurah(fallbackSurahs[0]);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurahs();
  }, []);

  // Seçilen surenin detaylarını getir
  const fetchSurahDetail = async (surah: Surah) => {
    // Zaten ayetleri varsa veya fallback modundaysak tekrar çekme
    if ((surah.verses && surah.verses.length > 0) || usingFallback) {
      setSelectedSurah(surah);
      return;
    }
    
    try {
      setLoadingSurah(true);
      setErrorMessage(null);
      
      // API isteği için timeout (5 saniye)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        // Arapça ayetleri çek
        const arabicResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surah.id}`, {
          signal: controller.signal
        });
        
        // Türkçe çevirileri çek
        const translationResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surah.id}/tr.yazir`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!arabicResponse.ok || !translationResponse.ok) {
          throw new Error('API yanıt hatası');
        }
        
        const arabicData = await arabicResponse.json();
        const translationData = await translationResponse.json();
        
        if (arabicData.code === 200 && translationData.code === 200) {
          const arabicVerses = arabicData.data.ayahs;
          const translationVerses = translationData.data.ayahs;
          
          // Ayetleri ve çevirilerini birleştir
          const verses: Verse[] = arabicVerses.map((verse: any, index: number) => ({
            number: verse.numberInSurah,
            arabic: verse.text,
            translation: translationVerses[index].text
          }));
          
          // Sure bilgisini güncelle
          const updatedSurah = { ...surah, verses };
          
          // Surahlar listesini güncelle
          setSurahs(prevSurahs => 
            prevSurahs.map(s => s.id === updatedSurah.id ? updatedSurah : s)
          );
          
          setSelectedSurah(updatedSurah);
        } else {
          throw new Error('API veri formatı hatası');
        }
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error) {
      console.error(`${surah.name} suresi çekilirken hata:`, error);
      setErrorMessage(`${surah.name} suresi yüklenemedi.`);
      
      // Yedek verilere geç
      if (!usingFallback) {
        setUsingFallback(true);
        setSurahs(fallbackSurahs);
        const fallbackSurah = fallbackSurahs.find(s => s.id === surah.id) || fallbackSurahs[0];
        setSelectedSurah(fallbackSurah);
      } else {
        const fallbackSurah = fallbackSurahs.find(s => s.id === surah.id);
        setSelectedSurah(fallbackSurah || fallbackSurahs[0]);
      }
    } finally {
      setLoadingSurah(false);
    }
  };

  // Arama sonuçlarını filtrele
  const filteredSurahs = surahs.filter(surah => 
    surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.arabicName.includes(searchQuery)
  );

  // Sure seçimini işle
  const handleSurahSelect = (surah: Surah) => {
    fetchSurahDetail(surah);
    setShowSurahList(false);
  };

  // Önceki sureye git
  const goToPreviousSurah = () => {
    if (selectedSurah && selectedSurah.id > 1) {
      const prevSurah = surahs.find(s => s.id === selectedSurah.id - 1);
      if (prevSurah) fetchSurahDetail(prevSurah);
    }
  };

  // Sonraki sureye git
  const goToNextSurah = () => {
    if (selectedSurah && selectedSurah.id < surahs.length) {
      const nextSurah = surahs.find(s => s.id === selectedSurah.id + 1);
      if (nextSurah) fetchSurahDetail(nextSurah);
    }
  };

  // API'ye yeniden bağlan
  const reconnect = () => {
    window.location.reload();
  };

  // Yükleme durumu
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
      {/* Yedek veri kullanım uyarısı */}
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
      
      {/* Hata mesajı */}
      {errorMessage && !usingFallback && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 text-sm">
          {errorMessage}
        </div>
      )}
      
      {/* Sure Seçim Başlığı */}
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
      
      {/* Sure İçeriği */}
      {selectedSurah && (
        <div className="p-4">
          {/* Sure içeriği yüklenirken gösterilecek animasyon */}
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
              {/* Besmele - 1. ve 9. sureler hariç tüm surelerin başında gösterilir */}
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
              
              {/* Ayetler */}
              <div className="space-y-6">
                {selectedSurah.verses.map((verse) => (
                  <div key={verse.number} className="verse-container group">
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
                      <button className="p-1 hover:text-emerald-600 dark:hover:text-emerald-400" title="Dinle">
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