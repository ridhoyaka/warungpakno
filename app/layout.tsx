import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Warung Pak No',
  description: 'Warung Kremesan & Penyetan Pak No - Enak, Renyah, Terjangkau',
  icons: {
    icon: '/logopakno.jpeg',
    apple: '/logopakno.jpeg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  )
}
