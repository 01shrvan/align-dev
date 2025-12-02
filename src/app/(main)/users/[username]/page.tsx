import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import TrendsSidebar from "@/components/TrendsSidebar";
import prisma from "@/lib/prisma";
import { type FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import type { Metadata } from "next";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { cache } from "react";
import UserPosts from "./UserPosts";
import EditProfileButton from "./EditProfileButton";
import * as AvatarComponent from "@/components/ui/avatar";
import VerifiedBadge from "@/components/VerifiedBadge";

interface PageProps {
  params: Promise<{ username: string }>;
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      isVerified: true,
      createdAt: true,
      interests: true,
      occupation: true,
      location: true,
      age: true,
      gender: true,
      _count: {
        select: {
          posts: true,
          followers: true,
        },
      },
      followers: {
        where: {
          followerId: loggedInUserId,
        },
        select: {
          followerId: true,
        },
      },
    },
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      interests: true,
      occupation: true,
      location: true,
      createdAt: true,
      _count: { select: { posts: true, followers: true } },
    },
  });

  if (!user) {
    return { title: "User not found" };
  }

  const interestSummary = (user.interests ?? []).slice(0, 3).join(", ");
  const details: string[] = [];
  if (user.occupation) details.push(user.occupation);
  if (user.location) details.push(user.location);
  const counts = `Posts: ${formatNumber(user._count.posts)} · Followers: ${formatNumber(user._count.followers)}`;

  const baseDescription = user.bio?.trim()
    ? (user.bio.length > 200 ? `${user.bio.slice(0, 197)}...` : user.bio)
    : [details.join(" • "), interestSummary ? `Interests: ${interestSummary}` : null, counts]
        .filter(Boolean)
        .join(" • ");

  const image = user.avatarUrl || "/assets/opengraph-image.png";
  const description = user.avatarUrl
    ? baseDescription
    : `Discover ${user.displayName} on Align — where thoughts find their people. ${counts}${interestSummary ? ` • Interests: ${interestSummary}` : ""}`.slice(0, 240);
  const url = `/users/${user.username}`;

  return {
    title: `${user.displayName} (@${user.username})`,
    description,
    openGraph: {
      type: "profile",
      url,
      title: `${user.displayName} (@${user.username})`,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${user.displayName} (@${user.username})`,
      description,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

export default async function Page({ params }: PageProps) {
  const { username } = await params;
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <div className="flex-1 pl-5 ml-5 border-l border-dashed border-border">
      <main className="flex w-full min-w-0">
        <div className="w-full min-w-0 space-y-5 border-r border-dashed border-border pr-5 mr-5">
          <UserProfile user={user} loggedInUserId={loggedInUser.id} />
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <h2 className="text-center text-2xl font-bold">
              {user.displayName}&apos;s posts
            </h2>
          </div>
          <UserPosts userId={user.id} />
        </div>
        <TrendsSidebar />
      </main>
    </div>
  );
}

interface UserProfileProps {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    createdAt: Date;
    interests: string[];
    occupation: string | null;
    location: string | null;
    age: number | null;
    gender: string | null;
    _count: {
      posts: number;
      followers: number;
    };
    followers: {
      followerId: string;
    }[];
  };
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  const interests = user.interests ?? [];

  const bioSections = parseBioSections(user.bio);

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <AvatarComponent.Avatar className="mx-auto size-48">
        <AvatarComponent.AvatarImage src={user.avatarUrl as string} />
        <AvatarComponent.AvatarFallback>
          {user.username[0].toUpperCase()}
        </AvatarComponent.AvatarFallback>
      </AvatarComponent.Avatar>

      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {user.displayName}
              {user.isVerified && <VerifiedBadge size={18} />}
            </h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div className="text-sm text-muted-foreground">
            Member since {formatDate(user.createdAt, "MMM d, yyyy")}
          </div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>

        {user.id === loggedInUserId ? (
          <EditProfileButton user={user} />
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>

      {(user.location || user.age || user.occupation) && (
        <>
          <hr />
          <div className="flex flex-wrap gap-4 text-sm">
            {user.location && (
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">📍</span>
                <span>{user.location}</span>
              </div>
            )}
            {user.age && (
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">🎂</span>
                <span>{user.age} years old</span>
              </div>
            )}
            {user.occupation && (
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">💼</span>
                <span>{user.occupation}</span>
              </div>
            )}
          </div>
        </>
      )}

      <hr />

      {bioSections.story && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Their Story
          </h3>
          <p className="whitespace-pre-line break-words leading-relaxed">
            {bioSections.story}
          </p>
        </div>
      )}

      {bioSections.creating && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Creating
          </h3>
          <p className="whitespace-pre-line break-words leading-relaxed">
            {bioSections.creating}
          </p>
        </div>
      )}

      {bioSections.why && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Why It Matters
          </h3>
          <p className="whitespace-pre-line break-words leading-relaxed">
            {bioSections.why}
          </p>
        </div>
      )}

      {!bioSections.story && !bioSections.creating && !bioSections.why && user.bio && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            About
          </h3>
          <p className="whitespace-pre-line break-words leading-relaxed">
            {user.bio}
          </p>
        </div>
      )}

      {!user.bio && (
        <div className="text-center py-4">
          <p className="text-muted-foreground italic text-sm">
            No story shared yet
          </p>
        </div>
      )}

      {interests.length > 0 && (
        <>
          <hr />
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, i) => (
                <span
                  key={i}
                  className="rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function parseBioSections(bio: string | null): {
  story?: string;
  creating?: string;
  why?: string;
} {
  if (!bio) return {};

  const sections = bio.split("\n\n").filter(s => s.trim());

  if (sections.length === 3) {
    return {
      story: sections[0].trim(),
      creating: sections[1].trim(),
      why: sections[2].trim(),
    };
  }

  return {};
}
