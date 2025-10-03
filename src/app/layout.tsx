import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "sonner"
import { ServiceWorkerRegistration } from "@/components/service-worker-registration"
import ReactQueryProvider from "./ReactQueryProvider"
import { Playfair_Display, Lato } from "next/font/google"
import { extractRouterConfig } from "uploadthing/server"
import { fileRouter } from "./api/uploadthing/core"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://align-network.01shrvan.tech"),
  title: {
    template: "%s | Align Network",
    default: "Align Network",
  },
  description:
    "Align Network is an exclusive space for people who want meaningful connections. Share your micro-thoughts, match with like-minded souls.",
  icons: { icon: "/assets/logo-white.svg" },
  openGraph: {
    type: "website",
    url: "https://align-network.01shrvan.tech",
    images: ["/assets/opengraph-image.png"],
    description:
      "Align Network is an exclusive space for people who want meaningful connections. Share your micro-thoughts, match with like-minded souls.",
    siteName: "Align Network",
    locale: "en_US",
  },
  manifest: "/manifest.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* <head>
        <link rel="icon" href="/favicon.ico" />
      </head> */}
      <body className={`${playfair.variable} ${lato.variable} antialiased`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster />
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
