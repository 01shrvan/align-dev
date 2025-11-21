import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

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

    const community = await prisma.community.findUnique({
      where: { id: communityId }
    });

    if (!community) {
      return Response.json({ error: "Community not found" }, { status: 404 });
    }

    const existingMember = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: user.id,
          communityId
        }
      }
    });

    if (existingMember) {
      return Response.json({ error: "Already a member" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.communityMember.create({
        data: {
          userId: user.id,
          communityId,
          role: 'MEMBER'
        }
      }),
      prisma.community.update({
        where: { id: communityId },
        data: { memberCount: { increment: 1 } }
      })
    ]);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Join community error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ communityId: string }> }
) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { communityId } = await params;

    const member = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: user.id,
          communityId
        }
      }
    });

    if (!member) {
      return Response.json({ error: "Not a member" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.communityMember.delete({
        where: {
          userId_communityId: {
            userId: user.id,
            communityId
          }
        }
      }),
      prisma.community.update({
        where: { id: communityId },
        data: { memberCount: { decrement: 1 } }
      })
    ]);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Leave community error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}