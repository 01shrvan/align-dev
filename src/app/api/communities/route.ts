import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommunityDataSelect } from "@/lib/types/community";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const category = req.nextUrl.searchParams.get("category") || undefined;
    const search = req.nextUrl.searchParams.get("search") || undefined;
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 12;

    const communities = await prisma.community.findMany({
      where: {
        ...(category && { category }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        })
      },
      select: getCommunityDataSelect(user.id),
      orderBy: [
        { isOfficial: 'desc' },
        { memberCount: 'desc' },
        { createdAt: 'desc' }
      ],
      take: pageSize + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor }
      })
    });

    const hasNextPage = communities.length > pageSize;
    const result = hasNextPage ? communities.slice(0, pageSize) : communities;

    return Response.json({
      communities: result,
      nextCursor: hasNextPage ? result[result.length - 1].id : null
    });
  } catch (error) {
    console.error("Fetch communities error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, description, category, type, avatarUrl, bannerUrl, privacy } = body;

    if (!name || !slug || !category || !type) {
      return Response.json(
        { error: "Name, slug, category, and type are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.community.findUnique({
      where: { slug }
    });

    if (existing) {
      return Response.json(
        { error: "This community name is already taken" },
        { status: 400 }
      );
    }

    const community = await prisma.community.create({
      data: {
        name,
        slug,
        description,
        category,
        type,
        avatarUrl,
        bannerUrl,
        privacy: privacy || 'PUBLIC',
        creatorId: user.id,
        memberCount: 1,
        members: {
          create: {
            userId: user.id,
            role: 'ADMIN'
          }
        }
      },
      select: getCommunityDataSelect(user.id)
    });

    return Response.json(community, { status: 201 });
  } catch (error) {
    console.error("Create community error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}