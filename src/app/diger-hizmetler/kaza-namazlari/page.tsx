"use client";

import React, { useState, useEffect } from "react";
import { Plus, Calendar, Trash2, Clock, Check, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

type NamazVakti = "Sabah" | "Öğle" | "İkindi" | "Akşam" | "Yatsı";

interface KazaNamazi {
  id: string;
  namazVakti: NamazVakti;
  createdAt: string;
  kacGun: number;
  tamamlananGun: number;
  tamamlandi: boolean;
  sonTamamlananTarih?: string;
}

export default function KazaNamazlariPage() {
  const [kazaNamazlari, setKazaNamazlari] = useState<KazaNamazi[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKazaNamez, setNewKazaNamez] = useState<Omit<KazaNamazi, "id" | "tamamlananGun" | "tamamlandi" | "createdAt">>({
    namazVakti: "Sabah",
    kacGun: 1,
  });
  
  // LocalStorage'dan kaza namazlarını yükle
  useEffect(() => {
    const stored = localStorage.getItem("kazaNamazlari");
    if (stored) {
      setKazaNamazlari(JSON.parse(stored));
    }
  }, []);
  
  // Kaza namazlarını LocalStorage'a kaydet
  const saveToLocalStorage = (namazlar: KazaNamazi[]) => {
    localStorage.setItem("kazaNamazlari", JSON.stringify(namazlar));
  };
  
  // Form girdilerini güncelle
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "kacGun") {
      setNewKazaNamez(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setNewKazaNamez(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Yeni kaza namazı ekle
  const handleAddKazaNamazi = () => {
    if (newKazaNamez.kacGun <= 0) return;
    
    const kazaNamazi: KazaNamazi = {
      id: Date.now().toString(),
      ...newKazaNamez,
      tamamlananGun: 0,
      tamamlandi: false,
      createdAt: new Date().toISOString(),
    };
    
    const updatedKazaNamazlari = [...kazaNamazlari, kazaNamazi];
    setKazaNamazlari(updatedKazaNamazlari);
    saveToLocalStorage(updatedKazaNamazlari);
    
    // Formu sıfırla
    setNewKazaNamez({
      namazVakti: "Sabah",
      kacGun: 1,
    });
    setShowAddForm(false);
  };
  
  // Kaza namazı tamamlandı olarak işaretle (gün gün)
  const handleTamamlaGun = (id: string) => {
    const updatedKazaNamazlari = kazaNamazlari.map(namaz => {
      if (namaz.id === id && namaz.tamamlananGun < namaz.kacGun) {
        const yeniTamamlananGun = namaz.tamamlananGun + 1;
        const tamamlandi = yeniTamamlananGun >= namaz.kacGun;
        
        return {
          ...namaz,
          tamamlananGun: yeniTamamlananGun,
          tamamlandi,
          sonTamamlananTarih: new Date().toLocaleDateString("tr-TR"),
        };
      }
      return namaz;
    });
    
    setKazaNamazlari(updatedKazaNamazlari);
    saveToLocalStorage(updatedKazaNamazlari);
  };
  
  // Kaza namazını sil
  const handleDeleteKazaNamazi = (id: string) => {
    const updatedKazaNamazlari = kazaNamazlari.filter(namaz => namaz.id !== id);
    setKazaNamazlari(updatedKazaNamazlari);
    saveToLocalStorage(updatedKazaNamazlari);
  };
  
  // Kaza namazlarını grupla (tamamlanan/tamamlanmayan)
  const tamamlananNamazlar = kazaNamazlari.filter(namaz => namaz.tamamlandi);
  const devamEdenNamazlar = kazaNamazlari.filter(namaz => !namaz.tamamlandi);

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-emerald-600 dark:text-emerald-400 mb-8">
        Kaza Namazları Takibi
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
            Kaza Namazlarım
          </h2>
          
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Ekle</span>
          </Button>
        </div>
        
        {/* Devam Eden Kaza Namazları */}
        {devamEdenNamazlar.length > 0 ? (
          <div className="space-y-4 mb-8">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 text-sm border-b pb-2">
              Devam Eden Kaza Namazları
            </h3>
            
            {devamEdenNamazlar.map((namaz) => (
              <div 
                key={namaz.id}
                className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-emerald-600 dark:text-emerald-400">
                      {namaz.namazVakti} Namazı
                    </h4>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Eklenme: {new Date(namaz.createdAt).toLocaleDateString("tr-TR")}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTamamlaGun(namaz.id)}
                      className="p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800/50"
                      title="Günü tamamla"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteKazaNamazi(namaz.id)}
                      className="p-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 dark:hover:bg-red-800/50"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span>İlerleme: {namaz.tamamlananGun}/{namaz.kacGun} gün</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      %{Math.round((namaz.tamamlananGun / namaz.kacGun) * 100)}
                    </span>
                  </div>
                  
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full"
                      style={{ width: `${(namaz.tamamlananGun / namaz.kacGun) * 100}%` }}
                    ></div>
                  </div>
                  
                  {namaz.sonTamamlananTarih && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Son kılınan: {namaz.sonTamamlananTarih}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 mb-4 text-gray-500 dark:text-gray-400">
            <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>Devam eden kaza namazı bulunmuyor.</p>
            <p className="text-sm">Kaza namazı eklemek için "Yeni Ekle" butonuna tıklayın.</p>
          </div>
        )}
        
        {/* Tamamlanan Kaza Namazları */}
        {tamamlananNamazlar.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300 text-sm border-b pb-2 mb-4">
              Tamamlanan Kaza Namazları
            </h3>
            
            <div className="space-y-2">
              {tamamlananNamazlar.map((namaz) => (
                <div 
                  key={namaz.id}
                  className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    <div>
                      <div className="font-medium">{namaz.namazVakti} Namazı - {namaz.kacGun} gün</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Tamamlandı: {namaz.sonTamamlananTarih}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteKazaNamazi(namaz.id)}
                    className="text-red-500 hover:text-red-700 transition-colors text-sm"
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Bilgilendirme */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-emerald-600 dark:text-emerald-400">
          Kaza Namazları Hakkında
        </h2>
        
        <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
          <p>
            <strong>Kaza namazı</strong>, vaktinde kılınamayan farz namazların sonradan kılınmasıdır.
          </p>
          <p>
            <strong>Nasıl kılınır?</strong> Kaza namazları, normal vakitlerinde kılınan namazlar gibi kılınır, sadece niyeti farklıdır. Örneğin: "Niyet ettim Allah rızası için vaktinde kılamadığım öğle namazını kaza etmeye."
          </p>
          <p>
            <strong>Sıralama</strong> önemli değildir, hangi namazın kazası varsa kılınabilir. Vaktinde kılınamayan namazların kazasını en kısa sürede yerine getirmek önemlidir.
          </p>
        </div>
      </div>
      
      {/* Yeni Kaza Namazı Ekleme Formu */}
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
                  Yeni Kaza Namazı Ekle
                </h3>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Namaz Vakti</label>
                  <select
                    name="namazVakti"
                    value={newKazaNamez.namazVakti}
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
                  <label className="block mb-1 text-sm font-medium">Kaza Gün Sayısı</label>
                  <input
                    type="number"
                    name="kacGun"
                    value={newKazaNamez.kacGun}
                    onChange={handleInputChange}
                    min="1"
                    max="1000"
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Kılmanız gereken kaza namazı gün sayısını belirtin.
                  </p>
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
                    onClick={handleAddKazaNamazi}
                    disabled={newKazaNamez.kacGun <= 0}
                  >
                    Kaza Namazı Ekle
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 