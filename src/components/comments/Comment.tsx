"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { CommentData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import * as AvatarComponent from "@/components/ui/avatar";
import UserTooltip from "../UserTooltip";
import CommentMoreButton from "./CommentMoreButton";
import VerifiedBadge from "@/components/VerifiedBadge";
import CommentLikeButton from "./CommentLikeButton";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import ReplyInput from "./ReplyInput";
import kyInstance from "@/lib/ky";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";

interface CommentProps {
  comment: CommentData;
  postId: string;
}

export default function Comment({ comment, postId }: CommentProps) {
  const { user } = useSession();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const queryClient = useQueryClient();

  return (
    <div className="space-y-2 w-full overflow-hidden">
      <div className="group/comment flex gap-2 sm:gap-3 py-2 sm:py-3 w-full">
        <div className="flex-shrink-0">
          <UserTooltip user={comment.user}>
            <Link href={`/users/${comment.user.username}`}>
              <AvatarComponent.Avatar className="size-6 sm:size-8">
                <AvatarComponent.AvatarImage
                  src={comment.user.avatarUrl as string}
                />
                <AvatarComponent.AvatarFallback>
                  {comment.user.username[0]}
                </AvatarComponent.AvatarFallback>
              </AvatarComponent.Avatar>
            </Link>
          </UserTooltip>
        </div>
        <div className="flex-1 min-w-0 space-y-2 overflow-hidden">
          <div>
            <div className="flex flex-wrap items-center gap-1 text-xs sm:text-sm">
              <UserTooltip user={comment.user}>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Link
                    href={`/users/${comment.user.username}`}
                    className="font-semibold hover:underline truncate max-w-[120px] sm:max-w-none"
                  >
                    {comment.user.displayName}
                  </Link>
                  {comment.user.isVerified && <VerifiedBadge size={12} />}
                </div>
              </UserTooltip>
              <span className="text-muted-foreground shrink-0">
                {formatRelativeDate(comment.createdAt)}
              </span>
            </div>

            {comment.parent && (
              <div className="text-xs text-muted-foreground mb-1">
                Replying to @{comment.parent.user.username}
              </div>
            )}

            <div className="break-words overflow-wrap-anywhere text-sm sm:text-base mt-1">
              {comment.content}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-muted-foreground text-xs sm:text-sm">
            <CommentLikeButton
              commentId={comment.id}
              initialState={{
                likes: comment._count.likes,
                isLikedByUser: comment.likes.some(
                  (like: { userId: string }) => like.userId === user.id,
                ),
              }}
            />

            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-1 sm:gap-2 hover:text-foreground transition-colors"
            >
              <MessageSquare className="size-3 sm:size-4" />
              <span className="font-medium">Reply</span>
            </button>

            {comment._count.replies > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="font-medium hover:text-foreground transition-colors"
              >
                {showReplies ? "Hide" : "Show"} {comment._count.replies}{" "}
                {comment._count.replies === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>

          {showReplyInput && user && (
            <div className="w-full mt-2">
              <ReplyInput
                commentId={comment.id}
                postId={postId}
                onCancel={() => setShowReplyInput(false)}
                replyingTo={comment.user.username}
                onReplyPosted={() => {
                  setShowReplyInput(false);
                  setShowReplies(true);
                  queryClient.invalidateQueries({
                    queryKey: ["comments", postId],
                  });
                }}
              />
            </div>
          )}
        </div>

        {comment.user.id === user.id && (
          <CommentMoreButton
            comment={comment}
            className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
          />
        )}
      </div>

      {showReplies && comment._count.replies > 0 && (
        <div className="ml-2 sm:ml-4 mt-2 overflow-hidden">
          <CommentReplies commentId={comment.id} postId={postId} />
        </div>
      )}
    </div>
  );
}

function CommentReplies({
  commentId,
  postId,
}: {
  commentId: string;
  postId: string;
}) {
  const [replies, setReplies] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    async function fetchReplies() {
      setLoading(true);
      try {
        const data = await kyInstance
          .get(`/api/comments/${commentId}/replies`)
          .json<CommentData[]>();
        setReplies(data);
      } catch (error) {
        console.error("Failed to fetch replies:", error);
        setReplies([]);
      } finally {
        setLoading(false);
      }
    }
    fetchReplies();
  }, [commentId]);

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">Loading replies...</div>
    );
  }

  return (
    <div className="space-y-0 w-full overflow-hidden">
      {replies.map((reply) => (
        <div
          key={reply.id}
          className="border-l-2 border-muted/50 pl-2 sm:pl-3 relative w-full overflow-hidden"
        >
          <div className="absolute -left-px top-4 w-2 sm:w-3 h-px bg-muted/50"></div>
          <div className="w-full overflow-hidden">
            <Comment comment={reply} postId={postId} />
          </div>
        </div>
      ))}
    </div>
  );
}
