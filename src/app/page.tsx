import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import LandingPage from "@/components/LandingPage";

export default async function Home() {
  const { user } = await validateRequest();

  if (user) {
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

  return <LandingPage />;
}