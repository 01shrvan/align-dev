"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { onboardingSchema, OnboardingValues } from "@/lib/validation";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function completeOnboarding(
    data: OnboardingValues,
): Promise<{ error?: string; success?: boolean }> {
    try {
        const { user } = await validateRequest();

        if (!user) {
            return { error: "Unauthorized" };
        }

        const validatedData = onboardingSchema.parse(data);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                displayName: validatedData.displayName,
                bio: validatedData.bio,
                interests: validatedData.interests,
                location: validatedData.location,
                age: validatedData.age,
                gender: validatedData.gender,
                occupation: validatedData.occupation,
                isOnboarded: true,
            },
        });

        return redirect("/");
    } catch (error) {
        if (isRedirectError(error)) throw error;
        console.error(error);
        return {
            error: "Something went wrong. Please try again.",
        };
    }
}