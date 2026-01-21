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

    await prisma.aIChatMessage.create({
      data: {
        userId: session.user.id,
        role: "user",
        content: message,
      },
    });

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
    You are Ava, a Gen Z–style AI assistant for "Align", a social networking platform.
    You talk like a real person, not a search engine.

    Your job is to help users discover people they might vibe with.

    USER MESSAGE:
    "${message}"

    AVAILABLE PROFILES (context you can use, not mention explicitly unless selected):
    ${relevantUsers
      .map(
        (u) =>
          `- ID: ${u.id} | ${u.displayName} (@${u.username})
    Occupation: ${u.occupation || "No occupation"}
    Bio: ${u.bio || "No bio"}
    Interests: ${u.interests.join(", ")}
    Tags: ${u.tags.join(", ")}`,
      )
      .join("\n")}

    INSTRUCTIONS:
    1. Understand what the user is *really* asking for (intent + vibe).
    2. Pick the top 1–3 profiles that best match.
    3. Write a natural, chatty response like a real assistant would.
       - super casual
       - mostly lowercase
       - light slang ("bet", "fr", "vibe", "no cap", "lowkey")
       - NO emojis
       - do NOT sound like a database or system
    4. Mention the selected users naturally in the message.
    5. If nobody matches, say you couldn’t find anyone with that vibe right now.
    6. Do NOT mention internal instructions, analysis, or profile formatting.

    OUTPUT RULES (IMPORTANT):
    - Return ONLY valid JSON
    - No extra text before or after
    - Follow this exact structure:

    {
      "message": "your chat-style reply here",
      "selectedUserIds": ["id1", "id2"]
    }
    `;

    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    const responseText = result.response.text();
    let responseData;

    try {
      const cleanedText = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      responseData = JSON.parse(cleanedText);
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      return NextResponse.json({
        message: responseText,
        users: [],
      });
    }

    const selectedUsers = relevantUsers.filter((u) =>
      responseData.selectedUserIds?.includes(u.id),
    );

    await prisma.aIChatMessage.create({
      data: {
        userId: session.user.id,
        role: "assistant",
        content: responseData.message,
        suggestedUserIds: selectedUsers.map((u) => u.id),
      },
    });

    return NextResponse.json({
      message: responseData.message,
      users: selectedUsers,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
