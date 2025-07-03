import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import ReactQueryProvider from "./ReactQueryProvider";
import { Rubik_Glitch, Spline_Sans_Mono } from "next/font/google";
import DelayedRender from "@/components/ui/DelayedRender";

const rubikGlitch = Rubik_Glitch({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: "400",
});

const splineSansMono = Spline_Sans_Mono({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});


export const metadata: Metadata = {
  title: {
    template: "%s | Align Network",
    default: "Align Network",
  },
  description: "A thought-based matchmaking platform that fosters meaningful connections",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "icon", url: "/logo.svg", type: "image/svg+xml" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${rubikGlitch.variable} ${splineSansMono.variable} font-sans antialiased`}>
        <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
