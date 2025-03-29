"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Shield, Lock, CheckCircle } from "lucide-react";

interface ModalButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  text: string;
}

function ModalButton({ onClick, icon, text }: ModalButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors"
    >
      {icon}
      <span className="ml-1">{text}</span>
    </button>
  );
}

export function TermsOfServiceModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ModalButton 
        onClick={() => setIsOpen(true)} 
        icon={<Shield className="h-4 w-4" />} 
        text="Kullanım Şartları" 
      />
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Kullanım Şartları">
        <div className="prose prose-emerald max-w-none dark:prose-invert text-center">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-emerald-50 p-6 dark:bg-emerald-900/20">
              <Shield className="h-24 w-24 text-emerald-500" />
            </div>
          </div>
          
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>
          
          <div className="space-y-8 text-left">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-900/10 dark:bg-emerald-900/5">
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">1. Hizmetlerimize Hoş Geldiniz</h2>
              <div className="mt-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300">
                  Nur Bilgi platformuna hoş geldiniz. Bu kullanım şartları, Nur Bilgi platformunun ("Biz", "Bizim", "Platform") 
                  sunduğu hizmetleri kullanımınızı düzenlemektedir. Platformumuzu kullanarak bu şartları kabul etmiş sayılırsınız.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-900/10 dark:bg-emerald-900/5">
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">2. Hesap Oluşturma ve Güvenlik</h2>
              <div className="mt-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300">
                  Platformumuzu kullanabilmek için bir hesap oluşturmanız gerekmektedir. Hesap bilgilerinizin gizliliğini korumak 
                  sizin sorumluluğunuzdadır. Hesabınızla ilgili herhangi bir güvenlik ihlali durumunda bizi derhal bilgilendirmelisiniz.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-900/10 dark:bg-emerald-900/5">
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">3. Kullanım Koşulları</h2>
              <div className="mt-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300">
                  Platformumuzda sunulan içerikleri kişisel eğitim ve bilgilendirme amacıyla kullanabilirsiniz. İçerikleri izinsiz 
                  çoğaltmak, dağıtmak veya ticari amaçlarla kullanmak yasaktır.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-900/10 dark:bg-emerald-900/5">
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">4. Kullanıcı İçerikleri</h2>
              <div className="mt-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300">
                  Platforma yüklediğiniz içeriklerden siz sorumlusunuz. Telif hakkı ihlali, yasadışı veya platformun amaçlarına 
                  aykırı içerikler yüklememeyi kabul ediyorsunuz.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-900/10 dark:bg-emerald-900/5">
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">5. Hizmet Değişiklikleri</h2>
              <div className="mt-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300">
                  Hizmetlerimizi istediğimiz zaman değiştirme, askıya alma veya sonlandırma hakkını saklı tutarız. Bu durumda 
                  kullanıcıları önceden bilgilendirmeye çalışacağız.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-900/10 dark:bg-emerald-900/5">
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">6. Sorumluluk Sınırlaması</h2>
              <div className="mt-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300">
                  Platformumuz aracılığıyla sunulan bilgilerin doğruluğu için çaba göstermekle birlikte, bu bilgilerin eksiksizliği 
                  veya güncelliği konusunda garanti veremeyiz. Platformun kullanımından doğabilecek her türlü sonuçtan kullanıcı sorumludur.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-900/10 dark:bg-emerald-900/5">
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">7. İletişim</h2>
              <div className="mt-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300">
                  Bu kullanım şartları ile ilgili sorularınız için <a href="mailto:info@nurbilgi.com" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">info@nurbilgi.com</a> adresinden 
                  bizimle iletişime geçebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export function PrivacyPolicyModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ModalButton 
        onClick={() => setIsOpen(true)} 
        icon={<Lock className="h-4 w-4" />} 
        text="Gizlilik Politikası" 
      />
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Gizlilik Politikası">
        <div className="prose prose-emerald max-w-none dark:prose-invert text-center">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-emerald-50 p-6 dark:bg-emerald-900/20">
              <Lock className="h-24 w-24 text-emerald-500" />
            </div>
          </div>
          
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>
          
          <div className="space-y-8 text-left">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-900/10 dark:bg-emerald-900/5">
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">1. Giriş</h2>
              <div className="mt-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300">
                  Nur Bilgi olarak gizliliğinize saygı duyuyor ve kişisel verilerinizin korunmasını önemsiyoruz. Bu gizlilik politikası, 
                  platformumuz aracılığıyla toplanan bilgilerin nasıl kullanıldığını ve korunduğunu açıklamaktadır.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-900/10 dark:bg-emerald-900/5">
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">2. Topladığımız Bilgiler</h2>
              <div className="mt-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300">
                  Platformumuza kayıt olurken ad, soyad ve e-posta adresiniz gibi kişisel bilgilerinizi topluyoruz. Ayrıca platformu 
                  kullanımınızla ilgili otomatik olarak bilgiler toplayabiliriz (ziyaret ettiğiniz sayfalar, arama sorguları vb.).
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-900/10 dark:bg-emerald-900/5">
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">3. Bilgilerinizi Nasıl Kullanıyoruz</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Topladığımız bilgileri aşağıdaki amaçlarla kullanıyoruz:
                  </p>
                </div>
                <ul className="ml-8 space-y-2">
                  <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                    Size hizmetlerimizi sunmak ve hesabınızı yönetmek
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                    Platformumuzu geliştirmek ve içeriklerimizi iyileştirmek
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                    İletişim kurmak ve duyurularımızı iletmek
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                    Güvenlik ve doğrulama amacıyla
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-900/10 dark:bg-emerald-900/5">
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">4. Bilgi Paylaşımı</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Kişisel bilgilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmıyoruz:
                  </p>
                </div>
                <ul className="ml-8 space-y-2">
                  <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                    Yasal zorunluluk durumunda (mahkeme kararı vb.)
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                    Açık rızanızın olduğu durumlarda
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                    Hizmetlerimizin sağlanmasına yardımcı olan güvenilir iş ortaklarımızla
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-900/10 dark:bg-emerald-900/5">
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">5. Veri Güvenliği</h2>
              <div className="mt-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300">
                  Kişisel verilerinizin güvenliğini sağlamak için uygun teknik ve organizasyonel önlemler almaktayız. Ancak internet üzerinden 
                  veri iletiminin %100 güvenli olduğu garanti edilemez.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-900/10 dark:bg-emerald-900/5">
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">6. Çerezler (Cookies)</h2>
              <div className="mt-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300">
                  Platformumuz, deneyiminizi iyileştirmek için çerezler kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri devre dışı 
                  bırakabilirsiniz, ancak bu durumda bazı hizmetlerimizi tam olarak kullanamayabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
} 