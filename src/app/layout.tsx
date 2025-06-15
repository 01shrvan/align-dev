import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ReactQueryProvider from "./ReactQueryProvider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}