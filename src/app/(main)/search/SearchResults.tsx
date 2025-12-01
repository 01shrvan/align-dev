"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage, UsersPage, UserData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import { useState } from "react";

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState("posts");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "search", query],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get("/api/search", {
          searchParams: {
            q: query,
            ...(pageParam ? { cursor: pageParam } : {}),
          },
        })
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    gcTime: 0,
    enabled: activeTab === "posts",
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  const {
    data: usersData,
    fetchNextPage: fetchNextUsers,
    hasNextPage: hasNextUsers,
    isFetching: isFetchingUsers,
    isFetchingNextPage: isFetchingNextUsers,
    status: usersStatus,
  } = useInfiniteQuery({
    queryKey: ["user-search", query],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get("/api/search/users", {
          searchParams: {
            q: query,
            ...(pageParam ? { cursor: pageParam } : {}),
          },
        })
        .json<UsersPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    gcTime: 0,
    enabled: activeTab === "users",
  });

  const users = usersData?.pages.flatMap((page) => page.users) || [];

  function UserRow({ user }: { user: UserData }) {
    return (
      <div className="flex items-center justify-between rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Link href={`/users/${user.username}`}>
            <Avatar>
              <AvatarImage src={user.avatarUrl as string} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="min-w-0">
            <Link href={`/users/${user.username}`} className="font-semibold hover:underline block truncate">
              {user.displayName}
            </Link>
            <div className="text-sm text-muted-foreground truncate">@{user.username}</div>
            <div className="text-sm text-muted-foreground">
              <FollowerCount
                userId={user.id}
                initialState={{
                  followers: user._count.followers,
                  isFollowedByUser: !!user.followers.length,
                }}
              />
            </div>
          </div>
        </div>
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: !!user.followers.length,
          }}
        />
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
      </TabsList>

      <TabsContent value="posts">
        {status === "pending" && <PostsLoadingSkeleton />}
        {status === "success" && !posts.length && !hasNextPage && (
          <p className="text-center text-muted-foreground">No posts found for this query.</p>
        )}
        {status === "error" && (
          <p className="text-center text-destructive">An error occurred while loading posts.</p>
        )}
        {status === "success" && (
          <InfiniteScrollContainer
            className="space-y-5"
            onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
          >
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
            {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
          </InfiniteScrollContainer>
        )}
      </TabsContent>

      <TabsContent value="users">
        {usersStatus === "pending" && <Loader2 className="mx-auto my-3 animate-spin" />}
        {usersStatus === "success" && !users.length && !hasNextUsers && (
          <p className="text-center text-muted-foreground">No users found for this query.</p>
        )}
        {usersStatus === "error" && (
          <p className="text-center text-destructive">An error occurred while loading users.</p>
        )}
        {usersStatus === "success" && (
          <InfiniteScrollContainer
            className="space-y-4"
            onBottomReached={() => hasNextUsers && !isFetchingUsers && fetchNextUsers()}
          >
            {users.map((u) => (
              <UserRow key={u.id} user={u} />
            ))}
            {isFetchingNextUsers && <Loader2 className="mx-auto my-3 animate-spin" />}
          </InfiniteScrollContainer>
        )}
      </TabsContent>
    </Tabs>
  );
}
