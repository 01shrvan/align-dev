import kyInstance from "@/lib/ky";
import { CommentsPage, PostData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import Comment from "./Comment";
import CommentInput from "./CommentInput";

interface CommentsProps {
  post: PostData;
}

export default function Comments({ post }: CommentsProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/posts/${post.id}/comments`,
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<CommentsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  return (
    <div className="space-y-2 sm:space-y-3 w-full max-w-full overflow-hidden">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block text-xs sm:text-sm"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load previous comments
        </Button>
      )}
      {status === "pending" && (
        <Loader2 className="mx-auto animate-spin size-4 sm:size-5" />
      )}
      {status === "success" && !comments.length && (
        <p className="text-center text-muted-foreground text-sm">
          No comments yet.
        </p>
      )}
      {status === "error" && (
        <p className="text-center text-destructive text-sm">
          An error occurred while loading comments.
        </p>
      )}
      <div className="divide-y divide-border/50 w-full overflow-hidden">
        {comments.map((comment) => (
          <div key={comment.id} className="w-full overflow-hidden">
            <Comment comment={comment} postId={post.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
