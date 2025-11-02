"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMMUNITY_CATEGORIES } from "@/lib/types/community";
import kyInstance from "@/lib/ky";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CreateCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CreateCommunityData {
  name: string;
  slug: string;
  description: string;
  category: string;
  privacy: "PUBLIC" | "PRIVATE" | "RESTRICTED";
}

export default function CreateCommunityDialog({
  open,
  onOpenChange,
}: CreateCommunityDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [slugManual, setSlugManual] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateCommunityData>({
    defaultValues: {
      privacy: "PUBLIC",
    },
  });

  const communityName = watch("name");
  const category = watch("category");

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  if (communityName && !slugManual) {
    const autoSlug = generateSlug(communityName);
    setValue("slug", autoSlug);
  }

  const mutation = useMutation({
    mutationFn: async (data: CreateCommunityData) => {
      return kyInstance
        .post("/api/communities", { json: data })
        .json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      toast.success("Community created successfully!");
      reset();
      onOpenChange(false);
      router.push(`/communities/${data.slug}`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create community");
    },
  });

  const onSubmit = (data: CreateCommunityData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create a Community</DialogTitle>
          <DialogDescription>
            Build your own space and bring people together around shared interests.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Community Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Community Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., React Developers"
              {...register("name", {
                required: "Community name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Name must be less than 50 characters",
                },
              })}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              URL Slug <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">/communities/</span>
              <Input
                id="slug"
                placeholder="react-developers"
                {...register("slug", {
                  required: "Slug is required",
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message: "Only lowercase letters, numbers, and hyphens",
                  },
                })}
                onChange={(e) => {
                  setSlugManual(true);
                  register("slug").onChange(e);
                }}
              />
            </div>
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What's your community about?"
              rows={3}
              {...register("description", {
                maxLength: {
                  value: 500,
                  message: "Description must be less than 500 characters",
                },
              })}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={category}
              onValueChange={(value) => setValue("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {COMMUNITY_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="privacy">Privacy</Label>
            <Select
              defaultValue="PUBLIC"
              onValueChange={(value: any) => setValue("privacy", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Public</span>
                    <span className="text-xs text-muted-foreground">
                      Anyone can see and join
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="RESTRICTED">
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Restricted</span>
                    <span className="text-xs text-muted-foreground">
                      Anyone can see, join requires approval
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="PRIVATE">
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Private</span>
                    <span className="text-xs text-muted-foreground">
                      Only members can see content
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Community
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}