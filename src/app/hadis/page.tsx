"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  BookOpen,
  AlertTriangle,
  BookMarked,
  Heart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HadisPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [openHadis, setOpenHadis] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hadisData, setHadisData] = useState({
    sahihHadisler: [],
    kirkHadis: [],
    bilinenYanlislar: [],
  });

  useEffect(() => {
    // API route'dan hadis verilerini çekiyoruz
    fetch("/api/hadisler")
      .then((res) => res.json())
      .then((data) => setHadisData(data))
      .catch((err) => console.error(err));
  }, []);

  // Favorileri localStorage'dan çekme
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteHadisler");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Favorileri güncelleme
  const updateFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem("favoriteHadisler", JSON.stringify(newFavorites));
  };

  // Hadis açma/kapama
  const toggleHadis = (id: string) => {
    setOpenHadis((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Favorilere ekleme/çıkarma
  const toggleFavorite = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (favorites.includes(id)) {
      updateFavorites(favorites.filter((favId) => favId !== id));
    } else {
      updateFavorites([...favorites, id]);
    }
  };

  // Sahih hadisler için arama ve kategori filtrelemesi
  const filteredSahihHadisler = hadisData.sahihHadisler.filter((hadis: any) => {
    const matchesSearch =
      searchTerm === "" ||
      hadis.turkishText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hadis.explanation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = activeCategory === "" || hadis.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const hadisCategories = [
    { id: "ibadet", title: "İbadet" },
    { id: "ahlak", title: "Ahlak" },
    { id: "muamelat", title: "Muamelat" },
    { id: "iman", title: "İman" },
    { id: "ilim", title: "İlim" },
  ];

  return (
    <div className="min-h-screen bg-white pt-6 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-emerald-600">
          Hadisler
        </h1>

        <Tabs defaultValue="sahih" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-emerald-50">
            <TabsTrigger
              value="sahih"
              className="text-base font-medium data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Sahih Hadisler
            </TabsTrigger>
            <TabsTrigger
              value="kirk"
              className="text-base font-medium data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              <BookMarked className="h-4 w-4 mr-2" />
              40 Hadis
            </TabsTrigger>
            <TabsTrigger
              value="yanlislar"
              className="text-base font-medium data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Doğru Bilinen Yanlışlar
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
                  className="pl-10 bg-white text-gray-800 border-gray-400"
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
                  <p className="text-gray-600">
                    Aramanızla eşleşen hadis bulunamadı.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSahihHadisler.map((hadis: any) => (
                    <div
                      key={hadis.id}
                      className="bg-white border border-gray-100 rounded-lg overflow-hidden"
                    >
                      <div
                        onClick={() => toggleHadis(hadis.id)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-100 hover:bg-gray-200 cursor-pointer"
                      >
                        <p className="font-medium text-gray-900">
                          {hadis.turkishText}
                        </p>
                        <div className="flex items-center">
                          <span
                            onClick={(e) => toggleFavorite(hadis.id, e)}
                            className="mr-3 focus:outline-none cursor-pointer"
                            aria-label={
                              favorites.includes(hadis.id)
                                ? "Favorilerden çıkar"
                                : "Favorilere ekle"
                            }
                          >
                            <Heart
                              className={`h-5 w-5 ${
                                favorites.includes(hadis.id)
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-400 hover:text-red-500"
                              }`}
                            />
                          </span>
                          <ChevronDown
                            className={`h-5 w-5 text-emerald-600 transition-transform ${
                              openHadis[hadis.id] ? "transform rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>

                      {openHadis[hadis.id] && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                          <p className="text-right mb-3 font-arabic text-xl text-gray-800">
                            {hadis.arabic}
                          </p>
                          <p className="mb-2 text-sm text-gray-500">
                            {hadis.source}
                          </p>
                          <p className="text-gray-700">
                            {hadis.explanation}
                          </p>
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
              <h2 className="text-xl font-bold text-emerald-700 mb-4">
                İmam Nevevi'nin 40 Hadisi
              </h2>
              <p className="text-gray-700">
                İmam Nevevi (ö. 1277), dinin temel konularını içeren 40 (aslında
                42) hadisi bir araya getirmiştir. Bu hadisler, İslam'ın temel
                prensiplerini öğrenmek isteyenler için önemli bir kaynak oluşturur.
                Aşağıda bu koleksiyondaki hadislerin bir bölümü yer almaktadır.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                {hadisData.kirkHadis.map((hadis: any) => (
                  <div
                    key={hadis.id}
                    className="bg-white border border-gray-100 rounded-lg overflow-hidden"
                  >
                    <div
                      onClick={() => toggleHadis(hadis.id)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-100 hover:bg-gray-200 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <span className="bg-emerald-100 text-emerald-800 font-bold rounded-full h-8 w-8 flex items-center justify-center text-sm mr-3">
                          {hadis.number}
                        </span>
                        <p className="font-medium text-gray-900">
                          {hadis.turkishText.substring(0, 70)}...
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span
                          onClick={(e) => toggleFavorite(hadis.id, e)}
                          className="mr-3 focus:outline-none cursor-pointer"
                          aria-label={
                            favorites.includes(hadis.id)
                              ? "Favorilerden çıkar"
                              : "Favorilere ekle"
                          }
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              favorites.includes(hadis.id)
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400 hover:text-red-500"
                            }`}
                          />
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-emerald-600 transition-transform ${
                            openHadis[hadis.id] ? "transform rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {openHadis[hadis.id] && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <p className="text-right mb-3 font-arabic text-xl text-gray-800">
                          {hadis.arabic}
                        </p>
                        <p className="mb-4 text-gray-700">
                          {hadis.turkishText}
                        </p>
                        <p className="mb-2 text-sm text-gray-500">
                          {hadis.source}
                        </p>
                        <p className="text-gray-700">
                          {hadis.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Doğru Bilinen Yanlışlar Tab */}
          <TabsContent value="yanlislar" className="space-y-6">
            <div className="bg-white p-6 rounded-lg mb-6">
              <h2 className="text-xl font-bold text-emerald-700 mb-4">
                Hadislerle İlgili Bilinen Yanlışlar
              </h2>
              <p className="text-gray-700">
                Hadis ilmi komplike bir alandır ve çeşitli yanlış anlaşılmalara
                açıktır. Aşağıda hadislerle ilgili toplumda yaygın olan bazı yanlış
                anlaşılmalar ve bunların doğruları bulunmaktadır.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                {hadisData.bilinenYanlislar.map((yanlis: any) => (
                  <div
                    key={yanlis.id}
                    className="bg-white border border-gray-100 rounded-lg overflow-hidden"
                  >
                    <div
                      onClick={() => toggleHadis(yanlis.id)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-100 hover:bg-gray-200 cursor-pointer"
                    >
                      <p className="font-medium text-gray-900">
                        {yanlis.title}
                      </p>
                      <div className="flex items-center">
                        <span
                          onClick={(e) => toggleFavorite(yanlis.id, e)}
                          className="mr-3 focus:outline-none cursor-pointer"
                          aria-label={
                            favorites.includes(yanlis.id)
                              ? "Favorilerden çıkar"
                              : "Favorilere ekle"
                          }
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              favorites.includes(yanlis.id)
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400 hover:text-red-500"
                            }`}
                          />
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-emerald-600 transition-transform ${
                            openHadis[yanlis.id] ? "transform rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>

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
          <h2 className="text-xl font-bold text-emerald-700 mb-2">
            Daha Fazla Hadis
          </h2>
          <p className="text-gray-600 mb-4">
            Daha fazla hadis ve hadis ilmiyle ilgili bilgi için güvenilir kaynaklara
            başvurabilir veya İslami ilimler alanında eğitim almış kişilere danışabilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="/chatbot"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Hadisler Hakkında Soru Sor
            </a>
            <a
              href="/hakkimizda"
              className="px-4 py-2 bg-white text-slate-800 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
            >
              Bize Ulaşın
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
