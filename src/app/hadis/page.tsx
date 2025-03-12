"use client";

import { useState } from "react";
import { Search, ChevronDown, BookOpen, AlertTriangle, BookMarked } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HadisPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [openHadis, setOpenHadis] = useState<Record<string, boolean>>({});

  // Sahih hadis kategorileri
  const hadisCategories = [
    { id: "ibadet", title: "İbadet" },
    { id: "ahlak", title: "Ahlak" },
    { id: "muamelat", title: "Muamelat" },
    { id: "iman", title: "İman" },
    { id: "ilim", title: "İlim" }
  ];

  // Sahih hadisler listesi
  const sahihHadisler = [
    {
      id: "h1",
      category: "ibadet",
      arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
      turkishText: "Ameller niyetlere göredir.",
      source: "Buhârî, Bed'ü'l-vahy, 1; Müslim, İmâre, 155",
      explanation: "Bir kimsenin yaptığı işin değeri, o işi hangi niyetle yaptığına bağlıdır. İbadetler ve diğer davranışlar, kişinin niyetine göre değer kazanır veya kaybeder."
    },
    {
      id: "h2",
      category: "ahlak",
      arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
      turkishText: "Sizden biriniz kendisi için sevdiğini kardeşi için de sevmedikçe iman etmiş olmaz.",
      source: "Buhârî, Îmân, 7; Müslim, Îmân, 71",
      explanation: "Bu hadis, İslam'daki kardeşlik ve empati anlayışını ortaya koyar. Bir mümin, kendisi için istediği iyiliği başkaları için de istemelidir."
    },
    {
      id: "h3",
      category: "iman",
      arabic: "بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ",
      turkishText: "İslam beş temel üzerine kurulmuştur: Allah'tan başka ilah olmadığına ve Muhammed'in Allah'ın Resulü olduğuna şahitlik etmek, namaz kılmak, zekât vermek, hacca gitmek ve Ramazan orucunu tutmak.",
      source: "Buhârî, Îmân, 2; Müslim, Îmân, 21",
      explanation: "İslam'ın beş şartını açıklayan bu hadis, Müslümanların yerine getirmesi gereken temel görevleri belirtir."
    },
    {
      id: "h4",
      category: "ilim",
      arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
      turkishText: "İlim öğrenmek her Müslümana farzdır.",
      source: "İbn Mâce, Mukaddime, 17",
      explanation: "İslam dini, bilgi edinmeyi ve kendini geliştirmeyi tüm Müslümanlar için bir görev olarak görür. Kişinin dinini ve dünyasını doğru şekilde yaşaması için bilgi şarttır."
    },
    {
      id: "h5",
      category: "muamelat",
      arabic: "الدِّينُ النَّصِيحَةُ",
      turkishText: "Din nasihattir (samimiyettir).",
      source: "Müslim, Îmân, 95",
      explanation: "İslam'da samimiyet ve iyiliği tavsiye etmek dinin özüdür. Kişinin Allah'a, Resulüne, İslam büyüklerine ve tüm Müslümanlara karşı samimi ve dürüst olması gerekir."
    },
    {
      id: "h6",
      category: "ahlak",
      arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
      turkishText: "Allah'a ve ahiret gününe iman eden kimse, ya hayır söylesin ya da sussun.",
      source: "Buhârî, Edeb, 31; Müslim, Îmân, 74",
      explanation: "Bu hadis, konuşmanın önemini ve sözün değerini vurgular. Müslümanlar, konuşurken faydalı şeyler söylemeli veya susmalıdır."
    },
    {
      id: "h7",
      category: "ibadet",
      arabic: "إِنَّ اللهَ كَتَبَ الْإِحْسَانَ عَلَى كُلِّ شَيْءٍ",
      turkishText: "Allah her şeyde ihsanı (mükemmelliği) yazmıştır.",
      source: "Müslim, Sayd, 57",
      explanation: "İhsan, işi en güzel şekilde yapmak demektir. Bu hadis, her işte kaliteyi ve mükemmelliği aramanın gerekliliğini vurgular."
    },
    {
      id: "h8",
      category: "ilim",
      arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
      turkishText: "Kim ilim talep etmek için bir yola girerse, Allah ona cennetin yolunu kolaylaştırır.",
      source: "Müslim, Zikr, 38",
      explanation: "İlim öğrenmenin ve bilgi peşinde koşmanın faziletini anlatan bu hadis, ilim yolunda çaba gösterenlere Allah'ın cennet yolunu kolaylaştıracağını müjdeler."
    },
    {
      id: "h9",
      category: "muamelat",
      arabic: "خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ وَأَنَا خَيْرُكُمْ لِأَهْلِي",
      turkishText: "Sizin en hayırlınız, ailesine karşı en hayırlı olanınızdır. Ben de aileme karşı en hayırlı olanınızım.",
      source: "Tirmizî, Menâkıb, 63",
      explanation: "Bu hadis, aile ilişkilerinin önemini ve aile üyelerine iyi davranmanın gerekliliğini vurgular. Peygamber Efendimiz kendisinin de ailesine karşı en iyi şekilde davrandığını belirtmiştir."
    },
    {
      id: "h10",
      category: "iman",
      arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى أَكُونَ أَحَبَّ إِلَيْهِ مِنْ وَالِدِهِ وَوَلَدِهِ وَالنَّاسِ أَجْمَعِينَ",
      turkishText: "Sizden biriniz, ben ona babasından, evladından ve bütün insanlardan daha sevimli olmadıkça, iman etmiş olmaz.",
      source: "Buhârî, Îmân, 8; Müslim, Îmân, 70",
      explanation: "Hz. Peygamber'e olan sevginin, imanın bir göstergesi olduğunu belirten bu hadis, kişinin Peygamberimizi çok sevmesi gerektiğini vurgular."
    }
  ];

  // 40 Hadis - İmam Nevevi'nin 40 Hadis'inden seçmeler
  const kirkHadis = [
    {
      id: "k1",
      number: 1,
      arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ...",
      turkishText: "Ameller niyetlere göredir...",
      source: "Buhârî, Bed'ü'l-vahy, 1; Müslim, İmâre, 155",
      explanation: "Bu hadis İmam Nevevi'nin kırk hadis derlemesinin ilk hadisidir. Bir işin değerinin niyete göre belirleneceğini belirtir."
    },
    {
      id: "k2",
      number: 2,
      arabic: "بَيْنَمَا نَحْنُ جُلُوسٌ عِنْدَ رَسُولِ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ ذَاتَ يَوْمٍ إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ...",
      turkishText: "Bir gün Allah Resûlü (s.a.v.)'in yanında bulunduğumuz sırada, elbisesi bembeyaz, saçları simsiyah bir adam çıkageldi...",
      source: "Müslim, Îmân, 1",
      explanation: "Cebrail hadisi olarak bilinen bu rivayette, İslam'ın, imanın ve ihsanın ne olduğu açıklanmaktadır."
    },
    {
      id: "k3",
      number: 3,
      arabic: "بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ...",
      turkishText: "İslam beş temel üzerine kurulmuştur...",
      source: "Buhârî, Îmân, 2; Müslim, Îmân, 21",
      explanation: "İslam'ın beş şartını açıklayan bu hadis, Müslümanların temel sorumluluklarını belirtir."
    },
    {
      id: "k4",
      number: 4,
      arabic: "إِنَّ أَحَدَكُمْ يُجْمَعُ خَلْقُهُ فِي بَطْنِ أُمِّهِ أَرْبَعِينَ يَوْمًا...",
      turkishText: "Sizden birinizin yaratılışı, annesinin karnında kırk günde toplanır...",
      source: "Buhârî, Bed'ü'l-halk, 6; Müslim, Kader, 1",
      explanation: "İnsanın anne karnındaki oluşum sürecini ve kaderin nasıl yazıldığını anlatan bir hadistir."
    },
    {
      id: "k5",
      number: 5,
      arabic: "مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ مِنْهُ فَهُوَ رَدٌّ",
      turkishText: "Kim bizim bu işimizde (dinimizde) ondan olmayan bir şey ihdas ederse, o reddedilir.",
      source: "Buhârî, Sulh, 5; Müslim, Akdiye, 17",
      explanation: "Bu hadis bidatlerin (dinde olmayan yeni uygulamaların) reddedileceğini belirtir."
    },
    {
      id: "k6",
      number: 6,
      arabic: "إِنَّ الْحَلَالَ بَيِّنٌ وَإِنَّ الْحَرَامَ بَيِّنٌ وَبَيْنَهُمَا أُمُورٌ مُشْتَبِهَاتٌ...",
      turkishText: "Helal bellidir, haram da bellidir. İkisinin arasında ise şüpheli şeyler vardır...",
      source: "Buhârî, Îmân, 39; Müslim, Müsâkât, 107",
      explanation: "Bu hadis, helal ve haramların yanında şüpheli konulardan da kaçınmak gerektiğini öğütler. Kalbin huzuru için şüpheli şeylerden uzak durmak gerekir."
    },
    {
      id: "k7",
      number: 7,
      arabic: "الدِّينُ النَّصِيحَةُ...",
      turkishText: "Din nasihattir (samimiyettir)...",
      source: "Müslim, Îmân, 95",
      explanation: "Bu hadis, dinin özünün samimiyet olduğunu ve kişinin Allah'a, Peygamber'e ve tüm Müslümanlara karşı samimi olması gerektiğini vurgular."
    },
    {
      id: "k8",
      number: 8,
      arabic: "أُمِرْتُ أَنْ أُقَاتِلَ النَّاسَ حَتَّى يَشْهَدُوا أَنْ لَا إِلَهَ إِلَّا اللَّهُ...",
      turkishText: "İnsanlar 'Lâ ilâhe illallah' diyene kadar onlarla savaşmakla emrolundum...",
      source: "Buhârî, Îmân, 17; Müslim, Îmân, 36",
      explanation: "Bu hadis, İslam'ın temel prensiplerini kabul eden kişilerin can ve mal güvenliğinin sağlanması gerektiğini ifade eder."
    }
  ];

  // Hadislerle ilgili bilinen yanlışlar
  const bilinenYanlislar = [
    {
      id: "y1",
      title: "Bütün Hadislerin Aynı Güvenilirlik Seviyesine Sahip Olduğu Yanılgısı",
      description: "Hadisler, sahih, hasen ve zayıf gibi farklı derecelere ayrılır. Tüm hadisler aynı güvenilirlikte değildir. Bu nedenle hadisleri değerlendirirken sıhhat derecesine bakmak önemlidir."
    },
    {
      id: "y2",
      title: "Hadislerin Hepsinin Hz. Peygamber'den Hemen Sonra Yazıldığı Yanılgısı",
      description: "Hadislerin yazılı olarak kaydedilmesi uzun bir süreç içinde gerçekleşmiştir. Hz. Peygamber döneminde bazı hadisler yazılmış olsa da, sistematik hadis koleksiyonları daha sonraki yüzyıllarda oluşturulmuştur."
    },
    {
      id: "y3",
      title: "Sadece Buhârî ve Müslim'deki Hadislerin Sahih Olduğu Yanılgısı",
      description: "Buhârî ve Müslim en güvenilir hadis kaynaklarından olsa da, diğer hadis kitaplarında da sahih hadisler bulunmaktadır. Ayrıca, bu iki kaynakta da farklı derecelerde hadisler yer almaktadır."
    },
    {
      id: "y4",
      title: "\"Uydurma Hadis\" ile \"Zayıf Hadis\"in Aynı Olduğu Yanılgısı",
      description: "Uydurma hadisler tamamen asılsız olup, Hz. Peygamber'e ait olmayan sözlerdir. Zayıf hadisler ise isnad açısından bazı kusurları olan, ancak tamamen reddedilmesi gerekmeyen hadislerdir."
    },
    {
      id: "y5",
      title: "İnternette ve Sosyal Medyada Paylaşılan Tüm Hadislerin Doğru Olduğu Yanılgısı",
      description: "Günümüzde internet ve sosyal medyada Hz. Peygamber'e atfedilen pek çok söz paylaşılmaktadır. Ancak bunların büyük bir kısmı hadis değil, özlü sözler veya tamamen uydurmadır. Hadis olarak paylaşılan sözlerin mutlaka güvenilir kaynaklardan teyit edilmesi gerekir."
    },
    {
      id: "y6",
      title: "Herkesin Hadis Rivayet Edebileceği Yanılgısı",
      description: "Hadis ilminde raviler (hadisi aktaranlar) titizlikle incelenir ve adalet, zabt (ezber kuvveti), takva gibi özelliklere sahip olmaları beklenir. Herkes hadis rivayet edemez ve rivayet edilen hadisler çeşitli kriterlere göre değerlendirilir."
    },
    {
      id: "y7",
      title: "Hadislerin Kur'an'dan Bağımsız Olduğu Yanılgısı",
      description: "Hadisler, Kur'an'ın açıklayıcısı ve tamamlayıcısıdır. Kur'an'a aykırı bir hadis kabul edilmez. Hadisler Kur'an'la birlikte değerlendirilmelidir."
    }
  ];

  // Hadisleri filtreleme
  const filteredSahihHadisler = sahihHadisler.filter(hadis => {
    const matchesSearch = searchTerm === "" || 
      hadis.turkishText.toLowerCase().includes(searchTerm.toLowerCase()) || 
      hadis.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "" || hadis.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Hadisi açma/kapama
  const toggleHadis = (id: string) => {
    setOpenHadis(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-6 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-emerald-500">
          Hadisler
        </h1>
        
        <Tabs defaultValue="sahih" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="sahih" className="text-base font-medium">
              <BookOpen className="h-4 w-4 mr-2" />
              Sahih Hadisler
            </TabsTrigger>
            <TabsTrigger value="kirk" className="text-base font-medium">
              <BookMarked className="h-4 w-4 mr-2" />
              40 Hadis
            </TabsTrigger>
            <TabsTrigger value="yanlislar" className="text-base font-medium">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Bilinen Yanlışlar
            </TabsTrigger>
          </TabsList>
          
          {/* Sahih Hadisler Tab */}
          <TabsContent value="sahih" className="space-y-6">
            <div className="max-w-2xl mx-auto mb-6 relative">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Hadislerde ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <button
                onClick={() => setActiveCategory("")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeCategory === ""
                    ? "bg-emerald-600 text-white font-medium"
                    : "bg-white text-slate-800 hover:bg-gray-200 font-medium"
                }`}
              >
                Tümü
              </button>
              
              {hadisCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeCategory === category.id
                      ? "bg-emerald-600 text-white font-medium"
                      : "bg-white text-slate-800 hover:bg-gray-200 font-medium"
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
            
            <div className="max-w-3xl mx-auto">
              {filteredSahihHadisler.length === 0 ? (
                <div className="bg-white p-6 rounded-lg text-center">
                  <p className="text-gray-600">Aramanızla eşleşen hadis bulunamadı.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSahihHadisler.map((hadis) => (
                    <div
                      key={hadis.id}
                      className="bg-white border border-gray-100 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleHadis(hadis.id)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                      >
                        <p className="font-medium text-gray-900">{hadis.turkishText}</p>
                        <ChevronDown
                          className={`h-5 w-5 text-emerald-600 transition-transform ${
                            openHadis[hadis.id] ? "transform rotate-180" : ""
                          }`}
                        />
                      </button>
                      
                      {openHadis[hadis.id] && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                          <p className="text-right mb-3 font-arabic text-xl text-gray-800">{hadis.arabic}</p>
                          <p className="mb-2 text-sm text-gray-500">{hadis.source}</p>
                          <p className="text-gray-700">{hadis.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* 40 Hadis Tab */}
          <TabsContent value="kirk" className="space-y-6">
            <div className="bg-white p-6 rounded-lg mb-6">
              <h2 className="text-xl font-bold text-emerald-700 mb-4">İmam Nevevi'nin 40 Hadisi</h2>
              <p className="text-gray-700">
                İmam Nevevi (ö. 1277), dinin temel konularını içeren 40 (aslında 42) hadisi bir araya getirmiştir. Bu hadisler, İslam'ın temel prensiplerini öğrenmek isteyenler için önemli bir kaynak oluşturur. Aşağıda bu koleksiyondaki hadislerin bir bölümü yer almaktadır.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                {kirkHadis.map((hadis) => (
                  <div
                    key={hadis.id}
                    className="bg-white border border-gray-100 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleHadis(hadis.id)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <span className="bg-emerald-100 text-emerald-800 font-bold rounded-full h-8 w-8 flex items-center justify-center text-sm mr-3">
                          {hadis.number}
                        </span>
                        <p className="font-medium text-gray-900">{hadis.turkishText.substring(0, 70)}...</p>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-emerald-600 transition-transform ${
                          openHadis[hadis.id] ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    
                    {openHadis[hadis.id] && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <p className="text-right mb-3 font-arabic text-xl text-gray-800">{hadis.arabic}</p>
                        <p className="mb-4 text-gray-700">{hadis.turkishText}</p>
                        <p className="mb-2 text-sm text-gray-500">{hadis.source}</p>
                        <p className="text-gray-700">{hadis.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Bilinen Yanlışlar Tab */}
          <TabsContent value="yanlislar" className="space-y-6">
            <div className="bg-white p-6 rounded-lg mb-6">
              <h2 className="text-xl font-bold text-emerald-700 mb-4">Hadislerle İlgili Bilinen Yanlışlar</h2>
              <p className="text-gray-700">
                Hadis ilmi komplike bir alandır ve çeşitli yanlış anlaşılmalara açıktır. Aşağıda hadislerle ilgili toplumda yaygın olan bazı yanlış anlaşılmalar ve bunların doğruları bulunmaktadır.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                {bilinenYanlislar.map((yanlis) => (
                  <div
                    key={yanlis.id}
                    className="bg-white border border-gray-100 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleHadis(yanlis.id)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                    >
                      <p className="font-medium text-gray-900">{yanlis.title}</p>
                      <ChevronDown
                        className={`h-5 w-5 text-emerald-600 transition-transform ${
                          openHadis[yanlis.id] ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    
                    {openHadis[yanlis.id] && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <p className="text-gray-700">{yanlis.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Kaynaklar ve Açıklama */}
        <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-lg text-center border border-gray-100">
          <h2 className="text-xl font-bold text-emerald-700 mb-2">Daha Fazla Hadis</h2>
          <p className="text-gray-600 mb-4">
            Daha fazla hadis ve hadis ilmiyle ilgili bilgi için güvenilir kaynaklara başvurabilir veya İslami ilimler alanında eğitim almış kişilere danışabilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a href="/chatbot" className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
              Hadisler Hakkında Soru Sor
            </a>
            <a href="/ilmihal" className="px-4 py-2 bg-white text-slate-800 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
              İlmihal'e Git
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 