import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import ReactQueryProvider from "./ReactQueryProvider";
import { Playfair_Display, Lato } from "next/font/google";
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "./api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const siteUrl = "https://alignxyz.vercel.app";
const siteTitle = "Align Network";
const siteDescription =
  "Align Network is an exclusive space for people who want meaningful connections. Share your micro-thoughts, match with like-minded souls.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | Align Network",
    default: siteTitle,
  },
  description: siteDescription,
  icons: { icon: "/assets/logo-white.svg" },
  keywords: [
    "social network",
    "meaningful connections",
    "micro-thoughts",
    "like-minded souls",
  ],
  authors: [{ name: "Align Network" }],
  creator: "Align Network",
  publisher: "Align Network",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/assets/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Align Network - Where Thoughts Find Their People",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/assets/opengraph-image.png"],
    creator: "@alignnetwork",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable} antialiased`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
