import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function addAlignersTagToAllUsers() {
    try {
        console.log("🏷️  Adding 'aligners' tag to all users...");

        const users = await prisma.user.findMany({
            select: { id: true, username: true, tags: true }
        });

        console.log(`📊 Found ${users.length} users`);

        let updated = 0;
        let alreadyHad = 0;

        for (const user of users) {
            if (user.tags?.includes("aligners")) {
                alreadyHad++;
                continue;
            }

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    tags: {
                        push: "aligners"
                    }
                }
            });

            updated++;
            console.log(`✅ Added tag to @${user.username}`);
        }

        console.log("\n📈 Summary:");
        console.log(`   • Total users: ${users.length}`);
        console.log(`   • Updated: ${updated}`);
        console.log(`   • Already had tag: ${alreadyHad}`);
        console.log("\n🎉 Done!");

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

addAlignersTagToAllUsers();