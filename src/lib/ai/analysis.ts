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
You are an expert at analyzing people's interests from their social media activity.

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
1. Identify 5-10 SPECIFIC, NICHE interests this person has (not generic like "technology")
2. Suggest 5-7 NEW interests they might not know they have but would love
3. Explain your reasoning briefly

Return ONLY valid JSON in this format:
{
  "currentInterests": ["interest1", "interest2"],
  "suggestedInterests": ["new1", "new2"],
  "reasoning": "brief explanation"
}

Be specific! Instead of "coding", say "TypeScript Generics" or "React Performance Optimization".
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
You are an expert at understanding personality archetypes from writing style and content.

Analyze this person's writing style, topics, and thinking patterns:

${allContent || "Limited content available"}

Task:
Create a unique persona archetype for this person. Think of personas like:
- "The Skeptical Optimizer" - Questions everything, loves efficiency
- "The Teaching Enthusiast" - Explains concepts clearly, patient
- "The Chaotic Experimenter" - Tries everything, shares failures openly
- "The Pattern Spotter" - Connects dots across domains, systems thinker
- "The Pragmatic Builder" - Ship fast, learn by doing
- "The Deep Diver" - Goes rabbit-hole deep on topics
- "The Bridge Builder" - Connects people and ideas
- "The Question Asker" - Drives conversations through curiosity

Create a NEW unique persona name (2-3 words) based on their actual patterns.

Return ONLY valid JSON:
{
  "persona": "The Creative Systematizer",
  "traits": ["analytical", "creative", "detail-oriented", "curious"],
  "description": "Loves building systems but with artistic flair. Questions conventional approaches while respecting proven methods.",
  "matches": ["The Pattern Spotter", "The Pragmatic Builder"]
}
`;

  const result = await analyzeWithGemini(prompt);
  return result as PersonaAnalysisResult;
}
