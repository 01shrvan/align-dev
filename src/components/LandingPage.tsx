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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <main className="bg-background text-foreground">
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/30 backdrop-blur-md border-b border-dashed border-border/60 transition-all duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
                    <Image src={logo} alt="Align Network Logo" />
                  </div>
                  <span className="font-thunder text-2xl font-semibold transition-colors duration-300 group-hover:text-accent">
                    Align Network
                  </span>
                </Link>
              </div>

              <div className="hidden md:flex items-center">
                <Link href="/login">
                  <Button className="bg-accent text-background hover:bg-accent/90 font-sans transition-all duration-300 hover:scale-105 rounded-md">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  className="transition-transform duration-300 hover:rotate-12"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5 transition-transform duration-300" />
                  ) : (
                    <Menu className="h-5 w-5 transition-transform duration-300" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-background/30 border-b border-dashed border-border/60 animate-slide-down">
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-4">
                  <Link href="/login" className="w-full">
                    <Button className="w-full bg-accent text-background hover:bg-accent/90 font-sans transition-all duration-300 hover:scale-105 rounded-md">
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
          <div className="grid lg:grid-cols-12 gap-8 space-y-12 sm:gap-10 items-center">
            <div className="lg:col-span-7" data-animate>
              <span className="inline-flex items-center rounded-full border border-dashed border-border/60 px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-sans opacity-0 animate-fade-in-up delay-100 bg-background/30">
                No followers. No gatekeeping.
              </span>

              <h1 className="mt-6 sm:mt-8 font-thunder font-bold text-6xl sm:text-7xl opacity-0 animate-fade-in-up delay-200 leading-tight">
                Your ideas <span className="text-accent">matter</span>, not your clout.
              </h1>

              <p className="mt-6 max-w-xl text-sm sm:text-base text-muted-foreground font-sans opacity-0 animate-fade-in-up delay-300 leading-relaxed">
                Post once. Get discovered by people who vibe with you. On Align, your first reflection has the same reach as your 1000th—because it&apos;s about what you said, not who you are.
              </p>

              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up delay-400">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-accent text-background hover:bg-accent/90 font-sans transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-md"
                  >
                    Start reflecting
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5" data-animate>
              <div className="relative mx-auto w-full max-w-sm opacity-0 animate-fade-in-up delay-500">
                <div className="relative group">
                  <div className="absolute inset-0 h-64 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-dashed border-accent/20 transform transition-all duration-500 group-hover:scale-105"></div>

                  <div className="relative h-64 bg-background/30 rounded-xl border border-dashed border-border/60 p-6 overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl backdrop-blur-sm">
                    <div
                      className="absolute inset-0 z-[-1] opacity-[0.03] rounded-xl pointer-events-none"
                      style={{
                        backgroundImage: "radial-gradient(#888 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    ></div>
                    <div className="h-full flex flex-col justify-between opacity-100 relative z-0">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground/70 font-mono font-bold">
                          POST
                        </div>
                        <div className="mt-3 text-sm sm:text-base leading-relaxed">
                          &quot;What if your next post could land you a co-founder, a mentor, or your dream gig—without a single follower?&quot;
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-dashed border-border/40">
                        <span className="text-xs text-muted-foreground">Live now</span>
                        <div className="flex space-x-1.5">
                          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-100"></div>
                          <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-200"></div>
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
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-12" data-animate>
            <div className="lg:col-span-5 opacity-0 animate-fade-in-up">
              <h2 className="font-thunder text-4xl sm:text-5xl leading-tight">The broken system—fixed</h2>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
                LinkedIn buries you without followers. Reddit hides you without karma. Align puts your words on equal ground.
              </p>
            </div>

            <ul className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <li className="group rounded-xl border border-dashed border-border/60 p-5 sm:p-6 bg-background/30 hover:bg-background/50 transition-all duration-300 hover:scale-105 hover:shadow-lg opacity-0 animate-fade-in-up delay-100">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-accent transition-transform duration-300 group-hover:scale-125 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium font-thunder text-lg sm:text-xl">
                      Zero gatekeeping
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                      Fresh grad? Career changer? Introvert? Your first post reaches the same feed as everyone else.
                    </p>
                  </div>
                </div>
              </li>
              <li className="group rounded-xl border border-dashed border-border/60 p-5 sm:p-6 bg-background/30 hover:bg-background/50 transition-all duration-300 hover:scale-105 hover:shadow-lg opacity-0 animate-fade-in-up delay-200">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-accent transition-transform duration-300 group-hover:scale-125 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium font-thunder text-lg sm:text-xl">
                      Reflections {">"} résumés
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                      Share a thought, not a personal brand. We match on tone, tags, and vibes—no follower count required.
                    </p>
                  </div>
                </div>
              </li>
              <li className="group rounded-xl border border-dashed border-border/60 p-5 sm:p-6 bg-background/30 hover:bg-background/50 transition-all duration-300 hover:scale-105 hover:shadow-lg opacity-0 animate-fade-in-up delay-300">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-accent transition-transform duration-300 group-hover:scale-125 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium font-thunder text-lg sm:text-xl">
                      Instant alignment
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                      Post at 2 a.m. about your weird side project. Wake up to replies from people who actually get it.
                    </p>
                  </div>
                </div>
              </li>
              <li className="group rounded-xl border border-dashed border-border/60 p-5 sm:p-6 bg-background/30 hover:bg-background/50 transition-all duration-300 hover:scale-105 hover:shadow-lg opacity-0 animate-fade-in-up delay-400">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-accent transition-transform duration-300 group-hover:scale-125 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium font-thunder text-lg sm:text-xl">
                      No algorithm games
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                      We don't boost "influencers." We surface resonance. Every reflection has a fair shot at discovery.
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2" data-animate>
            <div className="rounded-xl space-y-5 border border-dashed border-border/60 p-6 sm:p-8 bg-background/30 hover:bg-background/50 transition-all duration-300 hover:scale-105 opacity-0 animate-fade-in-up delay-100">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono font-bold">
                For Gen Z & Early-Career
              </span>
              <h3 className="font-thunder text-3xl sm:text-4xl leading-tight">
                Skip the follower grind
              </h3>
              <ul className="space-y-3 text-sm sm:text-base text-muted-foreground font-sans">
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Post once, find your circle overnight</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Land internships via shared vibes, not cold DMs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>No need to "build a brand" before you're heard</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-dashed border-border/60 p-6 sm:p-8 bg-background/30 hover:bg-background/50 transition-all duration-300 hover:scale-105 opacity-0 animate-fade-in-up delay-200">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono font-bold">
                For Niche Creators
              </span>
              <h3 className="mt-4 font-thunder text-3xl sm:text-4xl leading-tight">
                Discover collaborators instantly
              </h3>
              <ul className="mt-5 space-y-3 text-sm sm:text-base text-muted-foreground font-sans">
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Share WIPs—get aligned feedback, not vanity likes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Find co-founders who vibe with your mission</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Turn reflections into paid gigs</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section
          className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16"
          data-animate
        >
          <div className="rounded-xl border border-dashed border-border/60 px-6 py-10 sm:px-8 sm:py-12 md:px-10 md:py-16 text-center hover:shadow-lg hover:bg-background/40 transition-all duration-300 hover:scale-105 opacity-0 animate-fade-in-up bg-background/30 relative overflow-hidden">
            <div
              className="absolute inset-0 z-[-1] opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#888 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            ></div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground/80 font-mono font-bold mb-4">
              Tired of shouting into the void?
            </p>
            <h2 className="font-thunder text-5xl sm:text-7xl lg:text-8xl font-extrabold uppercase leading-tight">
              Get <span className="text-accent">aligned</span> today
            </h2>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
              Post your first reflection. Find people who vibe with it. No followers required.
            </p>
            <div className="mt-8 sm:mt-10 flex justify-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-accent text-background hover:bg-accent/90 font-sans transition-all duration-300 hover:scale-110 hover:shadow-xl rounded-md"
                >
                  Start reflecting
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <p className="mt-6 sm:mt-8 text-xs text-muted-foreground/60 font-sans">
              Crafted by Shrvan
            </p>
          </div>
        </section>

        <footer className="border-t border-dashed border-border/60 bg-background/30 backdrop-blur-sm py-6 sm:py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">
              <div className="flex items-center gap-2 group">
                <div className="relative w-5 h-5 transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={logo}
                    alt="Align Network Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-thunder transition-colors duration-300 group-hover:text-accent">
                  Align Network
                </span>
              </div>

              <div className="flex items-center gap-6 sm:gap-4 text-xs text-muted-foreground">
                <Link
                  href="https://x.com/NetworkAli56631"
                  className="hover:text-accent transition-all duration-300 hover:scale-125"
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
                  className="hover:text-accent transition-all duration-300 hover:scale-125"
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
                  className="hover:text-accent transition-all duration-300 hover:scale-125"
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

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          opacity: 1 !important;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </>
  );
}
