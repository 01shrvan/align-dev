import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, MessageSquare, Sparkles } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.svg";

const pillars = [
  {
    title: "Clarity in Public",
    description: "Post one sharp thought and let signal do the matching.",
    icon: Compass,
  },
  {
    title: "Conversations that Matter",
    description: "Replies are built for ideas, not empty engagement loops.",
    icon: MessageSquare,
  },
  {
    title: "Momentum by Consistency",
    description: "Small daily posts compound into real opportunities.",
    icon: Sparkles,
  },
];

const notionFaces = [
  {
    src: "https://api.dicebear.com/9.x/notionists/svg?seed=Ari&backgroundColor=fde68a",
    position: "left-[26px] top-0",
  },
  {
    src: "https://api.dicebear.com/9.x/notionists/svg?seed=Kai&backgroundColor=bfdbfe",
    position: "right-0 top-[26px]",
  },
  {
    src: "https://api.dicebear.com/9.x/notionists/svg?seed=Nia&backgroundColor=fbcfe8",
    position: "left-[26px] bottom-0",
  },
  {
    src: "https://api.dicebear.com/9.x/notionists/svg?seed=Zoe&backgroundColor=c7d2fe",
    position: "left-0 top-[26px]",
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background font-sans text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(80rem_40rem_at_50%_-10%,hsl(var(--accent)/0.18),transparent_70%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background)))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]" />

      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Align Network Logo"
              className="h-8 w-8"
              priority
            />
            <span className="text-xl font-semibold tracking-tight">
              Align Network
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#why" className="transition-colors hover:text-foreground">
              Why
            </a>
            <a
              href="#pillars"
              className="transition-colors hover:text-foreground"
            >
              How
            </a>
          </nav>

          <Link href="/login">
            <Button className="h-10 gap-1 rounded-lg px-4 text-sm font-medium">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main>
        <section id="why" className="border-b border-border/50">
          <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
            <div className="mx-auto max-w-5xl text-center">
              <span className="inline-flex items-center rounded-full border border-border/70 bg-card/70 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Minimal social for high-agency people
              </span>

              <h1 className="mt-7 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                Think in public.
                <br />
                Get found faster.
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                Align is where builders publish sharp reflections, attract the
                right people, and build momentum without chasing trends.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link href="/login">
                  <Button className="h-10 gap-1 rounded-lg px-5 text-sm font-medium">
                    Start Posting
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  asChild
                  variant="outline"
                  className="h-10 rounded-lg border-gray-600 bg-black px-5 text-sm font-medium text-foreground hover:bg-gray-900 hover:text-foreground"
                >
                  <a href="#pillars">See The Flow</a>
                </Button>
              </div>

              <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  [
                    "Daily clarity",
                    "Publish one build insight, experiment result, or lesson in under 120 words.",
                  ],
                  [
                    "Real dialogue",
                    "Get feedback from builders working on similar problems and stages.",
                  ],
                  [
                    "Compounding trust",
                    "Each post becomes proof of thinking and execution people can trust.",
                  ],
                ].map((item) => (
                  <div
                    key={item[0]}
                    className="rounded-2xl border border-border/60 bg-card/60 p-5"
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                      {item[0]}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed">{item[1]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="pillars"
          className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        >
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
              Less feed. More fit.
            </h2>
          </div>

          <div className="grid auto-rows-[minmax(170px,_auto)] gap-4 md:grid-cols-6">
            <article className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 md:col-span-4 md:row-span-2">
              <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-accent/20 blur-3xl" />
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Intent signal
              </p>
              <h3 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Your voice finds aligned people.
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Post one thought. Align routes it to people with matching
                interests and context.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="relative h-20 w-20 rounded-full border border-border/70 bg-background/80">
                  <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/70 bg-card" />
                  {notionFaces.map((face) => (
                    <div
                      key={face.src}
                      className={`absolute h-7 w-7 overflow-hidden rounded-full border border-border/70 bg-background ${face.position}`}
                    >
                      <img
                        src={face.src}
                        alt="Notion-style avatar"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-border/60 bg-card/60 p-6 md:col-span-2 md:row-span-2">
              <div className="flex h-full flex-col">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Match quality
                </p>
                <p className="mt-3 text-5xl font-semibold leading-none tracking-tight">
                  92%
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Higher relevance than random feed discovery.
                </p>
                <div className="mt-auto h-2 rounded-full bg-background">
                  <div className="h-full w-[92%] rounded-full bg-foreground dark:bg-accent" />
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-border/60 bg-card/60 p-6 md:col-span-3">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Conversation depth
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Build threads that move ideas forward, not just reactions.
              </p>
              <div className="mt-5 rounded-xl border border-border/70 bg-background/70 p-4 text-sm">
                "This was the first post that brought me three high-quality
                intros in one day."
              </div>
            </article>

            <article className="rounded-2xl border border-border/60 bg-card/60 p-6 md:col-span-3">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Compounding reach
              </p>
              <p className="mt-3 text-5xl font-semibold leading-none tracking-tight">
                30 days
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                of consistent posting can reshape your network surface area.
              </p>
            </article>

            {pillars.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="group rounded-2xl border border-border/60 bg-card/55 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-foreground/30 md:col-span-2"
                >
                  <div className="inline-flex rounded-xl border border-border/70 bg-background p-2.5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-tight">
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
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Publish one sharp thought today.
              </h2>
            </div>

            <Link href="/login" className="shrink-0">
              <Button className="h-10 gap-1 rounded-lg px-5 text-sm font-medium">
                Join Align
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Image src={logo} alt="Align Network Logo" className="h-5 w-5" />
            <span>(c) {new Date().getFullYear()} Align Network</span>
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
