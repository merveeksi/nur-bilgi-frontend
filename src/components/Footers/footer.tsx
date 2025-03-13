import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-emerald-900 dark:bg-slate-900 text-white pt-12 pb-6 border-t border-emerald-700/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo ve Açıklama */}
          <div>
            <h2 className="text-2xl font-bold text-emerald-500 mb-4">Nur Bilgi</h2>
            <p className="text-gray-400 mb-4">
              İslami bilgiye erişimi kolaylaştıran modern ve kullanıcı dostu bir platform. 
              Kur'an, hadis, dua ve daha fazlası için tek adresiniz.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="mailto:info@nurbilgi.com" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Hızlı Bağlantılar */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-emerald-500 transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/kuran" className="text-gray-400 hover:text-emerald-500 transition-colors">
                  Kur'an-ı Kerim
                </Link>
              </li>
              <li>
                <Link href="/hadis" className="text-gray-400 hover:text-emerald-500 transition-colors">
                  Hadisler
                </Link>
              </li>
              <li>
                <Link href="/dua" className="text-gray-400 hover:text-emerald-500 transition-colors">
                  Dualar
                </Link>
              </li>
              <li>
                <Link href="/namaz-vakitleri" className="text-gray-400 hover:text-emerald-500 transition-colors">
                  Namaz Vakitleri
                </Link>
              </li>
              <li>
                <Link href="/ilmihal" className="text-gray-400 hover:text-emerald-500 transition-colors">
                  İlmihal
                </Link>
              </li>
              <li>
                <Link href="/chatbot" className="text-gray-400 hover:text-emerald-500 transition-colors">
                  İslami Chatbot
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim ve Diğer */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">İletişim & Diğer</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hakkimizda" className="text-gray-400 hover:text-emerald-500 transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/gizlilik" className="text-gray-400 hover:text-emerald-500 transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/sss" className="text-gray-400 hover:text-emerald-500 transition-colors">
                  Sık Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-gray-400 hover:text-emerald-500 transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/destek" className="text-gray-400 hover:text-emerald-500 transition-colors">
                  Destek Olun
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Sloganlı Bölüm */}
        <div className="mt-10 border-t border-gray-800 pt-6 text-center">
          <p className="italic text-gray-400 mb-4">
            "Her bilgi aydınlanmaya, her aydınlanma huzura bir adımdır."
          </p>
        </div>

        {/* Telif Hakkı */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-800 mt-6 pt-6">
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