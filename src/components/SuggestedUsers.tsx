"use client";

import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { UserData } from "@/lib/types";
import UserTooltip from "./UserTooltip";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Users } from "@/lib/icons";
import FollowButton from "./FollowButton";
import { Loader2 } from "@/lib/icons";

interface SuggestedUser extends UserData {
    score?: number;
    reasons?: string[];
    mutualFollowers?: number;
    commonInterests?: string[];
}

export default function SuggestedUsers() {
    const { data: suggestions, isLoading } = useQuery({
        queryKey: ["suggested-users"],
        queryFn: () =>
            kyInstance
                .get("/api/users/suggested")
                .json<SuggestedUser[]>(),
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading) {
        return (
            <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
                <div className="text-xl font-bold flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Who to follow
                </div>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }

    if (!suggestions?.length) {
        return null;
    }

    return (
        <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
            <div className="text-xl font-bold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Who to follow
            </div>
            {suggestions.map((user) => (
                <div key={user.id} className="flex items-center justify-between gap-3">
                    <UserTooltip user={user}>
                        <Link
                            href={`/users/${user.username}`}
                            className="flex items-center gap-3 flex-1 min-w-0"
                        >
                            <Avatar className="flex-none">
                                <AvatarImage src={user.avatarUrl || undefined} />
                                <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="line-clamp-1 break-all font-semibold hover:underline">
                                    {user.displayName}
                                </p>
                                <p className="line-clamp-1 break-all text-muted-foreground text-sm">
                                    @{user.username}
                                </p>
                                {user.reasons && user.reasons.length > 0 && (
                                    <p className="line-clamp-1 text-xs text-muted-foreground mt-1">
                                        {user.reasons[0]}
                                    </p>
                                )}
                            </div>
                        </Link>
                    </UserTooltip>
                    <FollowButton
                        userId={user.id}
                        initialState={{
                            followers: user._count.followers,
                            isFollowedByUser: user.followers.some(
                                ({ followerId }) => followerId === user.id,
                            ),
                        }}
                    />
                </div>
            ))}
        </div>
    );
}