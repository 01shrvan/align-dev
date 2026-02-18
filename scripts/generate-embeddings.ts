import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "../src/generated/prisma";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();

async function main() {
  const { getEmbedding } = await import("../src/lib/gemini");

  console.log("Starting embedding generation for all users...");

  const users = await prisma.user.findMany({
    where: {
      AND: [{ bio: { not: null } }, { bio: { not: "" } }],
    },
    select: {
      id: true,
      bio: true,
    },
  });

  console.log(`Found ${users.length} users with bios.`);

  for (const user of users) {
    if (!user.bio) continue;

    try {
      console.log(`Generating embedding for user: ${user.id}`);
      const embedding = await getEmbedding(user.bio);

      const vectorString = `[${embedding.join(",")}]`;

      await prisma.$executeRaw`
        UPDATE users
        SET "bioEmbedding" = ${vectorString}::vector
        WHERE id = ${user.id}
      `;

      console.log(`Successfully updated embedding for user: ${user.id}`);
    } catch (error) {
      console.error(`Failed to generate embedding for user ${user.id}:`, error);
    }
  }

  console.log("Finished generating embeddings.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
