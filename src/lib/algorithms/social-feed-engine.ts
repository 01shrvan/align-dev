import { PostData } from "@/lib/types";
import type { FeedPersonalizationSignals } from "@/lib/ai/feed-personalization";

export interface FeedScore {
  postId: string;
  score: number;
  reasons: Array<{
    type:
      | "interest"
      | "follower"
      | "engagement"
      | "trending"
      | "similar_users"
      | "cold_feed"
      | "ai_interest"
      | "discovery"
      | "verified";
    description: string;
    weight: number;
  }>;
}

export interface SuggestedUser {
  userId: string;
  score: number;
  mutualFollowers: number;
  commonInterests: string[];
  reasons: string[];
}

interface UserWithRelations {
  id: string;
  interests: string[];
  bio: string | null;
  following: Array<{ followingId: string }>;
  followers: Array<{ followerId: string }>;
}

interface FeedState {
  isCold: boolean;
  newestPostAge: number;
  totalPosts: number;
}

export class SocialFeedAlgorithm {

  private readonly MIN_FEED_ITEMS = 20;

  private readonly COLD_FEED_THRESHOLD_HOURS = 48;

  private readonly VERIFIED_PRIOR_WEIGHT = 0.05;

  private readonly MAX_VERIFIED_RATIO = 0.2;

  private readonly EMERGING_CREATOR_FOLLOWER_THRESHOLD = 150;

  private jaccardSimilarity(setA: string[], setB: string[]): number {
    if (setA.length === 0 || setB.length === 0) return 0;

    const a = new Set(setA.map(s => s.toLowerCase()));
    const b = new Set(setB.map(s => s.toLowerCase()));
    const intersection = new Set([...a].filter(x => b.has(x)));
    const union = new Set([...a, ...b]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }

  private detectFeedState(posts: PostData[]): FeedState {
    if (posts.length === 0) {
      return {
        isCold: true,
        newestPostAge: Infinity,
        totalPosts: 0
      };
    }

    const now = Date.now();
    const newestPost = posts.reduce((newest, post) => {
      const postTime = new Date(post.createdAt).getTime();
      return postTime > newest ? postTime : newest;
    }, 0);

    const newestPostAge = (now - newestPost) / (1000 * 60 * 60);
    const isCold = newestPostAge > this.COLD_FEED_THRESHOLD_HOURS;

    return {
      isCold,
      newestPostAge,
      totalPosts: posts.length
    };
  }

  private calculateRecencyScore(ageInHours: number, isColdFeed: boolean): number {
    if (isColdFeed) {
      return Math.exp(-ageInHours / 168);
    } else {
      return Math.exp(-ageInHours / 48);
    }
  }

  private calculateEmergingCreatorBoost(
    followerCount: number,
    exploreRatio: number,
  ): number {
    const scarcity = Math.max(
      0,
      1 - followerCount / this.EMERGING_CREATOR_FOLLOWER_THRESHOLD,
    );
    const normalizedExploreRatio = Math.min(Math.max(exploreRatio, 0.1), 0.4);

    return scarcity * normalizedExploreRatio * 0.12;
  }

  scorePostForUser(
    post: PostData,
    currentUser: UserWithRelations,
    allUsers: UserWithRelations[],
    feedState: FeedState,
    personalizationSignals?: FeedPersonalizationSignals,
    similarUserIds?: Set<string>,
  ): FeedScore {
    const reasons: FeedScore["reasons"] = [];
    let totalScore = 0;

    if (!post.user) {
      console.error("Post missing user in scorePostForUser:", post.id);
      return {
        postId: post.id,
        score: 0,
        reasons: [],
      };
    }

    const exploreRatio = personalizationSignals?.exploreRatio ?? 0.24;
    const userInterests = currentUser.interests || [];
    const aiInterests = personalizationSignals?.adjacentInterests || [];
    const postTopics = this.extractTopicsFromPost(post);
    const likesCount = post._count.likes;
    const commentsCount = post._count.comments;
    const bookmarksCount = post.bookmarks.length;
    const authorFollowerCount = post.user._count?.followers || 0;

    const isFollowing = currentUser.following.some(
      (following) => following.followingId === post.userId,
    );
    const isSimilarUser = similarUserIds
      ? similarUserIds.has(post.userId)
      : this.findTopSimilarUsers(currentUser, allUsers, 20).some(
          (similarUser) => similarUser.userId === post.userId,
        );

    const coreInterestScore =
      userInterests.length > 0 && postTopics.length > 0
        ? this.jaccardSimilarity(userInterests, postTopics)
        : 0;
    const adjacentInterestScore =
      aiInterests.length > 0 && postTopics.length > 0
        ? this.jaccardSimilarity(aiInterests, postTopics)
        : 0;

    const relationshipRaw = (isFollowing ? 1 : 0) + (isSimilarUser ? 0.5 : 0);
    const relationshipScore = Math.min(1, relationshipRaw / 1.5);

    const predictedEngagementRaw =
      likesCount * 2 + commentsCount * 3 + bookmarksCount * 5;
    const predictedEngagementScore = Math.min(predictedEngagementRaw / 120, 1);

    const ageInHours =
      (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
    const recencyScore = this.calculateRecencyScore(ageInHours, feedState.isCold);

    const noveltyScore =
      (!isFollowing ? 0.6 : 0) +
      (authorFollowerCount <= this.EMERGING_CREATOR_FOLLOWER_THRESHOLD ? 0.4 : 0);
    const normalizedNoveltyScore = Math.min(1, noveltyScore);

    const fairnessScore = Math.max(
      0,
      1 - authorFollowerCount / (this.EMERGING_CREATOR_FOLLOWER_THRESHOLD * 3),
    );

    totalScore += coreInterestScore * 0.3;
    totalScore += adjacentInterestScore * 0.12;
    totalScore += relationshipScore * 0.14;
    totalScore += predictedEngagementScore * 0.16;
    totalScore += recencyScore * 0.1;
    totalScore += normalizedNoveltyScore * 0.08;
    totalScore += fairnessScore * 0.08;

    if (post.user.isVerified) {
      totalScore += this.VERIFIED_PRIOR_WEIGHT;
      reasons.push({
        type: "verified",
        description: "Verified creator",
        weight: this.VERIFIED_PRIOR_WEIGHT,
      });
    }

    if (coreInterestScore > 0.15) {
      const matches = userInterests.filter((interest) =>
        postTopics.some((topic) =>
          topic.toLowerCase().includes(interest.toLowerCase()),
        ),
      );
      if (matches.length > 0) {
        reasons.push({
          type: "interest",
          description: `Matches: ${matches.slice(0, 2).join(", ")}`,
          weight: coreInterestScore * 0.3,
        });
      }
    }

    if (adjacentInterestScore > 0.14) {
      const adjacentMatches = aiInterests.filter((interest) =>
        postTopics.some((topic) =>
          topic.toLowerCase().includes(interest.toLowerCase()),
        ),
      );
      if (adjacentMatches.length > 0) {
        reasons.push({
          type: "ai_interest",
          description: `Adjacent: ${adjacentMatches.slice(0, 2).join(", ")}`,
          weight: adjacentInterestScore * 0.12,
        });
      }
    }

    if (relationshipScore > 0.45) {
      reasons.push({
        type: isFollowing ? "follower" : "similar_users",
        description: isFollowing ? `From @${post.user.username}` : "From similar user",
        weight: relationshipScore * 0.14,
      });
    }

    if (normalizedNoveltyScore > 0.5 || fairnessScore > 0.5) {
      const discoveryWeight = Math.max(
        normalizedNoveltyScore * 0.08,
        fairnessScore * 0.08,
      );
      reasons.push({
        type: "discovery",
        description: "Emerging creator",
        weight: discoveryWeight,
      });
    }

    if (predictedEngagementScore > 0.3) {
      reasons.push({
        type: "engagement",
        description: `${likesCount} likes, ${commentsCount} comments`,
        weight: predictedEngagementScore * 0.16,
      });
    }

    if (ageInHours < 2) {
      reasons.push({
        type: "trending",
        description: "Recently posted",
        weight: recencyScore * 0.1,
      });
    }

    totalScore += this.calculateEmergingCreatorBoost(authorFollowerCount, exploreRatio);

    if (post.likes.some((like) => like.userId === currentUser.id)) {
      totalScore *= 0.3;
    }
    if (post.bookmarks.some((bookmark) => bookmark.userId === currentUser.id)) {
      totalScore *= 0.5;
    }

    return {
      postId: post.id,
      score: totalScore,
      reasons: reasons.sort((a, b) => b.weight - a.weight).slice(0, 2),
    };
  }

  generateFeed(
    currentUser: UserWithRelations,
    allPosts: PostData[],
    allUsers: UserWithRelations[],
    feedType: "forYou" | "following",
    personalizationSignals?: FeedPersonalizationSignals,
  ): Array<PostData & { feedScore: FeedScore }> {
    const feedState = this.detectFeedState(allPosts);

    const validPosts = allPosts.filter((post) => {
      if (!post.user) {
        console.error("Filtering out post without user data:", post.id);
        return false;
      }
      return true;
    });

    const followingIds = new Set(
      currentUser.following.map((following) => following.followingId),
    );
    const availableUserIds = new Set(allUsers.map((user) => user.id));

    const candidatePosts = validPosts.filter((post) => {
      if (feedType === "forYou" && post.userId === currentUser.id) {
        return false;
      }

      if (feedType === "following" && !followingIds.has(post.userId)) {
        return false;
      }

      return availableUserIds.has(post.userId);
    });

    const similarUserIds = new Set(
      this.findTopSimilarUsers(currentUser, allUsers, 20).map(
        (similarUser) => similarUser.userId,
      ),
    );

    const scoredPosts = candidatePosts.map((post) => ({
      ...post,
      user: post.user,
      feedScore: this.scorePostForUser(
        post,
        currentUser,
        allUsers,
        feedState,
        personalizationSignals,
        similarUserIds,
      ),
    }));

    const scoreThreshold = feedState.isCold ? 0.03 : 0.06;
    const sortedScoredPosts = scoredPosts
      .filter((item) => item.feedScore.score > scoreThreshold)
      .sort((a, b) => b.feedScore.score - a.feedScore.score);

    const finalScoredPosts =
      feedType === "forYou"
        ? this.composeForYouMix(sortedScoredPosts, currentUser, personalizationSignals)
        : sortedScoredPosts;

    const verifiedBalancedFeed = this.balanceVerifiedPresence(
      finalScoredPosts,
      this.MAX_VERIFIED_RATIO,
    );
    const diversifiedFeed = this.diversifyByAuthor(verifiedBalancedFeed, 2);
    const jitteredFeed = this.jitterWithinBands(diversifiedFeed);

    if (jitteredFeed.length < this.MIN_FEED_ITEMS && feedType === "forYou") {
      const includedIds = new Set(jitteredFeed.map((post) => post.id));
      const remainingPosts = validPosts
        .filter((post) => !includedIds.has(post.id) && post.userId !== currentUser.id)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

      const backfillNeeded = this.MIN_FEED_ITEMS - diversifiedFeed.length;
      const backfillPosts = remainingPosts.slice(0, backfillNeeded).map((post) => ({
        ...post,
        user: post.user,
        feedScore: {
          postId: post.id,
          score: 0.01,
          reasons: [
            {
              type: "cold_feed" as const,
              description: "Showing posts due to low activity",
              weight: 0.01,
            },
          ],
        },
      }));

      return [...jitteredFeed, ...backfillPosts];
    }

    return jitteredFeed;
  }

  findSimilarUsers(
    currentUser: UserWithRelations,
    allUsers: UserWithRelations[],
    limit: number = 10
  ): SuggestedUser[] {

    const currentFollowingIds = currentUser.following.map(f => f.followingId);

    return allUsers
      .filter(user =>
        user.id !== currentUser.id &&
        !currentFollowingIds.includes(user.id)
      )
      .map(user => {
        let score = 0;

        const userFollowerIds = user.followers?.map(f => f.followerId) || [];
        const currentFollowerIds = currentUser.followers?.map(f => f.followerId) || [];

        const mutualFollowers = userFollowerIds.filter(id =>
          currentFollowerIds.includes(id) || currentFollowingIds.includes(id)
        ).length;

        score += Math.min(mutualFollowers * 0.1, 0.4);

        const userInterests = user.interests || [];
        const currentInterests = currentUser.interests || [];

        const interestSimilarity = this.jaccardSimilarity(userInterests, currentInterests);
        score += interestSimilarity * 0.3;

        const commonInterests = userInterests.filter(i =>
          currentInterests.some(ci => ci.toLowerCase() === i.toLowerCase())
        );

        const userFollowingIds = user.following?.map(f => f.followingId) || [];
        const followingOverlap = this.jaccardSimilarity(currentFollowingIds, userFollowingIds);
        score += followingOverlap * 0.3;

        const reasons: string[] = [];
        if (mutualFollowers > 0) {
          reasons.push(`${mutualFollowers} mutual connection${mutualFollowers > 1 ? 's' : ''}`);
        }
        if (commonInterests.length > 0) {
          reasons.push(`${commonInterests.slice(0, 2).join(', ')}`);
        }
        if (user.bio) {
          reasons.push(user.bio.slice(0, 60));
        }
        if (followingOverlap > 0.2) {
          reasons.push('Similar network');
        }

        return {
          userId: user.id,
          score,
          mutualFollowers,
          commonInterests,
          reasons: reasons.filter(r => r).slice(0, 2)
        };
      })
      .filter(suggestion => suggestion.score > 0.15)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private extractTopicsFromPost(post: PostData): string[] {
    const topics: string[] = [];

    if (post.content) {
      const hashtags = post.content.match(/#(\w+)/g);
      if (hashtags) {
        topics.push(...hashtags.map(tag => tag.slice(1).toLowerCase()));
      }

      const words = post.content.toLowerCase().split(/\s+/);
      const keywords = words.filter(word =>
        word.length > 4 &&
        !['about', 'their', 'there', 'where', 'these', 'those'].includes(word)
      );
      topics.push(...keywords.slice(0, 5));
    }

    return [...new Set(topics)];
  }

  private findTopSimilarUsers(
    currentUser: UserWithRelations,
    allUsers: UserWithRelations[],
    limit: number
  ): SuggestedUser[] {
    return allUsers
      .filter(user => user.id !== currentUser.id)
      .map(user => {
        const userInterests = user.interests || [];
        const currentInterests = currentUser.interests || [];
        const score = this.jaccardSimilarity(userInterests, currentInterests);

        return {
          userId: user.id,
          score,
          mutualFollowers: 0,
          commonInterests: [],
          reasons: []
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private composeForYouMix<
    T extends {
      userId: string;
      user: { isVerified?: boolean; _count?: { followers?: number } };
      feedScore: FeedScore;
    },
  >(
    items: T[],
    currentUser: UserWithRelations,
    personalizationSignals?: FeedPersonalizationSignals,
  ): T[] {
    const exploreRatio = personalizationSignals?.exploreRatio ?? 0.24;
    const followingSet = new Set(
      currentUser.following.map((following) => following.followingId),
    );

    const coreInterestPool = items.filter((item) =>
      item.feedScore.reasons.some((reason) => reason.type === "interest"),
    );
    const adjacentInterestPool = items.filter((item) =>
      item.feedScore.reasons.some((reason) => reason.type === "ai_interest"),
    );
    const socialPool = items.filter((item) => followingSet.has(item.userId));
    const emergingPool = items.filter((item) => {
      const followers = item.user._count?.followers || 0;
      return followers <= this.EMERGING_CREATOR_FOLLOWER_THRESHOLD;
    });
    const wildcardPool = [...items];

    const targetCount = Math.max(this.MIN_FEED_ITEMS, Math.min(items.length, 40));
    const counts = {
      core: Math.max(4, Math.floor(targetCount * (0.45 - exploreRatio * 0.2))),
      social: Math.max(2, Math.floor(targetCount * 0.2)),
      emerging: Math.max(3, Math.floor(targetCount * (0.18 + exploreRatio * 0.25))),
      adjacent: Math.max(2, Math.floor(targetCount * (0.1 + exploreRatio * 0.2))),
      wildcard: Math.max(1, Math.floor(targetCount * 0.07)),
    };

    const selected: T[] = [];
    const selectedIds = new Set<string>();

    const pickFromPool = (pool: T[], amount: number) => {
      if (amount <= 0) {
        return;
      }

      let picked = 0;

      for (const item of pool) {
        if (selected.length >= targetCount || picked >= amount) {
          break;
        }

        if (selectedIds.has(item.feedScore.postId)) {
          continue;
        }

        selected.push(item);
        selectedIds.add(item.feedScore.postId);
        picked += 1;
      }
    };

    pickFromPool(coreInterestPool, counts.core);
    pickFromPool(socialPool, counts.social);
    pickFromPool(emergingPool, counts.emerging);
    pickFromPool(adjacentInterestPool, counts.adjacent);
    pickFromPool(wildcardPool, counts.wildcard);

    for (const item of items) {
      if (selected.length >= items.length) {
        break;
      }

      if (selectedIds.has(item.feedScore.postId)) {
        continue;
      }

      selected.push(item);
      selectedIds.add(item.feedScore.postId);
    }

    return selected;
  }

  private jitterWithinBands<T extends { feedScore: { score: number } }>(
    items: T[],
  ): T[] {
    if (items.length <= 6) {
      return items;
    }

    const sorted = [...items].sort((a, b) => b.feedScore.score - a.feedScore.score);
    const chunkSize = 4;
    const jittered: T[] = [];

    for (let index = 0; index < sorted.length; index += chunkSize) {
      const chunk = sorted.slice(index, index + chunkSize);
      chunk.sort(() => Math.random() - 0.5);
      jittered.push(...chunk);
    }

    return jittered;
  }

  private balanceVerifiedPresence<
    T extends { userId: string; user: { isVerified?: boolean } },
  >(
    items: T[],
    maxVerifiedRatio: number,
  ): T[] {
    if (!items.length) {
      return items;
    }

    const maxVerifiedItems = Math.max(1, Math.floor(items.length * maxVerifiedRatio));
    let includedVerified = 0;

    const prioritized: T[] = [];
    const deferredVerified: T[] = [];

    for (const item of items) {
      if (item.user?.isVerified) {
        if (includedVerified < maxVerifiedItems) {
          prioritized.push(item);
          includedVerified += 1;
        } else {
          deferredVerified.push(item);
        }
      } else {
        prioritized.push(item);
      }
    }

    return [...prioritized, ...deferredVerified];
  }

  private diversifyByAuthor<T extends { userId: string }>(
    items: T[],
    maxPerAuthor: number,
  ): T[] {
    const authorCounts = new Map<string, number>();
    const diversifiedItems: T[] = [];

    for (const item of items) {
      const count = authorCounts.get(item.userId) || 0;
      if (count >= maxPerAuthor) {
        continue;
      }

      diversifiedItems.push(item);
      authorCounts.set(item.userId, count + 1);
    }

    return diversifiedItems;
  }

  getTrendingPosts(allPosts: PostData[], hoursWindow: number = 24): PostData[] {
    const cutoffTime = Date.now() - hoursWindow * 60 * 60 * 1000;

    return allPosts
      .filter(post => new Date(post.createdAt).getTime() > cutoffTime)
      .map(post => ({
        post,
        trendScore: this.calculateTrendScore(post)
      }))
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, 20)
      .map(item => item.post);
  }

  private calculateTrendScore(post: PostData): number {
    const ageInHours = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
    const likes = post._count.likes;
    const comments = post._count.comments;
    const bookmarks = post.bookmarks.length;

    const velocity = (likes * 2 + comments * 3 + bookmarks * 5) / Math.max(ageInHours, 0.5);

    return velocity;
  }
}
