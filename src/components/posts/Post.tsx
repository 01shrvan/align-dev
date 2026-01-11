"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate, extractUrls } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PostMoreButton from "./PostMoreButton";
import Linkify from "../Linkify";
import LinkPreview from "../LinkPreview";
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
  const router = useRouter();
  const [showComments, setShowComments] = useState(false);

  if (!post) {
    console.error("Post is undefined");
    return null;
  }

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

  const likeCount = post._count?.likes ?? 0;
  const commentCount = post._count?.comments ?? 0;
  const userLikes = post.likes ?? [];
  const userBookmarks = post.bookmarks ?? [];
  const attachments = post.attachments ?? [];

  const urls = extractUrls(post.content);

  const handlePostClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("a") ||
      target.closest("button") ||
      target.closest("[role='button']") ||
      target.closest("textarea") ||
      target.closest("input") ||
      target.closest("video")
    ) {
      return;
    }

    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      return;
    }

    router.push(`/posts/${post.id}`);
  };

  return (
    <article
      onClick={handlePostClick}
      className="group/post space-y-3 rounded-2xl bg-card/80 backdrop-blur-sm border-b border-border/50 p-5 shadow-sm cursor-pointer"
    >
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
        <div className="whitespace-pre-line break-words overflow-wrap-anywhere">
          {post.content}
        </div>
      </Linkify>
      {attachments.length > 0 && <MediaPreviews attachments={attachments} />}
      {attachments.length === 0 && urls.length > 0 && (
        <LinkPreview url={urls[0]} />
      )}
      <hr className="text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: likeCount,
              isLikedByUser: userLikes.some((like) => like.userId === user.id),
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
            isBookmarkedByUser: userBookmarks.some(
              (bookmark) => bookmark.userId === user.id,
            ),
          }}
        />
      </div>
      {showComments && <Comments post={post} />}
    </article>
  );
}

interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  if (!attachments || attachments.length === 0) {
    return null;
  }

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
  const commentCount = post._count?.comments ?? 0;

  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {commentCount} <span className="hidden sm:inline">comments</span>
      </span>
    </button>
  );
}
