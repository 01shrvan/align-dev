import { Skeleton } from "../ui/skeleton";

export default function PostsLoadingSkeleton() {
  return (
    <div className="space-y-5">
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
    </div>
  );
}

function PostLoadingSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-4 rounded-2xl bg-card border border-border/40 p-6 shadow-sm">
      <div className="flex flex-wrap gap-4 items-center">
        <Skeleton className="size-12 rounded-full bg-muted" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 rounded bg-muted" />
          <Skeleton className="h-3 w-20 rounded bg-muted/70" />
        </div>
      </div>
      <Skeleton className="h-20 rounded-lg bg-muted/60" />
      <div className="flex gap-3 mt-2">
        <Skeleton className="h-6 w-16 rounded bg-muted/80" />
        <Skeleton className="h-6 w-10 rounded bg-muted/60" />
      </div>
    </div>
  );
}
