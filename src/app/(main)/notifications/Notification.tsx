import * as AvatarComponent from "@/components/ui/avatar";
import type { NotificationType } from "@/generated/prisma";
import type { NotificationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Heart, MessageCircle, User2, AtSign, Users, Bell } from "@/lib/icons";
import Link from "next/link";

interface NotificationProps {
  notification: NotificationData;
}

function getNotificationText(notification: NotificationData): string {
  switch (notification.type) {
    case "FOLLOW":
      return "followed you";

    case "LIKE":
      return "liked your post";

    case "COMMENT":
      return "commented on your post";

    case "MENTION":
      return "mentioned you in a post";

    case "ALIGNERS":
      return "mentioned @aligners";

    default:
      return "New notification";
  }
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "FOLLOW":
      return <User2 className="size-5 md:size-7 text-primary" />;

    case "LIKE":
      return <Heart className="size-5 md:size-7 fill-red-500 text-red-500" />;

    case "COMMENT":
      return (
        <MessageCircle className="size-5 md:size-7 fill-primary text-primary" />
      );

    case "MENTION":
      return <AtSign className="size-5 md:size-7 text-primary" />;

    case "ALIGNERS":
      return <Users className="size-5 md:size-7 text-primary" />;

    default:
      return <Bell className="size-5 md:size-7" />;
  }
}

function getNotificationHref(notification: NotificationData): string {
  switch (notification.type) {
    case "FOLLOW":
      return `/users/${notification.issuer.username}`;

    case "LIKE":
    case "COMMENT":
    case "MENTION":
    case "ALIGNERS":
      return `/posts/${notification.postId}`;

    default:
      return "/";
  }
}

export default function Notification({ notification }: NotificationProps) {
  const message = getNotificationText(notification);
  const icon = getNotificationIcon(notification.type);
  const href = getNotificationHref(notification);

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-2 md:gap-3 rounded-2xl bg-card p-3 md:p-5 shadow-sm transition-colors hover:bg-card/70",
          !notification.read && "bg-primary/10",
        )}
      >
        <div className="flex-shrink-0 pt-0.5">{icon}</div>
        <AvatarComponent.Avatar className="size-8 md:size-10 flex-shrink-0">
          <AvatarComponent.AvatarImage
            src={notification.issuer.avatarUrl || ""}
          />
          <AvatarComponent.AvatarFallback>
            {notification.issuer.displayName[0] ||
              notification.issuer.username[0]}
          </AvatarComponent.AvatarFallback>
        </AvatarComponent.Avatar>
        <div className="flex-1 space-y-1 min-w-0">
          <div className="text-sm md:text-base">
            <span className="font-bold">{notification.issuer.displayName}</span>{" "}
            <span>{message}</span>
          </div>
          {notification.post && (
            <div className="line-clamp-2 md:line-clamp-3 whitespace-pre-line text-xs md:text-sm text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
