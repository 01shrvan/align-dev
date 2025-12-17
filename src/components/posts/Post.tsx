"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import { linkifyMentions } from "@/lib/utils/mentions";
import Image from "next/image";
import Link from "next/link";
import PostMoreButton from "./PostMoreButton";
import Linkify from "../Linkify";
import UserTooltip from "../UserTooltip";
import * as AvatarComponent from "@/components/ui/avatar";
import { Media } from "@/generated/prisma";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import Comments from "../comments/Comments";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import VerifiedBadge from "@/components/VerifiedBadge";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();
  const [showComments, setShowComments] = useState(false);

  if (!post.user) {
    console.error("Post missing user data:", post);
    return (
      <article className="group/post space-y-3 rounded-2xl bg-card/80 backdrop-blur-sm border-b border-border/50 p-5 shadow-sm">
        <div className="text-muted-foreground">
          Unable to load post. User data is missing.
        </div>
      </article>
    );
  }

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card/80 backdrop-blur-sm border-b border-border/50 p-3 sm:p-5 shadow-sm w-full max-w-full overflow-hidden">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <AvatarComponent.Avatar>
                <AvatarComponent.AvatarImage
                  src={post.user.avatarUrl as string}
                />
                <AvatarComponent.AvatarFallback>
                  {post.user.username?.[0] || "?"}
                </AvatarComponent.AvatarFallback>
              </AvatarComponent.Avatar>
            </Link>
          </UserTooltip>
          <div>
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="flex items-center gap-1.5 font-medium hover:underline"
                suppressHydrationWarning
              >
                {post.user.displayName || post.user.username}
                {post.user.isVerified && <VerifiedBadge size={16} />}
              </Link>
            </UserTooltip>
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.user.id === user.id && (
          <PostMoreButton post={post} className="" />
        )}
      </div>
      <Linkify>
        <div
          className="whitespace-pre-line break-words overflow-wrap-anywhere"
          dangerouslySetInnerHTML={{ __html: linkifyMentions(post.content) }}
        />
      </Linkify>
      {!!post.attachments?.length && (
        <MediaPreviews attachments={post.attachments} />
      )}
      <hr className="text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count?.likes || 0,
              isLikedByUser:
                post.likes?.some((like) => like.userId === user.id) || false,
            }}
          />
          <CommentButton
            post={post}
            onClick={() => setShowComments(!showComments)}
          />
        </div>
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser:
              post.bookmarks?.some((bookmark) => bookmark.userId === user.id) ||
              false,
          }}
        />
      </div>
      {showComments && (
        <div className="w-full max-w-full overflow-hidden">
          <Comments post={post} />
        </div>
      )}
    </article>
  );
}

interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((m) => (
        <MediaPreview key={m.id} media={m} />
      ))}
    </div>
  );
}

interface MediaPreviewProps {
  media: Media;
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-lg"
      />
    );
  }

  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-lg"
        />
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
}

interface CommentButtonProps {
  post: PostData;
  onClick: () => void;
}

function CommentButton({ post, onClick }: CommentButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 sm:gap-2 hover:text-foreground transition-colors"
    >
      <MessageSquare className="size-4 sm:size-5" />
      <span className="text-xs sm:text-sm font-medium tabular-nums">
        {post._count?.comments || 0}{" "}
        <span className="hidden sm:inline">comments</span>
      </span>
    </button>
  );
}
