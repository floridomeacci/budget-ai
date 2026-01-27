import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BudgetThuis AI Creative Studio',
  description: 'AI-powered creative dashboard for BudgetThuis marketing assets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
