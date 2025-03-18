"use client";

import React, { useState, useEffect } from "react";
import { Calculator, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

type AssetType = "altin" | "gumus" | "nakit" | "ticaret" | "diger";

const currentYearNisab = {
  altin: 85, // 85 gram altın değeri nisap
  gumus: 595, // 595 gram gümüş değeri nisap
};

export default function ZekatHesaplaPage() {
  const [activeTab, setActiveTab] = useState<AssetType>("nakit");
  const [assetValue, setAssetValue] = useState<number>(0);
  const [goldPrice, setGoldPrice] = useState<number>(3554.43); // TL/gram varsayılan değer
  const [silverPrice, setSilverPrice] = useState<number>(40.17); // TL/gram varsayılan değer
  const [nisabValue, setNisabValue] = useState<number>(0);
  const [zekatAmount, setZekatAmount] = useState<number>(0);
  const [shouldPayZekat, setShouldPayZekat] = useState<boolean>(false);
  const [lastCalculation, setLastCalculation] = useState<any>(null);
  const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(false);
  const [priceUpdateDate, setPriceUpdateDate] = useState<string>("");
  const [priceError, setPriceError] = useState<string>("");

  // API'den güncel fiyatları çek
  const fetchCurrentPrices = async () => {
    setIsLoadingPrices(true);
    setPriceError("");
    
    try {
      // Kendi API routumuzdan fiyatları alıyoruz
      const response = await fetch("/api/gold-prices", {
        cache: 'no-cache' // Her seferinde yeni istek yap
      });
      
      if (!response.ok) {
        throw new Error("Fiyat bilgileri alınamadı");
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Altın fiyatını işle
        if (data.gold && data.gold.price) {
          // Fiyat string'ini number'a çeviriyoruz (nokta ve virgüller için)
          const goldPriceStr = data.gold.price.replace(".", "").replace(",", ".");
          const goldPriceNum = parseFloat(goldPriceStr);
          if (!isNaN(goldPriceNum)) {
            setGoldPrice(goldPriceNum);
          }
        }
        
        // Gümüş fiyatını işle
        if (data.silver && data.silver.price) {
          // Fiyat string'ini number'a çeviriyoruz (nokta ve virgüller için)
          const silverPriceStr = data.silver.price.replace(".", "").replace(",", ".");
          const silverPriceNum = parseFloat(silverPriceStr);
          if (!isNaN(silverPriceNum)) {
            setSilverPrice(silverPriceNum);
          }
        }
        
        // Fiyat güncellenme tarihini kaydet
        if (data.lastUpdated) {
          const updateDate = new Date(data.lastUpdated);
          setPriceUpdateDate(updateDate.toLocaleDateString("tr-TR"));
        } else {
          setPriceUpdateDate("Bilinmiyor");
        }
        
        // API'den veri başarıyla alındı, hata mesajı gösterme
        setPriceError("");
      } else {
        throw new Error(data.message || "Fiyat bilgileri alınamadı");
      }
    } catch (error) {
      console.error("Fiyat bilgisi çekme hatası:", error);
      setPriceError("Fiyat bilgileri alınamadı. Varsayılan değerler kullanılıyor.");
    } finally {
      setIsLoadingPrices(false);
    }
  };

  // Sayfa yüklendiğinde fiyatları çek
  useEffect(() => {
    fetchCurrentPrices();
  }, []);

  // Nisap değerini hesapla
  useEffect(() => {
    // Altın üzerinden nisap hesabı (düşük olanı alırız)
    const goldNisab = currentYearNisab.altin * goldPrice;
    const silverNisab = currentYearNisab.gumus * silverPrice;
    
    // İki değerden küçük olanı nisap olarak kabul edilir
    const calculatedNisab = Math.min(goldNisab, silverNisab);
    setNisabValue(calculatedNisab);
  }, [goldPrice, silverPrice]);

  const handleTabChange = (tab: AssetType) => {
    setActiveTab(tab);
    setAssetValue(0);
    setZekatAmount(0);
    setShouldPayZekat(false);
  };

  const handleAssetValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAssetValue(value);
  };

  const handleMetalPriceChange = (e: React.ChangeEvent<HTMLInputElement>, metalType: "gold" | "silver") => {
    const value = parseFloat(e.target.value) || 0;
    if (metalType === "gold") {
      setGoldPrice(value);
    } else {
      setSilverPrice(value);
    }
  };

  const calculateZekat = () => {
    // Nisap değerini kontrol et
    if (assetValue >= nisabValue) {
      // Zekat oranı %2.5 (0.025)
      const calculated = assetValue * 0.025;
      setZekatAmount(calculated);
      setShouldPayZekat(true);
      
      // Son hesaplamayı kaydet
      const calculation = {
        type: activeTab,
        value: assetValue,
        zekat: calculated,
        date: new Date().toLocaleDateString("tr-TR"),
        nisab: nisabValue,
      };
      setLastCalculation(calculation);
      
      // LocalStorage'a kaydet
      const storedHistory = localStorage.getItem("zekatHistory");
      const history = storedHistory ? JSON.parse(storedHistory) : [];
      history.push(calculation);
      localStorage.setItem("zekatHistory", JSON.stringify(history));
    } else {
      setZekatAmount(0);
      setShouldPayZekat(false);
      setLastCalculation(null);
    }
  };

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-emerald-600 dark:text-emerald-400 mb-8">
        Zekat Hesaplama
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        {/* Varlık türü seçimi */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "nakit", label: "Nakit Para" },
            { id: "altin", label: "Altın" },
            { id: "gumus", label: "Gümüş" },
            { id: "ticaret", label: "Ticari Mallar" },
            { id: "diger", label: "Diğer Değerler" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as AssetType)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-gray-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Nisab değerleri ayarı */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Nisab Değerleri
            </h3>
            <button 
              onClick={fetchCurrentPrices}
              disabled={isLoadingPrices}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingPrices ? "animate-spin" : ""}`} />
              Güncel Fiyatları Getir
            </button>
          </div>
          
          {priceError && (
            <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-600 dark:text-red-400">
              {priceError}
            </div>
          )}
          
          {priceUpdateDate && !priceError && (
            <div className="mb-3 text-xs text-gray-500 dark:text-gray-400">
              Son güncelleme: {priceUpdateDate}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Altın Fiyatı (TL/gram)</label>
              <input
                type="number"
                value={goldPrice}
                onChange={(e) => handleMetalPriceChange(e, "gold")}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Altın nisabı: {currentYearNisab.altin} gram
              </p>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Gümüş Fiyatı (TL/gram)</label>
              <input
                type="number"
                value={silverPrice}
                onChange={(e) => handleMetalPriceChange(e, "silver")}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Gümüş nisabı: {currentYearNisab.gumus} gram
              </p>
            </div>
          </div>
          <div className="mt-3 px-3 py-2 bg-gray-100 dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-700">
            <p className="text-sm">
              <strong>Güncel Nisab:</strong>{" "}
              {nisabValue.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Nisab, zekat için belirlenen asgari zenginlik sınırıdır. 
              Varlıklarınız bu değerin üzerindeyse zekat vermeniz gerekir.
            </p>
          </div>
        </div>
        
        {/* Varlık değeri girişi */}
        <div className="mb-6">
          <label className="block mb-2 text-lg font-semibold">
            {activeTab === "nakit" ? "Nakit Para Miktarı" :
             activeTab === "altin" ? "Altın Değeri (TL)" :
             activeTab === "gumus" ? "Gümüş Değeri (TL)" :
             activeTab === "ticaret" ? "Ticari Mal Değeri (TL)" :
             "Varlık Değeri (TL)"}
          </label>
          <div className="flex">
            <input
              type="number"
              value={assetValue || ""}
              onChange={handleAssetValueChange}
              placeholder="Değer giriniz"
              className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={calculateZekat}
              className="px-4 py-3 rounded-r-lg bg-gray-600 hover:bg-gray-700 text-white flex items-center"
            >
              <Calculator className="w-5 h-5 mr-1" />
              Hesapla
            </button>
          </div>
        </div>
        
        {/* Sonuç */}
        {zekatAmount > 0 && (
          <motion.div 
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Zekat Sonucu
            </h3>
            <p className="mb-2">
              <strong>Ödemeniz Gereken Zekat:</strong>{" "}
              <span className="text-xl font-bold text-gray-700 dark:text-gray-300">
                {zekatAmount.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
              </span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Varlık değeriniz nisab miktarını aştığı için zekat vermeniz gerekmektedir.
            </p>
          </motion.div>
        )}
        
        {assetValue > 0 && !shouldPayZekat && (
          <motion.div 
            className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-2 text-blue-700 dark:text-blue-400">
              Zekat Sonucu
            </h3>
            <p className="text-sm">
              Varlık değeriniz nisab miktarının altında olduğu için zekat vermeniz gerekmemektedir.
            </p>
          </motion.div>
        )}
      </div>
      
      {/* Bilgilendirme */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Zekat Hakkında
        </h2>
        
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            <strong>Zekat</strong>, İslam'ın beş şartından biridir ve belirli bir zenginlik seviyesine ulaşmış Müslümanların mallarının bir kısmını ihtiyaç sahiplerine vermeleri anlamına gelir.
          </p>
          <p>
            <strong>Nisab</strong> değeri, zekat verebilmek için kişinin sahip olması gereken asgari zenginlik sınırıdır. Bu değer 85 gram altın veya 595 gram gümüşün değerine eşittir.
          </p>
          <p>
            <strong>Zekat oranı</strong>, genellikle %2.5'tir (1/40). Bu, zenginliğin kırkta birinin zekat olarak verilmesi gerektiği anlamına gelir.
          </p>
          <p>
            <strong>Kimlere verilir?</strong> Fakirler, miskinler (çok muhtaç olanlar), zekat toplamakla görevli memurlar, kalpleri İslam'a ısındırılmak istenenler, köleler, borçlular, Allah yolunda olanlar ve yolda kalmış yolcular.
          </p>
        </div>
      </div>
    </div>
  );
} 