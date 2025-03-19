"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Compass, MapPin, AlertCircle, RefreshCw } from "lucide-react";

// DeviceOrientationEvent için tip tanımlama
declare global {
  interface Window {
    DeviceOrientationEvent: {
      requestPermission?: () => Promise<string>;
    } & typeof DeviceOrientationEvent;
  }
}

export default function KiblePusulasiPage() {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [deviceOrientation, setDeviceOrientation] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [hasOrientationSupport, setHasOrientationSupport] = useState<boolean>(false);
  const [hasOrientationPermission, setHasOrientationPermission] = useState<boolean>(false);
  const compassRef = useRef<HTMLDivElement>(null);

  // Kabe'nin koordinatları (Mekke)
  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  // Kullanıcının konumunu al
  const getLocation = () => {
    setLoadingLocation(true);
    setLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
          setLoadingLocation(false);
          calculateQiblaDirection(position);
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
        }
      );
    } else {
      setLocationError("Tarayıcınız konum hizmetini desteklemiyor.");
      setLoadingLocation(false);
    }
  };

  // Kıble yönünü hesapla
  const calculateQiblaDirection = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    
    // Radyan cinsinden hesaplamalar
    const lat1 = latitude * Math.PI / 180;
    const lon1 = longitude * Math.PI / 180;
    const lat2 = KAABA_LAT * Math.PI / 180;
    const lon2 = KAABA_LNG * Math.PI / 180;
    
    // Kıble açısını hesapla
    const y = Math.sin(lon2 - lon1);
    const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(lon2 - lon1);
    let qiblaAngle = Math.atan2(y, x) * 180 / Math.PI;
    
    // Açıyı 0-360 aralığında tut
    qiblaAngle = (qiblaAngle + 360) % 360;
    
    setQiblaDirection(qiblaAngle);
  };

  // Cihaz yönelimi için izleme
  const setupOrientationListener = () => {
    if (window.DeviceOrientationEvent) {
      if (window.DeviceOrientationEvent.requestPermission && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+ için izin isteme gerekiyor
        setHasOrientationSupport(true);
      } else {
        // Diğer tarayıcılar için izin gerekmez
        window.addEventListener('deviceorientation', handleOrientation);
        setHasOrientationSupport(true);
        setHasOrientationPermission(true);
      }
    } else {
      console.log("Cihazınız yönelim sensörünü desteklemiyor.");
    }
  };

  // iOS için yönelim izni isteme
  const requestOrientationPermission = async () => {
    try {
      if (window.DeviceOrientationEvent.requestPermission && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        const permission = await window.DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          setHasOrientationPermission(true);
          console.log("Yönelim izni verildi.");
        } else {
          console.log("Yönelim izni reddedildi.");
        }
      }
    } catch (error) {
      console.error('Yönelim izni hatası:', error);
    }
  };

  // Cihaz yönelimini işle
  const handleOrientation = (event: DeviceOrientationEvent) => {
    // Alpha değeri pusula yönünü verir (derece olarak)
    const alpha = event.alpha; // 0-360 arası
    
    if (alpha !== null) {
      setDeviceOrientation(alpha);
      
      // Pusula açısını hesapla (kuzey yönü)
      // Not: Mobil cihazlarda webkitCompassHeading daha güvenilir olabilir
      if ('webkitCompassHeading' in event) {
        // @ts-ignore - webkitCompassHeading TypeScript tanımında yok
        const heading = event.webkitCompassHeading as number;
        setCompassHeading(heading);
      } else {
        // Standart tarayıcılar için alpha değerini kullan
        // 360'dan çıkar çünkü alpha saat yönünde, pusula ise saat yönünün tersinde artar
        setCompassHeading(360 - alpha);
      }

      // Pusula güncellemesi
      rotateCompass();
    }
  };

  // Pusula görselini döndür
  const rotateCompass = () => {
    if (compassRef.current && qiblaDirection !== null) {
      if (compassHeading !== null) {
        // Gerçek pusula yönü var, kıbleyi göstermek için hesapla
        // Kıble yönü - pusula yönü = pusulaya göre kıble açısı
        const compassBasedQiblaAngle = qiblaDirection - compassHeading;
        compassRef.current.style.transform = `rotate(${compassBasedQiblaAngle}deg)`;
      } else if (deviceOrientation !== null) {
        // Sadece cihaz yönelimi var
        const rotation = qiblaDirection - deviceOrientation;
        compassRef.current.style.transform = `rotate(${rotation}deg)`;
      } else {
        // Ne cihaz yönelimi ne de pusula yok, sadece kıble açısını göster
        compassRef.current.style.transform = `rotate(${qiblaDirection}deg)`;
      }
    }
  };

  // İlk yükleme
  useEffect(() => {
    getLocation();
    setupOrientationListener();
    
    // Komponent kaldırıldığında event listener'ları temizle
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Yönelim değiştiğinde veya kıble açısı güncellendiğinde pusulayı güncelle
  useEffect(() => {
    rotateCompass();
  }, [deviceOrientation, compassHeading, qiblaDirection]);

  // Mesafe hesaplama
  const calculateDistance = () => {
    if (!location) return null;
    
    const { latitude, longitude } = location.coords;
    
    // Haversine formülü
    const R = 6371; // Dünya yarıçapı (km)
    const dLat = (KAABA_LAT - latitude) * Math.PI / 180;
    const dLon = (KAABA_LNG - longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(latitude * Math.PI / 180) * Math.cos(KAABA_LAT * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance.toFixed(0);
  };

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-emerald-600 dark:text-emerald-400 mb-8">
        Kıble Pusulası
      </h1>
      
      {/* Konum ve Pusula Bilgisi / Hata */}
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
                Kıble yönünü görmek için konumunuzu paylaşın.
              </div>
            )}
            
            {hasOrientationSupport && (
              <div className={`mt-2 flex items-center gap-2 ${hasOrientationPermission ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                <Compass className="w-5 h-5" />
                <span>{hasOrientationPermission ? 'Pusula çalışıyor' : 'Pusula için izin gerekiyor'}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={getLocation}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
              size="sm"
              disabled={loadingLocation}
            >
              {loadingLocation ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
              <span>Konumu Yenile</span>
            </Button>
            
            {hasOrientationSupport && !hasOrientationPermission && (
              <Button
                onClick={requestOrientationPermission}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                size="sm"
              >
                <Compass className="w-4 h-4" />
                <span>Pusula İzni</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Pusula */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 flex flex-col items-center"
      >
        {location && qiblaDirection !== null ? (
          <>
            <div className="relative w-64 h-64 mb-6">
              {/* Pusula Arka Planı */}
              <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                {/* Kuzey İşareti */}
                <div className="absolute top-2 w-1 h-4 bg-red-500"></div>
                <div className="absolute top-6 text-xs font-bold text-red-500">N</div>
                
                {/* Doğu İşareti */}
                <div className="absolute right-2 w-4 h-1 bg-gray-600 dark:bg-gray-400"></div>
                <div className="absolute right-6 text-xs font-bold text-gray-600 dark:text-gray-400">E</div>
                
                {/* Güney İşareti */}
                <div className="absolute bottom-2 w-1 h-4 bg-gray-600 dark:bg-gray-400"></div>
                <div className="absolute bottom-6 text-xs font-bold text-gray-600 dark:text-gray-400">S</div>
                
                {/* Batı İşareti */}
                <div className="absolute left-2 w-4 h-1 bg-gray-600 dark:bg-gray-400"></div>
                <div className="absolute left-6 text-xs font-bold text-gray-600 dark:text-gray-400">W</div>
              </div>
              
              {/* Kıble Yönü Oku */}
              <div 
                ref={compassRef}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-1 h-full relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-emerald-600 dark:border-b-emerald-400"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-emerald-600 dark:bg-emerald-400 rounded-full -mt-1"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1/2 bg-emerald-600 dark:bg-emerald-400"></div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                Kıble Yönü: {Math.round(qiblaDirection)}°
              </p>
              {compassHeading !== null && (
                <p className="text-blue-600 dark:text-blue-400 mb-2">
                  Pusula Yönü: {Math.round(compassHeading)}°
                </p>
              )}
              {calculateDistance() && (
                <p className="text-gray-600 dark:text-gray-400">
                  Kabe'ye Uzaklık: ~{calculateDistance()} km
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <Compass className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
            <p className="text-gray-500">Kıble yönünü görmek için konumunuzu paylaşın.</p>
            {locationError && (
              <p className="text-red-500 mt-2">{locationError}</p>
            )}
          </div>
        )}
      </motion.div>
      
      {/* Bilgilendirme */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-emerald-600 dark:text-emerald-400">
          Kıble Pusulası Hakkında
        </h2>
        
        <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
          <p>
            <strong>Kıble Pusulası</strong>, namaz kılmak için yönelmeniz gereken yönü gösterir. Kıble, dünyanın neresinde olursanız olun Kâbe'nin (Mekke, Suudi Arabistan) yönüdür.
          </p>
          <p>
            <strong>Pusula ok işareti</strong> kıbleyi göstermektedir. Telefonunuzu düz tutarak, ok yönünde durduğunuzda kıbleye dönmüş olursunuz.
          </p>
          <p>
            <strong>Tam doğruluk</strong> için telefonunuzun pusula özelliğinin kalibre edilmiş olması gerekir. Bazı telefonlarda pusula kalibrasyonu gerekebilir (8 hareketi çizerek).
          </p>
          <p>
            <strong>Not:</strong> Pusula özelliği için <strong>hem konum izni hem de yönelim sensörü izni</strong> vermeniz gerekir. iOS cihazlarda "Pusula İzni" butonuna tıklayarak izin vermelisiniz.
          </p>
        </div>
      </div>
    </div>
  );
} 