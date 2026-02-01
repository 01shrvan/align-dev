import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ communityId: string }> }
) {
    try {
        const { communityId } = await params;
        const { user } = await validateRequest();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const community = await prisma.community.findUnique({
            where: { id: communityId },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true,
                    }
                },
                members: {
                    where: { userId: user.id },
                    select: {
                        role: true,
                        joinedAt: true
                    }
                },
                rules: {
                    orderBy: { order: 'asc' }
                },
                _count: {
                    select: {
                        members: true,
                        posts: true,
                        messages: true
                    }
                }
            }
        });

        if (!community) {
            return Response.json({ error: "Community not found" }, { status: 404 });
        }

        return Response.json(community);
    } catch (error) {
        console.error("Get community error:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ communityId: string }> }
) {
    try {
        const { communityId } = await params;
        const { user } = await validateRequest();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const membership = await prisma.communityMember.findUnique({
            where: {
                userId_communityId: {
                    userId: user.id,
                    communityId: communityId
                }
            }
        });

        if (!membership || membership.role !== 'ADMIN') {
            return Response.json(
                { error: "Only admins can delete communities" },
                { status: 403 }
            );
        }

        await prisma.community.delete({
            where: { id: communityId }
        });

        return Response.json({ success: true });
    } catch (error) {
        console.error("Delete community error:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
