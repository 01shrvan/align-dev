"use client"

import { logout } from "@/app/(auth)/actions"
import { useSession } from "@/app/(main)/SessionProvider"
import { cn } from "@/lib/utils"
import { UserIcon, Bell, Bookmark, Home, Mail, Briefcase, MessageCircle, LogOutIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer"
import * as AvatarComponent from "@/components/ui/avatar"
import { useQueryClient } from "@tanstack/react-query"

interface UserButtonProps {
  className?: string
  unreadNotificationCount?: number
}

const menuItems = [
  { href: "/", icon: Home, label: "Home", title: "Home" },
  { href: "/notifications", icon: Bell, label: "Notifications", title: "Notifications" },
  { href: "/messages", icon: Mail, label: "Messages", title: "Messages" },
  { href: "/bookmarks", icon: Bookmark, label: "Bookmarks", title: "Bookmarks" },
  { href: "/jobs", icon: Briefcase, label: "Jobs", title: "Jobs" },
  { href: "/ava", icon: MessageCircle, label: "Ava", title: "Ava" },
]

export default function UserButton({ className, unreadNotificationCount = 0 }: UserButtonProps) {
  const { user } = useSession()
  const queryClient = useQueryClient()
  const pathname = usePathname()

  return (
    <>
      <div className="hidden sm:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn("flex-none rounded-full", className)}>
              <AvatarComponent.Avatar>
                <AvatarComponent.AvatarImage src={(user.avatarUrl as string) || "/placeholder.svg"} />
                <AvatarComponent.AvatarFallback>{user.username[0]}</AvatarComponent.AvatarFallback>
              </AvatarComponent.Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Logged in as @{user.username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={`/users/${user.username}`}>
              <DropdownMenuItem>
                <UserIcon className="mr-2 size-4" />
                Profile
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="block sm:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <button className={cn("flex-none rounded-full", className)}>
              <AvatarComponent.Avatar>
                <AvatarComponent.AvatarImage src={(user.avatarUrl as string) || "/placeholder.svg"} />
                <AvatarComponent.AvatarFallback>{user.username[0]}</AvatarComponent.AvatarFallback>
              </AvatarComponent.Avatar>
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left pb-4 px-6">
              <DrawerTitle className="flex items-center gap-3">
                <AvatarComponent.Avatar className="h-12 w-12">
                  <AvatarComponent.AvatarImage src={(user.avatarUrl as string) || "/placeholder.svg"} />
                  <AvatarComponent.AvatarFallback>{user.username[0]}</AvatarComponent.AvatarFallback>
                </AvatarComponent.Avatar>
                <div className="flex flex-col">
                  <p className="font-semibold text-lg leading-none">@{user.username}</p>
                  <p className="text-sm text-muted-foreground mt-1">Logged in</p>
                </div>
              </DrawerTitle>
            </DrawerHeader>

            <div className="px-6 pb-6">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                  const IconComponent = item.icon

                  return (
                    <DrawerClose key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium transition-colors w-full text-left",
                          isActive
                            ? "bg-primary/10 text-[rgba(130,230,100,1)]"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <IconComponent
                          size={22}
                          fill={isActive ? "rgba(130, 230, 100, 1)" : "none"}
                          stroke={isActive ? "rgba(130, 230, 100, 1)" : "currentColor"}
                          strokeWidth={1.5}
                          className="shrink-0"
                        />
                        <span className="flex-1">{item.label}</span>
                        {item.href === "/notifications" && unreadNotificationCount > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs px-2.5 py-1 rounded-full min-w-[24px] text-center font-semibold">
                            {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
                          </span>
                        )}
                      </Link>
                    </DrawerClose>
                  )
                })}
              </div>

              <div className="border-t border-border my-6" />

              <div className="space-y-2">
                <DrawerClose asChild>
                  <Link
                    href={`/users/${user.username}`}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full text-left"
                  >
                    <UserIcon size={22} className="shrink-0" />
                    <span className="flex-1">Profile</span>
                  </Link>
                </DrawerClose>

                <DrawerClose asChild>
                  <button
                    onClick={() => {
                      queryClient.clear()
                      logout()
                    }}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left"
                  >
                    <LogOutIcon size={22} className="shrink-0" />
                    <span className="flex-1">Logout</span>
                  </button>
                </DrawerClose>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  )
}