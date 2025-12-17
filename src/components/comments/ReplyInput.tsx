"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { CommentData } from "@/lib/types";
import { createCommentSchema } from "@/lib/validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ReplyInputProps {
  commentId: string;
  postId: string;
  onCancel: () => void;
  replyingTo?: string;
  onReplyPosted?: () => void;
}

export default function ReplyInput({
  commentId,
  postId,
  onCancel,
  replyingTo,
  onReplyPosted,
}: ReplyInputProps) {
  useSession();
  const [input, setInput] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const { content } = createCommentSchema.parse({ content: input });
      return kyInstance
        .post(`/api/comments/${commentId}/replies`, {
          json: { content },
        })
        .json<CommentData>();
    },
    onSuccess: async () => {
      setInput("");
      onCancel();

      if (onReplyPosted) {
        onReplyPosted();
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["comments", postId],
        });
      }

      toast.success("Reply posted");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to post reply. Please try again.");
    },
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    mutation.mutate();
  }

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="space-y-3 mt-3">
        <div className="w-full">
          <textarea
            placeholder={`Reply to ${replyingTo || "comment"}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            rows={3}
            className="w-full resize-none rounded-lg bg-background border border-input px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              minHeight: "80px",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={mutation.isPending}
            className="h-9 px-4 text-sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || mutation.isPending}
            className="h-9 px-4 text-sm"
          >
            {mutation.isPending && (
              <Loader2 className="size-4 animate-spin mr-2" />
            )}
            Reply
          </Button>
        </div>
      </form>
    </div>
  );
}
