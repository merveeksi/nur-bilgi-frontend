"use client";

import React, { useState } from "react";
import { Search, Heart } from "lucide-react";
import { motion } from "framer-motion";

// Allah'ın 99 ismini içeren veri yapısı
const esmaNames = [
  { id: 1, arabic: "الله", turkish: "Allah", meaning: "Varlığı zaruri olan ve bütün hamdediş ve övgülere layık bulunan." },
  { id: 2, arabic: "الرحمن", turkish: "Er-Rahman", meaning: "Pek merhametli, çok merhametli." },
  { id: 3, arabic: "الرحيم", turkish: "Er-Rahim", meaning: "Çok merhamet edici." },
  { id: 4, arabic: "الملك", turkish: "El-Melik", meaning: "Mülkün, her varlığın sahibi." },
  { id: 5, arabic: "القدّوس", turkish: "El-Kuddüs", meaning: "Her türlü eksiklikten uzak olan, temiz, kutsal." },
  { id: 6, arabic: "السلام", turkish: "Es-Selam", meaning: "Her türlü tehlikelerden selamete çıkaran." },
  { id: 7, arabic: "المؤمن", turkish: "El-Mü'min", meaning: "Güven veren, emin kılan." },
  { id: 8, arabic: "المهيمن", turkish: "El-Müheymin", meaning: "Her şeyi gözeten, koruyan." },
  { id: 9, arabic: "العزيز", turkish: "El-Aziz", meaning: "Üstün, galip, güçlü, yenilmez." },
  { id: 10, arabic: "الجبّار", turkish: "El-Cebbar", meaning: "İradesini her durumda yürüten." },
  { id: 11, arabic: "المتكبّر", turkish: "El-Mütekebbir", meaning: "Büyüklükte eşi olmayan." },
  { id: 12, arabic: "الخالق", turkish: "El-Halik", meaning: "Yaratan, yoktan var eden." },
  { id: 13, arabic: "البارئ", turkish: "El-Bari", meaning: "Her şeyi kusursuzca yaratan." },
  { id: 14, arabic: "المصوّر", turkish: "El-Musavvir", meaning: "Her şeye şekil veren." },
  { id: 15, arabic: "الغفّار", turkish: "El-Gaffar", meaning: "Günahları örten ve çok bağışlayan." },
  { id: 16, arabic: "القهّار", turkish: "El-Kahhar", meaning: "Her şeyin üzerinde ezici güce sahip olan." },
  { id: 17, arabic: "الوهّاب", turkish: "El-Vehhab", meaning: "Karşılıksız veren." },
  { id: 18, arabic: "الرزّاق", turkish: "Er-Rezzak", meaning: "Rızık veren." },
  { id: 19, arabic: "الفتّاح", turkish: "El-Fettah", meaning: "Açan, çözümleyen." },
  { id: 20, arabic: "العليم", turkish: "El-Alim", meaning: "Her şeyi bilen." },
  { id: 21, arabic: "القابض", turkish: "El-Kabid", meaning: "Dilediğine darlık veren." },
  { id: 22, arabic: "الباسط", turkish: "El-Basit", meaning: "Dilediğine genişlik, bolluk veren." },
  { id: 23, arabic: "الخافض", turkish: "El-Hafid", meaning: "Alçaltan." },
  { id: 24, arabic: "الرافع", turkish: "Er-Rafi", meaning: "Yükselten." },
  { id: 25, arabic: "المعزّ", turkish: "El-Muiz", meaning: "Şeref ve kuvvet veren." },
  { id: 26, arabic: "المذلّ", turkish: "El-Muzil", meaning: "Zelil kılan, alçaltan." },
  { id: 27, arabic: "السميع", turkish: "Es-Semi", meaning: "Her şeyi işiten." },
  { id: 28, arabic: "البصير", turkish: "El-Basir", meaning: "Her şeyi gören." },
  { id: 29, arabic: "الحكم", turkish: "El-Hakem", meaning: "Hükmeden, hakkı yerine getiren." },
  { id: 30, arabic: "العدل", turkish: "El-Adl", meaning: "Mutlak adil." },
  // 99 ismin tamamı için 31-99 eklenecek (uzunluktan dolayı kısaltıldı)
];

export default function EsmaulHusnaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  // LocalStorage'dan favorileri yükle
  React.useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteEsma");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const saveToLocalStorage = (newFavorites: number[]) => {
    localStorage.setItem("favoriteEsma", JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleFavorite = (id: number) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    
    saveToLocalStorage(newFavorites);
  };

  const filteredEsma = esmaNames.filter(esma => 
    esma.turkish.toLowerCase().includes(searchTerm.toLowerCase()) ||
    esma.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-emerald-600 dark:text-emerald-400 mb-8">
        Esmaül Hüsna
      </h1>
      
      <div className="mb-6 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="İsim veya anlamına göre ara..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEsma.map((esma) => (
          <motion.div
            key={esma.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  {esma.turkish}
                </h2>
                <div className="text-2xl mb-2 font-arabic text-gray-800 dark:text-gray-200">
                  {esma.arabic}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {esma.meaning}
                </p>
              </div>
              
              <button
                onClick={() => toggleFavorite(esma.id)}
                className="mt-1"
              >
                <Heart 
                  className={`w-5 h-5 ${
                    favorites.includes(esma.id) 
                      ? "fill-red-500 text-red-500" 
                      : "text-gray-400 hover:text-red-500"
                  }`} 
                />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredEsma.length === 0 && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Aradığınız kriterlere uygun sonuç bulunamadı.
        </div>
      )}
    </div>
  );
} 