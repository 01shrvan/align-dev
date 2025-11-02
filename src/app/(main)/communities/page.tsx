"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { CommunitiesPage, COMMUNITY_CATEGORIES } from "@/lib/types/community";
import CommunityCard from "@/components/communities/CommunityCard";
import CreateCommunityDialog from "@/components/communities/CreateCommunityDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, Loader2, Users } from "lucide-react";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";

export default function CommunitiesPage() {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        const timeout = setTimeout(() => {
            setDebouncedSearch(value);
        }, 500);
        return () => clearTimeout(timeout);
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["communities", selectedCategory, debouncedSearch],
        queryFn: ({ pageParam }) => {
            const params = new URLSearchParams();
            if (selectedCategory !== "all") params.set("category", selectedCategory);
            if (debouncedSearch) params.set("search", debouncedSearch);
            if (pageParam) params.set("cursor", pageParam);

            return kyInstance
                .get(`/api/communities?${params.toString()}`)
                .json<CommunitiesPage>();
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    const communities = data?.pages.flatMap((page) => page.communities) || [];

    return (
        <div className="flex-1 pl-5 ml-5 border-l border-dashed border-border">
            <main className="flex w-full min-w-0 min-h-full">
                <div className="w-full min-w-0 space-y-5 border-r border-dashed border-border pr-5 mr-5 min-h-full">
                    <div className="rounded-2xl bg-card p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold flex items-center gap-2">
                                    <Users className="h-8 w-8" />
                                    Communities
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    Discover and join communities that match your interests
                                </p>
                            </div>
                            <Button onClick={() => setCreateDialogOpen(true)} size="lg">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Community
                            </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search communities..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {COMMUNITY_CATEGORIES.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {status === "pending" ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : status === "error" ? (
                        <div className="text-center py-12">
                            <p className="text-destructive">Failed to load communities</p>
                        </div>
                    ) : communities.length === 0 ? (
                        <div className="text-center py-12 space-y-3">
                            <p className="text-muted-foreground text-lg">
                                No communities found
                            </p>
                            <Button onClick={() => setCreateDialogOpen(true)}>
                                Create the first one!
                            </Button>
                        </div>
                    ) : (
                        <InfiniteScrollContainer
                            onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {communities.map((community) => (
                                    <CommunityCard key={community.id} community={community} />
                                ))}
                            </div>
                            {isFetchingNextPage && (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            )}
                        </InfiniteScrollContainer>
                    )}
                </div>

                <div className="sticky top-[5.25rem] hidden lg:block w-80 h-fit space-y-5">
                    <div className="rounded-2xl bg-card p-5 shadow-sm space-y-4">
                        <h3 className="font-bold text-lg">About Communities</h3>
                        <p className="text-sm text-muted-foreground">
                            Communities are spaces where people with shared interests can connect,
                            share content, and have meaningful discussions.
                        </p>
                        <Button
                            className="w-full"
                            onClick={() => setCreateDialogOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Your Own
                        </Button>
                    </div>

                    <div className="rounded-2xl bg-card p-5 shadow-sm space-y-3">
                        <h3 className="font-bold">Guidelines</h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• Be respectful and welcoming</li>
                            <li>• Follow community rules</li>
                            <li>• Share quality content</li>
                            <li>• Report inappropriate behavior</li>
                        </ul>
                    </div>
                </div>

                <CreateCommunityDialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                />
            </main>
        </div>
    );
}