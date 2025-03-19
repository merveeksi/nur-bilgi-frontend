"use client";

import { useState, useEffect } from "react";
import { Copy, Share } from "lucide-react";

// Alıntı tip tanımı
interface Quote {
  id: number;
  quote: string;
  source: string;
}

export default function DynamicQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isAutoChanging, setIsAutoChanging] = useState(true);
  const [fadeIn, setFadeIn] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  // API'den alıntıları çek
  useEffect(() => {
    async function fetchQuotes() {
      try {
        setLoading(true);
        const response = await fetch('/api/quotes');
        
        if (!response.ok) {
          throw new Error('Alıntılar yüklenirken bir hata oluştu');
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          setQuotes(data.data);
        } else {
          throw new Error(data.error || 'Alıntılar alınamadı');
        }
      } catch (err) {
        console.error('Alıntıları çekerken hata:', err);
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }
    
    fetchQuotes();
  }, []);

  // 7 saniyede bir otomatik değişim
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoChanging && quotes.length > 0) {
      interval = setInterval(() => {
        changeQuote();
      }, 7000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentQuoteIndex, isAutoChanging, quotes]);

  // Söz değiştirme fonksiyonu - fade efekti ile
  const changeQuote = () => {
    if (quotes.length === 0) return;
    
    setFadeIn(false);
    
    // Fade out sonrası yeni söz seçme
    setTimeout(() => {
      const nextIndex = (currentQuoteIndex + 1) % quotes.length;
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
    if (quotes.length === 0) return;
    
    setFadeIn(false);
    
    setTimeout(() => {
      const prevIndex = currentQuoteIndex === 0 
        ? quotes.length - 1 
        : currentQuoteIndex - 1;
      setCurrentQuoteIndex(prevIndex);
      setFadeIn(true);
    }, 500);
  };

  // Otomatik değişimi açma/kapama
  const toggleAutoChange = () => {
    setIsAutoChanging(!isAutoChanging);
  };

  // Mevcut alıntı
  const currentQuote = quotes.length > 0 ? quotes[currentQuoteIndex] : null;

  // Alıntıyı kopyalama fonksiyonu
  const handleCopyQuote = () => {
    if (currentQuote) {
      const textToCopy = `"${currentQuote.quote}" - ${currentQuote.source}`;
      
      try {
        // Modern API yöntemi
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy)
            .then(() => {
              setCopyFeedback(true);
              setTimeout(() => setCopyFeedback(false), 2000);
            })
            .catch(err => {
              console.error('Kopyalama başarısız oldu: ', err);
              // Fallback yöntemi kullan
              fallbackCopyTextToClipboard(textToCopy);
            });
        } else {
          // Fallback yöntemi kullan
          fallbackCopyTextToClipboard(textToCopy);
        }
      } catch (err) {
        console.error('Kopyalama başarısız oldu: ', err);
      }
    }
  };

  // Alternatif kopyalama yöntemi
  const fallbackCopyTextToClipboard = (text: string) => {
    try {
      // Geçici bir textarea oluştur
      const textArea = document.createElement("textarea");
      textArea.value = text;
      
      // Textarea'yı görünmez yap
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      // Kopyalama işlemini dene
      const successful = document.execCommand('copy');
      if (successful) {
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
      }
      
      document.body.removeChild(textArea);
    } catch (err) {
      console.error('Fallback kopyalama başarısız oldu: ', err);
    }
  };

  // Alıntıyı paylaşma fonksiyonu
  const handleShareQuote = () => {
    if (currentQuote) {
      const shareText = `"${currentQuote.quote}" - ${currentQuote.source}`;
      
      // Web Share API kontrolü
      if (navigator.share) {
        navigator.share({
          title: 'İslami Alıntı',
          text: shareText,
          url: window.location.href
        })
        .then(() => {
          setShareFeedback(true);
          setTimeout(() => setShareFeedback(false), 2000);
        })
        .catch(err => {
          console.error('Paylaşım başarısız oldu: ', err);
          // Paylaşım başarısız olursa kopyalama işlemini gerçekleştir
          handleCopyQuote();
        });
      } else {
        // Web Share API desteklenmiyorsa kopyalama işlemini gerçekleştir
        handleCopyQuote();
      }
    }
  };

  // Yükleniyor
  if (loading) {
    return (
      <div className="flex justify-center items-center h-60 relative">
        <div className="text-8xl flex items-center justify-center text-black dark:text-white mb-8 animate-pulse">
          ☾﷽
        </div>
        <div className="text-emerald-600 dark:text-emerald-400 text-lg absolute bottom-0">
          Alıntılar yükleniyor...
        </div>
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-60">
        <div className="text-red-500 dark:text-red-400 text-lg mb-4">
          {error}
        </div>
        <button 
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Yeniden Dene
        </button>
      </div>
    );
  }

  // Alıntı yoksa
  if (quotes.length === 0) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="text-gray-600 dark:text-gray-400 text-lg">
          Şu anda gösterilecek alıntı bulunamadı.
        </div>
      </div>
    );
  }

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
        <blockquote className="relative p-6 rounded-lg bg-white dark:bg-gray-800/50 shadow-lg border-l-4 border-emerald-600 dark:border-gray-600">
          <div className="relative z-10">
            <div 
              className="mb-4 text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200"
            >
              "{currentQuote?.quote}"
            </div>

            <div className="flex items-center justify-center space-x-2">
              <div className="h-px w-10 bg-gray-300 dark:bg-gray-600"></div>
              <cite className="text-gray-700 dark:text-gray-400 not-italic font-medium">
                {currentQuote?.source}
              </cite>
              <div className="h-px w-10 bg-gray-300 dark:bg-gray-600"></div>
            </div>
          </div>

          <div className="absolute bottom-2 right-2 flex space-x-1">
            <button
              onClick={handleCopyQuote}
              className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
              title="Alıntıyı kopyala"
            >
              <Copy className="w-4 h-4" />
              {copyFeedback && (
                <span className="absolute -top-8 right-0 bg-emerald-500 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  Kopyalandı!
                </span>
              )}
            </button>

            <button
              onClick={handleShareQuote}
              className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
              title="Alıntıyı paylaş"
            >
              <Share className="w-4 h-4" />
              {shareFeedback && (
                <span className="absolute -top-8 right-0 bg-emerald-500 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  Paylaşıldı!
                </span>
              )}
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
          className={`p-2 rounded-full ${isAutoChanging ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
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
          {quotes.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full ${index === currentQuoteIndex ? 'bg-emerald-500 dark:bg-gray-400' : 'bg-gray-300 dark:bg-gray-700'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 