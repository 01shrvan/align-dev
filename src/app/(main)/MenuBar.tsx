"use client";
import {
  Bell,
  Bookmark,
  Home,
  Briefcase,
  MessageCircle,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import NotificationsButton from "./NotificationsButton";

interface MenuBarProps {
  className?: string;
  unreadNotificationCount?: number;
}

const menuItems = [
  { href: "/home", icon: Home, label: "Home", title: "Home" },
  {
    href: "/notifications",
    icon: Bell,
    label: "Notifications",
    title: "Notifications",
    isNotifications: true,
  },
  {
    href: "/bookmarks",
    icon: Bookmark,
    label: "Bookmarks",
    title: "Bookmarks",
  },
  {
    href: "/communities",
    icon: Users,
    label: "Communities",
  },
  { href: "/jobs", icon: Briefcase, label: "Jobs", title: "Jobs" },
  { href: "/chat", icon: MessageCircle, label: "Ava", title: "Ava" },
];

export default function MenuBar({
  className,
  unreadNotificationCount = 0,
}: MenuBarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex w-full sm:flex-col sm:w-auto justify-between relative",
        className,
        pathname === "/chat" && "sm:hidden",
      )}
    >
      <div
        className="absolute inset-0 z-[-1] opacity-[0.03] rounded-xl pointer-events-none hidden sm:block"
        style={{
          backgroundImage: "radial-gradient(#888 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>
      {menuItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const IconComponent = item.icon;

        if (item.isNotifications) {
          return (
            <NotificationsButton
              key={item.href}
              initialState={{ unreadCount: unreadNotificationCount }}
              className={cn(
                "flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start flex-1 sm:flex-none gap-1 sm:gap-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "text-[rgba(130,230,100,1)]"
                  : "text-muted-foreground",
              )}
            />
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start flex-1 sm:flex-none gap-1 sm:gap-3 py-2 text-sm font-medium transition-colors",
              isActive ? "text-[rgba(130,230,100,1)]" : "text-muted-foreground",
            )}
            title={item.title}
          >
            <IconComponent
              size={20}
              fill={isActive ? "rgba(130, 230, 100, 1)" : "none"}
              stroke={isActive ? "rgba(130, 230, 100, 1)" : "currentColor"}
              strokeWidth={1.5}
              className="shrink-0"
            />
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
