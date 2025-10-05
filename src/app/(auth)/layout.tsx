import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (user) {
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { isOnboarded: true },
    });

    if (fullUser?.isOnboarded) {
      redirect("/");
    } else {
      redirect("/onboarding");
    }
  }

  return <>{children}</>;
}
