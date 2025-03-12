"use client";

import React, { useState, useEffect } from "react";
import { 
  getAllDuas, 
  getDuasByCategory, 
  getDuaCategories, 
  getDailyDua, 
  Dua, 
  DailyDua 
} from "@/services/duaService";
import { ChevronDown, ChevronUp, BookOpen, Star, Calendar, Copy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function DuaPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredDuas, setFilteredDuas] = useState<Dua[]>([]);
  const [allDuas, setAllDuas] = useState<Dua[]>([]);
  const [dailyDua, setDailyDua] = useState<DailyDua | null>(null);
  const [expandedDua, setExpandedDua] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const cats = getDuaCategories();
    const duas = getAllDuas();
    const daily = getDailyDua();

    setCategories(cats);
    setAllDuas(duas);
    setFilteredDuas(duas);
    setDailyDua(daily);
    
    // Select first category by default
    if (cats.length > 0) {
      setSelectedCategory(cats[0]);
      setFilteredDuas(getDuasByCategory(cats[0]));
    }
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFilteredDuas(getDuasByCategory(category));
    setSearchTerm("");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      if (selectedCategory) {
        setFilteredDuas(getDuasByCategory(selectedCategory));
      } else {
        setFilteredDuas(allDuas);
      }
    } else {
      const filtered = allDuas.filter(
        (dua) =>
          dua.title.toLowerCase().includes(value.toLowerCase()) ||
          dua.turkishText.toLowerCase().includes(value.toLowerCase()) ||
          (dua.translation && dua.translation.toLowerCase().includes(value.toLowerCase()))
      );
      setFilteredDuas(filtered);
      setSelectedCategory(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedDua(expandedDua === id ? null : id);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(`${type} kopyalandı`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 dark:bg-gray-900">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-center text-emerald-700 dark:text-emerald-400 mb-2">
          İslami Dualar
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-10">
          İslam'da en yaygın kullanılan dualar ve günlük dua koleksiyonu
        </p>

        {/* Daily Dua Section */}
        {dailyDua && (
          <motion.div 
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 shadow-lg mb-10 relative overflow-hidden dark:from-emerald-700 dark:to-emerald-800"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 right-0 opacity-10">
              <Calendar className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-yellow-300" fill="currentColor" />
                <h2 className="text-xl font-semibold text-white">Günün Duası</h2>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{dailyDua.title}</h3>
              
              {dailyDua.arabic && (
                <div className="group relative mb-4">
                  <p className="text-right text-white text-xl font-arabic leading-relaxed tracking-wider mb-2">
                    {dailyDua.arabic}
                  </p>
                  <button 
                    className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 rounded-full p-1"
                    onClick={() => copyToClipboard(dailyDua.arabic!, "Arapça metin")}
                  >
                    <Copy className="h-4 w-4 text-white" />
                  </button>
                </div>
              )}
              
              <div className="group relative mb-3">
                <p className="text-white font-medium">
                  {dailyDua.turkishText}
                </p>
                <button 
                  className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 rounded-full p-1"
                  onClick={() => copyToClipboard(dailyDua.turkishText, "Türkçe okunuş")}
                >
                  <Copy className="h-4 w-4 text-white" />
                </button>
              </div>
              
              {dailyDua.translation && (
                <p className="text-white/90 text-sm italic mb-4">
                  <span className="font-medium">Anlamı:</span> {dailyDua.translation}
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-4 text-white/80 text-sm">
                {dailyDua.source && (
                  <p>{dailyDua.source}</p>
                )}
                <p className="text-white/70">
                  {new Date(dailyDua.date).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              {dailyDua.virtues && (
                <div className="mt-4 bg-white/10 p-3 rounded-md">
                  <p className="text-white/90 text-sm">
                    <span className="font-medium">Faziletleri:</span> {dailyDua.virtues}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Dua ara..."
              className="w-full px-5 py-3 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Categories */}
        {searchTerm === "" && (
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-emerald-500 text-white dark:bg-emerald-600"
                    : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Duas List */}
        <div className="space-y-4">
          {filteredDuas.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Uygun dua bulunamadı</p>
            </div>
          ) : (
            filteredDuas.map((dua) => (
              <motion.div
                key={dua.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800"
              >
                <button
                  onClick={() => toggleExpand(dua.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <BookOpen className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {dua.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {dua.source}
                      </p>
                    </div>
                  </div>
                  {expandedDua === dua.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedDua === dua.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100 dark:border-gray-700"
                    >
                      <div className="p-5 space-y-4">
                        {dua.arabic && (
                          <div className="group relative">
                            <p className="text-right text-gray-800 text-xl font-arabic leading-relaxed tracking-wider mb-2 dark:text-gray-200">
                              {dua.arabic}
                            </p>
                            <button 
                              className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-100 dark:bg-gray-700 rounded-full p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(dua.arabic!, "Arapça metin");
                              }}
                            >
                              <Copy className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            </button>
                          </div>
                        )}
                        
                        <div className="group relative">
                          <p className="text-gray-800 font-medium dark:text-gray-200">
                            {dua.turkishText}
                          </p>
                          <button 
                            className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-100 dark:bg-gray-700 rounded-full p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(dua.turkishText, "Türkçe okunuş");
                            }}
                          >
                            <Copy className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                          </button>
                        </div>
                        
                        {dua.translation && (
                          <div className="group relative">
                            <p className="text-gray-700 dark:text-gray-300">
                              <span className="font-medium">Anlamı:</span>{" "}
                              {dua.translation}
                            </p>
                            <button 
                              className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-100 dark:bg-gray-700 rounded-full p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(dua.translation!, "Türkçe anlamı");
                              }}
                            >
                              <Copy className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            </button>
                          </div>
                        )}

                        {dua.occasion && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Ne Zaman Okunur:</span>{" "}
                            {dua.occasion}
                          </p>
                        )}

                        {dua.virtues && (
                          <div className="mt-4 bg-emerald-50 p-4 rounded-md dark:bg-emerald-900/20">
                            <p className="text-sm text-emerald-700 dark:text-emerald-400">
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
            ))
          )}
        </div>
      </div>

      {/* Copied Text Notification */}
      <AnimatePresence>
        {copiedText && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded-md shadow-lg"
          >
            {copiedText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 