import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prod 料金システム',
  description: '料金シミュレーションシステム',
  generator: 'Prod Pricing System',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
