import { validateRequest } from "@/auth";
import { geminiModel, getEmbedding } from "@/lib/gemini";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await validateRequest();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const embedding = await getEmbedding(message);
    const vectorQuery = `[${embedding.join(",")}]`;

    const users = await prisma.$queryRaw`
      SELECT
        id,
        username,
        "displayName",
        "avatarUrl",
        bio,
        occupation,
        interests,
        tags
      FROM users
      WHERE "bioEmbedding" IS NOT NULL
      ORDER BY "bioEmbedding" <=> ${vectorQuery}::vector ASC
      LIMIT 10;
    `;

    const foundUsers = users as Array<{
      id: string;
      username: string;
      displayName: string;
      avatarUrl: string | null;
      bio: string | null;
      occupation: string | null;
      interests: string[];
      tags: string[];
    }>;

    const relevantUsers = foundUsers.filter((u) => u.id !== session.user!.id);

    const systemPrompt = `
    You are Ava, a Gen Z style AI assistant for "Align", a networking platform.
    Your goal is to help users find connection matches.

    The user said: "${message}"

    Here are the profiles found (context):
    ${relevantUsers
        .map(
          (u) =>
            `- ${u.displayName} (@${u.username}): ${u.occupation || "No occupation"}. Bio: ${u.bio || "No bio"}. Interests: ${u.interests.join(", ")}. Tags: ${u.tags.join(", ")}`,
        )
        .join("\n")}

    Instructions:
    1. If relevant users are found in the list above, mention the top 1-3 best matches. Explain briefly why they fit the user's request.
    2. Be super casual, use lowercase often, maybe some slang (like "bet", "no cap", "lit", "vibe", "fr"), but DO NOT use emojis.
    3. Keep it relatively short.
    4. If no one fits, say you couldn't find anyone matching that vibe right now.

    Respond directly to the user.
    `;

    const result = await geminiModel.generateContent(systemPrompt);
    const responseText = result.response.text();

    return NextResponse.json({
      message: responseText,
      users: relevantUsers,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
