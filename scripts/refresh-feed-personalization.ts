import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "../src/generated/prisma";
import {
  needsFeedPersonalizationRefresh,
  refreshFeedPersonalization,
} from "../src/lib/ai/feed-personalization";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();

function getTakeArgument(defaultValue: number): number {
  const takeIndex = process.argv.findIndex((arg) => arg === "--take");
  if (takeIndex === -1) {
    return defaultValue;
  }

  const rawValue = process.argv[takeIndex + 1];
  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    throw new Error("--take must be a positive number");
  }

  return Math.floor(parsedValue);
}

async function main() {
  const forceRefresh = process.argv.includes("--force");
  const take = getTakeArgument(100);

  const users = await prisma.user.findMany({
    select: {
      id: true,
      interests: true,
      aiSuggestedInterests: true,
      persona: true,
      personaTraits: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const targetUsers = forceRefresh
    ? users.slice(0, take)
    : users.filter((user) => needsFeedPersonalizationRefresh(user)).slice(0, take);

  console.log(
    `Refreshing feed personalization for ${targetUsers.length} users${forceRefresh ? " (force mode)" : ""}`,
  );

  let successCount = 0;
  let failedCount = 0;

  for (const targetUser of targetUsers) {
    try {
      await refreshFeedPersonalization(targetUser.id);
      successCount += 1;
      console.log(`Refreshed ${targetUser.id}`);
    } catch (error) {
      failedCount += 1;
      console.error(`Failed ${targetUser.id}`, error);
    }
  }

  console.log(`Done. Success: ${successCount}, Failed: ${failedCount}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
