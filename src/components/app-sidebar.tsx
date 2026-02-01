"use client"

import {
  Bell,
  Bookmark,
  Home,
  Briefcase,
  MessageCircle,
  Users,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import NotificationsButton from "@/app/(main)/NotificationsButton"
import { logout } from "@/app/(auth)/actions"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  unreadNotificationCount?: number
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
    title: "Communities",
  },
  { href: "/jobs", icon: Briefcase, label: "Jobs", title: "Jobs" },
  { href: "/chat", icon: MessageCircle, label: "Ava", title: "Ava" },
]

export function AppSidebar({ unreadNotificationCount = 0 }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      side="left"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
              const IconComponent = item.icon

              if (item.isNotifications) {
                return (
                  <SidebarMenuItem key={item.href}>
                    <NotificationsButton
                      initialState={{ unreadCount: unreadNotificationCount }}
                      className={clsx(
                        "w-full flex items-center justify-start gap-3 px-2 py-1.5 text-sm font-medium transition-colors rounded-md",
                        isActive
                          ? "text-[rgba(130,230,100,1)] bg-sidebar-accent/30"
                          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/20",
                      )}
                    />
                  </SidebarMenuItem>
                )
              }

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link
                      href={item.href}
                      className={clsx(
                        "gap-3",
                        isActive && "text-[rgba(130,230,100,1)]"
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
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              onClick={async () => {
                await logout()
              }}
            >
              <button className="w-full text-left gap-3">
                <LogOut size={20} className="shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
