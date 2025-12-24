import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { lastAIAnalysis: true },
    });

    const lastAnalysis = userData?.lastAIAnalysis;

    if (!lastAnalysis) {
      return Response.json({
        canAnalyze: true,
        timeRemaining: 0,
        lastAnalysis: null,
      });
    }

    const hoursSinceLastAnalysis =
      (Date.now() - lastAnalysis.getTime()) / (1000 * 60 * 60);

    const canAnalyze = hoursSinceLastAnalysis >= 24;
    const timeRemaining = canAnalyze
      ? 0
      : Math.ceil(24 - hoursSinceLastAnalysis);

    return Response.json({
      canAnalyze,
      timeRemaining,
      lastAnalysis: lastAnalysis.toISOString(),
    });
  } catch (error) {
    console.error("Cooldown check error:", error);
    return Response.json(
      { error: "Failed to check cooldown status" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.NODE_ENV === "production") {
      return Response.json(
        { error: "Not allowed in production" },
        { status: 403 },
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastAIAnalysis: null,
      },
    });

    return Response.json({ message: "Cooldown reset successfully" });
  } catch (error) {
    console.error("Cooldown reset error:", error);
    return Response.json(
      { error: "Failed to reset cooldown" },
      { status: 500 },
    );
  }
}
