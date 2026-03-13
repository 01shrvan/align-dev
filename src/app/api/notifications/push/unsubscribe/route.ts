import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const endpoint =
      body && typeof body.endpoint === "string" ? body.endpoint : null;

    if (endpoint) {
      await prisma.pushSubscription.deleteMany({
        where: {
          userId: user.id,
          endpoint,
        },
      });
    } else {
      await prisma.pushSubscription.deleteMany({
        where: {
          userId: user.id,
        },
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
