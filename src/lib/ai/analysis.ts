import { analyzeWithGemini } from "@/lib/gemini";
import prisma from "@/lib/prisma";

interface InterestAnalysisResult {
  currentInterests: string[];
  suggestedInterests: string[];
  reasoning: string;
}

interface PersonaAnalysisResult {
  persona: string;
  traits: string[];
  description: string;
  matches: string[];
}

export async function analyzeUserInterests(
  userId: string,
): Promise<InterestAnalysisResult> {
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
    throw new Error("User not found");
  }

  const postContent = user.posts.map((p) => p.content).join("\n");
  const commentContent = user.comments.map((c) => c.content).join("\n");
  const likedContent = user.likes.map((l) => l.post.content).join("\n");

  const prompt = `
You are a trend-savvy analyst decoding someone's vibe from their social footprint. Keep it Gen Z, authentic, and punchy.

User's Profile:
- Bio: ${user.bio || "No bio"}
- Current Interests: ${user.interests.join(", ") || "None listed"}

Recent Posts:
${postContent || "No posts yet"}

Recent Comments:
${commentContent || "No comments yet"}

Posts They Liked:
${likedContent || "No likes yet"}

Task:
1. Identify 3-5 HYPER-SPECIFIC, NICHE interests (e.g., "Neo-brutalism" not "Design").
2. Suggest 3-5 FRESH obsessions they'd vibe with.
3. Give a short, punchy reason why (Gen Z slang allowed but don't overdo it, keep it real, 2 sentences max).

Return ONLY valid JSON in this format:
{
  "currentInterests": ["interest1", "interest2"],
  "suggestedInterests": ["new1", "new2"],
  "reasoning": "Short, punchy explanation."
}
`;

  const result = await analyzeWithGemini(prompt);
  return result as InterestAnalysisResult;
}

export async function analyzeUserPersona(
  userId: string,
): Promise<PersonaAnalysisResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        take: 30,
        select: { content: true },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        take: 30,
        select: { content: true },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const allContent = [
    ...user.posts.map((p) => p.content),
    ...user.comments.map((c) => c.content),
  ].join("\n");

  const prompt = `
You are a vibe curator. Analyze this person's digital aura, writing style, and thinking patterns.

Content:
${allContent || "Limited content available"}

Task:
Create a unique "Vibe Archetype" for this person. Think cooler, internet-native personas like:
- "The Shitpost Sage"
- "The Chaos Gardener"
- "The Systems Sorcerer"
- "The Reply Guy Final Boss"
- "The Cozy Coder"

Create a NEW unique persona name (2-3 words).

Return ONLY valid JSON:
{
  "persona": "The Chaotic Architect",
  "traits": ["based", "unhinged", "systematic", "curious"],
  "description": "A 1-2 sentence vibe check. Keep it concise, lower case aesthetic if it fits, no corporate speak. Just straight facts about who they are online.",
  "matches": ["The Pattern Spotter", "The Pragmatic Builder"]
}
`;

  const result = await analyzeWithGemini(prompt);
  return result as PersonaAnalysisResult;
}
