import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

const OFFICIAL_COMMUNITIES = [
  {
    name: "Welcome",
    slug: "welcome",
    description: "Welcome to our platform! Introduce yourself and meet the community.",
    category: "General",
  },
  {
    name: "Announcements",
    slug: "announcements",
    description: "Official announcements and updates from the team.",
    category: "General",
  },
  {
    name: "Tech Talk",
    slug: "tech-talk",
    description: "Discuss the latest in technology, programming, and innovation.",
    category: "Technology",
  },
  {
    name: "Creative Corner",
    slug: "creative-corner",
    description: "Share your art, designs, and creative projects.",
    category: "Art & Design",
  },
  {
    name: "Career Hub",
    slug: "career-hub",
    description: "Job opportunities, career advice, and professional networking.",
    category: "Business",
  },
  {
    name: "Gaming Zone",
    slug: "gaming-zone",
    description: "All things gaming - from AAA titles to indie gems.",
    category: "Gaming",
  },
  {
    name: "Fitness & Health",
    slug: "fitness-health",
    description: "Share your fitness journey, tips, and healthy lifestyle advice.",
    category: "Health & Fitness",
  },
  {
    name: "Book Club",
    slug: "book-club",
    description: "Discuss your favorite books and discover new reads.",
    category: "Books",
  },
];

async function seedCommunities() {
  console.log("🌱 Seeding official communities...");

  let systemUser = await prisma.user.findFirst({
    where: { username: "system" },
  });

  if (!systemUser) {
    systemUser = await prisma.user.findFirst();
    
    if (!systemUser) {
      console.error("❌ No users found in database. Please create a user first.");
      return;
    }
  }

  console.log(`📝 Using user: ${systemUser.username} as community creator`);

  for (const community of OFFICIAL_COMMUNITIES) {
    try {
      const existing = await prisma.community.findUnique({
        where: { slug: community.slug },
      });

      if (existing) {
        console.log(`⏭️  Community "${community.name}" already exists, skipping...`);
        continue;
      }

      const created = await prisma.community.create({
        data: {
          name: community.name,
          slug: community.slug,
          description: community.description,
          category: community.category,
          isOfficial: true,
          privacy: "PUBLIC",
          creatorId: systemUser.id,
          memberCount: 1,
          members: {
            create: {
              userId: systemUser.id,
              role: "ADMIN",
            },
          },
        },
      });

      console.log(`✅ Created community: ${created.name} (/${created.slug})`);
    } catch (error) {
      console.error(`❌ Failed to create community "${community.name}":`, error);
    }
  }

  console.log("🎉 Official communities seeded successfully!");
}

seedCommunities()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });