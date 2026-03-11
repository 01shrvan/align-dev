"use server";

import { validateRequest } from "@/auth";
import { getEmbedding } from "@/lib/gemini";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const validatedValues = updateUserProfileSchema.parse(values);

  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const story = validatedValues.story.trim();
  const creating = validatedValues.creating.trim();
  const why = validatedValues.why.trim();
  const bio = [story, creating, why].filter(Boolean).join("\n\n");
  let bioEmbeddingVector: string | null | undefined;

  if (bio) {
    try {
      const embedding = await getEmbedding(bio);
      bioEmbeddingVector = `[${embedding.join(",")}]`;
    } catch (error) {
      console.error("Failed to refresh bio embedding", error);
      bioEmbeddingVector = null;
    }
  } else {
    bioEmbeddingVector = null;
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      displayName: validatedValues.displayName,
      bio: bio || null,
      interests: validatedValues.interests,
    },
    select: getUserDataSelect(user.id),
  });

  if (bioEmbeddingVector !== undefined) {
    await prisma.$executeRaw`
      UPDATE users
      SET "bioEmbedding" = ${bioEmbeddingVector}::vector
      WHERE id = ${user.id}
    `;
  }

  return updatedUser;
}

export async function revalidateUserProfile(username: string) {
  revalidatePath(`/users/${username}`);
}
