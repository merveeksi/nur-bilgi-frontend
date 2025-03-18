"use client";

import { useState, useEffect } from "react";
import { inspirationalQuotes } from "@/app/page";
import { Copy, Share } from "lucide-react";

export default function DynamicQuotes() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isAutoChanging, setIsAutoChanging] = useState(true);
  const [fadeIn, setFadeIn] = useState(true);

  // 7 saniyede bir otomatik değişim
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoChanging) {
      interval = setInterval(() => {
        changeQuote();
      }, 7000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentQuoteIndex, isAutoChanging]);

  // Söz değiştirme fonksiyonu - fade efekti ile
  const changeQuote = () => {
    setFadeIn(false);
    
    // Fade out sonrası yeni söz seçme
    setTimeout(() => {
      const nextIndex = (currentQuoteIndex + 1) % inspirationalQuotes.length;
      setCurrentQuoteIndex(nextIndex);
      setFadeIn(true);
    }, 500);
  };

  // Manuel olarak bir sonraki söze geçme
  const handleNextQuote = () => {
    changeQuote();
  };

  // Manuel olarak bir önceki söze geçme
  const handlePrevQuote = () => {
    setFadeIn(false);
    
    setTimeout(() => {
      const prevIndex = currentQuoteIndex === 0 
        ? inspirationalQuotes.length - 1 
        : currentQuoteIndex - 1;
      setCurrentQuoteIndex(prevIndex);
      setFadeIn(true);
    }, 500);
  };

  // Otomatik değişimi açma/kapama
  const toggleAutoChange = () => {
    setIsAutoChanging(!isAutoChanging);
  };

  const currentQuote = inspirationalQuotes[currentQuoteIndex];

  // Alıntıyı kopyalama fonksiyonu
  const handleCopyQuote = () => {
    if (currentQuote) {
      const textToCopy = `"${currentQuote.quote}" - ${currentQuote.source}`;
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          // Başarılı mesajı gösterilebilir
          console.log("Alıntı panoya kopyalandı!");
        })
        .catch(err => {
          console.error('Kopyalama başarısız oldu: ', err);
        });
    }
  };

  // Alıntıyı paylaşma fonksiyonu
  const handleShareQuote = () => {
    if (currentQuote && navigator.share) {
      navigator.share({
        title: 'İslami Alıntı',
        text: `"${currentQuote.quote}" - ${currentQuote.source}`,
        url: window.location.href
      })
      .catch(err => {
        console.error('Paylaşım başarısız oldu: ', err);
      });
    }
  };

  return (
    <div className="relative">
      {/* İslami Motif - Hilal ve Besmele */}
      <div className="flex justify-center mb-12">
        <div className="text-8xl flex items-center justify-center text-black dark:text-white mb-8">
          ☾﷽
        </div>
      </div>
      
      {/* Söz */}
      <div 
        className={`text-center mb-12 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
      >
        <blockquote className="relative p-6 rounded-lg bg-white dark:bg-gray-800/50 shadow-lg border-l-4 border-gray-500 dark:border-gray-600">
          <div className="relative z-10">
            <div 
              className="mb-4 text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200"
            >
              "{currentQuote.quote}"
            </div>

            <div className="flex items-center justify-center space-x-2">
              <div className="h-px w-10 bg-gray-300 dark:bg-gray-600"></div>
              <cite className="text-gray-700 dark:text-gray-400 not-italic font-medium">
                {currentQuote.source}
              </cite>
              <div className="h-px w-10 bg-gray-300 dark:bg-gray-600"></div>
            </div>
          </div>

          <div className="absolute bottom-2 right-2 flex space-x-1">
            <button
              onClick={handleCopyQuote}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
              title="Alıntıyı kopyala"
            >
              <Copy className="w-4 h-4" />
            </button>

            <button
              onClick={handleShareQuote}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
              title="Alıntıyı paylaş"
            >
              <Share className="w-4 h-4" />
            </button>
          </div>
        </blockquote>
      </div>
      
      {/* Kontroller */}
      <div className="flex justify-center items-center space-x-4 mb-8">
        <button 
          onClick={handlePrevQuote}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
          aria-label="Önceki söz"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        
        <button 
          onClick={toggleAutoChange}
          className={`p-2 rounded-full ${isAutoChanging ? 'bg-gray-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
          aria-label={isAutoChanging ? 'Otomatik değişimi kapat' : 'Otomatik değişimi aç'}
        >
          <span className="text-4xl w-8 h-8 flex items-center justify-center">☪︎</span>
        </button>
        
        <button 
          onClick={handleNextQuote}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
          aria-label="Sonraki söz"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
      
      {/* Alt Süsleme - İnce Geometrik Çizgi */}
      <div className="flex justify-center">
        <div className="relative w-32 h-px">
          <div className="absolute inset-0 bg-gray-500/60 dark:bg-gray-600/60"></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 rotate-45 border border-gray-500 dark:border-gray-600"></div>
        </div>
      </div>
      
      {/* Gösterge */}
      <div className="flex justify-center mt-6">
        <div className="flex space-x-1">
          {inspirationalQuotes.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full ${index === currentQuoteIndex ? 'bg-gray-500 dark:bg-gray-400' : 'bg-gray-300 dark:bg-gray-700'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 