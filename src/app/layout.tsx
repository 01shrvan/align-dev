import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "sonner"
import ReactQueryProvider from "./ReactQueryProvider"
import { Rubik_Glitch, Spline_Sans_Mono } from "next/font/google"
import { extractRouterConfig } from "uploadthing/server"
import { fileRouter } from "./api/uploadthing/core"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"

const rubikGlitch = Rubik_Glitch({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: "400",
})

const splineSansMono = Spline_Sans_Mono({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: {
    template: "%s | Align Network",
    default: "Align Network",
  },
  description: "A thought-based matchmaking platform that fosters meaningful connections",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "icon", url: "/logo.svg", type: "image/svg+xml" },
    { rel: "apple-touch-icon", url: "/logo.svg" },
  ],
  openGraph: {
    title: "Align Network",
    description: "A thought-based matchmaking platform that fosters meaningful connections",
    url: "https://align-network.01shrvan.tech",
    siteName: "Align Network",
    images: [
      {
        url: "/logo.png",
                width: 1200,
        height: 630,
        alt: "Align Network Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@AlignNetwork",
    title: "Align Network",
    description: "A thought-based matchmaking platform that fosters meaningful connections",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${rubikGlitch.variable} ${splineSansMono.variable} font-sans antialiased`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
