"use client";

import { useEffect } from "react";

const NOTIFICATION_EVENT_NAME = "align:notification-received";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

async function syncPushSubscription(registration: ServiceWorkerRegistration) {
  if (!("PushManager" in window) || !("Notification" in window)) {
    return;
  }

  if (Notification.permission === "denied") {
    return;
  }

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  if (!vapidPublicKey) {
    return;
  }

  const permission =
    Notification.permission === "granted"
      ? "granted"
      : await Notification.requestPermission();

  if (permission !== "granted") {
    return;
  }

  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
  }

  await fetch("/api/notifications/push/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription.toJSON()),
  });
}

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const handleMessage = (event: MessageEvent<{ type?: string }>) => {
      if (event.data?.type !== NOTIFICATION_EVENT_NAME) {
        return;
      }

      window.dispatchEvent(new Event(NOTIFICATION_EVENT_NAME));
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);

    void navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => syncPushSubscription(registration))
      .catch(() => {});

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, []);

  return null;
}
