import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { communityId: string } }
) {
    try {
        const { user } = await validateRequest();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
        const pageSize = 50;

        const membership = await prisma.communityMember.findUnique({
            where: {
                userId_communityId: {
                    userId: user.id,
                    communityId: params.communityId
                }
            }
        });

        if (!membership) {
            return Response.json({ error: "You must be a member to view chat" }, { status: 403 });
        }

        const messages = await prisma.communityMessage.findMany({
            where: { communityId: params.communityId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: pageSize + 1,
            ...(cursor && {
                skip: 1,
                cursor: { id: cursor }
            })
        });

        const hasNextPage = messages.length > pageSize;
        const result = hasNextPage ? messages.slice(0, pageSize) : messages;

        return Response.json({
            messages: result.reverse(),
            nextCursor: hasNextPage ? result[0].id : null
        });
    } catch (error) {
        console.error("Get community messages error:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: { communityId: string } }
) {
    try {
        const { user } = await validateRequest();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { content } = body;

        if (!content || content.trim().length === 0) {
            return Response.json({ error: "Message cannot be empty" }, { status: 400 });
        }

        const membership = await prisma.communityMember.findUnique({
            where: {
                userId_communityId: {
                    userId: user.id,
                    communityId: params.communityId
                }
            }
        });

        if (!membership) {
            return Response.json({ error: "You must be a member to chat" }, { status: 403 });
        }

        const community = await prisma.community.findUnique({
            where: { id: params.communityId }
        });

        if (community?.type !== 'CHAT') {
            return Response.json({ error: "This is not a chat community" }, { status: 400 });
        }

        const message = await prisma.communityMessage.create({
            data: {
                communityId: params.communityId,
                userId: user.id,
                content: content.trim()
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true,
                    }
                }
            }
        });

        return Response.json(message, { status: 201 });
    } catch (error) {
        console.error("Send message error:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}