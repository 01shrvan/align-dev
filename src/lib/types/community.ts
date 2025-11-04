import { Prisma } from "@/generated/prisma";

export function getCommunityDataSelect(loggedInUserId: string) {
  return {
    id: true,
    name: true,
    slug: true,
    description: true,
    avatarUrl: true,
    bannerUrl: true,
    category: true,
    isOfficial: true,
    type: true,
    privacy: true,
    memberCount: true,
    postCount: true,
    createdAt: true,
    creator: {
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
      }
    },
    members: {
      where: {
        userId: loggedInUserId
      },
      select: {
        role: true,
        joinedAt: true
      }
    },
    _count: {
      select: {
        members: true,
        posts: true,
        messages: true
      }
    }
  } satisfies Prisma.CommunitySelect;
}

export type CommunityData = Prisma.CommunityGetPayload<{
  select: ReturnType<typeof getCommunityDataSelect>;
}>;

export interface CommunitiesPage {
  communities: CommunityData[];
  nextCursor: string | null;
}

export const COMMUNITY_CATEGORIES = [
  'Technology',
  'Gaming',
  'Art & Design',
  'Music',
  'Sports',
  'Education',
  'Business',
  'Health & Fitness',
  'Food & Cooking',
  'Travel',
  'Science',
  'Entertainment',
  'Fashion',
  'Photography',
  'Books',
  'General'
] as const;