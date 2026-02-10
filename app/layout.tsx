import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/providers/query-provider'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'High School Portal 1 - College Football Recruiting',
  description: 'Connect with college football coaches. Find contact information for 3,400+ verified coaches across FBS, FCS, and Division II.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <QueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#12141a',
                border: '1px solid #2a2d35',
                color: '#ffffff',
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  )
}
