import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import ThemeSwitcher from '@/components/ThemeSwitcher'

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Nur Bilgi - İslami Bilgi ve İbadet Destek Platformu',
  description: 'İslami sorularınızı sorun, ilmihal bilgilerini inceleyin, ezan vakitlerini takip edin, dua ve Kur\'an okuyun.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider>
          <AuthProvider>
            <ThemeSwitcher />
            <SocialSidebar />
            <main>
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
