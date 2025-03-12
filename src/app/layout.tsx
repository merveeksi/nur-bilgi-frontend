import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

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
    <html lang="tr">
      <body className={poppins.className}>{children}</body>
    </html>
  )
}
