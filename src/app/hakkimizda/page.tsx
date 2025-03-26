"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";
import PageSection from "@/components/ui/page-section";

export default function AboutPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.name || !formState.email || !formState.message) {
      setErrorMessage("Lütfen gerekli alanları doldurunuz.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSubmitSuccess(false);
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          subject: formState.subject,
          content: formState.message,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Mesaj gönderilirken bir hata oluştu');
      }
      
      setSubmitSuccess(true);
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Mesaj gönderim hatası:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageSection>
      {/* About Us Section - Enhanced Version */}
      <div className="mb-20 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-6">
            Hoş Geldiniz
          </h2>
          <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full mb-8"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900/30">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-emerald-600 dark:text-emerald-400">İslami Kaynaklar</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Kur'an-ı Kerim, hadis kitapları, namaz vakitleri ve dualar gibi çeşitli İslami kaynakları kolayca erişebileceğiniz bir platform.
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900/30">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-emerald-600 dark:text-emerald-400">Yapay Zeka Chatbot</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Dini sorularınızı yapay zeka destekli chatbot aracılığıyla sorabilir, anında cevaplar alabilirsiniz.
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900/30">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-emerald-600 dark:text-emerald-400">Güvenilir Bilgi</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Dini bilgileri doğru kaynaklardan alarak toplumumuza sunmak için çalışıyoruz.
            </p>
          </div>
        </div>
        
        <div className="relative bg-white dark:bg-slate-800/50 p-8 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900/30">
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          
          <p className="text-lg text-center text-slate-700 dark:text-slate-300 mt-2">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Nur Bilgi</span> ekibi olarak, İslami bilgilerin doğru bir şekilde aktarılması ve yaygınlaştırılması için çalışmalarımızı sürdürüyoruz. 
            Platform hakkında görüş, öneri ve sorularınız için aşağıdaki iletişim bilgilerinden bize ulaşabilirsiniz.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Contact Info Section */}
        <div className="relative flex flex-col h-full">
          {/* Shimmer effect background */}
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/40 via-emerald-300/40 to-emerald-500/40 rounded-2xl blur-xl opacity-70 animate-pulse"></div>
          
          <div className="relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg h-full border border-emerald-100 dark:border-emerald-900/30 hover:scale-[1.01] hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold mb-8 text-emerald-600 dark:text-emerald-400">
              İletişim Bilgileri
            </h2>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30 rounded-full mr-4">
                  <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-1 text-emerald-500 dark:text-emerald-300">E-posta</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-lg">info@nurbilgi.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30 rounded-full mr-4">
                  <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-1 text-emerald-500 dark:text-emerald-300">Telefon</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-lg">+90 (212) 123 45 67</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30 rounded-full mr-4">
                  <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-1 text-emerald-500 dark:text-emerald-300">Adres</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-lg">
                    Nur Bilgi
                    <br />
                    Çamlıca, Üsküdar
                    <br />
                    İstanbul, Türkiye
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <h3 className="text-2xl font-medium mb-5 text-emerald-600 dark:text-emerald-400">
                Bizi Takip Edin
              </h3>
              
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-800/50 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>

                <a href="#" className="w-12 h-12 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-800/50 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>

                <a href="#" className="w-12 h-12 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-800/50 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>

                <a href="#" className="w-12 h-12 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-800/50 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Message Form Section */}
        <div className="relative flex flex-col h-full">
          {/* Shimmer effect background */}
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/40 via-emerald-300/40 to-emerald-500/40 rounded-2xl blur-xl opacity-70 animate-pulse"></div>
          
          <div className="relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg h-full border border-emerald-100 dark:border-emerald-900/30 hover:scale-[1.01] hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold mb-8 text-emerald-600 dark:text-emerald-400">
              Bize Mesaj Gönderin
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
                    Adınız Soyadınız *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Adınız ve soyadınız"
                    className="w-full border-slate-300 dark:border-slate-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
                    E-posta Adresiniz *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="E-posta adresiniz"
                    className="w-full border-slate-300 dark:border-slate-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
                    Konu
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    placeholder="Mesajınızın konusu"
                    className="w-full border-slate-300 dark:border-slate-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
                    Mesajınız *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Mesajınızı buraya yazın..."
                    className="w-full min-h-[150px] border-slate-300 dark:border-slate-600"
                  />
                </div>
                
                {errorMessage && (
                  <div className="text-red-500 text-sm">
                    {errorMessage}
                  </div>
                )}
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 dark:bg-emerald-900/30 hover:bg-emerald-600 dark:hover:bg-emerald-800/50 transition-colors"
                  variant="default"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>Gönderiliyor...</>
                  ) : submitSuccess ? (
                    <>
                      <Check className="w-5 h-5" />
                      Mesajınız Gönderildi
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Mesaj Gönder
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageSection>
  );
} 