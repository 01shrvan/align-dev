import { PostData } from "@/lib/types";
import { Loader2, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSubmitCommentMutation } from "./mutations";

interface CommentInputProps {
  post: PostData;
}

export default function CommentInput({ post }: CommentInputProps) {
  const [input, setInput] = useState("");

  const mutation = useSubmitCommentMutation(post.id);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input) return;

    mutation.mutate(
      {
        post,
        content: input,
      },
      {
        onSuccess: () => setInput(""),
      },
    );
  }

  return (
    <form
      className="flex w-full items-center gap-1 sm:gap-2 max-w-full"
      onSubmit={onSubmit}
    >
      <Input
        placeholder="Write a comment..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
        className="flex-1 min-w-0 text-sm"
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!input.trim() || mutation.isPending}
        className="shrink-0 size-8 sm:size-10"
      >
        {!mutation.isPending ? (
          <SendHorizonal className="size-4 sm:size-5" />
        ) : (
          <Loader2 className="animate-spin size-4 sm:size-5" />
        )}
      </Button>
    </form>
  );
}
