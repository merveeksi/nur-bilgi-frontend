"use client";

import React, { useState } from "react";
import { DailyDua } from "@/services/duaService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, AlertCircle } from "lucide-react";

export default function DuaAdminPage() {
  const [dailyDua, setDailyDua] = useState<Partial<DailyDua>>({
    id: `daily-${new Date().getTime()}`,
    title: "",
    arabic: "",
    turkishText: "",
    translation: "",
    source: "",
    date: new Date().toISOString().split('T')[0],
    virtues: ""
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDailyDua(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate essential fields
    if (!dailyDua.title || !dailyDua.turkishText) {
      setMessage({ type: "error", text: "Başlık ve Türkçe dua metni gereklidir" });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // In a real application, this would send data to a backend API
      // For now, just simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you'd receive success confirmation from the API
      setMessage({ type: "success", text: "Günün duası başarıyla kaydedildi!" });
      
      // Clear the form for a new entry
      setDailyDua({
        id: `daily-${new Date().getTime()}`,
        title: "",
        arabic: "",
        turkishText: "",
        translation: "",
        source: "",
        date: new Date().toISOString().split('T')[0],
        virtues: ""
      });
    } catch (error) {
      setMessage({ type: "error", text: "Günün duası kaydedilirken bir hata oluştu" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 dark:bg-gray-900">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-emerald-700 dark:text-emerald-400 mb-2">
          Dua Yönetimi
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-10">
          Günlük dua eklemek ve düzenlemek için yönetim paneli
        </p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === "success" 
              ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" 
              : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
          }`}>
            <AlertCircle className="h-5 w-5" />
            <p>{message.text}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-6 dark:text-white">Günün Duası Ekle</h2>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Başlık*
                </label>
                <Input
                  id="title"
                  name="title"
                  value={dailyDua.title}
                  onChange={handleInputChange}
                  placeholder="Dua başlığı"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tarih
                </label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={dailyDua.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="arabic" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Arapça Metin
              </label>
              <textarea
                id="arabic"
                name="arabic"
                value={dailyDua.arabic || ""}
                onChange={handleInputChange}
                placeholder="Arapça dua metni"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:ring-offset-gray-800 dark:focus:ring-emerald-400 min-h-[100px] text-right font-arabic"
                dir="rtl"
              />
            </div>
            
            <div>
              <label htmlFor="turkishText" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Türkçe Okunuş*
              </label>
              <textarea
                id="turkishText"
                name="turkishText"
                value={dailyDua.turkishText || ""}
                onChange={handleInputChange}
                placeholder="Duanın Türkçe okunuşu"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:ring-offset-gray-800 dark:focus:ring-emerald-400 min-h-[100px]"
                required
              />
            </div>
            
            <div>
              <label htmlFor="translation" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Türkçe Anlamı
              </label>
              <textarea
                id="translation"
                name="translation"
                value={dailyDua.translation || ""}
                onChange={handleInputChange}
                placeholder="Duanın Türkçe anlamı"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:ring-offset-gray-800 dark:focus:ring-emerald-400 min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="source" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Kaynak
                </label>
                <Input
                  id="source"
                  name="source"
                  value={dailyDua.source || ""}
                  onChange={handleInputChange}
                  placeholder="Kur'an, Hadis vb."
                />
              </div>
              
              <div>
                <label htmlFor="virtues" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Faziletleri
                </label>
                <Input
                  id="virtues"
                  name="virtues"
                  value={dailyDua.virtues || ""}
                  onChange={handleInputChange}
                  placeholder="Duanın faziletleri"
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                isLoading={isSaving}
              >
                {!isSaving && <Save className="h-5 w-5 mr-2" />}
                Günün Duasını Kaydet
              </Button>
            </div>
          </form>
        </div>
        
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Not: Bu sayfa sadece demo amaçlıdır. Gerçek bir uygulamada yetkili kullanıcılara özel erişim sağlanmalıdır.</p>
        </div>
      </div>
    </div>
  );
} 