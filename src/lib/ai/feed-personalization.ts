import type { User } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { z } from "zod";

const MAX_ADJACENT_INTERESTS = 8;
const MAX_PERSONA_TRAITS = 8;
const MIN_REQUIRED_ADJACENT_INTERESTS = 4;
const MIN_REQUIRED_PERSONA_TRAITS = 2;
const REFRESH_COOLDOWN_MS = 1000 * 60 * 60 * 6;

const pendingRefreshes = new Set<string>();
const refreshAttempts = new Map<string, number>();

const feedCurationSchema = z.object({
  adjacentInterests: z.array(z.string()).default([]),
  persona: z.string().trim().min(2).max(80).optional().nullable(),
  personaTraits: z.array(z.string()).default([]),
  explorationLevel: z.enum(["low", "medium", "high"]).default("medium"),
});

type PersonalizationSource = Pick<
  User,
  "id" | "interests" | "aiSuggestedInterests" | "persona" | "personaTraits"
>;

export interface FeedPersonalizationSignals {
  adjacentInterests: string[];
  exploreRatio: number;
}

function normalizeTopics(values: string[], limit: number): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const rawValue of values) {
    const cleaned = rawValue
      .trim()
      .replace(/^#/, "")
      .replace(/\s+/g, " ")
      .slice(0, 40);

    if (!cleaned || cleaned.length < 2) {
      continue;
    }

    const key = cleaned.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    normalized.push(cleaned);

    if (normalized.length >= limit) {
      break;
    }
  }

  return normalized;
}

function mapExplorationLevelToTrait(level: "low" | "medium" | "high"): string {
  if (level === "high") {
    return "curious";
  }

  if (level === "low") {
    return "focused";
  }

  return "balanced";
}

function deriveExploreRatioFromTraits(personaTraits: string[]): number {
  if (!personaTraits.length) {
    return 0.22;
  }

  const loweredTraits = personaTraits.map((trait) => trait.toLowerCase());

  const highExploration = loweredTraits.some(
    (trait) =>
      trait.includes("curious") ||
      trait.includes("experimental") ||
      trait.includes("adventurous") ||
      trait.includes("chaos") ||
      trait.includes("explorer"),
  );

  if (highExploration) {
    return 0.32;
  }

  const lowExploration = loweredTraits.some(
    (trait) =>
      trait.includes("focused") ||
      trait.includes("specialist") ||
      trait.includes("deep") ||
      trait.includes("niche"),
  );

  if (lowExploration) {
    return 0.16;
  }

  return 0.24;
}

export function needsFeedPersonalizationRefresh(
  user: PersonalizationSource,
): boolean {
  return (
    user.aiSuggestedInterests.length < MIN_REQUIRED_ADJACENT_INTERESTS ||
    user.personaTraits.length < MIN_REQUIRED_PERSONA_TRAITS ||
    !user.persona
  );
}

export function buildFeedPersonalizationSignals(
  user: PersonalizationSource,
): FeedPersonalizationSignals {
  const adjacentInterests = normalizeTopics(
    user.aiSuggestedInterests,
    MAX_ADJACENT_INTERESTS,
  );

  return {
    adjacentInterests,
    exploreRatio: deriveExploreRatioFromTraits(user.personaTraits),
  };
}

function buildCurationPrompt(input: {
  bio: string;
  interests: string[];
  posts: string[];
  comments: string[];
  likedPosts: string[];
  bookmarkedPosts: string[];
}): string {
  return `You are building a personalized feed profile for a social app focused on niche creators and gen z discovery.

User profile:
- Bio and onboarding story: ${input.bio || "No bio"}
- Existing interests: ${input.interests.join(", ") || "None listed"}

Recent posts:
${input.posts.join("\n") || "No posts"}

Recent comments:
${input.comments.join("\n") || "No comments"}

Recently liked posts:
${input.likedPosts.join("\n") || "No likes"}

Recently bookmarked posts:
${input.bookmarkedPosts.join("\n") || "No bookmarks"}

Task:
1. Suggest 6-8 ADJACENT interests that are close enough to the user's taste but still exploratory.
2. Create a concise 2-3 word persona name.
3. Provide 4-6 persona traits that can influence feed exploration behavior.
4. Set explorationLevel to "low", "medium", or "high".

Rules:
- Keep interests niche and modern.
- Do not repeat the exact same interest text.
- Return only JSON.

JSON format:
{
  "adjacentInterests": ["topic1", "topic2"],
  "persona": "The Pattern Explorer",
  "personaTraits": ["curious", "experimental", "community-driven"],
  "explorationLevel": "high"
}`;
}

export async function refreshFeedPersonalization(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { content: true },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { content: true },
      },
      likes: {
        take: 15,
        include: {
          post: {
            select: { content: true },
          },
        },
      },
      bookmarks: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          post: {
            select: { content: true },
          },
        },
      },
    },
  });

  if (!user) {
    return;
  }

  const prompt = buildCurationPrompt({
    bio: user.bio || "",
    interests: user.interests,
    posts: user.posts.map((post) => post.content),
    comments: user.comments.map((comment) => comment.content),
    likedPosts: user.likes.map((like) => like.post.content),
    bookmarkedPosts: user.bookmarks.map((bookmark) => bookmark.post.content),
  });

  const { analyzeWithGemini } = await import("@/lib/gemini");
  const rawProfile = await analyzeWithGemini(prompt);
  const profile = feedCurationSchema.parse(rawProfile);

  const adjacentInterests = normalizeTopics(
    [...profile.adjacentInterests, ...user.aiSuggestedInterests],
    MAX_ADJACENT_INTERESTS,
  );

  const levelTrait = mapExplorationLevelToTrait(profile.explorationLevel);
  const personaTraits = normalizeTopics(
    [levelTrait, ...profile.personaTraits, ...user.personaTraits],
    MAX_PERSONA_TRAITS,
  );

  const persona = profile.persona?.trim() || user.persona || null;

  await prisma.user.update({
    where: { id: userId },
    data: {
      aiSuggestedInterests: adjacentInterests,
      persona,
      personaTraits,
    },
  });
}

export function queueFeedPersonalizationRefresh(userId: string): boolean {
  const now = Date.now();
  const lastAttempt = refreshAttempts.get(userId);

  if (pendingRefreshes.has(userId)) {
    return false;
  }

  if (lastAttempt && now - lastAttempt < REFRESH_COOLDOWN_MS) {
    return false;
  }

  refreshAttempts.set(userId, now);
  pendingRefreshes.add(userId);

  void refreshFeedPersonalization(userId)
    .catch((error) => {
      console.error("Feed personalization refresh failed", error);
    })
    .finally(() => {
      pendingRefreshes.delete(userId);
    });

  return true;
}
