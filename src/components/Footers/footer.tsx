"use client";

import { useState } from "react";
import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Heart, Send, CheckCircle, Github, Linkedin, Bell, DollarSign } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basit e-posta doğrulaması
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }
    
    // Gerçek uygulamada API çağrısı yapılır
    setTimeout(() => {
      setSubscribed(true);
      setEmail("");
      setSelectedCategories([]);
    }, 500);
  };

  const categories = [
    { id: "kuran", name: "Kur'an-ı Kerim" },
    { id: "hadis", name: "Hadisler" },
    { id: "dua", name: "Dualar" },
    { id: "gundemeibadet", name: "Gündem & İbadetler" },
    { id: "tefsir", name: "Tefsirler" },
  ];

  return (
    <footer className="bg-emerald-900 dark:bg-slate-900 text-white pt-12 pb-6 border-t border-emerald-700/20">
      <div className="container mx-auto px-4">

        {/* Newsletter Section - Üyelik Formu (Yeni Tasarım) */}
        <div className="mb-12 relative overflow-hidden">
          {/* Dekoratif arka plan deseni */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/islamic-pattern.png')] bg-repeat opacity-10"></div>
          </div>
          
          <div className="relative z-10 bg-gradient-to-br from-emerald-800 to-emerald-900 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-emerald-700/30 dark:border-slate-700/30 shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-yellow-300 to-emerald-400"></div>
            
            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row gap-10 items-center">
                {/* Sol taraf - Açıklama */}
                <div className="md:w-1/2">
                  <div className="flex items-center gap-3 mb-4">
                    <Bell className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-2xl md:text-3xl font-bold text-white">Nur Bilgi Bülteni</h3>
                  </div>
                  
                  <p className="text-gray-300 mb-6 text-lg">
                    İslami bilgiler, özel içerikler ve manevi hatırlatmalar için haftalık bültenimize kaydolun.
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-400 mb-8">
                    <div className="flex items-center">
                      <span className="inline-block w-5 h-5 bg-emerald-700/30 rounded-full flex items-center justify-center mr-2 text-emerald-400">✓</span>
                      Haftanın ayet ve hadisleri
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-5 h-5 bg-emerald-700/30 rounded-full flex items-center justify-center mr-2 text-emerald-400">✓</span>
                      Güncel dini konular ve açıklamalar
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-5 h-5 bg-emerald-700/30 rounded-full flex items-center justify-center mr-2 text-emerald-400">✓</span>
                      Özel dua ve zikirler
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-5 h-5 bg-emerald-700/30 rounded-full flex items-center justify-center mr-2 text-emerald-400">✓</span>
                      İslami gün ve geceler için hatırlatmalar
                    </div>
                  </div>
                </div>
                
                {/* Sağ taraf - Form */}
                <div className="md:w-1/2 w-full">
                  {!subscribed ? (
                    <form onSubmit={handleSubscribe} className="bg-emerald-800/40 dark:bg-slate-800/40 p-6 rounded-xl border border-emerald-700/20 dark:border-slate-700/20">
                      <h4 className="font-medium text-white mb-4">E-posta adresinizi girin</h4>
                      
                      <div className="mb-4">
                        <input
                          type="email"
                          placeholder="ornek@mail.com"
                          className="w-full px-4 py-3 bg-emerald-900/40 dark:bg-slate-900/40 border border-emerald-600/50 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        {error && <p className="mt-1 text-red-400 text-sm">{error}</p>}
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-medium text-white mb-3">İlgilendiğiniz konuları seçin (isteğe bağlı)</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {categories.map(category => (
                            <div key={category.id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={category.id}
                                checked={selectedCategories.includes(category.id)}
                                onChange={() => handleCategoryToggle(category.id)}
                                className="w-4 h-4 rounded text-emerald-500 bg-emerald-900/40 border-emerald-600/50 focus:ring-emerald-500/30 focus:ring-offset-0"
                              />
                              <label htmlFor={category.id} className="ml-2 text-sm text-gray-300">
                                {category.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-colors shadow-lg"
                      >
                        <span>Bültene Abone Ol</span>
                        <Send size={16} className="ml-2" />
                      </button>
                      
                      <p className="mt-3 text-xs text-gray-400 text-center">
                        Kaydolarak <Link href="/gizlilik" className="underline hover:text-emerald-400">Gizlilik Politikamızı</Link> kabul etmiş olursunuz.
                      </p>
                    </form>
                  ) : (
                    <div className="bg-emerald-700/30 rounded-xl p-6 flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-600/20 flex items-center justify-center mb-4">
                        <CheckCircle size={36} className="text-emerald-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">Teşekkürler!</h4>
                      <p className="text-emerald-300">
                        Bültenimize başarıyla abone oldunuz. İlk bültenimizi yakında alacaksınız.
                      </p>
                      <button 
                        onClick={() => setSubscribed(false)} 
                        className="mt-4 text-sm underline text-emerald-400 hover:text-emerald-300"
                      >
                        Farklı bir e-posta ile tekrar abone ol
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sadeleştirilmiş Alt Kısım */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-4 justify-between">
          {/* Logo ve Açıklama */}
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold text-emerald-500 mb-4">Nur Bilgi</h2>
            <p className="text-gray-400 mb-4">
              İslami bilgiye erişimi kolaylaştıran modern ve kullanıcı dostu bir platform. 
              Kur'an, hadis, dua ve daha fazlası için tek adresiniz.
            </p>
            <div className="flex space-x-4 mb-6">
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="mailto:info@nurbilgi.com" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          {/* Destek Olun */}
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-4 text-white">Destek Olun</h3>
            <p className="text-gray-400 mb-4">
              Nur Bilgi'nin gelişimine katkıda bulunarak bu hayırlı projenin devamını sağlayabilirsiniz.
            </p>
            <Link 
              href="/destek" 
              className="inline-flex items-center px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-md"
            >
              <DollarSign size={16} className="mr-2" />
              <span>Destek Olun</span>
            </Link>
          </div>
        </div>

        {/* Telif Hakkı */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-800 mt-10 pt-6">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Nur Bilgi. Tüm hakları saklıdır.
          </p>
          <p className="text-gray-500 text-sm mt-2 md:mt-0">
            <span className="flex items-center justify-center md:justify-end">
              Sevgiyle yapıldı <Heart size={14} className="mx-1 text-red-500 fill-red-500" /> Türkiye'de
            </span>
          </p>
        </div>
      </div>

      {/* İslami Desen */}
      <div className="h-1 mt-6 bg-gradient-to-r from-transparent via-emerald-600/20 to-transparent"></div>
    </footer>
  );
} 