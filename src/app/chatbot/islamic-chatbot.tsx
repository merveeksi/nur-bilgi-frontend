'use client';
import ReactMarkdown from 'react-markdown';
import { useState, useRef, useEffect } from 'react';
import { isAuthenticated, getCurrentUser } from '@/services/authService'; // Bu servislerin sizde olduğunu varsayıyoruz
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

// Mesajların yapısı için Interface
interface Message {
  id: number | string; // ID'yi string veya number yapalım (Date.now() veya uuid için)
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Backend'den gelecek yanıtın yapısı için Interface
interface ApiResponse {
  reply?: string;
  message?: string; // Backend hata mesajı için alternatif alan
  Error?: string;   // Backend hata mesajı için alternatif alan
}

export default function IslamicChatbot() {
  // --- State Tanımlamaları ---
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
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Otomatik kaydırma için

  // --- Auth ve Session (Sizin kodunuzdan alındı) ---
  const isLoggedInRef = useRef(isAuthenticated());
  const currentUserRef = useRef(getCurrentUser());
  const loggedIn = isLoggedInRef.current;
  const currentUser = currentUserRef.current;
  const sessionIdRef = useRef(uuidv4());
  const sessionId = sessionIdRef.current; // Bu sessionId'yi API isteğinde gönderebilirsiniz (isteğe bağlı)

  // --- Mesaj Gönderme Fonksiyonu (Düzenlenmiş Hali) ---
  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim(); // Kenar boşluklarını temizle
    if (trimmedInput === '') return; // Boş mesajı engelle

    setError(null); // Varsa önceki hatayı temizle

    const newUserMessage: Message = {
      id: uuidv4(), // Benzersiz ID için uuid kullanıldı
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date(),
    };

    // Optimistic UI: Kullanıcı mesajını hemen ekle
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue(''); // Input alanını temizle
    setIsLoading(true); // Yükleniyor animasyonunu başlat

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5204'}/api/AiChatMessage`;

    try {
      // ------------ >> GERÇEK API ÇAĞRISI (fetch) << ------------
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // İsterseniz sessionId gibi ek bilgileri header'da gönderebilirsiniz
          // 'X-Session-Id': sessionId
        },
        // Backend'deki ChatRequest DTO'suna uygun "message" alanı
        body: JSON.stringify({ message: trimmedInput }),
      });
      // ---------------------------------------------------------

      if (!response.ok) {
        // HTTP status kodu 2xx değilse (örn: 404, 500, 400)
        let errorMsg = `API isteği başarısız: ${response.status} ${response.statusText}`;
        try {
          // Backend'den JSON formatında bir hata mesajı gelmiş olabilir
          const errorData: ApiResponse = await response.json();
          // Backend'in döndürdüğü hata mesajını (varsa) kullanmaya çalışalım
          errorMsg = errorData.message || errorData.Error || errorMsg;
        } catch (e) {
          // Yanıt JSON değilse veya parse edilemezse, status kodunu içeren mesajı kullan
        }
        throw new Error(errorMsg); // Hata fırlat, aşağıdaki catch bloğu yakalayacak
      }

      // Başarılı yanıt (HTTP 200 OK)
      const data: ApiResponse = await response.json(); // Yanıtı JSON olarak oku

      if (data.reply) {
        // Backend'den { "reply": "..." } şeklinde yanıt geldiğini varsayıyoruz
        const newBotMessage: Message = {
          id: uuidv4(), // Benzersiz ID
          text: data.reply,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newBotMessage]); // Bot'un yanıtını listeye ekle
      } else {
        // Yanıt geldi ama içinde "reply" alanı yoksa
        throw new Error('API yanıtı geçerli bir cevap içermiyor.');
      }

    } catch (err) {
      // fetch sırasında veya sonrasında bir hata oluşursa (network hatası, fırlatılan Error vb.)
      console.error('Chatbot isteği hatası:', err);
      // Hata mesajını state'e set ederek UI'da göster
      setError(err instanceof Error ? err.message : 'Sunucuyla iletişim sırasında bilinmeyen bir hata oluştu.');
      // İsteğe bağlı: Hatayı chat'e bot mesajı olarak da ekleyebilirsiniz
      /*
      const errorMessage: Message = {
        id: uuidv4(),
        text: err instanceof Error ? err.message : 'Üzgünüm, bir sorun oluştu.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      */
    } finally {
      // İstek başarılı da olsa, hata da olsa yükleniyor durumunu kaldır
      setIsLoading(false);
    }
  };

  // --- Otomatik Kaydırma Efekti ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- JSX (Arayüz) ---
  return (
    <div className="flex flex-col h-[500px] bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-emerald-600 dark:bg-emerald-700 text-white p-4">
        <h3 className="text-2xl font-semibold text-center">İslami Chatbot</h3>
        <p className="text-ml text-white/80 text-center">Dini sorularınızı sorabilirsiniz</p>
        {!loggedIn && (
          <div className="mt-2 text-center text-white/90 text-sm">
            <Link href="/giris" className="underline font-bold">Giriş yaparak</Link> sorularınızı kaydedin ve daha fazla özelliğe erişin.
          </div>
        )}
      </div>

      {/* Mesaj Alanı */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-slate-900">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg shadow ${
                  message.sender === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700'
                }`}
              >
                {message.sender === 'bot' ? (
                  <ReactMarkdown components={{
                    p: ({node, ...props}) => <p className="whitespace-pre-wrap" {...props} />
                  }}>{message.text}</ReactMarkdown>
                ) : (
                  <p className="whitespace-pre-wrap">{message.text}</p>
                )}
                <p className="text-xs mt-1 opacity-70 text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Yükleniyor Göstergesi */}
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

          {/* Hata Mesajı */}
          {error && (
            <div className="flex justify-center my-2">
              <div className="max-w-[80%] p-2 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm">
                {error}
              </div>
            </div>
          )}

          {/* Otomatik kaydırma için boş div */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Alanı */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()} // Enter ile gönderme
            placeholder="Sorunuzu yazın..."
            className="flex-1 p-2 border text-gray-700 border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || inputValue.trim() === ''}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" // Basit stil
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> // Yükleniyor ikonu
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg> // Gönder ikonu
            )}
          </button>
        </div>
      </div>
    </div>
  );
}