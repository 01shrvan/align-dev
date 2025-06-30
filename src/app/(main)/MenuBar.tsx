"use client";
import {
  Bell,
  Bookmark,
  Home,
  Mail,
  Briefcase,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface MenuBarProps {
  className?: string;
}

const menuItems = [
  { href: "/", icon: Home, label: "Home", title: "Home" },
  { href: "/notifications", icon: Bell, label: "Notifications", title: "Notifications" },
  { href: "/messages", icon: Mail, label: "Messages", title: "Messages" },
  { href: "/bookmarks", icon: Bookmark, label: "Bookmarks", title: "Bookmarks" },
  { href: "/jobs", icon: Briefcase, label: "Jobs", title: "Jobs" },
  { href: "/ava", icon: MessageCircle, label: "Ava", title: "Ava" },
];

export default function MenuBar({ className }: MenuBarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={clsx(
        "flex w-full sm:flex-col sm:w-auto justify-between",
        className
      )}
    >
      {menuItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const IconComponent = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex flex-col sm:flex-row items-center justify-center flex-1 sm:flex-none gap-1 sm:gap-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "text-[rgba(130,230,100,1)]"
                : "text-muted-foreground"
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
