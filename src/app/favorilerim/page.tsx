"use client";

import { useState, useEffect } from "react";
import { 
  getAllDuas, 
  getDuaById,
  Dua,
  DailyDua 
} from "@/services/duaService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, BookMarked, ChevronDown, ChevronUp, BookText } from "lucide-react";
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

interface EsmaItem {
  id: number;
  arabic: string;
  turkish: string;
  meaning: string;
}

export default function FavorilerimPage() {
  const [duaFavorites, setDuaFavorites] = useState<Dua[]>([]);
  const [hadiFavorites, setHadisFavorites] = useState<HadisItem[]>([]);
  const [esmaFavorites, setEsmaFavorites] = useState<EsmaItem[]>([]);
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

  // Esmaül Hüsna veri kümesi
  const esmaData: EsmaItem[] = [
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

    // Esmaül Hüsna favorilerini yükle
    const storedEsmaFavorites = localStorage.getItem('favoriteEsma');
    if (storedEsmaFavorites) {
      const esmaIds = JSON.parse(storedEsmaFavorites) as number[];
      const favoriteEsma = esmaData.filter(esma => esmaIds.includes(esma.id));
      setEsmaFavorites(favoriteEsma);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const removeFromFavorites = (id: string | number, type: 'dua' | 'hadis' | 'esma') => {
    if (type === 'dua') {
      const storedFavorites = localStorage.getItem('favoriteDualar');
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites) as string[];
        const newFavorites = favorites.filter(favId => favId !== id);
        localStorage.setItem('favoriteDualar', JSON.stringify(newFavorites));
        setDuaFavorites(prev => prev.filter(dua => dua.id !== id));
      }
    } else if (type === 'hadis') {
      const storedFavorites = localStorage.getItem('favoriteHadisler');
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites) as string[];
        const newFavorites = favorites.filter(favId => favId !== id);
        localStorage.setItem('favoriteHadisler', JSON.stringify(newFavorites));
        setHadisFavorites(prev => prev.filter(hadis => hadis.id !== id));
      }
    } else if (type === 'esma') {
      const storedFavorites = localStorage.getItem('favoriteEsma');
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites) as number[];
        const newFavorites = favorites.filter(favId => favId !== id);
        localStorage.setItem('favoriteEsma', JSON.stringify(newFavorites));
        setEsmaFavorites(prev => prev.filter(esma => esma.id !== id as number));
      }
    }
  };

  return (
    <div className="min-h-screen text-black bg-gray-50 pt-24 pb-16 px-4 dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
              Favorilerim
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              Kaydettiğiniz dua, hadis ve esmaül hüsna
            </p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-emerald-50 dark:bg-emerald-900">
            <TabsTrigger value="dualar" className="text-base font-medium data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <BookOpen className="h-4 w-4 mr-2" />
              Dualar
            </TabsTrigger>
            <TabsTrigger value="hadisler" className="text-base font-medium data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <BookMarked className="h-4 w-4 mr-2" />
              Hadisler
            </TabsTrigger>
            <TabsTrigger value="esmaul-husna" className="text-base font-medium data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <BookText className="h-4 w-4 mr-2" />
              Esmaül Hüsna
            </TabsTrigger>
          </TabsList>
          
          {/* Dualar Tab */}
          <TabsContent value="dualar" className="space-y-6">
            {duaFavorites.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Favori duanız bulunmamaktadır.</p>
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
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                  >
                    <div
                      onClick={() => toggleExpand(dua.id)}
                      className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
                            <BookOpen className="h-5 w-5" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {dua.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
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
                          className="border-t border-gray-100 dark:border-gray-700"
                        >
                          <div className="p-5 space-y-4">
                            {dua.arabic && (
                              <p className="text-right text-gray-800 dark:text-gray-200 text-xl font-arabic leading-relaxed tracking-wider mb-2">
                                {dua.arabic}
                              </p>
                            )}
                            
                            <p className="text-gray-800 dark:text-gray-200 font-medium">
                              {dua.turkishText}
                            </p>
                            
                            {dua.translation && (
                              <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Anlamı:</span>{" "}
                                {dua.translation}
                              </p>
                            )}

                            {dua.occasion && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Ne Zaman Okunur:</span>{" "}
                                {dua.occasion}
                              </p>
                            )}

                            {dua.virtues && (
                              <div className="mt-4 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-md">
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">
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
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Favori hadisiniz bulunmamaktadır.</p>
                <a href="/hadis" className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
                  Hadis Sayfasına Git
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {hadiFavorites.map((hadis) => (
                  <motion.div
                    key={hadis.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                  >
                    <div
                      onClick={() => toggleExpand(hadis.id)}
                      className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
                            <BookMarked className="h-5 w-5" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {hadis.turkishText.substring(0, 60)}{hadis.turkishText.length > 60 ? "..." : ""}
                          </h3>
                          {hadis.category && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {hadis.category.charAt(0).toUpperCase() + hadis.category.slice(1)}
                            </p>
                          )}
                        </div>
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
                        {expandedItems[hadis.id] ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedItems[hadis.id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-100 dark:border-gray-700"
                        >
                          <div className="p-5 space-y-4">
                            {hadis.arabic && (
                              <p className="text-right text-gray-800 dark:text-gray-200 text-xl font-arabic leading-relaxed tracking-wider mb-4">
                                {hadis.arabic}
                              </p>
                            )}
                            
                            <p className="text-gray-800 dark:text-gray-200 font-medium mb-3">
                              {hadis.turkishText}
                            </p>
                            
                            {hadis.source && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                <span className="font-medium not-italic">Kaynak:</span>{" "}
                                {hadis.source}
                              </p>
                            )}

                            {hadis.explanation && (
                              <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  <span className="font-medium">Açıklama:</span>{" "}
                                  {hadis.explanation}
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
          
          {/* Esmaül Hüsna Tab */}
          <TabsContent value="esmaul-husna" className="space-y-6">
            {esmaFavorites.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Favori esmaül hüsnanız bulunmamaktadır.</p>
                <a href="/diger-hizmetler/esmaul-husna" className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
                  Esmaül Hüsna Sayfasına Git
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {esmaFavorites.map((esma) => (
                  <motion.div
                    key={esma.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                  >
                    <div
                      onClick={() => toggleExpand(esma.id.toString())}
                      className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
                            <BookText className="h-5 w-5" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {esma.turkish}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {esma.meaning.substring(0, 60)}{esma.meaning.length > 60 ? "..." : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromFavorites(esma.id, 'esma');
                          }}
                          className="mr-3 text-gray-400 hover:text-red-500 focus:outline-none cursor-pointer"
                          aria-label="Favorilerden çıkar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                          </svg>
                        </span>
                        {expandedItems[esma.id.toString()] ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedItems[esma.id.toString()] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-100 dark:border-gray-700"
                        >
                          <div className="p-5 space-y-4">
                            <p className="text-right text-gray-800 dark:text-gray-200 text-xl font-arabic leading-relaxed tracking-wider mb-4">
                              {esma.arabic}
                            </p>
                            
                            <p className="text-gray-800 dark:text-gray-200 font-medium">
                              {esma.turkish}
                            </p>
                            
                            <p className="text-gray-700 dark:text-gray-300">
                              <span className="font-medium">Anlamı:</span>{" "}
                              {esma.meaning}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 