"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SSSPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>("kullanim");
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({});

  // Kategorilere göre sıkça sorulan sorular
  const faqCategories = [
    { id: "kullanim", title: "Site Kullanımı" },
    { id: "hesap", title: "Hesap Bilgileri" },
    { id: "ozellikler", title: "Özellikler" },
    { id: "gizlilik", title: "Gizlilik" },
    { id: "iletisim", title: "İletişim" },
  ];

  // SSS listesi
  const faqs = [
    // Site Kullanımı
    {
      id: "kullanim1",
      category: "kullanim",
      question: "Nur Bilgi platformunu nasıl kullanabilirim?",
      answer: "Nur Bilgi platformu kullanıcı dostu arayüzü ile İslami bilgi, dua, hadis, namaz vakitleri ve daha fazlasına erişmenizi sağlar. Üst menüdeki sekmelerden istediğiniz bölüme gidebilir, arama yapabilir ve kişiselleştirilmiş içerikler oluşturabilirsiniz."
    },
    {
      id: "kullanim2",
      category: "kullanim",
      question: "Mobil cihazlardan erişim sağlayabilir miyim?",
      answer: "Evet, Nur Bilgi platformu tamamen mobil uyumludur. Telefonunuz veya tabletiniz üzerinden tüm özelliklere erişebilirsiniz. Tarayıcınızdan siteye girmeniz yeterlidir, ayrıca bir uygulama indirmenize gerek yoktur."
    },
    {
      id: "kullanim3",
      category: "kullanim",
      question: "Chatbot'u nasıl kullanabilirim?",
      answer: "Chatbot'a ana menüdeki 'Chatbot' seçeneğine tıklayarak ulaşabilirsiniz. Dini sorularınızı yazabilir ve anında cevap alabilirsiniz. Chatbot İslami konularda size yardımcı olmak için tasarlanmıştır ve Kur'an, hadis ve güvenilir İslami kaynaklara dayanarak yanıtlar verir."
    },
    {
      id: "kullanim4",
      category: "kullanim",
      question: "Namaz vakitlerini nasıl öğrenebilirim?",
      answer: "Namaz vakitleri bölümüne üst menüden 'Namaz Vakitleri' seçeneğine tıklayarak ulaşabilirsiniz. Konumunuzu paylaşarak bulunduğunuz yere özel namaz vakitlerini görebilir, hatırlatıcı kurabilir ve takvim görünümüne erişebilirsiniz."
    },
    
    // Hesap Bilgileri
    {
      id: "hesap1",
      category: "hesap",
      question: "Nur Bilgi'ye nasıl üye olabilirim?",
      answer: "Sağ üst köşedeki 'Kaydol' butonuna tıklayarak üyelik formunu doldurabilirsiniz. E-posta adresiniz, şifreniz ve temel bilgilerinizle hızlıca üye olabilirsiniz. Üyelik tamamen ücretsizdir."
    },
    {
      id: "hesap2",
      category: "hesap",
      question: "Şifremi unuttum, ne yapmalıyım?",
      answer: "Giriş sayfasındaki 'Şifremi Unuttum' bağlantısına tıklayıp e-posta adresinizi girerek şifre sıfırlama bağlantısı alabilirsiniz. E-postanıza gelen bağlantıyı takip ederek yeni bir şifre oluşturabilirsiniz."
    },
    {
      id: "hesap3",
      category: "hesap",
      question: "Hesap bilgilerimi nasıl güncelleyebilirim?",
      answer: "Giriş yaptıktan sonra sağ üst köşedeki profil menüsünden 'Hesap Ayarlarım' seçeneğine tıklayarak kişisel bilgilerinizi, e-posta adresinizi ve şifrenizi güncelleyebilirsiniz."
    },
    {
      id: "hesap4",
      category: "hesap",
      question: "Hesabımı nasıl silebilirim?",
      answer: "Hesabınızı silmek için 'Hesap Ayarlarım' sayfasının en altında bulunan 'Hesabımı Sil' butonunu kullanabilirsiniz. Bu işlem geri alınamaz ve tüm verilerinizi siler, bu nedenle dikkatli olmanızı öneririz."
    },
    
    // Özellikler
    {
      id: "ozellik1",
      category: "ozellikler",
      question: "Not alma özelliği nasıl kullanılır?",
      answer: "Not alma özelliğine üst menüden 'Notlarım' seçeneğine tıklayarak ulaşabilirsiniz. Burada yeni not ekleyebilir, mevcut notlarınızı düzenleyebilir, kategorilere ayırabilir ve arama yapabilirsiniz. Notlarınız otomatik olarak kaydedilir ve sadece sizin erişiminize açıktır."
    },
    {
      id: "ozellik2",
      category: "ozellikler",
      question: "Dua ve sureleri nasıl favorilerime ekleyebilirim?",
      answer: "Dua ve sure sayfalarında her içeriğin yanında bir kalp simgesi bulunur. Bu simgeye tıklayarak içeriği favorilerinize ekleyebilirsiniz. Favorilerinize 'Favorilerim' menüsünden erişebilirsiniz."
    },
    {
      id: "ozellik3",
      category: "ozellikler",
      question: "Kur'an okuma özelliği neler sunuyor?",
      answer: "Kur'an bölümünde sure ve ayet okuyabilir, Arapça metin, meal ve tefsir bilgilerine erişebilirsiniz. Ayrıca sesli okuma özelliği ile Kur'an'ı dinleyebilir, sayfa işaretleyebilir ve notlar alabilirsiniz."
    },
    {
      id: "ozellik4",
      category: "ozellikler",
      question: "İlmihal bölümünde neler bulabilirim?",
      answer: "İlmihal bölümünde İslam'ın temel konuları, ibadetler, günlük hayatta dikkat edilmesi gereken dini kurallar ve önemli bilgiler yer almaktadır. Bu bölüm farklı ilmihal kaynaklarından derlenmiş kapsamlı bir bilgi kaynağıdır."
    },
    
    // Gizlilik
    {
      id: "gizlilik1",
      category: "gizlilik",
      question: "Verilerim nasıl korunuyor?",
      answer: "Nur Bilgi, kullanıcı verilerinin gizliliğine büyük önem verir. Kişisel bilgileriniz şifrelenerek saklanır ve üçüncü taraflarla paylaşılmaz. Detaylı bilgi için gizlilik politikamızı inceleyebilirsiniz."
    },
    {
      id: "gizlilik2",
      category: "gizlilik",
      question: "Kişisel notlarım başkaları tarafından görülebilir mi?",
      answer: "Hayır, notlarınız tamamen özeldir ve sadece siz görebilirsiniz. Notlarınız güvenli bir şekilde saklanır ve platformun başka kullanıcıları veya yöneticileri tarafından görüntülenemez."
    },
    
    // İletişim
    {
      id: "iletisim1",
      category: "iletisim",
      question: "Sorularımı veya önerilerimi nasıl iletebilirim?",
      answer: "Sorularınızı ve önerilerinizi iletişim formumuz üzerinden veya info@nurbilgi.com e-posta adresimize göndererek iletebilirsiniz. En kısa sürede size dönüş yapacağız."
    },
    {
      id: "iletisim2",
      category: "iletisim",
      question: "Nur Bilgi ekibinde kimler var?",
      answer: "Nur Bilgi; İslami bilgi, teknoloji ve eğitim alanlarında uzman kişilerden oluşan bir ekip tarafından geliştirilmektedir. Ekibimizde ilahiyatçılar, yazılım geliştiricileri, tasarımcılar ve içerik editörleri bulunmaktadır."
    },
    {
      id: "iletisim3",
      category: "iletisim",
      question: "Nur Bilgi platformunun amacı nedir?",
      answer: "Nur Bilgi, güvenilir İslami bilgiyi modern teknoloji ile buluşturarak Müslümanların günlük hayatlarında ihtiyaç duydukları dini bilgi ve araçlara kolay erişim sağlamayı amaçlamaktadır. Platformumuz, kullanıcı dostu bir arayüzle İslami bilginin herkes için erişilebilir olmasını hedefler."
    },
  ];

  // Arama ve kategori filtrelerine göre SSS'leri filtreleme
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchTerm === "" || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === null || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Soru/cevabı açma-kapama
  const toggleQuestion = (id: string) => {
    setOpenQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-6 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-emerald-500">
          Sıkça Sorulan Sorular
        </h1>
        
        {/* Arama kutusu */}
        <div className="max-w-2xl mx-auto mb-6 relative">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Sorularda ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Kategoriler */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeCategory === null
                ? "bg-emerald-600 text-white font-medium"
                : "bg-white text-slate-800 hover:bg-gray-200 font-medium"
            }`}
          >
            Tümü
          </button>
          
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeCategory === category.id
                  ? "bg-emerald-600 text-white font-medium"
                  : "bg-white text-slate-800 hover:bg-gray-200 font-medium"
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
        
        {/* SSS Accordion */}
        <div className="max-w-3xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white p-6 rounded-lg text-center">
              <p className="text-gray-600">Aramanızla eşleşen soru bulunamadı.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white border border-gray-100 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleQuestion(faq.id)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                  >
                    <h3 className="font-medium text-gray-900">{faq.question}</h3>
                    <ChevronDown
                      className={`h-5 w-5 text-emerald-600 transition-transform ${
                        openQuestions[faq.id] ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  
                  {openQuestions[faq.id] && (
                    <div className="px-6 py-4 bg-emerald-50 border-t border-gray-100">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* İletişim CTA */}
        <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-lg text-center border border-gray-100">
          <h2 className="text-xl font-bold text-emerald-700 mb-2">Sorunuzu bulamadınız mı?</h2>
          <p className="text-gray-600 mb-4">
            Merak ettiğiniz diğer sorular için chatbot'umuzu kullanabilir veya bizimle iletişime geçebilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a href="/chatbot" className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
              Chatbot'a Sor
            </a>
            <a href="/iletisim" className="px-4 py-2 bg-white text-slate-800 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
              İletişime Geç
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 