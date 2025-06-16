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
    <div className="w-full animate-pulse space-y-4 rounded-2xl bg-gradient-to-br from-card/80 via-muted/60 to-background/80 backdrop-blur-sm border border-border/50 p-6 shadow-md">
      <div className="flex flex-wrap gap-4 items-center">
        <Skeleton className="size-12 rounded-full bg-gradient-to-tr from-muted/70 to-primary/30" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 rounded bg-gradient-to-r from-primary/40 to-muted/60" />
          <Skeleton className="h-3 w-20 rounded bg-gradient-to-r from-muted/60 to-primary/30" />
        </div>
      </div>
      <Skeleton className="h-20 rounded-lg bg-gradient-to-r from-muted/40 via-background/60 to-primary/20" />
      <div className="flex gap-3 mt-2">
        <Skeleton className="h-6 w-16 rounded bg-gradient-to-r from-primary/30 to-muted/50" />
        <Skeleton className="h-6 w-10 rounded bg-gradient-to-r from-muted/50 to-primary/20" />
      </div>
    </div>
  );
}