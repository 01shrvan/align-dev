"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { extractMentions } from "@/lib/utils/mentions";

export async function submitPost(input: {
  content: string;
  mediaIds: string[];
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const newPost = await prisma.post.create({
    data: {
      content: input.content,
      userId: user.id,
      attachments: {
        connect: input.mediaIds.map((id) => ({ id })),
      },
    },
  });

  const { userMentions, tagMentions } = extractMentions(input.content);

  if (tagMentions.length > 0) {
    for (const tag of tagMentions) {
      const usersWithTag = await prisma.user.findMany({
        where: {
          tags: {
            has: tag
          },
          id: { not: user.id }
        },
        select: { id: true }
      });

      if (usersWithTag.length > 0) {
        const BATCH_SIZE = 1000;
        for (let i = 0; i < usersWithTag.length; i += BATCH_SIZE) {
          const batch = usersWithTag.slice(i, i + BATCH_SIZE);

          await prisma.notification.createMany({
            data: batch.map(u => ({
              issuerId: user.id,
              recipientId: u.id,
              postId: newPost.id,
              type: "ALIGNERS",
            })),
            skipDuplicates: true,
          });
        }

        console.log(`🔔 Sent @${tag} notification to ${usersWithTag.length} users`);
      }
    }
  }

  if (userMentions.length > 0) {
    const mentionedUsers = await prisma.user.findMany({
      where: {
        username: { in: userMentions },
        id: { not: user.id }
      },
      select: { id: true }
    });

    if (mentionedUsers.length > 0) {
      await prisma.notification.createMany({
        data: mentionedUsers.map(u => ({
          issuerId: user.id,
          recipientId: u.id,
          postId: newPost.id,
          type: "MENTION",
        })),
        skipDuplicates: true,
      });
    }
  }

  return newPost;
}
