import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { analyzeUserPersona } from "@/lib/ai/analysis";
import { NextRequest } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
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
    if (lastAnalysis) {
      const hoursSinceLastAnalysis =
        (Date.now() - lastAnalysis.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastAnalysis < 24) {
        return Response.json(
          { error: "Please wait 24 hours between analyses" },
          { status: 429 },
        );
      }
    }

    console.log(`Starting persona analysis for user ${user.id}`);
    const startTime = Date.now();

    const analysis = await analyzeUserPersona(user.id);

    const duration = Date.now() - startTime;
    console.log(
      `Persona analysis completed in ${duration}ms for user ${user.id}`,
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        persona: analysis.persona,
        personaTraits: analysis.traits,
        lastAIAnalysis: new Date(),
      },
    });

    return Response.json(analysis);
  } catch (error) {
    console.error("Persona analysis error:", error);

    if (error instanceof Error) {
      if (
        error.message.includes("timeout") ||
        error.message.includes("TIMEOUT")
      ) {
        return Response.json(
          {
            error: "Analysis is taking longer than expected. Please try again.",
          },
          { status: 408 },
        );
      }

      if (
        error.message.includes("rate limit") ||
        error.message.includes("quota")
      ) {
        return Response.json(
          {
            error:
              "AI service temporarily unavailable. Please try again later.",
          },
          { status: 429 },
        );
      }
    }

    return Response.json(
      { error: "Failed to analyze persona. Please try again." },
      { status: 500 },
    );
  }
}
