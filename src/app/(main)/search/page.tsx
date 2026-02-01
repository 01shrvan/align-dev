import TrendsSidebar from "@/components/TrendsSidebar";
import { Metadata } from "next";
import SearchResults from "./SearchResults";
interface PageProps {
  searchParams: { q: string };
}
export function generateMetadata({ searchParams: { q } }: PageProps): Metadata {
  return {
    title: `Search results for "${q}"`,
  };
}
export default function Page({ searchParams: { q } }: PageProps) {
  return (
    <div className="flex-1 pl-5 ml-5 border-l border-dashed border-border/60">
      <main className="flex w-full min-w-0 min-h-full">
        <div className="w-full min-w-0 space-y-5 border-r border-dashed border-border/60 pr-5 mr-5 min-h-full max-w-5xl mx-auto bg-background/30 rounded-xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] relative">
          <div
            className="absolute inset-0 z-[-1] opacity-[0.03] rounded-xl pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#888 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          <div className="flex-none flex items-center justify-between p-4 border-b border-dashed border-border/60 bg-background/60 backdrop-blur-sm rounded-t-xl">
            <h1 className="line-clamp-2 break-all text-lg font-bold">
              Search: &quot;{q}&quot;
            </h1>
            <div className="text-[10px] text-muted-foreground font-mono bg-secondary/50 px-2 py-1 rounded border border-border/40">
              RESULTS
            </div>
          </div>

          <div className="px-4 sm:px-6 pb-4 sm:pb-6">
            <SearchResults query={q} />
          </div>
        </div>
        <TrendsSidebar />
      </main>
    </div>
  );
}
