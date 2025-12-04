import { PostData } from "@/lib/types";
import { User } from "@/generated/prisma";

export interface FeedScore {
  postId: string;
  score: number;
  reasons: Array<{
    type: 'interest' | 'follower' | 'engagement' | 'trending' | 'similar_users';
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

interface UserWithRelations extends User {
  following: Array<{ followingId: string }>;
  followers: Array<{ followerId: string }>;
}

export class SocialFeedAlgorithm {
  
  private jaccardSimilarity(setA: string[], setB: string[]): number {
    if (setA.length === 0 || setB.length === 0) return 0;
    
    const a = new Set(setA.map(s => s.toLowerCase()));
    const b = new Set(setB.map(s => s.toLowerCase()));
    const intersection = new Set([...a].filter(x => b.has(x)));
    const union = new Set([...a, ...b]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  scorePostForUser(
    post: PostData,
    currentUser: UserWithRelations,
    allUsers: UserWithRelations[]
  ): FeedScore {
    const reasons: FeedScore['reasons'] = [];
    let totalScore = 0;

    if (post.user.isVerified) {
      return {
        postId: post.id,
        score: 10,
        reasons: [
          {
            type: 'follower',
            description: 'Verified creator',
            weight: 1
          }
        ]
      };
    }

    const isFollowing = currentUser.following.some(f => f.followingId === post.userId);
    if (isFollowing) {
      totalScore += 0.4;
      reasons.push({
        type: 'follower',
        description: `From @${post.user.username}`,
        weight: 0.4
      });
    }

    const userInterests = currentUser.interests || [];
    const postTopics = this.extractTopicsFromPost(post);
    
    if (userInterests.length > 0 && postTopics.length > 0) {
      const interestScore = this.jaccardSimilarity(userInterests, postTopics);
      const weightedScore = interestScore * 0.25;
      totalScore += weightedScore;
      
      if (interestScore > 0.2) {
        const matches = userInterests.filter(i => 
          postTopics.some(t => t.toLowerCase().includes(i.toLowerCase()))
        );
        if (matches.length > 0) {
          reasons.push({
            type: 'interest',
            description: `Matches: ${matches.slice(0, 2).join(', ')}`,
            weight: weightedScore
          });
        }
      }
    }

    const likesCount = post._count.likes;
    const commentsCount = post._count.comments;
    const bookmarksCount = post.bookmarks.length;
    
    const engagementScore = Math.min(
      (likesCount * 2 + commentsCount * 3 + bookmarksCount * 4) / 100, 
      1
    );
    totalScore += engagementScore * 0.2;
    
    if (engagementScore > 0.3) {
      reasons.push({
        type: 'engagement',
        description: `${likesCount} likes, ${commentsCount} comments`,
        weight: engagementScore * 0.2
      });
    }

    const followingIds = currentUser.following.map(f => f.followingId);
    const authorFollowerCount = post.user._count?.followers || 0;
    const socialProofScore = Math.min(authorFollowerCount / 1000, 1) * 0.15;
    
    if (socialProofScore > 0.05) {
      totalScore += socialProofScore;
      reasons.push({
        type: 'follower',
        description: `Popular creator`,
        weight: socialProofScore
      });
    }

    const ageInHours = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
    const recencyScore = Math.max(0, 1 - ageInHours / 48) * 0.1;
    totalScore += recencyScore;

        if (ageInHours < 2) {
        reasons.push({
            type: 'trending',
            description: 'Recently posted',
            weight: recencyScore
        });
        }

    const similarUsers = this.findSimilarUsers(currentUser, allUsers, 20);
    const isSimilarUser = similarUsers.some(su => su.userId === post.userId);
    
    if (isSimilarUser) {
      totalScore += 0.1;
      reasons.push({
        type: 'similar_users',
        description: 'From similar user',
        weight: 0.1
      });
    }

    if (post.likes.some(like => like.userId === currentUser.id)) {
      totalScore *= 0.3;
    }
    if (post.bookmarks.some(bookmark => bookmark.userId === currentUser.id)) {
      totalScore *= 0.5;
    }

    return {
      postId: post.id,
      score: totalScore,
      reasons: reasons.sort((a, b) => b.weight - a.weight).slice(0, 2)
    };
  }

  generateFeed(
    currentUser: UserWithRelations,
    allPosts: PostData[],
    allUsers: UserWithRelations[],
    feedType: 'forYou' | 'following'
  ): Array<PostData & { feedScore: FeedScore }> {
    
    let filteredPosts = allPosts;

    if (feedType === 'following') {
      const followingIds = currentUser.following.map(f => f.followingId);
      filteredPosts = allPosts.filter(post => followingIds.includes(post.userId));
    }

    if (feedType === 'forYou') {
      filteredPosts = filteredPosts.filter(post => post.userId !== currentUser.id);
    }

    const scoredPosts = filteredPosts.map(post => {
      const feedScore = this.scorePostForUser(post, currentUser, allUsers);
      
      return {
        ...post,
        feedScore
      };
    }).filter(item => item.feedScore.score > 0.1);

    scoredPosts.sort((a, b) => b.feedScore.score - a.feedScore.score);

    return this.diversifyByAuthor(scoredPosts, 3);
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

  private diversifyByAuthor<T extends { userId: string }>(
    items: T[],
    maxPerAuthor: number
  ): T[] {
    const authorCounts = new Map<string, number>();
    const diversified: T[] = [];

    for (const item of items) {
      const count = authorCounts.get(item.userId) || 0;
      if (count < maxPerAuthor) {
        diversified.push(item);
        authorCounts.set(item.userId, count + 1);
      }
    }

    return diversified;
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
