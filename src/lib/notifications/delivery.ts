import "server-only";

import type { NotificationType, Prisma } from "@/generated/prisma";
import { nodemailerUtils } from "@/lib/emails/nodemailer";
import { sendPushPayloadToUser } from "@/lib/notifications/push";
import prisma from "@/lib/prisma";

interface NotificationDraft {
  issuerId: string;
  recipientId: string;
  type: NotificationType;
  postId?: string | null;
}

interface NotificationContent {
  actionText: string;
  path: string;
  emailSubject: string;
}

const PUSH_TYPES = new Set<NotificationType>([
  "FOLLOW",
  "LIKE",
  "COMMENT",
  "MENTION",
  "COMMENT_LIKE",
  "COMMENT_REPLY",
]);

const EMAIL_TYPES = new Set<NotificationType>([
  "FOLLOW",
  "LIKE",
  "COMMENT",
  "MENTION",
  "COMMENT_LIKE",
  "COMMENT_REPLY",
]);

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://alignxyz.vercel.app";

function buildNotificationContent(
  notification: NotificationDraft,
  issuerUsername: string,
): NotificationContent {
  const postPath = notification.postId
    ? `/posts/${notification.postId}`
    : "/notifications";

  switch (notification.type) {
    case "FOLLOW":
      return {
        actionText: "started following you",
        path: `/users/${issuerUsername}`,
        emailSubject: "New follower on Align",
      };
    case "LIKE":
      return {
        actionText: "liked your post",
        path: postPath,
        emailSubject: "Someone liked your post",
      };
    case "COMMENT":
      return {
        actionText: "commented on your post",
        path: postPath,
        emailSubject: "New comment on your post",
      };
    case "MENTION":
      return {
        actionText: "mentioned you in a post",
        path: postPath,
        emailSubject: "You were mentioned on Align",
      };
    case "COMMENT_LIKE":
      return {
        actionText: "liked your comment",
        path: postPath,
        emailSubject: "Someone liked your comment",
      };
    case "COMMENT_REPLY":
      return {
        actionText: "replied to your comment",
        path: postPath,
        emailSubject: "New reply to your comment",
      };
    case "ALIGNERS":
      return {
        actionText: "mentioned @aligners in a post",
        path: postPath,
        emailSubject: "New Aligners mention",
      };
    default:
      return {
        actionText: "sent you a new notification",
        path: "/notifications",
        emailSubject: "New notification on Align",
      };
  }
}

function shouldSendExternalNotification(type: NotificationType): boolean {
  return PUSH_TYPES.has(type) || EMAIL_TYPES.has(type);
}

function withLeadingSlash(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

function toAbsoluteUrl(path: string) {
  try {
    return new URL(path, baseUrl).toString();
  } catch {
    return `https://alignxyz.vercel.app${path}`;
  }
}

async function deliverNotifications(notifications: NotificationDraft[]) {
  const deliverable = notifications.filter((notification) =>
    shouldSendExternalNotification(notification.type),
  );

  if (!deliverable.length) {
    return;
  }

  const issuerIds = [...new Set(deliverable.map((item) => item.issuerId))];
  const recipientIds = [
    ...new Set(deliverable.map((item) => item.recipientId)),
  ];

  const [issuers, recipients] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: issuerIds } },
      select: {
        id: true,
        username: true,
        displayName: true,
      },
    }),
    prisma.user.findMany({
      where: { id: { in: recipientIds } },
      select: {
        id: true,
        displayName: true,
        email: true,
      },
    }),
  ]);

  const issuerMap = new Map(issuers.map((issuer) => [issuer.id, issuer]));
  const recipientMap = new Map(
    recipients.map((recipient) => [recipient.id, recipient]),
  );

  await Promise.allSettled(
    deliverable.map(async (notification) => {
      const issuer = issuerMap.get(notification.issuerId);
      const recipient = recipientMap.get(notification.recipientId);

      if (!issuer || !recipient) {
        return;
      }

      const content = buildNotificationContent(notification, issuer.username);
      const path = withLeadingSlash(content.path);
      const actionUrl = toAbsoluteUrl(path);
      const outboundWork: Promise<unknown>[] = [];

      if (PUSH_TYPES.has(notification.type)) {
        outboundWork.push(
          sendPushPayloadToUser(recipient.id, {
            title: "Align",
            body: `${issuer.displayName} ${content.actionText}`,
            url: path,
          }),
        );
      }

      if (EMAIL_TYPES.has(notification.type) && recipient.email) {
        outboundWork.push(
          nodemailerUtils.sendNotificationEmail({
            to: recipient.email,
            recipientName: recipient.displayName,
            issuerName: issuer.displayName,
            actionText: content.actionText,
            actionUrl,
            subject: content.emailSubject,
          }),
        );
      }

      if (!outboundWork.length) {
        return;
      }

      await Promise.allSettled(outboundWork);
    }),
  );
}

export async function createNotificationAndDeliver(
  notification: NotificationDraft,
) {
  if (notification.issuerId === notification.recipientId) {
    return null;
  }

  const createdNotification = await prisma.notification.create({
    data: {
      issuerId: notification.issuerId,
      recipientId: notification.recipientId,
      postId: notification.postId ?? null,
      type: notification.type,
    },
  });

  await deliverNotifications([notification]);

  return createdNotification;
}

export async function createManyNotificationsAndDeliver(
  notifications: NotificationDraft[],
  options?: {
    skipDuplicates?: boolean;
  },
): Promise<Prisma.BatchPayload> {
  const sanitizedNotifications = notifications.filter(
    (notification) => notification.issuerId !== notification.recipientId,
  );

  if (!sanitizedNotifications.length) {
    return { count: 0 };
  }

  const created = await prisma.notification.createMany({
    data: sanitizedNotifications.map((notification) => ({
      issuerId: notification.issuerId,
      recipientId: notification.recipientId,
      postId: notification.postId ?? null,
      type: notification.type,
    })),
    skipDuplicates: options?.skipDuplicates,
  });

  await deliverNotifications(sanitizedNotifications);

  return created;
}
