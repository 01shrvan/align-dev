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
}

export default function ReplyInput({
    commentId,
    postId,
    onCancel,
    replyingTo,
}: ReplyInputProps) {
    const { user } = useSession();
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

            await queryClient.invalidateQueries({
                queryKey: ["comments", postId],
            });

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
        <form onSubmit={onSubmit} className="flex flex-col gap-2 mt-2">
            <div className="flex items-start gap-2">
                <input
                    placeholder={`Reply to ${replyingTo || "comment"}...`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    autoFocus
                    className="flex-1 rounded-lg bg-background border border-border px-3 py-2 text-sm"
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    disabled={mutation.isPending}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    size="sm"
                    disabled={!input.trim() || mutation.isPending}
                >
                    {mutation.isPending && <Loader2 className="size-4 animate-spin mr-2" />}
                    Reply
                </Button>
            </div>
        </form>
    );
}