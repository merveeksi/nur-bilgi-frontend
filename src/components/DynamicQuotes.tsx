"use client";

import { useState, useEffect } from "react";
import { inspirationalQuotes } from "@/app/page";

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
        <blockquote className="text-2xl md:text-3xl text-gray-800 dark:text-gray-200 font-serif italic leading-relaxed mb-8">
          "{currentQuote.quote}"
        </blockquote>
        
        <div className="flex items-center justify-center space-x-3">
          <span className="h-px w-12 bg-emerald-500 dark:bg-emerald-600"></span>
          <cite className="text-emerald-700 dark:text-emerald-500 not-italic font-medium">
            {currentQuote.source}
          </cite>
          <span className="h-px w-12 bg-emerald-500 dark:bg-emerald-600"></span>
        </div>
      </div>
      
      {/* Kontroller */}
      <div className="flex justify-center items-center space-x-4 mb-8">
        <button 
          onClick={handlePrevQuote}
          className="p-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
          aria-label="Önceki söz"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        
        <button 
          onClick={toggleAutoChange}
          className={`p-2 rounded-full ${isAutoChanging ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
          aria-label={isAutoChanging ? 'Otomatik değişimi kapat' : 'Otomatik değişimi aç'}
        >
          <span className="text-4xl w-8 h-8 flex items-center justify-center">☪︎</span>
        </button>
        
        <button 
          onClick={handleNextQuote}
          className="p-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
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
          <div className="absolute inset-0 bg-emerald-500/60 dark:bg-emerald-600/60"></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 rotate-45 border border-emerald-500 dark:border-emerald-600"></div>
        </div>
      </div>
      
      {/* Gösterge */}
      <div className="flex justify-center mt-6">
        <div className="flex space-x-1">
          {inspirationalQuotes.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full ${index === currentQuoteIndex ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-gray-300 dark:bg-gray-700'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 