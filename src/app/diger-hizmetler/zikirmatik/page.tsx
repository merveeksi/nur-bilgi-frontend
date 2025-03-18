"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, RotateCcw, Save } from "lucide-react";
import { motion } from "framer-motion";

type SavedZikir = {
  id: string;
  name: string;
  count: number;
  date: string;
};

export default function ZikirmatikPage() {
  const [count, setCount] = useState(0);
  const [zikirName, setZikirName] = useState("");
  const [savedZikirler, setSavedZikirler] = useState<SavedZikir[]>([]);

  // LocalStorage'dan kaydedilen zikirleri yükle
  useEffect(() => {
    const stored = localStorage.getItem("savedZikirler");
    if (stored) {
      setSavedZikirler(JSON.parse(stored));
    }
  }, []);

  // Zikirleri LocalStorage'a kaydet
  const saveToLocalStorage = (zikirler: SavedZikir[]) => {
    localStorage.setItem("savedZikirler", JSON.stringify(zikirler));
  };

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    if (count > 0) {
      setCount((prevCount) => prevCount - 1);
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleSave = () => {
    if (count === 0) return;
    
    const newZikir: SavedZikir = {
      id: Date.now().toString(),
      name: zikirName || `Zikir ${savedZikirler.length + 1}`,
      count,
      date: new Date().toLocaleString("tr-TR"),
    };
    
    const updatedZikirler = [...savedZikirler, newZikir];
    setSavedZikirler(updatedZikirler);
    saveToLocalStorage(updatedZikirler);
    
    // Reset after saving
    setCount(0);
    setZikirName("");
  };

  const handleDelete = (id: string) => {
    const updatedZikirler = savedZikirler.filter((zikir) => zikir.id !== id);
    setSavedZikirler(updatedZikirler);
    saveToLocalStorage(updatedZikirler);
  };

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-emerald-600 dark:text-emerald-400 mb-8">
        Zikirmatik
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col items-center">
          <div className="mb-6">
            <input
              type="text"
              value={zikirName}
              onChange={(e) => setZikirName(e.target.value)}
              placeholder="Zikir adı (isteğe bağlı)"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <motion.div 
            className="text-8xl font-bold mb-8 text-emerald-600 dark:text-emerald-400"
            key={count}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {count}
          </motion.div>
          
          <div className="flex space-x-4 mb-6">
            <Button
              onClick={handleDecrement}
              variant="outline"
              size="lg"
              className="rounded-full w-12 h-12 flex items-center justify-center"
              disabled={count === 0}
            >
              <Minus className="w-6 h-6" />
              Geri
            </Button>
            
            <Button
              onClick={handleIncrement}
              size="lg"
              className="rounded-full w-16 h-16 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center"
            >
              <Plus className="w-8 h-8" />
              Artır
            </Button>
            
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="rounded-full w-12 h-12 flex items-center justify-center"
              disabled={count === 0}
            >
              <RotateCcw className="w-6 h-6" />
              Sıfırla
            </Button>
          </div>
          
          <Button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={count === 0}
          >
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
        </div>
      </div>
      
      {savedZikirler.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-emerald-600 dark:text-emerald-400">
            Kaydedilen Zikirler
          </h2>
          
          <div className="space-y-2">
            {savedZikirler.map((zikir) => (
              <div 
                key={zikir.id} 
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <div className="font-medium">{zikir.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {zikir.date}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {zikir.count}
                  </span>
                  <button
                    onClick={() => handleDelete(zikir.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 