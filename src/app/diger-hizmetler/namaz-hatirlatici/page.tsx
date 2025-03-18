"use client";

import React, { useState, useEffect } from "react";
import { BellRing, Clock, Plus, X, Bell, BellOff, Check, RefreshCw } from "lucide-react";
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
}

export default function NamazHatirlaticiPage() {
  const [reminders, setReminders] = useState<NamazReminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState<Omit<NamazReminder, "id" | "active" | "createdAt">>({
    namazVakti: "Sabah",
    time: "",
    type: "daily",
  });
  const [notificationPermission, setNotificationPermission] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  
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
      setCurrentTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Her dakika güncelle
    
    return () => clearInterval(interval);
  }, []);
  
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
  
  // Yeni hatırlatıcı ekle
  const handleAddReminder = () => {
    if (!newReminder.time) return;
    
    const reminder: NamazReminder = {
      id: Date.now().toString(),
      ...newReminder,
      active: true,
      createdAt: new Date().toISOString(),
    };
    
    const updatedReminders = [...reminders, reminder];
    setReminders(updatedReminders);
    localStorage.setItem("namazReminders", JSON.stringify(updatedReminders));
    
    // Formu sıfırla
    setNewReminder({
      namazVakti: "Sabah",
      time: "",
      type: "daily",
    });
    setShowAddForm(false);
    
    // Bildirim izni kontrolü
    if (notificationPermission !== "granted") {
      requestNotificationPermission();
    }
  };
  
  // Hatırlatıcı silme
  const handleDeleteReminder = (id: string) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    setReminders(updatedReminders);
    localStorage.setItem("namazReminders", JSON.stringify(updatedReminders));
  };
  
  // Hatırlatıcı aktif/pasif durumunu değiştir
  const toggleReminderActive = (id: string) => {
    const updatedReminders = reminders.map(reminder => 
      reminder.id === id ? { ...reminder, active: !reminder.active } : reminder
    );
    setReminders(updatedReminders);
    localStorage.setItem("namazReminders", JSON.stringify(updatedReminders));
  };
  
  // Test bildirimi gönder
  const sendTestNotification = () => {
    if (notificationPermission === "granted") {
      const notification = new Notification("Namaz Hatırlatıcı", {
        body: "Bu bir test bildirimidir. Namaz vakti hatırlatıcıları bu şekilde görünecektir.",
        icon: "/favicon.ico"
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } else {
      requestNotificationPermission();
    }
  };
  
  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
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
              
              <form className="space-y-4">
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
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    İptal
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={handleAddReminder}
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
            <strong>Namaz hatırlatıcı</strong> özelliği, namaz vakitlerini kaçırmamanız için size bildirim gönderir.
          </p>
          <p>
            <strong>Her gün</strong> seçeneği ile, belirlediğiniz vakitte her gün hatırlatma alırsınız.
          </p>
          <p>
            <strong>Bir kez</strong> seçeneği ile, sadece bir kez hatırlatma alırsınız.
          </p>
          <p>
            Not: Bildirimler tarayıcınız açıkken çalışır. Daha kapsamlı hatırlatıcılar için cihazınızın alarm özelliğini kullanabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
} 