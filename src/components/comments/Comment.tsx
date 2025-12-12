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

interface CommentProps {
  comment: CommentData;
  postId: string;
}

export default function Comment({ comment, postId }: CommentProps) {
  const { user } = useSession();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="space-y-2">
      <div className="group/comment flex gap-3 py-3">
        <span className="hidden sm:inline">
          <UserTooltip user={comment.user}>
            <Link href={`/users/${comment.user.username}`}>
              <AvatarComponent.Avatar className="mx-auto size-8">
                <AvatarComponent.AvatarImage src={comment.user.avatarUrl as string} />
                <AvatarComponent.AvatarFallback>
                  {comment.user.username[0]}
                </AvatarComponent.AvatarFallback>
              </AvatarComponent.Avatar>
            </Link>
          </UserTooltip>
        </span>
        <div className="flex-1 space-y-2">
          <div>
            <div className="flex items-center gap-1 text-sm">
              <UserTooltip user={comment.user}>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/users/${comment.user.username}`}
                    className="font-semibold hover:underline"
                  >
                    {comment.user.displayName}
                  </Link>
                  {comment.user.isVerified && <VerifiedBadge size={14} />}
                </div>
              </UserTooltip>
              <span className="text-muted-foreground">
                {formatRelativeDate(comment.createdAt)}
              </span>
            </div>

            {comment.parent && (
              <div className="text-xs text-muted-foreground mb-1">
                Replying to @{comment.parent.user.username}
              </div>
            )}

            <div className="break-words overflow-wrap-anywhere">{comment.content}</div>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground">
            <CommentLikeButton
              commentId={comment.id}
              initialState={{
                likes: comment._count.likes,
                isLikedByUser: comment.likes.some(
                  (like) => like.userId === user.id,
                ),
              }}
            />

            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <MessageSquare className="size-4" />
              <span className="text-sm font-medium">Reply</span>
            </button>

            {comment._count.replies > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-sm font-medium hover:text-foreground transition-colors"
              >
                {showReplies ? "Hide" : "Show"} {comment._count.replies}{" "}
                {comment._count.replies === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>

          {showReplyInput && (
            <ReplyInput
              commentId={comment.id}
              postId={postId}
              onCancel={() => setShowReplyInput(false)}
              replyingTo={comment.user.username}
            />
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
        <div className="ml-11 border-l-2 border-border pl-4 space-y-2">
          <CommentReplies commentId={comment.id} postId={postId} />
        </div>
      )}
    </div>
  );
}

function CommentReplies({ commentId, postId }: { commentId: string; postId: string }) {
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
      } finally {
        setLoading(false);
      }
    }
    fetchReplies();
  }, [commentId]);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading replies...</div>;
  }

  return (
    <>
      {replies.map((reply) => (
        <Comment key={reply.id} comment={reply} postId={postId} />
      ))}
    </>
  );
}
