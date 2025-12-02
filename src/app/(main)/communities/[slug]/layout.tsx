import type { Metadata } from "next";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const prisma = (await import("@/lib/prisma")).default;
  const community = await prisma.community.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
      description: true,
      avatarUrl: true,
      bannerUrl: true,
      category: true,
      privacy: true,
      _count: {
        select: { members: true, posts: true, messages: true },
      },
      type: true,
    },
  });

  if (!community) {
    return { title: "Community not found" };
  }

  const counts = `${community._count.members} members · ${community.type === "CHAT" ? `${community._count.messages} messages` : `${community._count.posts} posts`}`;
  const baseDescription = community.description?.trim() || `${community.category} • ${community.privacy} • ${counts}`;
  const description = baseDescription.length > 240 ? `${baseDescription.slice(0, 237)}…` : baseDescription;

  const image = community.bannerUrl || community.avatarUrl || "/assets/opengraph-image.png";
  const url = `/communities/${community.slug}`;

  return {
    title: community.name,
    description,
    openGraph: {
      type: "website",
      url,
      title: community.name,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: community.name,
      description,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
