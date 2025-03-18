"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Search, Star, Bell, BellOff } from "lucide-react";
import { motion } from "framer-motion";

interface DiniGun {
  id: number;
  name: string;
  date: string; // "GG.AA.YYYY" formatında
  description: string;
  isHoliday: boolean;
  importance: 1 | 2 | 3; // 1: Çok Önemli, 2: Önemli, 3: Normal
  type: "gece" | "gun"; // Gece veya Gün
}

export default function DiniGunlerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationSettings, setNotificationSettings] = useState<number[]>([]); // ID'leri tutar
  const [activeYear, setActiveYear] = useState<number>(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<"upcoming" | "all">("upcoming");
  
  // Örnek dini günler ve geceler verileri (normalde API'den gelir)
  const diniGunler: DiniGun[] = [
    {
      id: 1,
      name: "Ramazan Bayramı (1. Gün)",
      date: `10.04.${activeYear}`,
      description: "Ramazan ayının sonunda kutlanan üç günlük bayram.",
      isHoliday: true,
      importance: 1,
      type: "gun"
    },
    {
      id: 2,
      name: "Ramazan Bayramı (2. Gün)",
      date: `11.04.${activeYear}`,
      description: "Ramazan Bayramı'nın ikinci günü.",
      isHoliday: true,
      importance: 1,
      type: "gun"
    },
    {
      id: 3,
      name: "Ramazan Bayramı (3. Gün)",
      date: `12.04.${activeYear}`,
      description: "Ramazan Bayramı'nın üçüncü ve son günü.",
      isHoliday: true,
      importance: 1,
      type: "gun"
    },
    {
      id: 4,
      name: "Kurban Bayramı (1. Gün)",
      date: `17.06.${activeYear}`,
      description: "Hac ibadeti sırasında kutlanan dört günlük bayram.",
      isHoliday: true,
      importance: 1,
      type: "gun"
    },
    {
      id: 5,
      name: "Kurban Bayramı (2. Gün)",
      date: `18.06.${activeYear}`,
      description: "Kurban Bayramı'nın ikinci günü.",
      isHoliday: true,
      importance: 1,
      type: "gun"
    },
    {
      id: 6,
      name: "Kurban Bayramı (3. Gün)",
      date: `19.06.${activeYear}`,
      description: "Kurban Bayramı'nın üçüncü günü.",
      isHoliday: true,
      importance: 1,
      type: "gun"
    },
    {
      id: 7,
      name: "Kurban Bayramı (4. Gün)",
      date: `20.06.${activeYear}`,
      description: "Kurban Bayramı'nın dördüncü ve son günü.",
      isHoliday: true,
      importance: 1,
      type: "gun"
    },
    {
      id: 8,
      name: "Mevlid Kandili",
      date: `15.09.${activeYear}`,
      description: "Hz. Muhammed'in doğum günü anısına kutlanan gece.",
      isHoliday: false,
      importance: 1,
      type: "gece"
    },
    {
      id: 9,
      name: "Regaib Kandili",
      date: `24.01.${activeYear}`,
      description: "Üç ayların başlangıcı olan Recep ayının ilk perşembe gecesi.",
      isHoliday: false,
      importance: 2,
      type: "gece"
    },
    {
      id: 10,
      name: "Miraç Kandili",
      date: `07.02.${activeYear}`,
      description: "Hz. Muhammed'in miracının anıldığı, Recep ayının 27. gecesi.",
      isHoliday: false,
      importance: 1,
      type: "gece"
    },
    {
      id: 11,
      name: "Berat Kandili",
      date: `25.02.${activeYear}`,
      description: "Şaban ayının 15. gecesi, günahlardan arınma gecesi.",
      isHoliday: false,
      importance: 1,
      type: "gece"
    },
    {
      id: 12,
      name: "Kadir Gecesi",
      date: `03.04.${activeYear}`,
      description: "Kur'an'ın indirildiği gece, Ramazan'ın 27. gecesi.",
      isHoliday: false,
      importance: 1,
      type: "gece"
    },
    {
      id: 13,
      name: "Aşure Günü",
      date: `15.07.${activeYear}`,
      description: "Muharrem ayının 10. günü, Hz. Nuh'un gemisinin karaya oturduğu ve Hz. Hüseyin'in şehit edildiği gün.",
      isHoliday: false,
      importance: 2,
      type: "gun"
    },
    {
      id: 14,
      name: "Ramazan'ın İlk Günü",
      date: `11.03.${activeYear}`,
      description: "Oruç ayı Ramazan'ın ilk günü.",
      isHoliday: false,
      importance: 1,
      type: "gun"
    },
    {
      id: 15,
      name: "Arefe Günü (Ramazan)",
      date: `09.04.${activeYear}`,
      description: "Ramazan Bayramı'ndan önceki gün.",
      isHoliday: false,
      importance: 2,
      type: "gun"
    },
    {
      id: 16,
      name: "Arefe Günü (Kurban)",
      date: `16.06.${activeYear}`,
      description: "Kurban Bayramı'ndan önceki gün.",
      isHoliday: false,
      importance: 2,
      type: "gun"
    }
  ];
  
  // LocalStorage'dan bildirim ayarlarını yükle
  useEffect(() => {
    const savedSettings = localStorage.getItem("diniGunlerNotifications");
    if (savedSettings) {
      setNotificationSettings(JSON.parse(savedSettings));
    }
  }, []);
  
  // Bildirim ayarlarını kaydet
  const saveNotificationSettings = (newSettings: number[]) => {
    localStorage.setItem("diniGunlerNotifications", JSON.stringify(newSettings));
    setNotificationSettings(newSettings);
  };
  
  // Bildirim ayarını değiştir
  const toggleNotification = (id: number) => {
    if (notificationSettings.includes(id)) {
      saveNotificationSettings(notificationSettings.filter(itemId => itemId !== id));
    } else {
      saveNotificationSettings([...notificationSettings, id]);
    }
  };
  
  // Tarih fonksiyonları
  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day);
  };
  
  const formatDate = (dateStr: string) => {
    const date = parseDate(dateStr);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      weekday: 'long'
    });
  };
  
  const getRemainingDays = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const targetDate = parseDate(dateStr);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // Arama ve filtreleme
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Yıl değiştirme
  const changeYear = (year: number) => {
    setActiveYear(year);
  };
  
  // Filtrelenmiş günler
  const filteredDays = diniGunler
    .filter(gun => 
      gun.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gun.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (activeTab === "upcoming") {
        const remainingDaysA = getRemainingDays(a.date);
        const remainingDaysB = getRemainingDays(b.date);
        
        // Geçmiş günleri sona koy
        if (remainingDaysA < 0 && remainingDaysB >= 0) return 1;
        if (remainingDaysA >= 0 && remainingDaysB < 0) return -1;
        
        return remainingDaysA - remainingDaysB;
      } else {
        // Tarih sırasına göre
        return parseDate(a.date).getTime() - parseDate(b.date).getTime();
      }
    });
  
  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-emerald-600 dark:text-emerald-400 mb-8">
        Dini Günler ve Geceler ({activeYear})
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        {/* Arama ve Filtreleme */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Ara..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => changeYear(activeYear - 1)}
              className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
            >
              {activeYear - 1}
            </button>
            <button
              className="px-3 py-2 rounded bg-emerald-600 text-white"
              disabled
            >
              {activeYear}
            </button>
            <button
              onClick={() => changeYear(activeYear + 1)}
              className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
            >
              {activeYear + 1}
            </button>
          </div>
        </div>
        
        {/* Tab Seçimi */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-2 px-4 text-sm font-medium ${
              activeTab === "upcoming"
                ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Yaklaşan
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-2 px-4 text-sm font-medium ${
              activeTab === "all"
                ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Hepsi
          </button>
        </div>
        
        {/* Dini Günler Listesi */}
        <div className="space-y-4">
          {filteredDays.length > 0 ? (
            filteredDays.map((gun) => {
              const remainingDays = getRemainingDays(gun.date);
              const isToday = remainingDays === 0;
              const isPast = remainingDays < 0;
              const hasNotification = notificationSettings.includes(gun.id);
              
              return (
                <motion.div
                  key={gun.id}
                  className={`p-4 rounded-lg border ${
                    isToday 
                      ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                      : isPast
                        ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2 sm:gap-4">
                      <div className={`flex-shrink-0 p-3 rounded-full ${
                        gun.type === "gece"
                          ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                          : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                      }`}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {gun.name}
                          </h3>
                          {gun.importance === 1 && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        
                        <div className="text-sm mt-0.5 text-gray-500 dark:text-gray-400">
                          {formatDate(gun.date)}
                        </div>
                        
                        <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                          {gun.description}
                        </p>
                        
                        {!isPast && (
                          <div className={`text-sm mt-1 font-medium ${
                            isToday 
                              ? "text-emerald-600 dark:text-emerald-400" 
                              : "text-blue-600 dark:text-blue-400"
                          }`}>
                            {isToday 
                              ? "Bugün!" 
                              : `${remainingDays} gün kaldı`}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleNotification(gun.id)}
                      className={`p-2 rounded-full ${
                        hasNotification
                          ? "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                          : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      title={hasNotification ? "Bildirimi kapat" : "Bildirim al"}
                    >
                      {hasNotification ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>Arama kriterlerine uygun sonuç bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Bilgilendirme */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-emerald-600 dark:text-emerald-400">
          Dini Günler ve Geceler Hakkında
        </h2>
        
        <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
          <p>
            <strong>Mübarek günler ve geceler</strong>, İslam dininde özel öneme sahip, ibadet ve dua ile geçirilmesi tavsiye edilen zamanlardır.
          </p>
          <p>
            <strong>Kandil geceleri</strong>, Mevlid, Regaib, Miraç, Berat ve Kadir gecelerinden oluşur. Bu geceler duaların kabul edildiği, günahların affedildiği mübarek gecelerdir.
          </p>
          <p>
            <strong>Ramazan ve Kurban Bayramları</strong>, İslam'ın iki büyük bayramıdır. Ramazan Bayramı Ramazan ayının sonunda, Kurban Bayramı ise Hac ibadetinin yapıldığı dönemde kutlanır.
          </p>
          <p>
            <strong>Aşure Günü</strong>, Muharrem ayının 10. günüdür ve tarihte birçok önemli olayın gerçekleştiği gün olarak kabul edilir.
          </p>
        </div>
      </div>
    </div>
  );
} 