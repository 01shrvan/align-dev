import type React from "react";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import Navbar from "./Navbar";
import MenuBar from "./MenuBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) {
    redirect("/login");
  }

  return (
    <SessionProvider value={session}>
      <SidebarProvider>
        <div className="flex min-h-screen flex-col w-full">
          <Navbar />
          <div className="flex w-full flex-1 overflow-hidden">
            <AppSidebar />
            <main className="flex-1 flex min-h-0 flex-col overflow-auto">
              <div className="mx-auto flex w-full max-w-7xl grow pt-5 flex-1">
                <div className="flex-1 flex min-h-0 w-full">{children}</div>
              </div>
            </main>
          </div>
          <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t p-3 sm:hidden bg-card/80 backdrop-blur-md border-t-border/60" />
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
