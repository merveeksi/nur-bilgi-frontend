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
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {/* Navbar */}
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-[calc(100%-2rem)]">
              <Navbar />
            </div>
            
            {/* Main content with top padding for navbar */}
            <div className="pt-24">
              <ThemeSwitcher />
              <SocialSidebar />
              {children}
            </div>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
