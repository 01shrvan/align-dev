import { validateRequest } from "@/auth";
import { createNotificationAndDeliver } from "@/lib/notifications/delivery";
import prisma from "@/lib/prisma";
import { CommentLikeInfo } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> },
) {
  try {
    const { commentId } = await params;
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        likes: {
          where: {
            userId: loggedInUser.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!comment) {
      return Response.json({ error: "Comment not found" }, { status: 404 });
    }

    const data: CommentLikeInfo = {
      likes: comment._count.likes,
      isLikedByUser: !!comment.likes.length,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> },
) {
  try {
    const { commentId } = await params;
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        userId: true,
        postId: true,
      },
    });

    if (!comment) {
      return Response.json({ error: "Comment not found" }, { status: 404 });
    }

    await prisma.commentLike.upsert({
      where: {
        userId_commentId: {
          userId: loggedInUser.id,
          commentId,
        },
      },
      create: {
        userId: loggedInUser.id,
        commentId,
      },
      update: {},
    });

    if (loggedInUser.id !== comment.userId) {
      await createNotificationAndDeliver({
        issuerId: loggedInUser.id,
        recipientId: comment.userId,
        postId: comment.postId,
        type: "COMMENT_LIKE",
      });
    }

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> },
) {
  try {
    const { commentId } = await params;
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        userId: true,
        postId: true,
      },
    });

    if (!comment) {
      return Response.json({ error: "Comment not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.commentLike.deleteMany({
        where: {
          userId: loggedInUser.id,
          commentId,
        },
      }),
      prisma.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: comment.userId,
          postId: comment.postId,
          type: "COMMENT_LIKE",
        },
      }),
    ]);

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
