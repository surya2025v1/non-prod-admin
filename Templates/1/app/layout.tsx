import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import ConditionalLayout from "@/components/conditional-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hindu Temple - Spiritual Journey & Community",
  description: "Experience divine blessings, participate in sacred ceremonies, and connect with our spiritual community. Join us for prayers, festivals, and spiritual growth.",
  keywords: "Hindu temple, spirituality, prayers, festivals, community, meditation, divine blessings",
  openGraph: {
    title: "Hindu Temple - Spiritual Journey & Community",
    description: "Experience divine blessings and spiritual growth in our sacred temple community.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#8b0000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
