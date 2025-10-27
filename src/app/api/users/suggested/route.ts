import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { SocialFeedAlgorithm } from "@/lib/algorithms/social-feed-engine";

export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        interests: true,
        following: {
          select: { followingId: true }
        },
        followers: {
          select: { followerId: true }
        }
      }
    });

    if (!currentUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const followingIds = currentUser.following.map(f => f.followingId);

    const candidateUsers = await prisma.user.findMany({
      where: {
        id: {
          notIn: [user.id, ...followingIds]
        }
      },
      take: 100,
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        interests: true,
        following: {
          select: { followingId: true }
        },
        followers: {
          select: { followerId: true }
        }
      }
    });

    const algorithm = new SocialFeedAlgorithm();
    const suggestions = algorithm.findSimilarUsers(
      currentUser as any,
      candidateUsers as any,
      5
    );

    const suggestedUserIds = suggestions.map(s => s.userId);
    const suggestedUsers = await prisma.user.findMany({
      where: {
        id: { in: suggestedUserIds }
      },
      select: getUserDataSelect(user.id)
    });

    const enrichedSuggestions = suggestedUsers.map(userData => {
      const suggestion = suggestions.find(s => s.userId === userData.id);
      return {
        ...userData,
        score: suggestion?.score,
        mutualFollowers: suggestion?.mutualFollowers,
        commonInterests: suggestion?.commonInterests,
        reasons: suggestion?.reasons || []
      };
    });

    enrichedSuggestions.sort((a, b) => (b.score || 0) - (a.score || 0));

    return Response.json(enrichedSuggestions);
  } catch (error) {
    console.error("Suggested users error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}