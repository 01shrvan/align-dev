"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { FollowerInfo, UserData } from "@/lib/types";
import Link from "next/link";
import { PropsWithChildren } from "react";
import FollowButton from "./FollowButton";
import FollowerCount from "./FollowerCount";
import Linkify from "./Linkify";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import * as AvatarComponent from "@/components/ui/avatar";

interface UserTooltipProps extends PropsWithChildren {
  user: UserData;
}

export default function UserTooltip({ children, user }: UserTooltipProps) {
  const { user: loggedInUser } = useSession();

  const followerState: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: !!user.followers.some(
      ({ followerId }) => followerId === loggedInUser.id,
    ),
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="bg-card rounded-lg shadow-lg p-0">
          <div className="flex max-w-80 flex-col gap-3 break-words px-4 py-4 md:min-w-52 text-white">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`}>
                <AvatarComponent.Avatar>
                  <AvatarComponent.AvatarImage src={user.avatarUrl as string} />
                  <AvatarComponent.AvatarFallback>
                    {user.username[0]}
                  </AvatarComponent.AvatarFallback>
                </AvatarComponent.Avatar>
              </Link>
              {loggedInUser.id !== user.id && (
                <FollowButton userId={user.id} initialState={followerState} />
              )}
            </div>
            <div>
              <Link href={`/users/${user.username}`}>
                <div className="text-lg font-semibold font-bold hover:underline">
                  {user.displayName}
                </div>
                <div className="text-muted-foreground font-bold">
                  @{user.username}
                </div>
              </Link>
            </div>
            {user.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line text-sm text-muted-foreground">
                  {user.bio}
                </div>
              </Linkify>
            )}
            <div className="font-bold">
              <FollowerCount userId={user.id} initialState={followerState} />
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
