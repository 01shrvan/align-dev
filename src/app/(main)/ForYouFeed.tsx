"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "@/lib/icons";

export default function ForYouFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/for-you",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-muted-foreground text-lg">
          No posts found in your feed yet.
        </p>
        <p className="text-sm text-muted-foreground">
          Follow more users or add interests to see personalized content!
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive py-8">
        An error occurred while loading your feed.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post: any) => (
        <div key={post.id} className="bg-card rounded-xl border shadow-sm overflow-hidden">
          {post.feedScore && post.feedScore.reasons && post.feedScore.reasons.length > 0 && (
            <div className="px-4 py-2 bg-gradient-to-r from-muted/30 to-transparent border-b border-border/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {post.feedScore.reasons.slice(0, 2).map((reason: any, idx: number) => (
                    <span key={idx} className="flex items-center gap-1">
                      <span className="font-medium text-foreground">
                        {reason.type === 'trending' ? 'Recently posted' : reason.description}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          <Post post={post} />
        </div>
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}