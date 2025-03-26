'use client';

import { useState, useRef, useEffect } from 'react';
import { isAuthenticated, getCurrentUser } from '@/services/authService';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface QuestionStatus {
  remaining: number;
  requiresPremium: boolean;
  resetTime?: number; // Sıfırlama zamanı için timestamp
}

export default function IslamicChatbot() {
  // Sonsuz render döngüsünü önlemek için auth durumunu memoize edelim
  const isLoggedInRef = useRef(isAuthenticated());
  const currentUserRef = useRef(getCurrentUser());
  
  // Oturum bilgilerini değişkenler olarak kullanıma hazırlayalım
  const loggedIn = isLoggedInRef.current;
  const currentUser = currentUserRef.current;
  
  // Benzersiz oturum ID'si - sadece bir kez oluşturulur
  const sessionIdRef = useRef(uuidv4());
  const sessionId = sessionIdRef.current;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Selamun Aleyküm! İslami sorularınızı sorabilirsiniz.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionStatus, setQuestionStatus] = useState<QuestionStatus>({
    remaining: Infinity,
    requiresPremium: false,
  });
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Başlangıçta soru hakkını kontrol et - useEffect'i bir kez çalıştıracak şekilde ayarlıyoruz
  useEffect(() => {
    // Soru hakkını sınırsız olarak ayarla
    setQuestionStatus({
      remaining: Infinity,
      requiresPremium: false,
      resetTime: undefined
    });
    
    // localStorage'ı temizle veya devre dışı bırak
    // Önceki kodu yorum satırına alıyoruz
    /*
    try {
      const key = loggedIn && currentUser 
        ? `questionCount_${currentUser.id}` 
        : `questionCount_${sessionId}`;
        
      const storedData = localStorage.getItem(key);
      
      // Sadece localStorage'da bir değer varsa state'i güncelle
      if (storedData !== null) {
        const data = JSON.parse(storedData);
        const count = data.count;
        const resetTime = data.resetTime;
        const now = Date.now();
        
        // 24 saat geçmiş mi kontrol et
        if (resetTime && now > resetTime) {
          // 24 saat geçmiş, hakları sıfırla
          setQuestionStatus({
            remaining: 3,
            requiresPremium: false,
            resetTime: now + 24 * 60 * 60 * 1000 // 24 saat sonrası
          });
          
          // Yeni değerleri localStorage'a kaydet
          localStorage.setItem(key, JSON.stringify({
            count: 0,
            resetTime: now + 24 * 60 * 60 * 1000
          }));
        } else {
          // 24 saat geçmemiş, mevcut hakları kullan
          if (count >= 3) {
            setQuestionStatus({
              remaining: 0,
              requiresPremium: true,
              resetTime: resetTime
            });
          } else {
            setQuestionStatus({
              remaining: 3 - count,
              requiresPremium: false,
              resetTime: resetTime
            });
          }
        }
      } else {
        // İlk kullanım, yeni bir resetTime oluştur
        const now = Date.now();
        setQuestionStatus({
          remaining: 3,
          requiresPremium: false,
          resetTime: now + 24 * 60 * 60 * 1000
        });
        
        localStorage.setItem(key, JSON.stringify({
          count: 0,
          resetTime: now + 24 * 60 * 60 * 1000
        }));
      }
    } catch (error) {
      console.error('Soru hakkı kontrol hatası:', error);
    }
    */
    // Boş dependency array ile useEffect'i sadece bir kez çalıştır
  }, []); 

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    // Hata mesajını temizle
    setError(null);
    
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // API'ye istek gönder
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newUserMessage.text,
          sessionId: sessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Premium kontrolünü kaldır
        /*
        if (response.status === 403 && data.requiresPremium) {
          setQuestionStatus({
            remaining: 0,
            requiresPremium: true,
            resetTime: questionStatus.resetTime
          });
          setError(data.error || 'Premium üyelik gerekiyor');
          
          // Local storage'a kaydet (premium gerektiren durumu)
          const key = loggedIn && currentUser 
            ? `questionCount_${currentUser.id}` 
            : `questionCount_${sessionId}`;
          localStorage.setItem(key, JSON.stringify({
            count: 3,
            resetTime: questionStatus.resetTime
          }));
        } else {
        */
        // Diğer hatalar
        setError(data.error || 'Bir hata oluştu');
        /*
        }
        */
        
        setIsLoading(false);
        return;
      }

      // Yanıtı mesajlara ekle
      const newBotMessage: Message = {
        id: messages.length + 2,
        text: data.message,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newBotMessage]);
      
      // Soru statüsü güncellemesini devre dışı bırak
      /*
      // Kullanıcı kontenjanlı sorgu statüsünü güncelle
      if (data.questionStatus) {
        const updatedStatus = {
          ...data.questionStatus,
          resetTime: questionStatus.resetTime
        };
        setQuestionStatus(updatedStatus);
        
        // Geri kalan soru hakkını localStorage'a kaydet
        try {
          const key = loggedIn && currentUser 
            ? `questionCount_${currentUser.id}` 
            : `questionCount_${sessionId}`;
          const count = 3 - updatedStatus.remaining;
          localStorage.setItem(key, JSON.stringify({
            count: count,
            resetTime: questionStatus.resetTime
          }));
        } catch (err) {
          console.error('Soru sayacı kaydetme hatası:', err);
        }
      }
      */
    } catch (err) {
      console.error('Chatbot isteği hatası:', err);
      setError('Sunucuyla iletişim sırasında bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Kalan süreyi hesapla
  const getTimeRemaining = () => {
    if (!questionStatus.resetTime) return '';
    
    const now = Date.now();
    const remaining = questionStatus.resetTime - now;
    
    if (remaining <= 0) return 'Çok yakında';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours} saat ${minutes} dakika`;
  };

  return (
    <div className="flex flex-col h-[500px] bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-emerald-600 dark:bg-emerald-700 text-white p-4">
        <h3 className="text-2xl font-semibold text-center">İslami Chatbot</h3>
        <p className="text-ml text-white/80 text-center">Dini sorularınızı sorabilirsiniz</p>
        
        {/* Soru hakkı bilgisini kaldır
        {!questionStatus.requiresPremium && (
          <div className="mt-2 text-center text-white/90 text-sm">
            Kalan ücretsiz soru hakkınız: <span className="font-bold">{questionStatus.remaining}</span>
            <div className="text-xs mt-1">Haklar yenilenecek: {getTimeRemaining()}</div>
          </div>
        )}
        
        {questionStatus.requiresPremium && (
          <div className="mt-2 text-center bg-amber-300 hover:bg-amber-500 text-gray-700 p-2 rounded-md text-sm">
            Ücretsiz soru hakkınız doldu. 
            <div className="text-xs mt-1">Haklar yenilenecek: {getTimeRemaining()}</div>
          </div>
        )}
        */}
        
        {/* Giriş yapmamış kullanıcılara bilgilendirme */}
        {!loggedIn && (
          <div className="mt-2 text-center text-white/90 text-sm">
            <Link href="/giris" className="underline font-bold">
              Giriş yaparak
            </Link> sorularınızı kaydedin ve daha fazla özelliğe erişin.
          </div>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-slate-900">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700'
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {/* Hata mesajı */}
          {error && (
            <div className="flex justify-center my-2">
              <div className="max-w-[80%] p-2 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm">
                {error}
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Sorunuzu yazın..."
            className="flex-1 p-2 border text-gray-700 border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || inputValue.trim() === ''}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 
            transition-all duration-300 transform hover:scale-105 
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-lg hover:shadow-emerald-500/50
            flex items-center gap-2 font-medium
            border border-emerald-500 hover:border-emerald-700"
          >
            <span>Gönder</span>
            <svg 
              className="w-4 h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 