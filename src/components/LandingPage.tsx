"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Sparkles, MessageSquare, ShieldCheck, Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import logo from "@/assets/logo.svg"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => setIsLoaded(true), [])

  return (
    <main className="bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                  <Image
                    src={logo}
                    alt="Align Network Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-serif text-lg tracking-tight">Align Network</span>
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
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 sm:pb-16 md:pb-20">
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center rounded-full border border-border/40 px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground font-sans">
              New way to connect
            </span>

            <h1 className="mt-4 sm:mt-6 font-serif text-[clamp(2rem,6vw,4.5rem)] leading-[1.05] tracking-tight">
              Think. Match. <span className="text-accent">Align.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm sm:text-base text-muted-foreground font-sans">
              Align helps you find meaningful connections by matching on the way you think and create—not just looks.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/login">
                <Button size="lg" className="bg-accent text-background hover:bg-accent/90 rounded-sm font-sans">
                  explore feed
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

                  <div className={`h-full flex flex-col justify-between transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground/70 font-sans">Thought Profile</div>
                      <div className="mt-2 text-lg font-serif">Creative. Thoughtful. Curious.</div>
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-accent/40"></div>
                        <div className="w-2 h-2 rounded-full bg-accent/60"></div>
                        <div className="w-2 h-2 rounded-full bg-accent/80"></div>
                      </div>
                      <div className="text-xs text-muted-foreground/70">align-network</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 border-t border-border/40 flex items-center justify-center">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3">
            <p className="text-xl uppercase tracking-wider text-muted-foreground font-sans">Ready to find your match?</p>
            <div className="mt-2 sm:mt-0">
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-serif text-[clamp(1.5rem,3vw,2rem)] leading-tight">
              Built for depth, creativity, and real connection
            </h2>
            <p className="mt-3 text-sm text-muted-foreground font-sans">
              A lightweight, modern experience that highlights what matters most: your ideas and your craft.
            </p>
          </div>

          <ul className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <li className="group rounded-lg border border-border/40 p-4 hover:border-accent/30 transition-colors">
              <div className="flex items-center gap-3">
                <Brain className="h-4 w-4 text-accent" />
                <h3 className="font-medium font-sans">Thought Profiles</h3>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-sans">Share how you think with short prompts and themes.</p>
            </li>
            <li className="group rounded-lg border border-border/40 p-4 hover:border-accent/30 transition-colors">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-accent" />
                <h3 className="font-medium font-sans">Creative Showcase</h3>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-sans">Highlight your art, music, and side projects.</p>
            </li>
            <li className="group rounded-lg border border-border/40 p-4 hover:border-accent/30 transition-colors">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-accent" />
                <h3 className="font-medium font-sans">Deeper Matches</h3>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-sans">Skip small talk. Match on ideas and values.</p>
            </li>
            <li className="group rounded-lg border border-border/40 p-4 hover:border-accent/30 transition-colors">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <h3 className="font-medium font-sans">Privacy First</h3>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-sans">You control what you share and with whom.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border/40 p-4 sm:p-6">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans">For Gen Z</span>
            <h3 className="mt-2 font-serif text-xl sm:text-2xl tracking-tight">Authenticity over everything</h3>
            <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground font-sans">
              <li>Show who you are beyond photos</li>
              <li>Connect through shared ideas</li>
              <li>Find your creative circle</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/40 p-4 sm:p-6">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans">For Creators</span>
            <h3 className="mt-2 font-serif text-xl sm:text-2xl tracking-tight">Find your creative match</h3>
            <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground font-sans">
              <li>Share work in progress safely</li>
              <li>Be discovered for your craft</li>
              <li>Collaborate with aligned minds</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="rounded-lg border border-border/40 px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 text-center">
          <p className="text-xs uppercase tracking-wider text-muted-foreground/80 font-sans mb-2">Ready to find your match?</p>
          <h2 className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight">
            Get <span className="text-accent">aligned</span> today
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground font-sans">
            Experience a new way to connect. Matches based on what really matters.
          </p>
          <div className="mt-4 sm:mt-6">
            <Link href="/login">
              <Button size="lg" className="bg-accent text-background hover:bg-accent/90 rounded-sm font-sans">
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
              <span className="text-sm font-serif">Align Network</span>
            </div>

            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link href="#" className="hover:text-accent transition-colors">Terms</Link>
              <Link href="#" className="hover:text-accent transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-accent transition-colors">Contact</Link>
            </div>

            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Align Network
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
