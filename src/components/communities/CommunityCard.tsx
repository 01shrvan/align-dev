"use client";

import { CommunityData } from "@/lib/types/community";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Lock, Shield } from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { toast } from "sonner";

interface CommunityCardProps {
  community: CommunityData;
}

export default function CommunityCard({ community }: CommunityCardProps) {
  const queryClient = useQueryClient();
  const isMember = community.members.length > 0;
  const memberRole = community.members[0]?.role;

  const joinMutation = useMutation({
    mutationFn: async () => {
      if (isMember) {
        return kyInstance.delete(`/api/communities/${community.id}/join`).json();
      } else {
        return kyInstance.post(`/api/communities/${community.id}/join`).json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      toast.success(isMember ? "Left community" : "Joined community!");
    },
    onError: () => {
      toast.error(isMember ? "Failed to leave community" : "Failed to join community");
    },
  });

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
      <div className="relative h-32 w-full bg-gradient-to-br from-primary/20 to-primary/5">
        {community.bannerUrl ? (
          <img
            src={community.bannerUrl}
            alt={community.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
        )}
        
        {community.isOfficial && (
          <Badge className="absolute top-2 right-2 bg-blue-600">
            <Shield className="mr-1 h-3 w-3" />
            Official
          </Badge>
        )}

        {community.privacy !== "PUBLIC" && (
          <Badge variant="secondary" className="absolute top-2 left-2">
            <Lock className="mr-1 h-3 w-3" />
            {community.privacy === "PRIVATE" ? "Private" : "Restricted"}
          </Badge>
        )}
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-start gap-3">
          <Avatar className="h-16 w-16 border-4 border-background -mt-10">
            <AvatarImage src={community.avatarUrl || undefined} />
            <AvatarFallback className="text-lg font-bold">
              {community.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 mt-1">
            <Link href={`/communities/${community.slug}`}>
              <h3 className="font-bold text-lg line-clamp-1 hover:underline">
                {community.name}
              </h3>
            </Link>
            <p className="text-xs text-muted-foreground">
              c/{community.slug}
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {community.description || "No description yet."}
        </p>

        <Badge variant="outline" className="mb-3">
          {community.category}
        </Badge>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{community._count.members.toLocaleString()}</span>
          </div>
          <div>
            {community._count.posts.toLocaleString()} posts
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={isMember ? "outline" : "default"}
            className="flex-1"
            onClick={() => joinMutation.mutate()}
            disabled={joinMutation.isPending}
          >
            {isMember ? "Leave" : "Join"}
          </Button>
          <Button variant="ghost" asChild>
            <Link href={`/communities/${community.slug}`}>
              View
            </Link>
          </Button>
        </div>

        {isMember && memberRole && memberRole !== "MEMBER" && (
          <Badge variant="secondary" className="mt-2 w-full justify-center">
            {memberRole}
          </Badge>
        )}
      </div>
    </div>
  );
}