import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude } from "@/lib/types";
import { createCommentSchema } from "@/lib/validation";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> },
) {
  try {
    const { commentId } = await params;
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parentComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        postId: true,
        userId: true,
      },
    });

    if (!parentComment) {
      return Response.json({ error: "Comment not found" }, { status: 404 });
    }

    const { content } = createCommentSchema.parse(await req.json());

    const [newReply] = await prisma.$transaction([
      prisma.comment.create({
        data: {
          content,
          postId: parentComment.postId,
          userId: user.id,
          parentId: commentId,
        },
        include: getCommentDataInclude(user.id),
      }),
      ...(user.id !== parentComment.userId
        ? [
            prisma.notification.create({
              data: {
                issuerId: user.id,
                recipientId: parentComment.userId,
                type: "COMMENT_REPLY",
              },
            }),
          ]
        : []),
    ]);

    return Response.json(newReply);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> },
) {
  try {
    const { commentId } = await params;
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const replies = await prisma.comment.findMany({
      where: {
        parentId: commentId,
      },
      include: getCommentDataInclude(user.id),
      orderBy: {
        createdAt: "asc",
      },
    });

    return Response.json(replies);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
