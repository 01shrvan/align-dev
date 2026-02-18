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

  const bio = validatedValues.bio?.trim();
  let bioEmbeddingVector: string | null | undefined;

  if (typeof validatedValues.bio === "string") {
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
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: validatedValues,
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
