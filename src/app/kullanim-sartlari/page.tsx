"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <Link
          href="/kayit"
          className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Kayıt sayfasına dön
        </Link>
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kullanım Şartları</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>
        </div>

        <div className="prose prose-emerald max-w-none dark:prose-invert">
          <h2>1. Hizmetlerimize Hoş Geldiniz</h2>
          <p>
            Nur Bilgi platformuna hoş geldiniz. Bu kullanım şartları, Nur Bilgi platformunun ("Biz", "Bizim", "Platform") 
            sunduğu hizmetleri kullanımınızı düzenlemektedir. Platformumuzu kullanarak bu şartları kabul etmiş sayılırsınız.
          </p>

          <h2>2. Hesap Oluşturma ve Güvenlik</h2>
          <p>
            Platformumuzu kullanabilmek için bir hesap oluşturmanız gerekmektedir. Hesap bilgilerinizin gizliliğini korumak 
            sizin sorumluluğunuzdadır. Hesabınızla ilgili herhangi bir güvenlik ihlali durumunda bizi derhal bilgilendirmelisiniz.
          </p>

          <h2>3. Kullanım Koşulları</h2>
          <p>
            Platformumuzda sunulan içerikleri kişisel eğitim ve bilgilendirme amacıyla kullanabilirsiniz. İçerikleri izinsiz 
            çoğaltmak, dağıtmak veya ticari amaçlarla kullanmak yasaktır.
          </p>

          <h2>4. Kullanıcı İçerikleri</h2>
          <p>
            Platforma yüklediğiniz içeriklerden siz sorumlusunuz. Telif hakkı ihlali, yasadışı veya platformun amaçlarına 
            aykırı içerikler yüklememeyi kabul ediyorsunuz.
          </p>

          <h2>5. Hizmet Değişiklikleri</h2>
          <p>
            Hizmetlerimizi istediğimiz zaman değiştirme, askıya alma veya sonlandırma hakkını saklı tutarız. Bu durumda 
            kullanıcıları önceden bilgilendirmeye çalışacağız.
          </p>

          <h2>6. Sorumluluk Sınırlaması</h2>
          <p>
            Platformumuz aracılığıyla sunulan bilgilerin doğruluğu için çaba göstermekle birlikte, bu bilgilerin eksiksizliği 
            veya güncelliği konusunda garanti veremeyiz. Platformun kullanımından doğabilecek her türlü sonuçtan kullanıcı sorumludur.
          </p>

          <h2>7. İletişim</h2>
          <p>
            Bu kullanım şartları ile ilgili sorularınız için <a href="mailto:info@nurbilgi.com" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">info@nurbilgi.com</a> adresinden 
            bizimle iletişime geçebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
} 