import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { analyzeUserInterests } from "@/lib/ai/analysis";
import { NextRequest } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`Starting interest analysis for user ${user.id}`);
    const startTime = Date.now();

    const analysis = await analyzeUserInterests(user.id);

    const duration = Date.now() - startTime;
    console.log(
      `Interest analysis completed in ${duration}ms for user ${user.id}`,
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        aiSuggestedInterests: analysis.suggestedInterests,
      },
    });

    return Response.json(analysis);
  } catch (error) {
    console.error("Interest analysis error:", error);

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
      { error: "Failed to analyze interests. Please try again." },
      { status: 500 },
    );
  }
}
