import type { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { LenisProvider } from "@/components/landing/lenis-provider"
import { Providers } from "@/components/providers"

export const metadata: Metadata = {
  title: "Clara Monét | Portrait Photography East London",
  description:
    "A natural light portrait photography studio in East London for founders, families, and quiet professionals. Considered direction, natural light, limited sessions.",
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        inter.variable,
        fraunces.variable,
        "font-sans"
      )}
    >
      <body>
        <LenisProvider>
          <Providers>
            <TooltipProvider>{children}</TooltipProvider>
          </Providers>
        </LenisProvider>
        <Toaster />
      </body>
    </html>
  )
}
