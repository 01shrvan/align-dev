import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.svg";

const features = [
  {
    title: "Discover opportunities",
    description:
      "Access curated conversations and opportunities from people already aligned with your work.",
    icon: Compass,
  },
  {
    title: "Streamlined interactions",
    description:
      "Post once and let relevant people find you without endless profile optimization.",
    icon: MessageSquare,
  },
  {
    title: "Signal-first identity",
    description:
      "Your ideas and consistency carry more weight than vanity metrics.",
    icon: Sparkles,
  },
];

const trustItems = [
  "Student founders",
  "Indie hackers",
  "Creator circles",
  "Startup teams",
  "Design communities",
  "Builder groups",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_8%_8%,hsl(var(--accent)/0.16),transparent_34%),radial-gradient(circle_at_90%_12%,hsl(var(--accent)/0.12),transparent_28%)]" />

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Align Network Logo"
              className="h-8 w-8"
              priority
            />
            <span className="font-thunder text-2xl leading-none">
              Align Network
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#platform"
              className="transition-colors hover:text-foreground"
            >
              Platform
            </a>
          </nav>

          <Link href="/login">
            <Button className="rounded-sm bg-accent text-background hover:bg-accent/90">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main>
        <section className="border-b border-border/60">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-8 lg:py-28">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center rounded-full border border-border/70 bg-card/70 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                The platform for what is next in networking
              </span>

              <h1 className="mt-6 max-w-3xl font-thunder text-5xl leading-[0.88] sm:text-6xl lg:text-7xl">
                Minimal UI.
                <br />
                Maximum signal.
                <br />
                Better outcomes.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Share reflections, get discovered by the right people, and build
                real momentum without follower games.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="rounded-sm bg-accent text-background shadow-[0_14px_34px_hsl(var(--accent)/0.3)] hover:bg-accent/90"
                  >
                    Start showcasing now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button size="lg" variant="outline" className="rounded-sm">
                    Explore platform
                  </Button>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-3 -z-10 rounded-[28px] bg-[linear-gradient(135deg,hsl(var(--accent)/0.28),transparent_38%,hsl(var(--accent)/0.12))] blur-2xl" />

                <div className="rounded-2xl border border-border/70 bg-card/90 p-6 shadow-[0_22px_45px_-30px_hsl(var(--foreground)/0.5)]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      Reflection preview
                    </p>
                    <span className="rounded-full border border-border/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                      Live
                    </span>
                  </div>

                  <blockquote className="mt-5 text-xl leading-relaxed text-card-foreground">
                    &ldquo;What are you building today that could create your
                    next big opportunity?&rdquo;
                  </blockquote>

                  <div className="mt-6 space-y-2 border-t border-border/70 pt-4 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Distribution</span>
                      <span className="text-foreground">Relevance-first</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Follower weighting</span>
                      <span className="text-foreground">Zero</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Output quality</span>
                      <span className="text-foreground">
                        High-intent replies
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/60 bg-card/70 p-3">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      Reach model
                    </p>
                    <p className="mt-2 text-sm">
                      Equal visibility on first posts
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-card/70 p-3">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      Outcome
                    </p>
                    <p className="mt-2 text-sm">Conversations that compound</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="border-b border-border/60 py-10">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Built for high-intent communities
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {trustItems.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-border/60 bg-card/65 px-3 py-2 text-center text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
        >
          <div className="mb-8 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              First layer
            </p>
            <h2 className="mt-3 font-thunder text-4xl sm:text-5xl">
              Clean interface, deliberate structure, better focus.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((item, index) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="group rounded-xl border border-border/60 bg-card/70 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40"
                >
                  <div className="h-28 rounded-lg border border-border/60 bg-gradient-to-br from-accent/20 via-card to-background" />
                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex rounded-lg border border-border/70 bg-background p-2">
                      <Icon className="h-4 w-4 text-accent" />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 font-thunder text-3xl leading-none">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-border/60 bg-card/35">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Start now
              </p>
              <h2 className="mt-3 font-thunder text-4xl leading-[0.92] sm:text-5xl">
                Publish your first reflection and find your people fast.
              </h2>
            </div>

            <Link href="/login" className="shrink-0">
              <Button
                size="lg"
                className="rounded-sm bg-accent text-background hover:bg-accent/90"
              >
                Join Align
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Image src={logo} alt="Align Network Logo" className="h-5 w-5" />
            <span>© {new Date().getFullYear()} Align Network</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://x.com/NetworkAli56631"
              className="hover:text-foreground"
            >
              X
            </Link>
            <Link
              href="https://www.linkedin.com/company/celestia-labs/"
              className="hover:text-foreground"
            >
              LinkedIn
            </Link>
            <Link
              href="https://discord.gg/4dpETE5G"
              className="hover:text-foreground"
            >
              Discord
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
