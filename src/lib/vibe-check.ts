import prisma from "@/lib/prisma";
import { getUserDataSelect, type UserData } from "@/lib/types";
import { getEmbedding } from "@/lib/gemini";

export interface VibeMatch extends UserData {
  vibeAlignment: number;
}

async function getOrCreateUserBioVector(userId: string) {
  const userRows = await prisma.$queryRaw<
    Array<{ bio: string | null; embedding: string | null }>
  >`
    SELECT
      bio,
      "bioEmbedding"::text AS embedding
    FROM users
    WHERE id = ${userId}
    LIMIT 1
  `;

  const userRow = userRows[0];

  if (!userRow) {
    return null;
  }

  if (userRow.embedding) {
    return userRow.embedding;
  }

  const bio = userRow.bio?.trim();

  if (!bio) {
    return null;
  }

  let vector: string;

  try {
    const embedding = await getEmbedding(bio);
    vector = `[${embedding.join(",")}]`;

    await prisma.$executeRaw`
      UPDATE users
      SET "bioEmbedding" = ${vector}::vector
      WHERE id = ${userId}
    `;
  } catch (error) {
    console.error("Failed to create bio embedding", error);
    return null;
  }

  return vector;
}

export async function getTopVibeMatches(
  viewerId: string,
  take: number = 5,
): Promise<VibeMatch[]> {
  const viewerVector = await getOrCreateUserBioVector(viewerId);

  if (!viewerVector) {
    return [];
  }

  const rows = await prisma.$queryRaw<
    Array<{ id: string; similarity: number }>
  >`
    SELECT
      u.id,
      1 - (u."bioEmbedding" <=> ${viewerVector}::vector) AS similarity
    FROM users u
    LEFT JOIN follows f
      ON f."followingId" = u.id
      AND f."followerId" = ${viewerId}
    WHERE u.id <> ${viewerId}
      AND u."bioEmbedding" IS NOT NULL
      AND f."followingId" IS NULL
    ORDER BY u."bioEmbedding" <=> ${viewerVector}::vector ASC
    LIMIT ${take}
  `;

  if (!rows.length) {
    return [];
  }

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: rows.map((row) => row.id),
      },
    },
    select: getUserDataSelect(viewerId),
  });

  const usersById = new Map(users.map((user) => [user.id, user]));

  return rows
    .map((row) => {
      const user = usersById.get(row.id);

      if (!user) {
        return null;
      }

      const vibeAlignment = Math.max(
        0,
        Math.min(100, Math.round(row.similarity * 100)),
      );

      return {
        ...user,
        vibeAlignment,
      };
    })
    .filter((user): user is VibeMatch => Boolean(user));
}
