"use client";

import React, { useState } from "react";
import { Search, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardTitle, CardDescription } from "@/components/ui/hover-effect";
import Link from "next/link";


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
  { id: 31, arabic: "اللطيف", turkish: "El-Latif", meaning: "En ince işlerin bütün inceliklerini bilen." },
  { id: 32, arabic: "الخبير", turkish: "El-Habir", meaning: "Her şeyden haberdar olan." },
  { id: 33, arabic: "الحليم", turkish: "El-Halim", meaning: "Yumuşak davranan, cezada acele etmeyen." },
  { id: 34, arabic: "العظيم", turkish: "El-Azim", meaning: "Büyüklükte sonu olmayan." },
  { id: 35, arabic: "الغفور", turkish: "El-Gafur", meaning: "Çok bağışlayıcı." },
  { id: 36, arabic: "الشكور", turkish: "Eş-Şekur", meaning: "Az iyiliğe çok mükâfat veren." },
  { id: 37, arabic: "العلي", turkish: "El-Aliyy", meaning: "Yüceler yücesi." },
  { id: 38, arabic: "الكبير", turkish: "El-Kebir", meaning: "Büyüklükte benzeri olmayan." },
  { id: 39, arabic: "الحفيظ", turkish: "El-Hafiz", meaning: "Koruyucu." },
  { id: 40, arabic: "المقيت", turkish: "El-Mukit", meaning: "Rızıkları yaratan ve ihtiyacı olanlara ulaştıran." },
  { id: 41, arabic: "الحسيب", turkish: "El-Hasib", meaning: "Hesaba çeken." },
  { id: 42, arabic: "الجليل", turkish: "El-Celil", meaning: "Celal ve azamet sahibi." },
  { id: 43, arabic: "الكريم", turkish: "El-Kerim", meaning: "Çok cömert, çok ikram eden." },
  { id: 44, arabic: "الرقيب", turkish: "Er-Rakib", meaning: "Her an gözetleyen." },
  { id: 45, arabic: "المجيب", turkish: "El-Mucib", meaning: "Duaları kabul eden." },
  { id: 46, arabic: "الواسع", turkish: "El-Vasi", meaning: "İlmi ve rahmeti her şeyi kuşatan." },
  { id: 47, arabic: "الحكيم", turkish: "El-Hakim", meaning: "Her işi hikmetli olan." },
  { id: 48, arabic: "الودود", turkish: "El-Vedud", meaning: "Çok seven, çok sevilen." },
  { id: 49, arabic: "المجيد", turkish: "El-Mecid", meaning: "Şanı yüce olan." },
  { id: 50, arabic: "الباعث", turkish: "El-Bais", meaning: "Ölüleri dirilten." },
  { id: 51, arabic: "الشهيد", turkish: "Eş-Şehid", meaning: "Her şeye şahit olan." },
  { id: 52, arabic: "الحق", turkish: "El-Hakk", meaning: "Varlığı değişmez olan gerçek." },
  { id: 53, arabic: "الوكيل", turkish: "El-Vekil", meaning: "Kendisine tevekkül edenlerin işlerini yoluna koyan." },
  { id: 54, arabic: "القوي", turkish: "El-Kaviyy", meaning: "Kudret sahibi." },
  { id: 55, arabic: "المتين", turkish: "El-Metin", meaning: "Kuvvet ve kudret menbaı." },
  { id: 56, arabic: "الولي", turkish: "El-Veliyy", meaning: "Dost, yardımcı." },
  { id: 57, arabic: "الحميد", turkish: "El-Hamid", meaning: "Övgüye lâyık." },
  { id: 58, arabic: "المحصي", turkish: "El-Muhsi", meaning: "Her şeyi tek tek sayan, bilen." },
  { id: 59, arabic: "المبدئ", turkish: "El-Mübdi", meaning: "Maddesiz ve örneksiz yaratan." },
  { id: 60, arabic: "المعيد", turkish: "El-Muid", meaning: "Yok olanı tekrar var eden." },
  { id: 61, arabic: "المحيي", turkish: "El-Muhyi", meaning: "Can veren, dirilten." },
  { id: 62, arabic: "المميت", turkish: "El-Mümit", meaning: "Ölümü yaratan." },
  { id: 63, arabic: "الحي", turkish: "El-Hayy", meaning: "Diri, canlı, hayat sahibi." },
  { id: 64, arabic: "القيوم", turkish: "El-Kayyum", meaning: "Zatı ile var olan ve her şeyi varlıkta tutan." },
  { id: 65, arabic: "الواجد", turkish: "El-Vacid", meaning: "Dilediğini dilediği anda bulan." },
  { id: 66, arabic: "الماجد", turkish: "El-Macid", meaning: "Şanı, izzet ve şerefi çok yüce olan." },
  { id: 67, arabic: "الواحد", turkish: "El-Vahid", meaning: "Tek olan, bir olan." },
  { id: 68, arabic: "الصمد", turkish: "Es-Samed", meaning: "Hiçbir şeye muhtaç olmayan." },
  { id: 69, arabic: "القادر", turkish: "El-Kadir", meaning: "Güç yetiren, ölçüyle yaratan." },
  { id: 70, arabic: "المقتدر", turkish: "El-Muktedir", meaning: "Dilediği gibi tasarruf eden." },
  { id: 71, arabic: "المقدم", turkish: "El-Mukaddim", meaning: "İstediğini öne alan." },
  { id: 72, arabic: "المؤخر", turkish: "El-Muahhir", meaning: "İstediğini arkaya bırakan." },
  { id: 73, arabic: "الأول", turkish: "El-Evvel", meaning: "İlk." },
  { id: 74, arabic: "الآخر", turkish: "El-Ahir", meaning: "Son." },
  { id: 75, arabic: "الظاهر", turkish: "Ez-Zahir", meaning: "Varlığı açık, aşikâr." },
  { id: 76, arabic: "الباطن", turkish: "El-Batın", meaning: "Gizli, görünmeyen, aklın kavrayamayacağı." },
  { id: 77, arabic: "الوالي", turkish: "El-Vali", meaning: "Kâinatı idare eden." },
  { id: 78, arabic: "المتعال", turkish: "El-Müteali", meaning: "Son derece yüce." },
  { id: 79, arabic: "البر", turkish: "El-Berr", meaning: "İyilik ve ihsanı bol." },
  { id: 80, arabic: "التواب", turkish: "Et-Tevvab", meaning: "Tevbeleri kabul eden." },
  { id: 81, arabic: "المنتقم", turkish: "El-Müntakim", meaning: "Suçluları cezalandıran." },
  { id: 82, arabic: "العفو", turkish: "El-Afüvv", meaning: "Affeden, bağışlayan." },
  { id: 83, arabic: "الرؤوف", turkish: "Er-Rauf", meaning: "Çok şefkatli." },
  { id: 84, arabic: "مالك الملك", turkish: "Malik'ül-Mülk", meaning: "Mülkün gerçek sahibi." },
  { id: 85, arabic: "ذو الجلال والإكرام", turkish: "Zül-Celali vel-İkram", meaning: "Celal, azamet ve kerem sahibi." },
  { id: 86, arabic: "المقسط", turkish: "El-Muksit", meaning: "Adaletle hükmeden." },
  { id: 87, arabic: "الجامع", turkish: "El-Cami", meaning: "İstediğini bir araya toplayan." },
  { id: 88, arabic: "الغني", turkish: "El-Ganiyy", meaning: "Zengin, hiçbir şeye muhtaç olmayan." },
  { id: 89, arabic: "المغني", turkish: "El-Mugni", meaning: "Müstağni kılan, zengin eden." },
  { id: 90, arabic: "المانع", turkish: "El-Mani", meaning: "Dilemediği şeye mani olan, engelleyen." },
  { id: 91, arabic: "الضار", turkish: "Ed-Darr", meaning: "Zarar verenlerin zarar vermesini yaratan." },
  { id: 92, arabic: "النافع", turkish: "En-Nafi", meaning: "Fayda veren." },
  { id: 93, arabic: "النور", turkish: "En-Nur", meaning: "Aydınlatan, nur kaynağı." },
  { id: 94, arabic: "الهادي", turkish: "El-Hadi", meaning: "Hidayet veren." },
  { id: 95, arabic: "البديع", turkish: "El-Bedi", meaning: "Eşi ve örneği olmayan." },
  { id: 96, arabic: "الباقي", turkish: "El-Baki", meaning: "Varlığının sonu olmayan." },
  { id: 97, arabic: "الوارث", turkish: "El-Varis", meaning: "Her şeyin asıl ve gerçek sahibi." },
  { id: 98, arabic: "الرشيد", turkish: "Er-Reşid", meaning: "Doğru yolu gösteren." },
  { id: 99, arabic: "الصبور", turkish: "Es-Sabur", meaning: "Çok sabırlı olan." }
];

export default function EsmaulHusnaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    
    saveToLocalStorage(newFavorites);
  };

  const filteredEsma = esmaNames.filter(esma => 
    esma.turkish.toLowerCase().includes(searchTerm.toLowerCase()) ||
    esma.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format esma data for hover effect component
  const esmaItems = filteredEsma.map(esma => ({
    title: esma.turkish,
    description: esma.meaning,
    link: `#${esma.id}`, // Anchor link
    id: esma.id,
    arabic: esma.arabic
  }));

  return (
    <div className="container px-4 py-8 max-w-6xl mx-auto">
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
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
          />
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {esmaItems.map((item, idx) => (
          <div
            key={item.id}
            className="relative group block p-2 h-full w-full"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-emerald-100 dark:bg-emerald-900/30 block rounded-3xl"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            <Card>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{item.title}</CardTitle>
                  <div className="text-2xl mb-2 font-arabic text-gray-800 dark:text-gray-200">
                    {item.arabic}
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </div>
                
                <motion.button
                  onClick={(e) => toggleFavorite(item.id, e)}
                  className="mt-1"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      favorites.includes(item.id) 
                        ? "fill-red-500 text-red-500" 
                        : "text-gray-400 hover:text-red-500"
                    }`} 
                  />
                </motion.button>
              </div>
            </Card>
          </div>
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