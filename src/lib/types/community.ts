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
        posts: true
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

export interface CommunityMemberInfo {
  isMember: boolean;
  role?: 'ADMIN' | 'MODERATOR' | 'MEMBER';
  joinedAt?: Date;
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

export type CommunityCategory = typeof COMMUNITY_CATEGORIES[number];

export const OFFICIAL_COMMUNITIES = [
  {
    name: 'Welcome',
    slug: 'welcome',
    description: 'Welcome to our platform! Introduce yourself and meet the community.',
    category: 'General',
    avatarUrl: '/communities/welcome.png'
  },
  {
    name: 'Announcements',
    slug: 'announcements',
    description: 'Official announcements and updates from the team.',
    category: 'General',
    avatarUrl: '/communities/announcements.png'
  },
  {
    name: 'Tech Talk',
    slug: 'tech-talk',
    description: 'Discuss the latest in technology, programming, and innovation.',
    category: 'Technology',
    avatarUrl: '/communities/tech.png'
  },
  {
    name: 'Creative Corner',
    slug: 'creative-corner',
    description: 'Share your art, designs, and creative projects.',
    category: 'Art & Design',
    avatarUrl: '/communities/creative.png'
  },
  {
    name: 'Career Hub',
    slug: 'career-hub',
    description: 'Job opportunities, career advice, and professional networking.',
    category: 'Business',
    avatarUrl: '/communities/career.png'
  }
];