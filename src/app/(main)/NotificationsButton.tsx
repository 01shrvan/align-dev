"use client";

import kyInstance from "@/lib/ky";
import { NotificationCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface NotificationsButtonProps {
  initialState: NotificationCountInfo;
}

export default function NotificationsButton({
  initialState,
}: NotificationsButtonProps) {
  const pathname = usePathname();

  const { data } = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: () =>
      kyInstance
        .get("/api/notifications/unread-count")
        .json<NotificationCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  const isActive = pathname.startsWith("/notifications");

  return (
    <Link
      href="/notifications"
      className={clsx(
        "flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start flex-1 sm:flex-none gap-1 sm:gap-3 py-2 text-sm font-medium transition-colors",
        isActive ? "text-[rgba(130,230,100,1)]" : "text-muted-foreground",
      )}
      title="Notifications"
    >
      <div className="relative">
        <Bell
          size={20}
          fill={isActive ? "rgba(130, 230, 100, 1)" : "none"}
          stroke={isActive ? "rgba(130, 230, 100, 1)" : "currentColor"}
          strokeWidth={1.5}
          className="shrink-0"
        />
        {!!data.unreadCount && (
          <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
            {data.unreadCount}
          </span>
        )}
      </div>
      <span className="hidden sm:inline">Notifications</span>
    </Link>
  );
}
