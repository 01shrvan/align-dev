import type React from "react";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import Navbar from "./Navbar";
import MenuBar from "./MenuBar";

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
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow pt-5">
          <MenuBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-xl px-3 py-5 shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] sm:block lg:px-5 xl:w-80 bg-background/30 backdrop-blur-sm border border-border/40" />
          <div className="flex-1 flex min-h-0">{children}</div>
        </div>
        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t p-3 sm:hidden bg-card/80 backdrop-blur-md border-t-border/60" />
      </div>
    </SessionProvider>
  );
}
