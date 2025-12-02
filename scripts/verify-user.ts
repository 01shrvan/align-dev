import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();
async function verifyUser(username: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { username },
        });
        if (!user) {
            console.log(`❌ User "${username}" not found`);
            return;
        }
        if (user.isVerified) {
            console.log(`✅ User "${username}" is already verified`);
            return;
        }
        await prisma.user.update({
            where: { username },
            data: { isVerified: true },
        });
        console.log(`✅ Successfully verified user "${username}"`);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}
async function unverifyUser(username: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { username },
        });
        if (!user) {
            console.log(`❌ User "${username}" not found`);
            return;
        }
        if (!user.isVerified) {
            console.log(`ℹ️  User "${username}" is not verified`);
            return;
        }
        await prisma.user.update({
            where: { username },
            data: { isVerified: false },
        });
        console.log(`✅ Successfully unverified user "${username}"`);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}
async function listVerifiedUsers() {
    try {
        const users = await prisma.user.findMany({
            where: { isVerified: true },
            select: {
                username: true,
                displayName: true,
                email: true,
                isVerified: true,
            },
        });
        console.log("\n✅ Verified Users:");
        console.log("═══════════════════════════════════════");
        if (users.length === 0) {
            console.log("No verified users found.");
        } else {
            users.forEach((user) => {
                console.log(`• @${user.username} (${user.displayName})`);
                if (user.email) console.log(`  📧 ${user.email}`);
            });
        }
        console.log("═══════════════════════════════════════\n");
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}
const args = process.argv.slice(2);
const command = args[0];
const username = args[1];
if (!command) {
    console.log(`
🔷 Verified Badge Management Tool
═══════════════════════════════════════
Usage:
  node scripts/verify-user.js verify <username>     - Verify a user
  node scripts/verify-user.js unverify <username>   - Remove verification
  node scripts/verify-user.js list                  - List all verified users
Examples:
  node scripts/verify-user.js verify shrvan
  node scripts/verify-user.js unverify johndoe
  node scripts/verify-user.js list
  `);
    process.exit(0);
}
switch (command) {
    case "verify":
        if (!username) {
            console.log("❌ Please provide a username");
            process.exit(1);
        }
        verifyUser(username);
        break;
    case "unverify":
        if (!username) {
            console.log("❌ Please provide a username");
            process.exit(1);
        }
        unverifyUser(username);
        break;
    case "list":
        listVerifiedUsers();
        break;
    default:
        console.log(`❌ Unknown command: ${command}`);
        console.log("Use: verify, unverify, or list");
        process.exit(1);
}