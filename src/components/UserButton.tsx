"use client";

import { logout } from "@/app/(auth)/actions";
import { useSession } from "@/app/(main)/SessionProvider";
import { cn } from "@/lib/utils";
import {
  UserIcon,
  Bell,
  Bookmark,
  Home,
  Mail,
  Briefcase,
  MessageCircle,
  LogOutIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import * as AvatarComponent from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import VerifiedBadge from "@/components/VerifiedBadge";

interface UserButtonProps {
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
    title: "Communities",
  },
  { href: "/jobs", icon: Briefcase, label: "Jobs", title: "Jobs" },
  // { href: "/ava", icon: MessageCircle, label: "Ava", title: "Ava" },
];

export default function UserButton({
  className,
  unreadNotificationCount = 0,
}: UserButtonProps) {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleLogout = () => {
    queryClient.clear();
    logout();
  };

  const DropdownVersion = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex-none rounded-full transition-all duration-200 hover:ring-2 hover:ring-primary/20 hover:ring-offset-2",
            className,
          )}
        >
          <div className="relative">
            <AvatarComponent.Avatar className="h-8 w-8 md:h-9 md:w-9">
              <AvatarComponent.AvatarImage
                src={(user.avatarUrl as string) || "/placeholder.svg"}
                alt={`${user.username}'s avatar`}
              />
              <AvatarComponent.AvatarFallback className="text-xs font-semibold">
                {user.username[0].toUpperCase()}
              </AvatarComponent.AvatarFallback>
            </AvatarComponent.Avatar>
            {unreadNotificationCount > 0 && (
              <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                </span>
              </div>
            )}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-2" sideOffset={8}>
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex items-center gap-3">
            <AvatarComponent.Avatar className="h-10 w-10">
              <AvatarComponent.AvatarImage
                src={(user.avatarUrl as string) || "/placeholder.svg"}
                alt={`${user.username}'s avatar`}
              />
              <AvatarComponent.AvatarFallback className="text-sm font-semibold">
                {user.username[0].toUpperCase()}
              </AvatarComponent.AvatarFallback>
            </AvatarComponent.Avatar>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium">{user.displayName}</span>
                {user.isVerified && <VerifiedBadge size={16} />}
              </div>
              <p className="text-xs text-muted-foreground">View your profile</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <Link href={`/users/${user.username}`}>
          <DropdownMenuItem className="px-3 py-2.5 cursor-pointer">
            <UserIcon className="mr-3 h-4 w-4" />
            Profile
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="px-3 py-2.5 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={handleLogout}
        >
          <LogOutIcon className="mr-3 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const DrawerVersion = () => (
    <Drawer>
      <DrawerTrigger asChild>
        <button className={cn("flex-none rounded-full", className)}>
          <div className="relative">
            <AvatarComponent.Avatar className="h-8 w-8">
              <AvatarComponent.AvatarImage
                src={(user.avatarUrl as string) || "/placeholder.svg"}
                alt={`${user.username}'s avatar`}
              />
              <AvatarComponent.AvatarFallback className="text-xs font-semibold">
                {user.username[0].toUpperCase()}
              </AvatarComponent.AvatarFallback>
            </AvatarComponent.Avatar>
            {unreadNotificationCount > 0 && (
              <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                </span>
              </div>
            )}
          </div>
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh] h-auto">
        <DrawerHeader className="text-left pb-3 px-4 sm:px-6 border-b border-border">
          <DrawerTitle className="flex items-center gap-3 sm:gap-4">
            <AvatarComponent.Avatar className="h-12 w-12 sm:h-14 sm:w-14">
              <AvatarComponent.AvatarImage
                src={(user.avatarUrl as string) || "/placeholder.svg"}
                alt={`${user.username}'s avatar`}
              />
              <AvatarComponent.AvatarFallback className="text-base sm:text-lg font-semibold">
                {user.username[0].toUpperCase()}
              </AvatarComponent.AvatarFallback>
            </AvatarComponent.Avatar>
            <div className="flex flex-col min-w-0">
              <p className="font-semibold text-lg sm:text-xl leading-none truncate">
                @{user.username}
              </p>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Logged in
              </p>
            </div>
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6 overflow-y-auto">
          <div className="space-y-1 mb-6">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground px-3 py-2">
              Navigation
            </h3>
            {menuItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const IconComponent = item.icon;

              return (
                <DrawerClose key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 sm:gap-4 px-3 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-colors w-full text-left",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted/50",
                    )}
                  >
                    <IconComponent
                      size={20}
                      className={cn(
                        "shrink-0 sm:w-6 sm:h-6",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.href === "/notifications" &&
                      unreadNotificationCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full min-w-[24px] sm:min-w-[28px] text-center font-bold">
                          {unreadNotificationCount > 99
                            ? "99+"
                            : unreadNotificationCount}
                        </span>
                      )}
                  </Link>
                </DrawerClose>
              );
            })}
          </div>

          <div className="border-t border-border my-4 sm:my-6" />

          <div className="space-y-1">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground px-3 py-2">
              Account
            </h3>

            <DrawerClose asChild>
              <Link
                href={`/users/${user.username}`}
                className="flex items-center gap-3 sm:gap-4 px-3 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full text-left active:bg-muted/50"
              >
                <UserIcon size={20} className="shrink-0 sm:w-6 sm:h-6" />
                <span className="flex-1">Profile</span>
              </Link>
            </DrawerClose>

            <DrawerClose asChild>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 sm:gap-4 px-3 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left active:bg-red-100"
              >
                <LogOutIcon size={20} className="shrink-0 sm:w-6 sm:h-6" />
                <span className="flex-1">Logout</span>
              </button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );

  return isMobile ? <DrawerVersion /> : <DropdownVersion />;
}
