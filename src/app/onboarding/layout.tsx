import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = await validateRequest();

    if (!user) {
        redirect("/login");
    }

    // Check if user is already onboarded
    const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { isOnboarded: true }
    });

    if (fullUser?.isOnboarded) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-background">
            {children}
        </div>
    );
}