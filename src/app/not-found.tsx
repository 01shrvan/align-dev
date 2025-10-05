"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-logo {
          animation: spin-slow 5s linear infinite;
        }
        .number-shadow {
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-16">
            <h1 className="text-xl text-muted-foreground font-light tracking-wide">
              The page you are looking for does not exist
            </h1>
          </div>

          <div className="mb-16">
            <div className="flex items-center justify-center text-[10rem] md:text-[16rem] lg:text-[20rem] font-black text-foreground leading-none tracking-tighter number-shadow">
              <span className="select-none">4</span>
              <div className="mx-8 md:mx-12 lg:mx-16 flex items-center justify-center">
                <Image
                  src={logo || "/placeholder.svg"}
                  alt="Align Network Logo"
                  width={80}
                  height={80}
                  className="spin-logo md:w-26 md:h-26 lg:w-34 lg:h-34 drop-shadow-lg"
                />
              </div>
              <span className="select-none">4</span>
            </div>
          </div>

          <div>
            <Button
              asChild
              size="lg"
              className="h-14 px-12 text-base font-semibold tracking-wide bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Link href="/">Explore Feed</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
