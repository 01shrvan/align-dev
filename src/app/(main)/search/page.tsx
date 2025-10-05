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
    <div className="flex-1 pl-5 ml-5 border-l border-dashed border-border">
      <main className="flex w-full min-w-0 min-h-full">
        <div className="w-full min-w-0 space-y-5 border-r border-dashed border-border pr-5 mr-5 min-h-full">
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <h1 className="line-clamp-2 break-all text-center text-2xl font-bold">
              Search results for &quot;{q}&quot;
            </h1>
          </div>
          <SearchResults query={q} />
        </div>
        <TrendsSidebar />
      </main>
    </div>
  );
}
