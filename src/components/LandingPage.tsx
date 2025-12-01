"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Brain,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.svg";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setIsLoaded(true), []);

  return (
    <main className="bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8">
                  <Image src={logo} alt="Align Network Logo" />
                </div>
                <span className="font-thunder text-3xl font-semibold">
                  Align Network
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center">
              <Link href="/login">
                <Button className="bg-accent text-background hover:bg-accent/90 rounded-sm font-sans">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-border/30">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                <Link href="/login" className="w-full">
                  <Button className="w-full bg-accent text-background hover:bg-accent/90 rounded-sm font-sans">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-28 md:pb-36">
        <div className="grid lg:grid-cols-12 gap-6 space-y-12 sm:gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center rounded-full border border-border/40 px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground font-sans">
              New way to connect
            </span>

            <h1 className="mt-4 sm:mt-6 font-thunder font-bold text-7xl">
              Think. Match. <span className="text-accent">Align.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm sm:text-base text-muted-foreground font-sans">
              Align helps you find meaningful connections by matching on the way
              you think and create—not just looks.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-accent text-background hover:bg-accent/90 rounded-sm font-sans"
                >
                  Explore feed
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="relative">
                <div className="absolute top-4 left-4 right-4 h-64 bg-accent/5 rounded-lg border border-accent/10 transform rotate-6"></div>

                <div className="absolute top-2 left-2 right-2 h-64 bg-accent/10 rounded-lg border border-accent/20 transform rotate-3"></div>

                <div className="relative h-64 bg-background rounded-lg border border-border/40 p-6 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-full transform translate-x-10 -translate-y-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-accent/5 rounded-full transform -translate-x-8 translate-y-8"></div>

                  <div
                    className={`h-full flex flex-col justify-between transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                  >
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground/70 font-sans">
                        Thought Profile
                      </div>
                      <div className="mt-2 text-lg font-thunder">
                        Creative. Thoughtful. Curious.
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-accent/40"></div>
                        <div className="w-2 h-2 rounded-full bg-accent/60"></div>
                        <div className="w-2 h-2 rounded-full bg-accent/80"></div>
                      </div>
                      <div className="text-xs text-muted-foreground/70">
                        align-network
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-thunder  text-4xl">
              Built for depth, creativity, and real connection
            </h2>
            <p className="mt-3 text-sm text-muted-foreground font-sans">
              A lightweight, modern experience that highlights what matters
              most: your ideas and your craft.
            </p>
          </div>

          <ul className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <li className="group rounded-lg border border-border/40 p-4 hover:border-accent/30 transition-colors">
              <div className="flex items-center gap-3">
                <Brain className="h-4 w-4 text-accent" />
                <h3 className="font-medium font-thunder text-2xl">
                  Thought Profiles
                </h3>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-sans">
                Share how you think with short prompts and themes.
              </p>
            </li>
            <li className="group rounded-lg border border-border/40 p-4 hover:border-accent/30 transition-colors">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-accent" />
                <h3 className="font-thunder font-medium text-2xl">
                  Creative Showcase
                </h3>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-sans">
                Highlight your art, music, and side projects.
              </p>
            </li>
            <li className="group rounded-lg border border-border/40 p-4 hover:border-accent/30 transition-colors">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-accent" />
                <h3 className="font-medium font-thunder text-2xl">
                  Deeper Matches
                </h3>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-sans">
                Skip small talk. Match on ideas and values.
              </p>
            </li>
            <li className="group rounded-lg border border-border/40 p-4 hover:border-accent/30 transition-colors">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <h3 className="font-medium font-thunder text-2xl">
                  Privacy First
                </h3>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-sans">
                You control what you share and with whom.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <div className="rounded-lg space-y-4 border border-border/40 p-4 sm:p-6">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans">
              For Gen Z
            </span>
            <h3 className="mt-2 font-thunder text-4xl ">
              Authenticity over everything
            </h3>
            <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-1 list-disc list-inside text-xs sm:text-base text-muted-foreground font-sans">
              <li>Show who you are beyond photos</li>
              <li>Connect through shared ideas</li>
              <li>Find your creative circle</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/40 p-4 sm:p-6">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans">
              For Creators
            </span>
            <h3 className="mt-2 font-thunder text-4xl">
              Find your creative match
            </h3>
            <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-1 list-disc list-inside text-xs sm:text-base text-muted-foreground font-sans">
              <li>Share work in progress safely</li>
              <li>Be discovered for your craft</li>
              <li>Collaborate with aligned minds</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="rounded-lg border border-border/40 px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 text-center">
          <p className="text-xs uppercase tracking-wider text-muted-foreground/80 font-sans mb-2">
            Ready to find your match?
          </p>
          <h2 className="font-thunder text-9xl font-extrabold uppercase">
            Get <span className="text-accent">aligned</span> today
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground font-sans">
            Experience a new way to connect. Matches based on what really
            matters.
          </p>
          <div className="mt-4 sm:mt-6">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-accent text-background hover:bg-accent/90 rounded-sm font-sans"
              >
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/30 bg-background/80 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="relative w-5 h-5">
                <Image
                  src={logo}
                  alt="Align Network Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-thunder">Align Network</span>
            </div>

            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link
                href="https://x.com/NetworkAli56631"
                className="hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link
                href="https://www.linkedin.com/company/celestia-labs/"
                className="hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
              <Link
                href="https://discord.gg/4dpETE5G"
                className="hover:text-accent transition-colors"
                aria-label="Discord"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.043.107a14.076 14.076 0 0 0 1.227 1.993a.077.077 0 0 0 .084.028a19.9 19.9 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.156 2.42c0 1.333-.946 2.418-2.156 2.418z" />
                </svg>
              </Link>
            </div>
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Align Network
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
