import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

interface UserWithAnalysis {
  id: string;
  username: string;
  displayName: string;
  lastAIAnalysis: Date | null;
  persona: string | null;
}

async function debugPersonaCooldown(): Promise<void> {
  try {
    console.log("🔍 Debugging persona analysis cooldown...\n");

    const usersWithAnalysis = await prisma.user.findMany({
      where: {
        lastAIAnalysis: {
          not: null,
        },
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        lastAIAnalysis: true,
        persona: true,
      },
      orderBy: {
        lastAIAnalysis: "desc",
      },
    });

    if (usersWithAnalysis.length === 0) {
      console.log("✅ No users found with persona analysis history.");
      return;
    }

    console.log(
      `Found ${usersWithAnalysis.length} user(s) with analysis history:\n`,
    );

    for (const user of usersWithAnalysis) {
      const lastAnalysis = user.lastAIAnalysis;
      const hoursSinceLastAnalysis = lastAnalysis
        ? (Date.now() - lastAnalysis.getTime()) / (1000 * 60 * 60)
        : 0;

      const canAnalyze = hoursSinceLastAnalysis >= 24;
      const hoursRemaining = canAnalyze
        ? 0
        : Math.ceil(24 - hoursSinceLastAnalysis);

      console.log(`👤 User: ${user.displayName} (@${user.username})`);
      console.log(`   ID: ${user.id}`);
      console.log(
        `   Last Analysis: ${lastAnalysis?.toISOString() || "Never"}`,
      );
      console.log(`   Hours Since: ${hoursSinceLastAnalysis.toFixed(2)}`);
      console.log(`   Can Analyze: ${canAnalyze ? "✅ Yes" : "❌ No"}`);
      if (!canAnalyze) {
        console.log(`   Hours Remaining: ${hoursRemaining}`);
      }
      console.log(`   Has Persona: ${user.persona ? "✅ Yes" : "❌ No"}`);
      console.log("");
    }

    const args = process.argv.slice(2);
    if (args.includes("--reset") && args.includes("--user")) {
      const userIdIndex = args.indexOf("--user") + 1;
      const userId = args[userIdIndex];

      if (userId) {
        console.log(`🔄 Resetting cooldown for user: ${userId}`);

        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { lastAIAnalysis: null },
          select: {
            id: true,
            username: true,
            displayName: true,
            lastAIAnalysis: true,
          },
        });

        console.log(
          `✅ Cooldown reset successfully for ${updatedUser.displayName}`,
        );
        console.log(
          `   Last Analysis is now: ${updatedUser.lastAIAnalysis || "null"}`,
        );
      }
    }

    if (args.includes("--reset-all")) {
      console.log("🔄 Resetting cooldown for all users...");

      const result = await prisma.user.updateMany({
        where: {
          lastAIAnalysis: {
            not: null,
          },
        },
        data: {
          lastAIAnalysis: null,
        },
      });

      console.log(`✅ Reset cooldown for ${result.count} users`);
    }
  } catch (error) {
    console.error("❌ Error debugging persona cooldown:", error);
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv.length === 2) {
  console.log("🔧 Persona Analysis Cooldown Debug Tool");
  console.log("");
  console.log("Usage:");
  console.log(
    "  tsx scripts/debug-persona-cooldown.ts                    # Check all user cooldowns",
  );
  console.log(
    "  tsx scripts/debug-persona-cooldown.ts --reset --user ID  # Reset specific user's cooldown",
  );
  console.log(
    "  tsx scripts/debug-persona-cooldown.ts --reset-all        # Reset all user cooldowns",
  );
  console.log("");
  console.log("Examples:");
  console.log("  tsx scripts/debug-persona-cooldown.ts");
  console.log(
    "  tsx scripts/debug-persona-cooldown.ts --reset --user clxxxx1234",
  );
  console.log("  tsx scripts/debug-persona-cooldown.ts --reset-all");
  console.log("");
}

debugPersonaCooldown();
