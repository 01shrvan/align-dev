import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import ChatClient from "./ChatClient";
import { redirect } from "next/navigation";

interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  occupation: string | null;
  bio: string | null;
  interests: string[];
  tags: string[];
}

interface Message {
  role: "user" | "assistant";
  content: string;
  users?: User[];
}

export default async function ChatPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const history = await prisma.aIChatMessage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  const allSuggestedUserIds = new Set<string>();
  history.forEach((msg) => {
    msg.suggestedUserIds.forEach((id) => allSuggestedUserIds.add(id));
  });

  const profiles = await prisma.user.findMany({
    where: {
      id: { in: Array.from(allSuggestedUserIds) },
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      occupation: true,
      bio: true,
      interests: true,
      tags: true,
    },
  });

  const profilesMap = new Map(profiles.map((p) => [p.id, p]));

  const messages: Message[] = history.map((msg) => {
    const suggestedUsers = msg.suggestedUserIds
      .map((id) => profilesMap.get(id))
      .filter((u) => u !== undefined) as User[];

    return {
      role: msg.role as "user" | "assistant",
      content: msg.content,
      users: suggestedUsers.length > 0 ? suggestedUsers : undefined,
    };
  });

  return <ChatClient initialMessages={messages} assistantName="Ava" />;
}
