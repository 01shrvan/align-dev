import { validateRequest } from "@/auth";
import {
  needsFeedPersonalizationRefresh,
  queueFeedPersonalizationRefresh,
} from "@/lib/ai/feed-personalization";
import prisma from "@/lib/prisma";

export async function POST() {
  const { user } = await validateRequest();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      interests: true,
      aiSuggestedInterests: true,
      persona: true,
      personaTraits: true,
    },
  });

  if (!currentUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const shouldQueueRefresh = needsFeedPersonalizationRefresh(currentUser);
  const queued = shouldQueueRefresh
    ? queueFeedPersonalizationRefresh(currentUser.id)
    : false;

  return Response.json({
    queued,
    reason: shouldQueueRefresh
      ? queued
        ? "Refresh queued"
        : "Refresh recently attempted"
      : "Feed profile already enriched",
  });
}
