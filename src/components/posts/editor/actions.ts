"use server";

import { validateRequest } from "@/auth";
import { createManyNotificationsAndDeliver } from "@/lib/notifications/delivery";
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
            has: tag,
          },
          id: { not: user.id },
        },
        select: { id: true },
      });

      if (usersWithTag.length > 0) {
        const BATCH_SIZE = 1000;

        for (let i = 0; i < usersWithTag.length; i += BATCH_SIZE) {
          const batch = usersWithTag.slice(i, i + BATCH_SIZE);

          await createManyNotificationsAndDeliver(
            batch.map((recipient) => ({
              issuerId: user.id,
              recipientId: recipient.id,
              postId: newPost.id,
              type: "ALIGNERS",
            })),
            {
              skipDuplicates: true,
            },
          );
        }
      }
    }
  }

  if (userMentions.length > 0) {
    const mentionedUsers = await prisma.user.findMany({
      where: {
        username: { in: userMentions },
        id: { not: user.id },
      },
      select: { id: true },
    });

    if (mentionedUsers.length > 0) {
      await createManyNotificationsAndDeliver(
        mentionedUsers.map((mentionedUser) => ({
          issuerId: user.id,
          recipientId: mentionedUser.id,
          postId: newPost.id,
          type: "MENTION",
        })),
        {
          skipDuplicates: true,
        },
      );
    }
  }

  return newPost;
}
