import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        persona: true,
        personaTraits: true,
        interests: true,
      },
    });

    if (!currentUser?.persona) {
      return Response.json(
        { error: "Analyze your persona first" },
        { status: 400 },
      );
    }

    console.log(`Finding persona matches for user ${user.id}`);
    const startTime = Date.now();

    const matches = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: user.id } },
          {
            OR: [
              { persona: currentUser.persona },
              { personaTraits: { hasSome: currentUser.personaTraits } },
              { interests: { hasSome: currentUser.interests } },
            ],
          },
        ],
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        persona: true,
        personaTraits: true,
        interests: true,
        isVerified: true,
        _count: {
          select: {
            followers: true,
            posts: true,
          },
        },
      },
      take: 20,
    });

    const scoredMatches = matches.map((match) => {
      let score = 0;

      if (match.persona === currentUser.persona) score += 50;

      const sharedTraits = match.personaTraits.filter((t) =>
        currentUser.personaTraits.includes(t),
      );
      score += sharedTraits.length * 10;

      const sharedInterests = match.interests.filter((i) =>
        currentUser.interests.includes(i),
      );
      score += sharedInterests.length * 5;

      return {
        ...match,
        matchScore: score,
        sharedTraits,
        sharedInterests,
      };
    });

    scoredMatches.sort((a, b) => b.matchScore - a.matchScore);

    const duration = Date.now() - startTime;
    console.log(
      `Found ${scoredMatches.length} matches in ${duration}ms for user ${user.id}`,
    );

    return Response.json(scoredMatches.slice(0, 10));
  } catch (error) {
    console.error("Find matches error:", error);

    if (error instanceof Error) {
      if (
        error.message.includes("timeout") ||
        error.message.includes("TIMEOUT")
      ) {
        return Response.json(
          {
            error: "Search is taking longer than expected. Please try again.",
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
            error: "Service temporarily unavailable. Please try again later.",
          },
          { status: 429 },
        );
      }
    }

    return Response.json(
      { error: "Failed to find matches. Please try again." },
      { status: 500 },
    );
  }
}
