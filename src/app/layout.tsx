import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import dynamic from 'next/dynamic'
import Footer from '@/components/Footers/footer'
import SocialSidebar from '@/components/Icons/SocialSidebar'
import ThemeSwitcher from '@/components/ThemeSwitcher'

// Navbar bileşenini dinamik olarak import ediyoruz
const Navbar = dynamic(() => import('@/components/Headers/navbar'), {
  ssr: false
})

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nur Bilgi - İslami Bilgi Platformu',
  description: 'İslami bilgi ve kaynaklara kolay erişim için kapsamlı platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-slate-950`}>
        <ThemeProvider>
          <AuthProvider>
            {/* Navbar - arka plan rengi ve pozisyonu düzeltildi */}
            <div className="sticky top-0 z-50 w-full px-4 py-2">
              <Navbar />
            </div>
            
            {/* Main content - üst paddingden kurtulduk */}
            <main className="min-h-screen">
              <ThemeSwitcher />
              <SocialSidebar />
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
