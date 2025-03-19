"use client";

import React, { useState, useEffect, useRef } from "react";
import { BellRing, Clock, Plus, X, Bell, BellOff, Check, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

type NamazVakti = "Sabah" | "Öğle" | "İkindi" | "Akşam" | "Yatsı";
type ReminderType = "once" | "daily";

interface NamazReminder {
  id: string;
  namazVakti: NamazVakti;
  time: string;
  active: boolean;
  type: ReminderType;
  note?: string;
  createdAt: string;
  soundEnabled?: boolean;
  soundType?: string;
}

export default function NamazHatirlaticiPage() {
  const [reminders, setReminders] = useState<NamazReminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState<Omit<NamazReminder, "id" | "active" | "createdAt">>({
    namazVakti: "Sabah",
    time: "",
    type: "daily",
    soundEnabled: true,
    soundType: "beep",
  });
  const [notificationPermission, setNotificationPermission] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [alarmPlaying, setAlarmPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Added a simple beep sound as fallback
  const beepSound = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU0AAADIz8DJu8LMyMG3y8zCwLjIzsTBtsbPxsO2xNDGxbTD0MfGtMPPx8aywNDHx7LBz8fHsMLPx8eww8/Ix7DD0MnHsMLQysevwtDKxq3C0MvGrMPRzMasxNLMxqvD0cysxNHMrMXQzK3G0MytyM/MrsnOya7Kzcmuy8vJr8zKybDNycmxzsrIs8/Lx7PPzcezz8/Gs9DQxrTQ0Ma00NDGtNDQxrXR0MW10dDGttHQxrfR0Me30c/IuNHOybfSzcm40szKutLLyrvTysu808nMv9PIzb/Ux84A0w==";
  
  // Bildirim izinlerini kontrol et
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
    
    // Kayıtlı hatırlatıcıları localStorage'dan yükle
    const savedReminders = localStorage.getItem("namazReminders");
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
    
    // Geçerli saat
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      setCurrentTime(timeString);
      
      // Hatırlatıcıları kontrol et
      checkReminders(timeString);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 15000); // Her 15 saniyede bir kontrol et
    
    // Audio elementi oluştur ve ses dosyasını önceden yükle
    if (audioRef.current) {
      // MP3 formatındaki bip sesini kullan (base64 değil doğrudan dosya)
      audioRef.current.src = "/sounds/alerts/beep.mp3";
      audioRef.current.load();
      
      // Safari ve mobil tarayıcılar için oynatmayı güçlendirmek adına sessiz bir kullanıcı etkileşimi tetikleyicisi
      const enableAudio = () => {
        audioRef.current?.play().then(() => {
          audioRef.current!.pause();
          audioRef.current!.currentTime = 0;
          document.removeEventListener('click', enableAudio);
        }).catch(err => {
          console.log("Pre-enable audio failed, will try again on user interaction");
        });
      };
      
      // Kullanıcı herhangi bir yere tıkladığında sesi etkinleştirmeyi dene
      document.addEventListener('click', enableAudio, { once: true });
    }
    
    return () => clearInterval(interval);
  }, []); // reminders bağımlılığını kaldırdım
  
  // Ayrı bir useEffect ile zamanlanmış kontroller için
  useEffect(() => {
    // Bu useEffect sadece reminders değiştiğinde çalışacak
    const checkCurrentReminders = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      checkReminders(timeString);
    };
    
    // reminders değiştiğinde mevcut zamanı kontrol et
    checkCurrentReminders();
    
    // localStorage'a kaydet
    localStorage.setItem("namazReminders", JSON.stringify(reminders));
  }, [reminders]); // Sadece reminders değiştiğinde çalışacak
  
  // Bildirim izni iste
  const requestNotificationPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };
  
  // Form girdilerini güncelle
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReminder(prev => ({ ...prev, [name]: value }));
  };
  
  // Hatırlatıcıları kontrol et ve gerektiğinde bildirim gönder
  const checkReminders = (currentTimeString: string) => {
    reminders.forEach(reminder => {
      if (reminder.active && reminder.time === currentTimeString) {
        // Bildirimi göster
        sendReminderNotification(reminder);
        
        // Tek seferlik hatırlatıcıyı devre dışı bırak
        if (reminder.type === "once") {
          toggleReminderActive(reminder.id, false);
        }
      }
    });
  };
  
  // Ses tipleri
  const soundTypes = {
    beep: {
      name: "Kısa Uyarı Sesi",
      src: "/sounds/alerts/beep.mp3"
    },
    shortAzan: {
      name: "Kısa Ezan",
      src: "/sounds/alerts/short-azan.mp3"
    },
    longAzan: {
      name: "Uzun Ezan",
      src: "/sounds/azan.mp3"
    }
  };
  
  // Bildirim gönder
  const sendReminderNotification = (reminder: NamazReminder) => {
    if (notificationPermission === "granted") {
      const notification = new Notification(`${reminder.namazVakti} Namazı Vakti`, {
        body: reminder.note ? `${reminder.note}` : `${reminder.namazVakti} namazı vakti geldi.`,
        icon: "/favicon.ico"
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      
      // Ses çal (ses aktifse)
      if (reminder.soundEnabled !== false) {
        // Set the correct sound type if specified
        if (reminder.soundType && soundTypes[reminder.soundType as keyof typeof soundTypes]) {
          const soundSrc = soundTypes[reminder.soundType as keyof typeof soundTypes].src;
          if (audioRef.current) {
            audioRef.current.src = soundSrc;
            audioRef.current.load();
          }
        }
        
        playAlarmSound();
      }
    }
  };
  
  // Ses çal
  const playAlarmSound = () => {
    if (audioRef.current) {
      // Try to play with better error handling
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 1.0;
      
      try {
        // Konsola detaylı bilgi yazalım
        console.log("Playing sound from:", audioRef.current.src);
        
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setAlarmPlaying(true);
              console.log("Ses başarıyla çalınıyor");
            })
            .catch(err => {
              console.error("Ses çalma hatası:", err);
              
              // Ses çalınamazsa başka bir yöntem dene - inline olarak eleman oluştur
              try {
                const tempAudio = new Audio("/sounds/alerts/beep.mp3");
                tempAudio.volume = 1.0;
                tempAudio.play().then(() => {
                  setAlarmPlaying(true);
                  console.log("Alternatif metot ile ses çalınıyor");
                  
                  // Ses çalındıktan sonra temizle
                  tempAudio.onended = () => {
                    setAlarmPlaying(false);
                  };
                }).catch(e => console.error("Alternatif metot başarısız:", e));
              } catch (e) {
                console.error("Ses çalma tamamen başarısız oldu:", e);
              }
              
              // Otomatik kullanıcı etkileşimi hatası durumunda kullanıcıyı bilgilendir
              if (err.name === "NotAllowedError") {
                alert("Ses çalmak için sayfayla etkileşime geçmeniz gerekiyor. Lütfen sayfaya tıklayın ve tekrar deneyin.");
                
                // Fallback: try to play again after user interaction
                document.addEventListener('click', function playOnClick() {
                  const audioElement = audioRef.current;
                  if (audioElement) {
                    audioElement.play().catch(e => console.error("İkinci deneme hatası:", e));
                  }
                  document.removeEventListener('click', playOnClick);
                }, { once: true });
              }
            });
        }
      } catch (error) {
        console.error("Ses yükleme hatası:", error);
      }
    }
  };
  
  // Ses durdur
  const stopAlarmSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAlarmPlaying(false);
    }
  };
  
  // Hatırlatıcı aktif/pasif durumunu değiştir
  const toggleReminderActive = (id: string, state?: boolean) => {
    const updatedReminders = reminders.map(reminder => 
      reminder.id === id ? { ...reminder, active: state !== undefined ? state : !reminder.active } : reminder
    );
    setReminders(updatedReminders);
  };
  
  // Hatırlatıcının ses durumunu değiştir
  const toggleReminderSound = (id: string) => {
    const updatedReminders = reminders.map(reminder => 
      reminder.id === id ? { ...reminder, soundEnabled: !reminder.soundEnabled } : reminder
    );
    setReminders(updatedReminders);
  };
  
  // Hatırlatıcı silme
  const handleDeleteReminder = (id: string) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    setReminders(updatedReminders);
  };
  
  // Test bildirimi gönder
  const sendTestNotification = () => {
    if (notificationPermission === "granted") {
      const notification = new Notification("Namaz Hatırlatıcı Test", {
        body: "Bu bir test bildirimidir. Namaz vakti hatırlatıcıları bu şekilde görünecektir.",
        icon: "/favicon.ico"
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      
      // Set to beep sound for test
      if (audioRef.current) {
        const beepSound = soundTypes.beep.src;
        audioRef.current.src = beepSound;
        audioRef.current.load();
      }
      
      // Test için ses çal - immediately try to play sound
      setTimeout(() => {
        playAlarmSound();
      }, 300);
      
      // 5 saniye sonra sesi durdur
      setTimeout(() => {
        stopAlarmSound();
      }, 5000);
    } else {
      requestNotificationPermission();
    }
  };
  
  // Yeni hatırlatıcı ekle
  const handleAddReminder = () => {
    // Saat kontrolü yap
    if (!newReminder.time) {
      console.log("Hatırlatıcı ekleme hatası: Saat seçilmedi");
      alert("Lütfen bir saat seçin.");
      return;
    }
    
    // Form verilerini konsola yaz (hata ayıklama için)
    console.log("Yeni hatırlatıcı eklenecek:", JSON.stringify(newReminder));
    
    try {
      // Yeni hatırlatıcı objesi oluştur
      const reminder: NamazReminder = {
        id: Date.now().toString(),
        ...newReminder,
        active: true,
        createdAt: new Date().toISOString(),
        soundEnabled: newReminder.soundEnabled !== undefined ? newReminder.soundEnabled : true,
      };
      
      console.log("Oluşturulan hatırlatıcı:", JSON.stringify(reminder));
      
      // Mevcut hatırlatıcıları güncelle
      const updatedReminders = [...reminders, reminder];
      console.log("Güncellenmiş hatırlatıcılar:", JSON.stringify(updatedReminders));
      
      // State'i güncelle
      setReminders(updatedReminders);
      console.log("State güncellendi, yeni reminders.length:", updatedReminders.length);
      
      // Browser storage'e kayıt yapıldığını teyit et
      setTimeout(() => {
        const storedData = localStorage.getItem("namazReminders");
        console.log("LocalStorage'de saklanan veri:", storedData);
        console.log("LocalStorage'de hatırlatıcı sayısı:", storedData ? JSON.parse(storedData).length : 0);
      }, 500);
      
      // Formu sıfırla
      setNewReminder({
        namazVakti: "Sabah",
        time: "",
        type: "daily",
        soundEnabled: true,
        soundType: "beep",
      });
      
      setShowAddForm(false);
      
      // Bildirim izni kontrolü
      if (notificationPermission !== "granted") {
        requestNotificationPermission();
      }
      
      console.log("Hatırlatıcı başarıyla eklendi");
      
      // Kullanıcıya geri bildirim
      setTimeout(() => {
        alert("Hatırlatıcı başarıyla eklendi!");
      }, 100);
    } catch (error) {
      console.error("Hatırlatıcı ekleme hatası:", error);
      alert("Hatırlatıcı eklenirken bir hata oluştu: " + (error instanceof Error ? error.message : String(error)));
    }
  };
  
  // Açıklamalı ses tipi adı oluştur
  const getSoundTypeName = (soundType?: string) => {
    if (!soundType) return "Kısa Uyarı Sesi";
    
    const soundInfo = soundTypes[soundType as keyof typeof soundTypes];
    return soundInfo ? soundInfo.name : "Kısa Uyarı Sesi";
  };
  
  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      {/* Audio element for alarm - default to beep sound */}
      <audio 
        ref={audioRef} 
        preload="auto" 
        src="/sounds/alerts/beep.mp3"
        playsInline
      />
      
      {/* Alarm çalıyorsa durdurma butonu göster */}
      {alarmPlaying && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button 
            onClick={stopAlarmSound}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 shadow-lg flex items-center gap-2"
          >
            <VolumeX className="w-5 h-5" />
            <span>Alarmı Durdur</span>
          </Button>
        </div>
      )}
      
      <h1 className="text-3xl font-bold text-center text-emerald-600 dark:text-emerald-400 mb-8">
        Namaz Hatırlatıcı
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
              Hatırlatıcılarım
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Şu an: {currentTime}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={sendTestNotification}
              className="flex items-center gap-1"
            >
              <Bell className="w-4 h-4" />
              <span>Test Et</span>
            </Button>
            
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Ekle</span>
            </Button>
          </div>
        </div>
        
        {/* Bildirim izni kontrolü */}
        {notificationPermission !== "granted" && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-amber-700 dark:text-amber-400">
                Bildirim İzni Gerekli
              </h3>
              <p className="text-sm text-amber-600 dark:text-amber-300">
                Namaz hatırlatıcılarının çalışabilmesi için bildirim iznine ihtiyacımız var.
              </p>
            </div>
            <Button
              onClick={requestNotificationPermission}
              className="bg-amber-500 hover:bg-amber-600 text-white"
              size="sm"
            >
              İzin Ver
            </Button>
          </div>
        )}
        
        {/* Hatırlatıcı Listesi */}
        <div className="space-y-3">
          {reminders.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <BellRing className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>Henüz bir hatırlatıcı eklenmedi.</p>
              <p className="text-sm">Namaz vakitlerini hatırlatmak için yeni bir hatırlatıcı ekleyin.</p>
            </div>
          ) : (
            reminders.map((reminder) => (
              <div 
                key={reminder.id}
                className={`flex justify-between items-center p-3 rounded-lg border ${
                  reminder.active 
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800" 
                    : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    reminder.active 
                      ? "bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400" 
                      : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                  }`}>
                    {reminder.active ? <BellRing className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                  </div>
                  
                  <div>
                    <div className="font-medium">{reminder.namazVakti} Namazı</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{reminder.time}</span>
                      <span className="mx-1">•</span>
                      <span>{reminder.type === "daily" ? "Her gün" : "Bir kez"}</span>
                      <span className="mx-1">•</span>
                      {reminder.soundEnabled !== false ? (
                        <span title={`Sesli alarm aktif: ${getSoundTypeName(reminder.soundType)}`}>
                          <Volume2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                        </span>
                      ) : (
                        <span title="Sesli alarm kapalı"><VolumeX className="w-3 h-3 text-gray-400" /></span>
                      )}
                    </div>
                    {reminder.note && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                        {reminder.note}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleReminderSound(reminder.id)}
                    className={`p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 ${
                      reminder.soundEnabled !== false 
                        ? "text-emerald-500 dark:text-emerald-400" 
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                    title={reminder.soundEnabled !== false ? "Sesi kapat" : "Sesi aç"}
                  >
                    {reminder.soundEnabled !== false ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => toggleReminderActive(reminder.id)}
                    className={`p-1.5 rounded-full ${
                      reminder.active 
                        ? "hover:bg-emerald-200 dark:hover:bg-emerald-700 text-emerald-600 dark:text-emerald-400" 
                        : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                    }`}
                    title={reminder.active ? "Devre dışı bırak" : "Etkinleştir"}
                  >
                    {reminder.active ? <Check className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteReminder(reminder.id)}
                    className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                    title="Sil"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Yeni Hatırlatıcı Ekleme Formu */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                  Yeni Namaz Hatırlatıcı
                </h3>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                console.log("Form submit edildi");
                handleAddReminder();
              }}>
                <div>
                  <label className="block mb-1 text-sm font-medium">Namaz Vakti</label>
                  <select
                    name="namazVakti"
                    value={newReminder.namazVakti}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  >
                    <option value="Sabah">Sabah</option>
                    <option value="Öğle">Öğle</option>
                    <option value="İkindi">İkindi</option>
                    <option value="Akşam">Akşam</option>
                    <option value="Yatsı">Yatsı</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium">Saat</label>
                  <input
                    type="time"
                    name="time"
                    value={newReminder.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium">Tekrar</label>
                  <div className="flex gap-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="daily"
                        checked={newReminder.type === "daily"}
                        onChange={handleInputChange}
                        className="mr-1"
                      />
                      <span>Her gün</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="once"
                        checked={newReminder.type === "once"}
                        onChange={handleInputChange}
                        className="mr-1"
                      />
                      <span>Bir kez</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium">Not (isteğe bağlı)</label>
                  <textarea
                    name="note"
                    value={newReminder.note || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 resize-none"
                    rows={2}
                    placeholder="Ek bir not ekleyebilirsiniz..."
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium">Sesli Alarm</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="soundEnabled"
                      name="soundEnabled"
                      checked={newReminder.soundEnabled !== false}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, soundEnabled: e.target.checked }))}
                      className="mr-2 h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="soundEnabled" className="text-sm">
                      Bildirim sesi kullan
                    </label>
                  </div>
                  
                  {newReminder.soundEnabled !== false && (
                    <div className="mt-2">
                      <label className="block mb-1 text-sm font-medium">Ses Tipi</label>
                      <select
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                        name="soundType"
                        value={newReminder.soundType || "beep"}
                        onChange={handleInputChange}
                      >
                        {Object.entries(soundTypes).map(([key, { name }]) => (
                          <option key={key} value={key}>{name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    type="button"
                  >
                    İptal
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    type="submit"
                    disabled={!newReminder.time}
                  >
                    Hatırlatıcı Ekle
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bilgilendirme */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-emerald-600 dark:text-emerald-400">
          Namaz Hatırlatıcı Hakkında
        </h2>
        
        <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
          <p>
            <strong>Namaz hatırlatıcı</strong> özelliği, namaz vakitlerini kaçırmamanız için bildirim ve sesli alarm gönderir.
          </p>
          <p>
            <strong>Her gün</strong> seçeneği ile, belirlediğiniz vakitte her gün hatırlatma alırsınız.
          </p>
          <p>
            <strong>Bir kez</strong> seçeneği ile, sadece bir kez hatırlatma alırsınız.
          </p>
          <p>
            <strong>Sesli alarm</strong> ile bildirim geldiğinde seçtiğiniz ses çalınır:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Kısa Uyarı Sesi</strong>: Basit bir uyarı sesi</li>
            <li><strong>Kısa Ezan</strong>: Kısa bir ezan sesi</li>
            <li><strong>Uzun Ezan</strong>: Daha uzun bir ezan sesi</li>
          </ul>
          <p className="pt-2">
            <strong>Not:</strong> Bildirimler ve sesli alarmlar tarayıcınız açıkken ve bu sayfa ziyaret edildiğinde çalışır. "Test Et" butonuna basarak alarm sesini test edebilirsiniz. Bazı tarayıcılarda ses çalması için sayfayla etkileşimde bulunmanız gerekebilir.
          </p>
        </div>
      </div>
    </div>
  );
} 