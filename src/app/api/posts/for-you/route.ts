import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { SocialFeedAlgorithm } from "@/lib/algorithms/social-feed-engine";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;

    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
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

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const posts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      take: 200,
      orderBy: { createdAt: "desc" },
      include: getPostDataInclude(user.id),
    });

    const followingIds = currentUser.following.map(f => f.followingId);
    const postAuthorIds = [...new Set(posts.map(p => p.userId))];
    const relevantUserIds = [...new Set([...followingIds, ...postAuthorIds])];

    const allUsers = await prisma.user.findMany({
      where: {
        id: { in: relevantUserIds }
      },
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
        },
        _count: {
          select: {
            followers: true,
            posts: true
          }
        }
      }
    });

    const algorithm = new SocialFeedAlgorithm();
    const scoredPosts = algorithm.generateFeed(
      currentUser as any,
      posts,
      allUsers as any,
      'forYou'
    );

    let paginatedPosts = scoredPosts;
    if (cursor) {
      const cursorIndex = scoredPosts.findIndex(p => p.id === cursor);
      if (cursorIndex !== -1) {
        paginatedPosts = scoredPosts.slice(cursorIndex + 1);
      }
    }

    const finalPosts = paginatedPosts.slice(0, pageSize);

    const serializedPosts = finalPosts.map(post => ({
      id: post.id,
      content: post.content,
      userId: post.userId,
      createdAt: post.createdAt,
      user: {
        id: post.user.id,
        username: post.user.username,
        displayName: post.user.displayName,
        avatarUrl: post.user.avatarUrl,
        bio: post.user.bio,
        isVerified: post.user.isVerified,
        createdAt: post.user.createdAt,
        followers: post.user.followers,
        _count: post.user._count,
      },
      attachments: post.attachments,
      likes: post.likes,
      bookmarks: post.bookmarks,
      _count: post._count,
      feedScore: post.feedScore,
    }));

    const data: PostsPage = {
      posts: serializedPosts as any,
      nextCursor: finalPosts.length === pageSize 
        ? finalPosts[finalPosts.length - 1].id 
        : null,
    };

    return Response.json(data);
  } catch (error) {
    console.error("For You feed error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}