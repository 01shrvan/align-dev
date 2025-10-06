import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function JobsAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { isOnboarded: true },
  });

  if (!fullUser?.isOnboarded) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-background flex justify-center items-start p-5">
      <div className="w-full max-w-3xl">{children}</div>
    </div>
  );
}
