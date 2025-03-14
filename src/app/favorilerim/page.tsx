"use client";

import { useState, useEffect } from "react";
import { 
  getAllDuas, 
  getDuaById,
  Dua,
  DailyDua 
} from "@/services/duaService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, BookMarked, ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface HadisItem {
  id: string;
  category?: string;
  number?: number;
  arabic?: string;
  turkishText: string;
  source?: string;
  explanation: string;
}

export default function FavorilerimPage() {
  const [duaFavorites, setDuaFavorites] = useState<Dua[]>([]);
  const [hadiFavorites, setHadisFavorites] = useState<HadisItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>("dualar");
  
  // Hadis verisi için örnek
  const hadisData: Record<string, HadisItem> = {
    "h1": {
      id: "h1",
      category: "ibadet",
      arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
      turkishText: "Ameller niyetlere göredir.",
      source: "Buhârî, Bed'ü'l-vahy, 1; Müslim, İmâre, 155",
      explanation: "Bir kimsenin yaptığı işin değeri, o işi hangi niyetle yaptığına bağlıdır. İbadetler ve diğer davranışlar, kişinin niyetine göre değer kazanır veya kaybeder."
    },
    "h2": {
      id: "h2",
      category: "ahlak",
      arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
      turkishText: "Sizden biriniz kendisi için sevdiğini kardeşi için de sevmedikçe iman etmiş olmaz.",
      source: "Buhârî, Îmân, 7; Müslim, Îmân, 71",
      explanation: "Bu hadis, İslam'daki kardeşlik ve empati anlayışını ortaya koyar. Bir mümin, kendisi için istediği iyiliği başkaları için de istemelidir."
    },
    // Diğer hadisler için data
    "h3": {
      id: "h3",
      category: "iman",
      arabic: "بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ...",
      turkishText: "İslam beş temel üzerine kurulmuştur: Allah'tan başka ilah olmadığına ve Muhammed'in Allah'ın Resulü olduğuna şahitlik etmek, namaz kılmak, zekât vermek, hacca gitmek ve Ramazan orucunu tutmak.",
      source: "Buhârî, Îmân, 2; Müslim, Îmân, 21",
      explanation: "İslam'ın beş şartını açıklayan bu hadis, Müslümanların yerine getirmesi gereken temel görevleri belirtir."
    },
    "k1": {
      id: "k1",
      number: 1,
      arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ...",
      turkishText: "Ameller niyetlere göredir...",
      source: "Buhârî, Bed'ü'l-vahy, 1; Müslim, İmâre, 155",
      explanation: "Bu hadis İmam Nevevi'nin kırk hadis derlemesinin ilk hadisidir. Bir işin değerinin niyete göre belirleneceğini belirtir."
    },
    "y1": {
      id: "y1",
      turkishText: "Bütün Hadislerin Aynı Güvenilirlik Seviyesine Sahip Olduğu Yanılgısı",
      explanation: "Hadisler, sahih, hasen ve zayıf gibi farklı derecelere ayrılır. Tüm hadisler aynı güvenilirlikte değildir. Bu nedenle hadisleri değerlendirirken sıhhat derecesine bakmak önemlidir."
    }
  };

  useEffect(() => {
    // Favorileri localStorage'dan yükle
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    // Dua favorilerini yükle
    const storedDuaFavorites = localStorage.getItem('favoriteDualar');
    if (storedDuaFavorites) {
      const duaIds = JSON.parse(storedDuaFavorites) as string[];
      const allDuas = getAllDuas();
      const favoriteDuas = allDuas.filter(dua => duaIds.includes(dua.id));
      setDuaFavorites(favoriteDuas);
    }

    // Hadis favorilerini yükle
    const storedHadisFavorites = localStorage.getItem('favoriteHadisler');
    if (storedHadisFavorites) {
      const hadisIds = JSON.parse(storedHadisFavorites) as string[];
      const favoriteHadisler = hadisIds.map(id => hadisData[id]).filter(Boolean);
      setHadisFavorites(favoriteHadisler);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const removeFromFavorites = (id: string, type: 'dua' | 'hadis') => {
    if (type === 'dua') {
      const storedFavorites = localStorage.getItem('favoriteDualar');
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites) as string[];
        const newFavorites = favorites.filter(favId => favId !== id);
        localStorage.setItem('favoriteDualar', JSON.stringify(newFavorites));
        setDuaFavorites(prev => prev.filter(dua => dua.id !== id));
      }
    } else {
      const storedFavorites = localStorage.getItem('favoriteHadisler');
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites) as string[];
        const newFavorites = favorites.filter(favId => favId !== id);
        localStorage.setItem('favoriteHadisler', JSON.stringify(newFavorites));
        setHadisFavorites(prev => prev.filter(hadis => hadis.id !== id));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-6 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-emerald-500">
          Favorilerim
        </h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="dualar" className="text-base font-medium">
              <BookOpen className="h-4 w-4 mr-2" />
              Dualar
            </TabsTrigger>
            <TabsTrigger value="hadisler" className="text-base font-medium">
              <BookMarked className="h-4 w-4 mr-2" />
              Hadisler
            </TabsTrigger>
          </TabsList>
          
          {/* Dualar Tab */}
          <TabsContent value="dualar" className="space-y-6">
            {duaFavorites.length === 0 ? (
              <div className="bg-white p-6 rounded-lg text-center">
                <p className="text-gray-600 mb-4">Favori duanız bulunmamaktadır.</p>
                <a href="/dua" className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
                  Dua Sayfasına Git
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {duaFavorites.map((dua) => (
                  <motion.div
                    key={dua.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div
                      onClick={() => toggleExpand(dua.id)}
                      className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <BookOpen className="h-5 w-5" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {dua.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {dua.source}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromFavorites(dua.id, 'dua');
                          }}
                          className="mr-3 text-gray-400 hover:text-red-500 focus:outline-none cursor-pointer"
                          aria-label="Favorilerden çıkar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                          </svg>
                        </span>
                        {expandedItems[dua.id] ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedItems[dua.id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-100"
                        >
                          <div className="p-5 space-y-4">
                            {dua.arabic && (
                              <p className="text-right text-gray-800 text-xl font-arabic leading-relaxed tracking-wider mb-2">
                                {dua.arabic}
                              </p>
                            )}
                            
                            <p className="text-gray-800 font-medium">
                              {dua.turkishText}
                            </p>
                            
                            {dua.translation && (
                              <p className="text-gray-700">
                                <span className="font-medium">Anlamı:</span>{" "}
                                {dua.translation}
                              </p>
                            )}

                            {dua.occasion && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Ne Zaman Okunur:</span>{" "}
                                {dua.occasion}
                              </p>
                            )}

                            {dua.virtues && (
                              <div className="mt-4 bg-emerald-50 p-4 rounded-md">
                                <p className="text-sm text-emerald-700">
                                  <span className="font-medium">Faziletleri:</span>{" "}
                                  {dua.virtues}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Hadisler Tab */}
          <TabsContent value="hadisler" className="space-y-6">
            {hadiFavorites.length === 0 ? (
              <div className="bg-white p-6 rounded-lg text-center">
                <p className="text-gray-600 mb-4">Favori hadisiniz bulunmamaktadır.</p>
                <a href="/hadis" className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
                  Hadis Sayfasına Git
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {hadiFavorites.map((hadis) => (
                  <div
                    key={hadis.id}
                    className="bg-white border border-gray-100 rounded-lg overflow-hidden"
                  >
                    <div
                      onClick={() => toggleExpand(hadis.id)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center">
                        {hadis.number && (
                          <span className="bg-emerald-100 text-emerald-800 font-bold rounded-full h-8 w-8 flex items-center justify-center text-sm mr-3">
                            {hadis.number}
                          </span>
                        )}
                        <p className="font-medium text-gray-900">{hadis.turkishText.length > 70 ? hadis.turkishText.substring(0, 70) + "..." : hadis.turkishText}</p>
                      </div>
                      <div className="flex items-center">
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromFavorites(hadis.id, 'hadis');
                          }}
                          className="mr-3 text-gray-400 hover:text-red-500 focus:outline-none cursor-pointer"
                          aria-label="Favorilerden çıkar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                          </svg>
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-emerald-600 transition-transform ${
                            expandedItems[hadis.id] ? "transform rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                    
                    {expandedItems[hadis.id] && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        {hadis.arabic && (
                          <p className="text-right mb-3 font-arabic text-xl text-gray-800">{hadis.arabic}</p>
                        )}
                        {hadis.source && (
                          <p className="mb-2 text-sm text-gray-500">{hadis.source}</p>
                        )}
                        <p className="text-gray-700">{hadis.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Bilgilendirme ve Yönlendirme Bölümü */}
        <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-lg text-center border border-gray-100">
          <h2 className="text-xl font-bold text-emerald-700 mb-2">Favorilerinizi Yönetin</h2>
          <p className="text-gray-600 mb-4">
            Favori dua ve hadislerinizi buradan kolayca görüntüleyebilir, Dua ve Hadis sayfalarından yeni favoriler ekleyebilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a href="/dua" className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
              Dua Sayfasına Git
            </a>
            <a href="/hadis" className="px-4 py-2 bg-white text-slate-800 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
              Hadis Sayfasına Git
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 