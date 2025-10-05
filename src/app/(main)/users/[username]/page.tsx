import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import TrendsSidebar from "@/components/TrendsSidebar";
import prisma from "@/lib/prisma";
import { type FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import UserPosts from "./UserPosts";
import EditProfileButton from "./EditProfileButton";
import * as AvatarComponent from "@/components/ui/avatar";

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
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);
  return {
    title: `${user.displayName} (@${user.username})`,
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
      ({ followerId }) => followerId === loggedInUser.id,
    ),
  };

  const interests = user.interests ?? [];

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <AvatarComponent.Avatar className="mx-auto size-48">
        <AvatarComponent.AvatarImage src={user.avatarUrl as string} />
        <AvatarComponent.AvatarFallback>
          {user.username[0]}
        </AvatarComponent.AvatarFallback>
      </AvatarComponent.Avatar>

      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
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

      <hr />

      <div className="space-y-3 text-sm sm:text-base">
        <div>
          <strong>Bio:</strong>{" "}
          {user.bio ? (
            <p className="whitespace-pre-line break-words">{user.bio}</p>
          ) : (
            <span className="text-muted-foreground italic">No bio yet</span>
          )}
        </div>

        <div>
          <strong>Occupation:</strong>{" "}
          {user.occupation ? (
            <span>{user.occupation}</span>
          ) : (
            <span className="text-muted-foreground italic">
              No occupation specified
            </span>
          )}
        </div>

        <div>
          <strong>Location:</strong>{" "}
          {user.location ? (
            <span>{user.location}</span>
          ) : (
            <span className="text-muted-foreground italic">
              No location specified
            </span>
          )}
        </div>

        <div>
          <strong>Interests:</strong>{" "}
          {interests.length > 0 ? (
            <div className="mt-1 flex flex-wrap gap-2">
              {interests.map((interest, i) => (
                <span
                  key={i}
                  className="rounded-full bg-muted px-3 py-1 text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground italic">
              No interests added
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
