import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

interface PushSubscriptionBody {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

function isPushSubscriptionBody(value: unknown): value is PushSubscriptionBody {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PushSubscriptionBody>;

  return (
    typeof candidate.endpoint === "string" &&
    (typeof candidate.expirationTime === "number" ||
      candidate.expirationTime === null ||
      candidate.expirationTime === undefined) &&
    !!candidate.keys &&
    typeof candidate.keys.p256dh === "string" &&
    typeof candidate.keys.auth === "string"
  );
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!isPushSubscriptionBody(body)) {
      return Response.json(
        { error: "Invalid push subscription" },
        { status: 400 },
      );
    }

    await prisma.pushSubscription.upsert({
      where: {
        endpoint: body.endpoint,
      },
      create: {
        userId: user.id,
        endpoint: body.endpoint,
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
        expirationTime:
          typeof body.expirationTime === "number"
            ? new Date(body.expirationTime)
            : null,
      },
      update: {
        userId: user.id,
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
        expirationTime:
          typeof body.expirationTime === "number"
            ? new Date(body.expirationTime)
            : null,
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
