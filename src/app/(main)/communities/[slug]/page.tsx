"use client";
 
import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Trash2,
    Send,
    Loader2,
    MessageSquare,
    Newspaper,
    Shield,
    Lock,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Loading from "@/app/loading";
export default function CommunityPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const router = useRouter();
    const queryClient = useQueryClient();
    const [content, setContent] = useState("");
    const { data: community, isLoading } = useQuery({
        queryKey: ["community", slug],
        queryFn: async () => {
            const communities = await kyInstance
                .get("/api/communities", {
                    searchParams: { search: slug }
                })
                .json<any>();
            return communities.communities.find((c: any) => c.slug === slug);
        },
    });
    const isMember = community?.members?.length > 0;
    const userRole = community?.members?.[0]?.role;
    const isAdmin = userRole === "ADMIN";
    const isChatCommunity = community?.type === "CHAT";
    const {
        data: postsData,
        fetchNextPage: fetchNextPosts,
        hasNextPage: hasNextPosts,
        isFetching: isFetchingPosts,
    } = useInfiniteQuery({
        queryKey: ["community-posts", community?.id],
        queryFn: ({ pageParam }) =>
            kyInstance
                .get(`/api/communities/${community?.id}/posts`, {
                    searchParams: pageParam ? { cursor: pageParam } : {}
                })
                .json<any>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !!community?.id && !isChatCommunity && isMember,
    });
    const {
        data: messagesData,
        fetchNextPage: fetchNextMessages,
        hasNextPage: hasNextMessages,
    } = useInfiniteQuery({
        queryKey: ["community-messages", community?.id],
        queryFn: ({ pageParam }) =>
            kyInstance
                .get(`/api/communities/${community?.id}/messages`, {
                    searchParams: pageParam ? { cursor: pageParam } : {}
                })
                .json<any>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !!community?.id && isChatCommunity && isMember,
    });
    const posts = postsData?.pages.flatMap((page) => page.posts) || [];
    const messages = messagesData?.pages.flatMap((page) => page.messages) || [];
    const joinMutation = useMutation({
        mutationFn: async () => {
            if (isMember) {
                return kyInstance.delete(`/api/communities/${community.id}/join`).json();
            } else {
                return kyInstance.post(`/api/communities/${community.id}/join`).json();
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["community", slug] });
            toast.success(isMember ? "Left community" : "Joined community!");
        },
    });
    const postMutation = useMutation({
        mutationFn: async (data: { content: string }) => {
            const endpoint = isChatCommunity
                ? `/api/communities/${community.id}/messages`
                : `/api/communities/${community.id}/posts`;
            return kyInstance.post(endpoint, { json: data }).json();
        },
        onSuccess: () => {
            setContent("");
            if (isChatCommunity) {
                queryClient.invalidateQueries({ queryKey: ["community-messages", community.id] });
            } else {
                queryClient.invalidateQueries({ queryKey: ["community-posts", community.id] });
            }
            toast.success(isChatCommunity ? "Message sent!" : "Posted!");
        },
    });
    const deleteMutation = useMutation({
        mutationFn: async () => {
            return kyInstance.delete(`/api/communities/${community.id}`).json();
        },
        onSuccess: () => {
            toast.success("Community deleted");
            router.push("/communities");
        },
    });
    if (isLoading) {
        return (
            <Loading />
        );
    }
    if (!community) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Community not found</p>
                <Button className="mt-4" asChild>
                    <Link href="/communities">Back to Communities</Link>
                </Button>
            </div>
        );
    }
    return (
        <div className="flex-1 px-4 md:pl-5 md:ml-5 md:border-l md:border-dashed md:border-border">
            <main className="flex w-full min-w-0 min-h-full flex-col lg:flex-row">
                <div className="w-full min-w-0 space-y-5 lg:border-r lg:border-dashed lg:border-border lg:pr-5 lg:mr-5 min-h-full">
                    <div className="rounded-2xl bg-card shadow-sm overflow-hidden">
                        <div className="relative h-32 md:h-48 w-full bg-gradient-to-br from-primary/20 to-primary/5">
                            {community.bannerUrl && (
                                <img
                                    src={community.bannerUrl}
                                    alt={community.name}
                                    className="h-full w-full object-cover"
                                />
                            )}
                        </div>
                        <div className="p-4 md:p-6">
                            <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                                <Avatar className="h-16 w-16 md:h-20 md:w-20 border-4 border-background -mt-10 md:-mt-14">
                                    <AvatarImage src={community.avatarUrl || undefined} />
                                    <AvatarFallback className="text-xl md:text-2xl font-bold">
                                        {community.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-2">
                                        <h1 className="text-2xl md:text-3xl font-bold">{community.name}</h1>
                                        {community.isOfficial && (
                                            <Badge className="bg-blue-600">
                                                <Shield className="mr-1 h-3 w-3" />
                                                Official
                                            </Badge>
                                        )}
                                        {isChatCommunity ? (
                                            <Badge variant="secondary">
                                                <MessageSquare className="mr-1 h-3 w-3" />
                                                Chat
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">
                                                <Newspaper className="mr-1 h-3 w-3" />
                                                Feed
                                            </Badge>
                                        )}
                                        {community.privacy !== "PUBLIC" && (
                                            <Badge variant="outline">
                                                <Lock className="mr-1 h-3 w-3" />
                                                {community.privacy}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground mb-2 md:mb-3">
                                        c/{community.slug}
                                    </p>
                                    {community.description && (
                                        <p className="text-sm mb-3 md:mb-4">{community.description}</p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            {community._count.members} members
                                        </div>
                                        <div>
                                            {isChatCommunity
                                                ? `${community._count.messages || 0} messages`
                                                : `${community._count.posts || 0} posts`
                                            }
                                        </div>
                                        <Badge variant="outline">{community.category}</Badge>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-3 md:mt-0">
                                    <Button
                                        variant={isMember ? "outline" : "default"}
                                        onClick={() => joinMutation.mutate()}
                                        disabled={joinMutation.isPending}
                                    >
                                        {isMember ? "Leave" : "Join"}
                                    </Button>
                                    {isAdmin && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Community?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the
                                                        community and all its content.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => deleteMutation.mutate()}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {!isMember ? (
                        <div className="rounded-2xl bg-card p-12 text-center shadow-sm">
                            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-xl font-semibold mb-2">Join to participate</h3>
                            <p className="text-muted-foreground mb-4">
                                You need to be a member to view and participate in this community
                            </p>
                            <Button onClick={() => joinMutation.mutate()}>
                                Join Community
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-2xl bg-card p-4 shadow-sm">
                                <Textarea
                                    placeholder={isChatCommunity ? "Send a message..." : "Share something with the community..."}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={isChatCommunity ? 2 : 3}
                                    className="mb-3"
                                />
                                <div className="flex justify-end">
                                    <Button
                                        onClick={() => postMutation.mutate({ content })}
                                        disabled={!content.trim() || postMutation.isPending}
                                    >
                                        {postMutation.isPending ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="mr-2 h-4 w-4" />
                                        )}
                                        {isChatCommunity ? "Send" : "Post"}
                                    </Button>
                                </div>
                            </div>

                            {isChatCommunity ? (
                                <div className="rounded-2xl bg-card p-4 shadow-sm space-y-4">
                                    <h3 className="font-semibold text-lg mb-4">Chat</h3>
                                    {messages.length === 0 ? (
                                        <p className="text-center text-muted-foreground py-8">
                                            No messages yet. Start the conversation!
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {messages.map((message: any) => (
                                                <div key={message.id} className="flex gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={message.user.avatarUrl || undefined} />
                                                        <AvatarFallback>{message.user.displayName[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Link
                                                                href={`/users/${message.user.username}`}
                                                                className="font-semibold text-sm hover:underline"
                                                            >
                                                                {message.user.displayName}
                                                            </Link>
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatDistanceToNow(new Date(message.createdAt), {
                                                                    addSuffix: true,
                                                                })}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm">{message.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <InfiniteScrollContainer
                                    onBottomReached={() =>
                                        hasNextPosts && !isFetchingPosts && fetchNextPosts()
                                    }
                                    className="space-y-4"
                                >
                                    {posts.length === 0 ? (
                                        <div className="rounded-2xl bg-card p-12 text-center shadow-sm">
                                            <Newspaper className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                            <p className="text-muted-foreground">
                                                No posts yet. Be the first to share something!
                                            </p>
                                        </div>
                                    ) : (
                                        posts.map((post: any) => (
                                            <div key={post.id} className="rounded-2xl bg-card p-6 shadow-sm">
                                                <div className="flex gap-3 mb-4">
                                                    <Avatar>
                                                        <AvatarImage src={post.user.avatarUrl || undefined} />
                                                        <AvatarFallback>{post.user.displayName[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Link
                                                                href={`/users/${post.user.username}`}
                                                                className="font-semibold hover:underline"
                                                            >
                                                                {post.user.displayName}
                                                            </Link>
                                                            <span className="text-sm text-muted-foreground">
                                                                @{post.user.username}
                                                            </span>
                                                            <span className="text-sm text-muted-foreground">·</span>
                                                            <span className="text-sm text-muted-foreground">
                                                                {formatDistanceToNow(new Date(post.createdAt), {
                                                                    addSuffix: true,
                                                                })}
                                                            </span>
                                                            {post.isPinned && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    Pinned
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="whitespace-pre-wrap break-words">{post.content}</p>
                                                {post.attachments && post.attachments.length > 0 && (
                                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                                        {post.attachments.map((attachment: any) => (
                                                            <img
                                                                key={attachment.id}
                                                                src={attachment.url}
                                                                alt="Attachment"
                                                                className="rounded-lg w-full object-cover"
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </InfiniteScrollContainer>
                            )}
                        </>
                    )}
                </div>

                <div className="hidden lg:block w-80 space-y-5 sticky top-[5.25rem] h-fit">
                    {community.rules && community.rules.length > 0 && (
                        <div className="rounded-2xl bg-card p-5 shadow-sm">
                            <h3 className="font-bold mb-4">Community Rules</h3>
                            <ol className="space-y-3 text-sm">
                                {community.rules.map((rule: any) => (
                                    <li key={rule.id}>
                                        <div className="font-semibold">{rule.title}</div>
                                        <div className="text-muted-foreground">{rule.description}</div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    <div className="rounded-2xl bg-card p-5 shadow-sm">
                        <h3 className="font-bold mb-4">Created by</h3>
                        <Link href={`/users/${community.creator.username}`}>
                            <div className="flex items-center gap-3 p-2 rounded-lg ">
                                <Avatar>
                                    <AvatarImage src={community.creator.avatarUrl || undefined} />
                                    <AvatarFallback>{community.creator.displayName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold">{community.creator.displayName}</div>
                                    <div className="text-sm text-muted-foreground">
                                        @{community.creator.username}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

