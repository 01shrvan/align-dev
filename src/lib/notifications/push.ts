import "server-only";

import prisma from "@/lib/prisma";
import webpush from "web-push";

interface PushPayload {
  title: string;
  body: string;
  url: string;
}

interface StoredPushSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
}

let vapidConfigured = false;

function configureVapidIfPossible(): boolean {
  if (vapidConfigured) {
    return true;
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    return false;
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:noreply@mail.align-network.xyz",
    publicKey,
    privateKey,
  );

  vapidConfigured = true;

  return true;
}

async function sendToSubscription(
  subscription: StoredPushSubscription,
  payload: PushPayload,
) {
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      },
      JSON.stringify({
        ...payload,
        icon: "/icon-192x192.png",
        badge: "/icon-192x192.png",
      }),
    );
  } catch (error) {
    const statusCode =
      typeof error === "object" && error !== null && "statusCode" in error
        ? Number((error as { statusCode?: number }).statusCode)
        : null;

    if (statusCode === 404 || statusCode === 410) {
      await prisma.pushSubscription.deleteMany({
        where: { endpoint: subscription.endpoint },
      });
    }
  }
}

export async function sendPushPayloadToUser(
  userId: string,
  payload: PushPayload,
) {
  if (!configureVapidIfPossible()) {
    return;
  }

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
    select: {
      endpoint: true,
      p256dh: true,
      auth: true,
    },
  });

  await Promise.allSettled(
    subscriptions.map((subscription) =>
      sendToSubscription(subscription, payload),
    ),
  );
}
