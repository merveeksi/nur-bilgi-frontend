'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getCurrentUser } from '@/services/authService';

// Üyelik planları
const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Temel Plan',
    price: '29.99',
    features: [
      'Aylık 50 AI soru hakkı',
      'Soru-cevap geçmişi',
      'Sınırsız ayet ve hadis arama',
    ],
    recommended: false,
    period: 'ay',
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: '79.99',
    features: [
      'Aylık 200 AI soru hakkı',
      'Öncelikli cevaplama',
      'Gelişmiş ayet ve hadis açıklamaları',
      'Özel dini içerik erişimi',
      'Tüm kitaplar ve kaynaklara erişim',
    ],
    recommended: true,
    period: 'ay',
  },
  {
    id: 'yearly',
    name: 'Yıllık Plan',
    price: '599.99',
    features: [
      'Sınırsız AI soru hakkı',
      'Tüm Premium Plan özellikleri',
      '2 ay ücretsiz kullanım',
      'Özel AI danışmanlık desteği',
    ],
    recommended: false,
    period: 'yıl',
  },
];

export default function MembershipPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  
  // Kullanıcı giriş yapmış mı kontrol et
  const isLoggedIn = isAuthenticated();
  const currentUser = getCurrentUser();
  
  // Ödeme işlemini simüle eden fonksiyon
  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      router.push('/giris?redirect=profilim/uyelik');
      return;
    }
    
    setIsProcessing(true);
    
    // Ödeme entegrasyonu burada yapılacak (Stripe, iyzico, vs.)
    // Bu örnek için sadece bir gecikme ekleyeceğiz
    setTimeout(() => {
      setIsProcessing(false);
      
      // Başarılı ödeme sonrası
      alert('Üyelik işleminiz başarıyla tamamlandı!');
      router.push('/chatbot');
    }, 2000);
  };
  
  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-500 mb-4">
            Üyelik Planları
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Lütfen üyelik planlarını görüntülemek için giriş yapın
          </p>
          <div className="mt-6">
            <Link 
              href="/giris?redirect=profilim/uyelik"
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 
              transition-all duration-300 text-lg font-medium"
            >
              Giriş Yap
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-500 mb-4">
          Premium Üyelik Planları
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Dini AI Chatbot'umuzun tüm özelliklerine erişim için aşağıdaki premium planlarımızdan birini seçin.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {subscriptionPlans.map((plan) => (
          <div 
            key={plan.id}
            className={`rounded-xl overflow-hidden border transition-all 
            ${selectedPlan === plan.id 
              ? 'border-emerald-500 shadow-lg shadow-emerald-100 dark:shadow-emerald-900/30 scale-105 z-10' 
              : 'border-gray-200 dark:border-gray-700'
            }
            ${plan.recommended ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-white dark:bg-slate-800'}
            `}
          >
            {plan.recommended && (
              <div className="bg-emerald-600 text-white text-center py-1 font-medium">
                Önerilen Plan
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                {plan.name}
              </h3>
              
              <div className="mb-4">
                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {plan.price}₺
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">/{plan.period}</span>
              </div>
              
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-5 w-5 text-emerald-500 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full py-2 px-4 rounded-lg border transition-colors
                  ${selectedPlan === plan.id
                    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                    : 'bg-white text-emerald-600 border-emerald-600 hover:bg-emerald-50 dark:bg-transparent dark:text-emerald-400 dark:border-emerald-500 dark:hover:bg-emerald-900/20'
                  }
                `}
              >
                {selectedPlan === plan.id ? 'Seçildi' : 'Seç'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="max-w-md mx-auto bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            Ödeme Özeti
          </h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Seçilen plan:</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {subscriptionPlans.find(p => p.id === selectedPlan)?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Fiyat:</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {subscriptionPlans.find(p => p.id === selectedPlan)?.price}₺/{subscriptionPlans.find(p => p.id === selectedPlan)?.period}
              </span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 my-3 pt-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-800 dark:text-white">Toplam:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {subscriptionPlans.find(p => p.id === selectedPlan)?.price}₺
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full py-3 px-4 bg-emerald-600 text-white rounded-lg 
              hover:bg-emerald-700 transition-colors duration-300
              disabled:opacity-70 disabled:cursor-not-allowed
              flex items-center justify-center font-medium"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                İşleniyor...
              </>
            ) : (
              'Şimdi Satın Al'
            )}
          </button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
            Satın alma işleminizle birlikte, <a href="#" className="text-emerald-600 dark:text-emerald-400 underline">hizmet şartlarımızı</a> ve <a href="#" className="text-emerald-600 dark:text-emerald-400 underline">gizlilik politikamızı</a> kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
} 