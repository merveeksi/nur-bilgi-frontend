"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gizlilik Politikası</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>
        </div>

        <div className="prose prose-emerald max-w-none dark:prose-invert">
          <h2>1. Giriş</h2>
          <p>
            Nur Bilgi olarak gizliliğinize saygı duyuyor ve kişisel verilerinizin korunmasını önemsiyoruz. Bu gizlilik politikası, 
            platformumuz aracılığıyla toplanan bilgilerin nasıl kullanıldığını ve korunduğunu açıklamaktadır.
          </p>

          <h2>2. Topladığımız Bilgiler</h2>
          <p>
            Platformumuza kayıt olurken ad, soyad ve e-posta adresiniz gibi kişisel bilgilerinizi topluyoruz. Ayrıca platformu 
            kullanımınızla ilgili otomatik olarak bilgiler toplayabiliriz (ziyaret ettiğiniz sayfalar, arama sorguları vb.).
          </p>

          <h2>3. Bilgilerinizi Nasıl Kullanıyoruz</h2>
          <p>
            Topladığımız bilgileri aşağıdaki amaçlarla kullanıyoruz:
          </p>
          <ul>
            <li>Size hizmetlerimizi sunmak ve hesabınızı yönetmek</li>
            <li>Platformumuzu geliştirmek ve içeriklerimizi iyileştirmek</li>
            <li>İletişim kurmak ve duyurularımızı iletmek</li>
            <li>Güvenlik ve doğrulama amacıyla</li>
          </ul>

          <h2>4. Bilgi Paylaşımı</h2>
          <p>
            Kişisel bilgilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmıyoruz:
          </p>
          <ul>
            <li>Yasal zorunluluk durumunda (mahkeme kararı vb.)</li>
            <li>Açık rızanızın olduğu durumlarda</li>
            <li>Hizmetlerimizin sağlanmasına yardımcı olan güvenilir iş ortaklarımızla (bu durumda da verilerinizin güvenliği için gerekli önlemleri alıyoruz)</li>
          </ul>

          <h2>5. Veri Güvenliği</h2>
          <p>
            Kişisel verilerinizin güvenliğini sağlamak için uygun teknik ve organizasyonel önlemler almaktayız. Ancak internet üzerinden 
            veri iletiminin %100 güvenli olduğu garanti edilemez.
          </p>

          <h2>6. Çerezler (Cookies)</h2>
          <p>
            Platformumuz, deneyiminizi iyileştirmek için çerezler kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri devre dışı 
            bırakabilirsiniz, ancak bu durumda bazı hizmetlerimizi tam olarak kullanamayabilirsiniz.
          </p>

          <h2>7. Veri Saklama Süresi</h2>
          <p>
            Kişisel verilerinizi yasal yükümlülüklerimiz gerektirdiği sürece veya hizmetlerimizi sunmak için gerekli olduğu 
            sürece saklarız. Hesabınızı sildiğinizde, verileriniz makul bir süre içinde sistemlerimizden tamamen silinecektir.
          </p>

          <h2>8. Haklarınız</h2>
          <p>
            Kişisel verilerinizle ilgili aşağıdaki haklara sahipsiniz:
          </p>
          <ul>
            <li>Verilerinize erişim ve bunların bir kopyasını alma hakkı</li>
            <li>Verilerinizin düzeltilmesini veya silinmesini talep etme hakkı</li>
            <li>Veri işlemeyi kısıtlama hakkı</li>
            <li>Veri taşınabilirliği hakkı</li>
            <li>İtiraz hakkı</li>
          </ul>

          <h2>9. Politika Değişiklikleri</h2>
          <p>
            Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Değişiklikler yapıldığında, güncellenmiş politikayı platformumuzda 
            yayınlayacağız ve önemli değişiklikler durumunda sizi bilgilendireceğiz.
          </p>

          <h2>10. İletişim</h2>
          <p>
            Gizlilik politikamızla ilgili sorularınız veya talepleriniz için <a href="mailto:info@nurbilgi.com" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">info@nurbilgi.com</a> adresinden 
            bizimle iletişime geçebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
} 