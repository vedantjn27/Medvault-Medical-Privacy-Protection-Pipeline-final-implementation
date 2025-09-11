import type React from "react"
import type { Metadata } from "next"
import { Open_Sans, Work_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { PrefsProvider } from "@/components/prefs-context"
import { AppHeader } from "@/components/app-header"

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
})

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
})

export const metadata: Metadata = {
  title: "MedVault",
  description: "Healthcare Document Privacy Dashboard",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={`font-sans ${openSans.variable} ${workSans.variable}`}>
        <PrefsProvider>
          <AppHeader />
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </PrefsProvider>
      </body>
    </html>
  )
}
