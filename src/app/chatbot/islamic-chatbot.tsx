'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample responses - in a real app, this would be connected to an AI backend
  const sampleResponses = [
    'İslam\'da beş vakit namaz kılmak farzdır.',
    'Ramazan ayı, Müslümanlar için oruç tutma ayıdır.',
    'Kur\'an-ı Kerim, Allah\'ın insanlığa gönderdiği son ilahi kitaptır.',
    'Hac ibadeti, maddi ve bedeni durumu uygun olan Müslümanlar için ömürde bir kez farzdır.',
    'İslam\'ın beş şartı: Kelime-i şehadet getirmek, namaz kılmak, oruç tutmak, zekat vermek ve hacca gitmektir.',
    'Zekat, belirli bir miktar mala sahip olan Müslümanların yılda bir kez mallarının kırkta birini ihtiyaç sahiplerine vermesidir.',
  ];

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      
      const newBotMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newBotMessage]);
      setIsLoading(false);
    }, 1500);
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