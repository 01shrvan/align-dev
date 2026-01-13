import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (user) {
    if (!user.isVerified) redirect("/verify-email");

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { isOnboarded: true },
    });

    if (fullUser?.isOnboarded) {
      redirect("/home");
    } else {
      redirect("/onboarding");
    }
  }

  return <>{children}</>;
}
