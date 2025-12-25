"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PostMoreButton from "./PostMoreButton";
import Linkify from "../Linkify";
import UserTooltip from "../UserTooltip";
import * as AvatarComponent from "@/components/ui/avatar";
import { Media } from "@/generated/prisma";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import Comments from "../comments/Comments";
import { MessageSquare } from "lucide-react";
import { useState, MouseEvent } from "react";
import VerifiedBadge from "@/components/VerifiedBadge";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();
  const router = useRouter();
  const [showComments, setShowComments] = useState(false);

  const handleCardClick = (e: MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    const isInteractive = 
      target.closest('a') || 
      target.closest('button') || 
      target.closest('[role="button"]') ||
      target.closest('input') ||
      target.closest('textarea');

    if (!isInteractive) {
      router.push(`/posts/${post.id}`);
    }
  };

  return (
    <article 
      onClick={handleCardClick}
      className="group/post space-y-3 rounded-2xl bg-card/80 backdrop-blur-sm border-b border-border/50 p-5 shadow-sm cursor-pointer hover:bg-card/90 transition-colors"
    >
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link 
              href={`/users/${post.user.username}`}
              onClick={(e) => e.stopPropagation()}
            >
              <AvatarComponent.Avatar>
                <AvatarComponent.AvatarImage
                  src={post.user.avatarUrl as string}
                />
                <AvatarComponent.AvatarFallback>
                  {post.user.username[0]}
                </AvatarComponent.AvatarFallback>
              </AvatarComponent.Avatar>
            </Link>
          </UserTooltip>
          <div>
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="flex items-center gap-1.5 font-medium hover:underline"
                onClick={(e) => e.stopPropagation()}
                suppressHydrationWarning
              >
                {post.user.displayName}
                {post.user.isVerified && <VerifiedBadge size={16} />}
              </Link>
            </UserTooltip>
            <span className="block text-sm text-muted-foreground">
              {formatRelativeDate(post.createdAt)}
            </span>
          </div>
        </div>
        {post.user.id === user.id && (
          <div onClick={(e) => e.stopPropagation()}>
            <PostMoreButton post={post} className="" />
          </div>
        )}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}
      <hr className="text-muted-foreground" />
      <div 
        className="flex justify-between gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count.likes,
              isLikedByUser: post.likes.some((like) => like.userId === user.id),
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
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId === user.id,
            ),
          }}
        />
      </div>
      {showComments && (
        <div onClick={(e) => e.stopPropagation()}>
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
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post._count.comments}{" "}
        <span className="hidden sm:inline">comments</span>
      </span>
    </button>
  );
}