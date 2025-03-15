'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface City {
  id: string;
  name: string;
}

interface PrayerTime {
  name: string;
  time: string;
  nameAr?: string;
  icon: string;
}

interface DailyPrayer {
  date: string;
  hijriDate: string;
  city: string;
  times: PrayerTime[];
}

export default function NamazPage() {
  const [selectedCity, setSelectedCity] = useState<string>("istanbul");
  const [prayerData, setPrayerData] = useState<DailyPrayer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'today' | 'monthly'>('today');
  
  // Ana renk tonu - Tüm yeşiller bu değişkenler üzerinden kontrol edilecek
  const primaryColor = 'bg-emerald-700';
  const primaryHoverColor = 'hover:bg-emerald-800';
  const primaryTextColor = 'text-emerald-700';
  const primaryLightBgColor = 'bg-emerald-50';
  const primaryBorderColor = 'border-emerald-500';
  const primaryLightTextColor = 'text-emerald-100';
  
  // Örnek şehir verileri
  const cities: City[] = [
    { id: "istanbul", name: "İstanbul" },
    { id: "ankara", name: "Ankara" },
    { id: "izmir", name: "İzmir" },
    { id: "bursa", name: "Bursa" },
    { id: "adana", name: "Adana" },
    { id: "konya", name: "Konya" },
    { id: "antalya", name: "Antalya" },
    { id: "diyarbakir", name: "Diyarbakır" },
    { id: "samsun", name: "Samsun" },
    { id: "kayseri", name: "Kayseri" }
  ];

  // Örnek namaz vakti verileri (normalde API'den gelecek)
  const getExamplePrayerTimes = (city: string): DailyPrayer => {
    // Gerçek bir uygulamada bu veriler API'den alınacak
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    
    // Örnek saatler (gerçekte API'den gelecek)
    const timesMap: {[key: string]: PrayerTime[]} = {
      "istanbul": [
        { name: "İmsak", time: "05:37", nameAr: "الإمساك", icon: "moon" },
        { name: "Güneş", time: "07:05", nameAr: "الشروق", icon: "sunrise" },
        { name: "Öğle", time: "12:59", nameAr: "الظهر", icon: "sun" },
        { name: "İkindi", time: "16:18", nameAr: "العصر", icon: "sun-low" },
        { name: "Akşam", time: "18:43", nameAr: "المغرب", icon: "sunset" },
        { name: "Yatsı", time: "20:03", nameAr: "العشاء", icon: "stars" }
      ],
      "ankara": [
        { name: "İmsak", time: "05:23", nameAr: "الإمساك", icon: "moon" },
        { name: "Güneş", time: "06:49", nameAr: "الشروق", icon: "sunrise" },
        { name: "Öğle", time: "12:43", nameAr: "الظهر", icon: "sun" },
        { name: "İkindi", time: "16:01", nameAr: "العصر", icon: "sun-low" },
        { name: "Akşam", time: "18:28", nameAr: "المغرب", icon: "sunset" },
        { name: "Yatsı", time: "19:47", nameAr: "العشاء", icon: "stars" }
      ],
      "izmir": [
        { name: "İmsak", time: "05:44", nameAr: "الإمساك", icon: "moon" },
        { name: "Güneş", time: "07:09", nameAr: "الشروق", icon: "sunrise" },
        { name: "Öğle", time: "13:05", nameAr: "الظهر", icon: "sun" },
        { name: "İkindi", time: "16:25", nameAr: "العصر", icon: "sun-low" },
        { name: "Akşam", time: "18:52", nameAr: "المغرب", icon: "sunset" },
        { name: "Yatsı", time: "20:11", nameAr: "العشاء", icon: "stars" }
      ]
    };
    
    // Mevcut şehir için veri yoksa istanbul verilerini kullan
    const times = timesMap[city] || timesMap["istanbul"];
    
    return {
      date: `${day}.${month}.${year}`,
      hijriDate: "15 Şaban 1445",  // Gerçek uygulamada hicri tarih hesaplanmalı
      city: city,
      times: times
    };
  };

  // Şehir değiştiğinde namaz vakitlerini güncelle
  useEffect(() => {
    // API çağrısı yerine örnek veri kullanılıyor
    setPrayerData(getExamplePrayerTimes(selectedCity));
    setLoading(false);
  }, [selectedCity]);
  
  // Saat güncellemesi
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };
    
    // İlk yükleme
    updateTime();
    
    // Her saniye güncelle
    const timer = setInterval(updateTime, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Namaz vaktini kontrol eden yardımcı fonksiyon
  const getCurrentPrayer = (times: PrayerTime[]): string => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    for (let i = times.length - 1; i >= 0; i--) {
      if (currentTime >= times[i].time) {
        return times[i].name;
      }
    }
    
    // Eğer bugünün hiçbir vakti geçmediyse, yatsı vakti olarak kabul et
    return "Yatsı";
  };

  // Sıradaki namaz vaktini bulan yardımcı fonksiyon
  const getNextPrayer = (times: PrayerTime[]): { name: string, time: string, remaining: string } => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinute;
    
    // Vakitleri dakika cinsinden çevir
    const timesInMinutes = times.map(t => {
      const [hour, minute] = t.time.split(':').map(Number);
      return { name: t.name, timeMinutes: hour * 60 + minute };
    });
    
    // Şu anki zamandan sonraki ilk vakti bul
    let nextPrayer = timesInMinutes.find(t => t.timeMinutes > currentTimeMinutes);
    
    // Eğer bugün kalan vakit yoksa, ertesi günün ilk vakti (imsak)
    if (!nextPrayer) {
      nextPrayer = { name: "İmsak (yarın)", timeMinutes: timesInMinutes[0].timeMinutes + 24 * 60 };
    }
    
    // Kalan süreyi hesapla
    const remainingMinutes = nextPrayer.timeMinutes - currentTimeMinutes;
    const remainingHours = Math.floor(remainingMinutes / 60);
    const remainingMins = remainingMinutes % 60;
    
    // Orijinal vakti bul
    const originalTime = times.find(t => t.name === nextPrayer?.name.split(' ')[0])?.time || "00:00";
    
    return {
      name: nextPrayer.name,
      time: originalTime,
      remaining: `${remainingHours} saat ${remainingMins} dakika`
    };
  };

  // Zaman çizelgesini hesapla
  const calculateTimelinePosition = (times: PrayerTime[]): number => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinute;
    
    // Günün başlangıcı (imsak) ve sonu (ertesi gün imsak) arasındaki toplam dakika
    const [imsakHour, imsakMinute] = times[0].time.split(':').map(Number);
    const imsakTimeMinutes = imsakHour * 60 + imsakMinute;
    
    // Günün toplam süresi (dakika cinsinden)
    const dayLengthMinutes = 24 * 60;
    
    // Günün başından şu ana kadar geçen süre
    let elapsedMinutes = 0;
    
    if (currentTimeMinutes >= imsakTimeMinutes) {
      elapsedMinutes = currentTimeMinutes - imsakTimeMinutes;
    } else {
      elapsedMinutes = currentTimeMinutes + (24 * 60 - imsakTimeMinutes);
    }
    
    // Yüzde olarak günün ilerlemesi
    return (elapsedMinutes / dayLengthMinutes) * 100;
  };

  // Icon komponentleri
  const icons: { [key: string]: React.ReactNode } = {
    moon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    sunrise: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    sun: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    "sun-low": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    sunset: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    stars: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4`}></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }
  
  if (!prayerData) {
    return (
      <div className="flex justify-center items-center h-screen p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-lg">
          <h3 className="text-lg font-semibold mb-2">Hata</h3>
          <p>Namaz vakitleri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }
  
  const currentPrayer = getCurrentPrayer(prayerData.times);
  const nextPrayer = getNextPrayer(prayerData.times);
  const timelinePosition = calculateTimelinePosition(prayerData.times);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Üst Başlık Alanı */}
      <div className={`${primaryColor} shadow-md py-4 px-6 sticky top-16 z-10`}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-white">Namaz Vakitleri</h1>
              <p className={`${primaryLightTextColor} text-sm mt-1`}>
                {prayerData.date} - {prayerData.hijriDate}
              </p>
            </div>
            
            <div className="relative w-full md:w-64">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-2 rounded-full border-none focus:ring-2 focus:ring-emerald-300 focus:outline-none appearance-none pr-10"
              >
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ana Görünüm Seçim Alanı */}
      <div className="bg-white shadow-sm py-3 px-6 border-b border-gray-200">
        <div className="container mx-auto">
          <div className="flex space-x-4">
            <button 
              onClick={() => setActiveTab('today')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'today' 
                  ? `${primaryColor} text-white` 
                  : `bg-gray-50 ${primaryTextColor} hover:bg-gray-100`
              }`}
            >
              Günlük Vakitler
            </button>
            <button 
              onClick={() => setActiveTab('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'monthly' 
                  ? `${primaryColor} text-white` 
                  : `bg-gray-50 ${primaryTextColor} hover:bg-gray-100`
              }`}
            >
              Aylık Takvim
            </button>
          </div>
        </div>
      </div>
      
      {/* Ana İçerik Alanı */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'today' ? (
          <>
            {/* Şu Anki Saat ve Aktif Vakit */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <p className="text-gray-500 text-sm">Şu anki vakit</p>
                  <h2 className={`text-2xl font-bold ${primaryTextColor}`}>{currentPrayer}</h2>
                  <p className="text-gray-600 text-sm">
                    Sıradaki vakit: <span className="font-medium">{nextPrayer.name}</span> ({nextPrayer.time}) - {nextPrayer.remaining} kaldı
                  </p>
                </div>
                <div className={`text-4xl font-bold ${primaryTextColor}`}>{currentTime}</div>
              </div>
              
              {/* Zaman Çizelgesi */}
              <div className="mt-6">
                <div className="h-2 bg-gray-200 rounded-full mt-4 relative">
                  <div 
                    className={`h-full ${primaryColor} rounded-full`}
                    style={{ width: `${timelinePosition}%` }}
                  ></div>
                  {prayerData.times.map((time, index) => {
                    // İmsak vaktinin saatini ve dakikasını al
                    const [hour, minute] = time.time.split(':').map(Number);
                    // İmsak vaktini dakika cinsinden hesapla
                    const timeInMinutes = hour * 60 + minute;
                    // İmsak vaktini günün toplam dakikasına oranla
                    const position = ((timeInMinutes / (24 * 60)) * 100);
                    
                    return (
                      <div 
                        key={index}
                        className="absolute top-0 -mt-1 transform -translate-x-1/2"
                        style={{ left: `${position}%` }}
                      >
                        <div className={`w-3 h-3 rounded-full ${
                          time.name === currentPrayer ? `${primaryColor} ring-2 ring-emerald-300` : 'bg-gray-400'
                        }`}></div>
                        <div className="text-xs mt-1 text-gray-500">{time.time}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Namaz Vakitleri Kartları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {prayerData.times.map((time, index) => (
                <div 
                  key={index} 
                  className={`rounded-lg shadow-md overflow-hidden ${
                    time.name === currentPrayer 
                      ? `${primaryLightBgColor} border-2 ${primaryBorderColor}` 
                      : 'bg-white'
                  }`}
                >
                  <div className="p-4 flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      time.name === currentPrayer ? `${primaryColor} text-white` : 'bg-gray-100 text-gray-500'
                    }`}>
                      {icons[time.icon]}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-800">{time.name}</h3>
                        {time.name === currentPrayer && (
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${primaryColor} text-white`}>
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className={`text-2xl font-bold ${primaryTextColor}`}>{time.time}</p>
                      <p className="text-xs text-gray-500">{time.nameAr}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Aylık görünüm - Örnek olarak bir mesaj gösterildi
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 mx-auto mb-4 ${primaryTextColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h2 className="text-xl font-semibold mb-2">Aylık Namaz Vakitleri Takvimi</h2>
                <p className="text-gray-600">Bu özellik yakında eklenecektir.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 