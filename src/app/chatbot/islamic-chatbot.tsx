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
}

export default function IslamicChatbot() {
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
  const [sessionId] = useState(() => uuidv4()); // Oturum için benzersiz ID
  const [questionStatus, setQuestionStatus] = useState<QuestionStatus>({
    remaining: 3,
    requiresPremium: false,
  });
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Kullanıcının giriş yapıp yapmadığını kontrol et
  const loggedIn = isAuthenticated();
  const currentUser = getCurrentUser();

  // Başlangıçta veya oturum durumu değiştiğinde soru hakkını kontrol et
  useEffect(() => {
    // localStorage'dan önceki soru sayısını alma
    const checkRemainingQuestions = () => {
      try {
        const key = loggedIn && currentUser 
          ? `questionCount_${currentUser.id}` 
          : `questionCount_${sessionId}`;
          
        const storedCount = localStorage.getItem(key);
        const count = storedCount ? parseInt(storedCount, 10) : 0;
        
        if (count >= 3) {
          setQuestionStatus({
            remaining: 0,
            requiresPremium: true
          });
        } else {
          setQuestionStatus({
            remaining: 3 - count,
            requiresPremium: false
          });
        }
      } catch (error) {
        console.error('Soru hakkı kontrol hatası:', error);
      }
    };
    
    checkRemainingQuestions();
  }, [loggedIn, currentUser, sessionId]);

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
        // Eğer premium gerekiyorsa
        if (response.status === 403 && data.requiresPremium) {
          setQuestionStatus({
            remaining: 0,
            requiresPremium: true,
          });
          setError(data.error || 'Premium üyelik gerekiyor');
          
          // Local storage'a kaydet (premium gerektiren durumu)
          const key = loggedIn && currentUser 
            ? `questionCount_${currentUser.id}` 
            : `questionCount_${sessionId}`;
          localStorage.setItem(key, '3'); // 3 soru sormuş kabul et
        } else {
          // Diğer hatalar
          setError(data.error || 'Bir hata oluştu');
        }
        
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
      
      // Kullanıcı kontenjanlı sorgu statüsünü güncelle
      if (data.questionStatus) {
        setQuestionStatus(data.questionStatus);
        
        // Geri kalan soru hakkını localStorage'a kaydet
        try {
          const key = loggedIn && currentUser 
            ? `questionCount_${currentUser.id}` 
            : `questionCount_${sessionId}`;
          const count = 3 - data.questionStatus.remaining;
          localStorage.setItem(key, count.toString());
        } catch (err) {
          console.error('Soru sayacı kaydetme hatası:', err);
        }
      }
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

  return (
    <div className="flex flex-col h-[500px] bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-emerald-600 dark:bg-emerald-700 text-white p-4">
        <h3 className="text-2xl font-semibold text-center">İslami Chatbot</h3>
        <p className="text-ml text-white/80 text-center">Dini sorularınızı sorabilirsiniz</p>
        
        {/* Kalan sorgu hakkını göster */}
        {!questionStatus.requiresPremium && (
          <div className="mt-2 text-center text-white/90 text-sm">
            Kalan ücretsiz soru hakkınız: <span className="font-bold">{questionStatus.remaining}</span>
          </div>
        )}
        
        {/* Premium üyelik gerektiğini göster */}
        {questionStatus.requiresPremium && (
          <div className="mt-2 text-center bg-amber-500 text-white p-2 rounded-md text-sm">
            Ücretsiz soru hakkınız doldu. 
            <Link href="/profilim/uyelik" className="underline font-bold ml-1">
              Premium üyelik satın alın
            </Link>
          </div>
        )}
        
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
            disabled={isLoading || questionStatus.requiresPremium}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || inputValue.trim() === '' || questionStatus.requiresPremium}
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
        
        {/* Premium bilgilendirme mesajı */}
        {questionStatus.requiresPremium && (
          <div className="mt-3 text-center">
            <Link 
              href="/profilim/uyelik" 
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 
              transition-all duration-300 inline-block font-medium"
            >
              Premium Üyelik Satın Al
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 