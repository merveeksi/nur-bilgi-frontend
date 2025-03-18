"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Navigation, Clock, Phone, Compass, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Mosque {
  id: string;
  name: string;
  address: string;
  distance?: number; // metre cinsinden
  phone?: string;
  rating?: number;
  imam?: string;
  prayerTimes?: {
    sabah: string;
    ogle: string;
    ikindi: string;
    aksam: string;
    yatsi: string;
  };
}

export default function YakinCamilerPage() {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [sortBy, setSortBy] = useState<"distance" | "name">("distance");
  
  // Örnek cami verileri (normalde API'den gelir)
  const sampleMosques: Mosque[] = [
    {
      id: "1",
      name: "Merkez Camii",
      address: "Cumhuriyet Mahallesi, Atatürk Cad. No:12, Merkez",
      distance: 450,
      phone: "0212 555 1234",
      rating: 4.7,
      imam: "Ahmet Yılmaz",
      prayerTimes: {
        sabah: "06:15",
        ogle: "13:00",
        ikindi: "16:30",
        aksam: "19:45",
        yatsi: "21:15"
      }
    },
    {
      id: "2",
      name: "Fatih Camii",
      address: "Fatih Mahallesi, İstiklal Sokak No:5, Merkez",
      distance: 850,
      phone: "0212 555 5678",
      rating: 4.5,
      imam: "Mehmet Ali Demir",
      prayerTimes: {
        sabah: "06:10",
        ogle: "13:00",
        ikindi: "16:30",
        aksam: "19:45",
        yatsi: "21:15"
      }
    },
    {
      id: "3",
      name: "Selimiye Camii",
      address: "Yeni Mahalle, Gül Sokak No:23, Merkez",
      distance: 1200,
      phone: "0212 555 9012",
      rating: 4.8,
      imam: "Mustafa Kaya",
      prayerTimes: {
        sabah: "06:15",
        ogle: "13:00",
        ikindi: "16:30",
        aksam: "19:45",
        yatsi: "21:15"
      }
    },
    {
      id: "4",
      name: "Mimar Sinan Camii",
      address: "Bahçelievler, Zambak Cad. No:34, Merkez",
      distance: 1500,
      phone: "0212 555 3456",
      rating: 4.6,
      imam: "Ali Yıldırım",
      prayerTimes: {
        sabah: "06:15",
        ogle: "13:00",
        ikindi: "16:30",
        aksam: "19:45",
        yatsi: "21:15"
      }
    },
    {
      id: "5",
      name: "Yeşil Camii",
      address: "Çamlık Mahallesi, Lale Sokak No:7, Merkez",
      distance: 2000,
      phone: "0212 555 7890",
      rating: 4.4,
      imam: "Hasan Şahin",
      prayerTimes: {
        sabah: "06:20",
        ogle: "13:00",
        ikindi: "16:30",
        aksam: "19:45",
        yatsi: "21:15"
      }
    }
  ];
  
  // Kullanıcının konumunu al
  const getLocation = () => {
    setLoadingLocation(true);
    setLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
          setLoadingLocation(false);
          fetchNearbyMosques(position);
        },
        (error) => {
          let errorMsg;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = "Konum erişim izni reddedildi.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = "Konum bilgisi mevcut değil.";
              break;
            case error.TIMEOUT:
              errorMsg = "Konum isteği zaman aşımına uğradı.";
              break;
            default:
              errorMsg = "Bilinmeyen bir hata oluştu.";
          }
          setLocationError(errorMsg);
          setLoadingLocation(false);
          
          // Hata durumunda örnek verileri göster
          setMosques(sampleMosques);
        }
      );
    } else {
      setLocationError("Tarayıcınız konum hizmetini desteklemiyor.");
      setLoadingLocation(false);
      
      // Hata durumunda örnek verileri göster
      setMosques(sampleMosques);
    }
  };
  
  // Yakındaki camileri al (gerçek bir API'ye bağlanılabilir)
  const fetchNearbyMosques = (position: GeolocationPosition) => {
    // Normalde burada API çağrısı yapılacak
    // Örnek veri kullanıyoruz
    
    // Random mesafe ekleme (gerçek konuma göre hesaplanması gerekir)
    const mosquesWithDistance = sampleMosques.map(mosque => ({
      ...mosque,
      distance: Math.floor(Math.random() * 3000) + 100 // 100m - 3100m arası
    }));
    
    setMosques(mosquesWithDistance);
  };
  
  // Sayfa yüklendiğinde konum al
  useEffect(() => {
    getLocation();
  }, []);
  
  // Camileri sırala
  const sortedMosques = [...mosques].sort((a, b) => {
    if (sortBy === "distance") {
      return (a.distance || 0) - (b.distance || 0);
    } else {
      return a.name.localeCompare(b.name);
    }
  });
  
  // Mesafe formatlaması
  const formatDistance = (meters?: number) => {
    if (!meters) return "Bilinmiyor";
    
    if (meters < 1000) {
      return `${meters} m`;
    } else {
      return `${(meters / 1000).toFixed(1)} km`;
    }
  };
  
  // Google Maps'te yön tarifi
  const openDirections = (mosque: Mosque) => {
    if (location) {
      const { latitude, longitude } = location.coords;
      const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(mosque.address)}&travelmode=walking`;
      window.open(url, "_blank");
    } else {
      // Konum yoksa sadece adrese git
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mosque.address)}`;
      window.open(url, "_blank");
    }
  };
  
  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-emerald-600 dark:text-emerald-400 mb-8">
        Yakındaki Camiler
      </h1>
      
      {/* Konum Bilgisi / Hata */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            {location ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">Konumunuz alındı</span>
              </div>
            ) : locationError ? (
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="w-5 h-5" />
                <span>{locationError}</span>
              </div>
            ) : (
              <div className="text-gray-600 dark:text-gray-400">
                Yakındaki camileri görmek için konumunuzu paylaşın.
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={getLocation}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
              size="sm"
              disabled={loadingLocation}
            >
              {loadingLocation ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Compass className="w-4 h-4" />
              )}
              <span>Konumu Yenile</span>
            </Button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "distance" | "name")}
              className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="distance">Mesafeye Göre</option>
              <option value="name">İsme Göre</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Cami Listesi */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        {sortedMosques.length > 0 ? (
          sortedMosques.map((mosque) => (
            <motion.div
              key={mosque.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                      {mosque.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {mosque.address}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                      <MapPin className="w-4 h-4 mr-1" />
                      {formatDistance(mosque.distance)}
                    </div>
                    
                    {mosque.rating && (
                      <div className="flex items-center mt-1 text-sm text-amber-500">
                        <span className="font-medium mr-1">{mosque.rating}</span>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between flex-wrap gap-2 mt-4">
                  <Button
                    onClick={() => setSelectedMosque(mosque === selectedMosque ? null : mosque)}
                    variant="outline"
                    size="sm"
                    className="text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                  >
                    {mosque === selectedMosque ? "Detayları Gizle" : "Detayları Göster"}
                  </Button>
                  
                  <Button
                    onClick={() => openDirections(mosque)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
                    size="sm"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Yol Tarifi</span>
                  </Button>
                </div>
                
                {/* Detay Bölümü */}
                {selectedMosque === mosque && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                  >
                    {mosque.phone && (
                      <div className="flex items-center mb-2 text-sm">
                        <Phone className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                        <span>{mosque.phone}</span>
                      </div>
                    )}
                    
                    {mosque.imam && (
                      <div className="mb-2 text-sm">
                        <span className="font-medium">İmam:</span> {mosque.imam}
                      </div>
                    )}
                    
                    {mosque.prayerTimes && (
                      <div className="mt-3">
                        <h3 className="font-medium mb-2 flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                          Namaz Vakitleri
                        </h3>
                        
                        <div className="grid grid-cols-5 gap-2 text-center text-xs">
                          {["Sabah", "Öğle", "İkindi", "Akşam", "Yatsı"].map((vakitName, i) => {
                            const key = vakitName.toLowerCase() as keyof typeof mosque.prayerTimes;
                            const vakit = mosque.prayerTimes![key];
                            
                            return (
                              <div key={i} className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                                <div className="font-medium text-emerald-600 dark:text-emerald-400">
                                  {vakitName}
                                </div>
                                <div className="mt-1">{vakit}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <MapPin className="w-10 h-10 mx-auto mb-2 text-gray-400 opacity-50" />
            <p className="text-gray-500">Yakında cami bulunamadı.</p>
            <p className="text-sm text-gray-400 mt-1">Konumunuzu yenileyerek tekrar deneyebilirsiniz.</p>
          </div>
        )}
      </div>
      
      {/* Bilgilendirme */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-emerald-600 dark:text-emerald-400">
          Yakındaki Camiler Hakkında
        </h2>
        
        <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
          <p>
            <strong>Yakındaki Camiler</strong> özelliği, bulunduğunuz konuma en yakın camileri görmenizi sağlar.
          </p>
          <p>
            <strong>Yol Tarifi</strong> butonuna tıklayarak Google Haritalar üzerinden seçtiğiniz camiye nasıl gideceğinizi görebilirsiniz.
          </p>
          <p>
            <strong>Namaz Vakitleri</strong> her caminin kendi ilanına göre değişiklik gösterebilir. Daha güncel bilgiler için cami yönetimiyle iletişime geçebilirsiniz.
          </p>
          <p>
            Not: Cami bilgileri örnek verilerdir ve gerçeği yansıtmayabilir. Gerçek uygulamada doğru veriler bir API üzerinden sağlanacaktır.
          </p>
        </div>
      </div>
    </div>
  );
} 