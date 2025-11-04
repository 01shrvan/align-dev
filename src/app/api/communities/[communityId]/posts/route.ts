import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ communityId: string }> }
) {
    try {
        const { user } = await validateRequest();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { communityId } = await params;
        const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
        const pageSize = 20;

        const membership = await prisma.communityMember.findUnique({
            where: {
                userId_communityId: {
                    userId: user.id,
                    communityId
                }
            }
        });

        if (!membership) {
            return Response.json({ error: "You must be a member to view posts" }, { status: 403 });
        }

        const posts = await prisma.communityPost.findMany({
            where: { communityId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true,
                    }
                },
                attachments: true,
            },
            orderBy: [
                { isPinned: 'desc' },
                { createdAt: 'desc' }
            ],
            take: pageSize + 1,
            ...(cursor && {
                skip: 1,
                cursor: { id: cursor }
            })
        });

        const hasNextPage = posts.length > pageSize;
        const result = hasNextPage ? posts.slice(0, pageSize) : posts;

        return Response.json({
            posts: result,
            nextCursor: hasNextPage ? result[result.length - 1].id : null
        });
    } catch (error) {
        console.error("Get community posts error:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ communityId: string }> }
) {
    try {
        const { user } = await validateRequest();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { communityId } = await params;
        const body = await req.json();
        const { content, attachments } = body;

        if (!content || content.trim().length === 0) {
            return Response.json({ error: "Content cannot be empty" }, { status: 400 });
        }

        const membership = await prisma.communityMember.findUnique({
            where: {
                userId_communityId: {
                    userId: user.id,
                    communityId
                }
            }
        });

        if (!membership) {
            return Response.json({ error: "You must be a member to post" }, { status: 403 });
        }

        const community = await prisma.community.findUnique({
            where: { id: communityId }
        });

        if (community?.type !== 'FEED') {
            return Response.json({ error: "This is not a feed community" }, { status: 400 });
        }

        const post = await prisma.communityPost.create({
            data: {
                communityId,
                userId: user.id,
                content: content.trim(),
                attachments: attachments ? {
                    connect: attachments.map((id: string) => ({ id }))
                } : undefined
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true,
                    }
                },
                attachments: true,
            }
        });

        await prisma.community.update({
            where: { id: communityId },
            data: { postCount: { increment: 1 } }
        });

        return Response.json(post, { status: 201 });
    } catch (error) {
        console.error("Create community post error:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}