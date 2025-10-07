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

    const bio = [
      validatedData.story,
      validatedData.creating,
      validatedData.why,
    ]
      .filter(Boolean)
      .join("\n\n");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        displayName: validatedData.displayName,
        bio: bio || validatedData.bio,
        interests: validatedData.interests,
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