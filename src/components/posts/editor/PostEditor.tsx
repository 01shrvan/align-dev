"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import LoadingButton from "@/components/LoadingButton";
import * as AvatarComponent from "@/components/ui/avatar";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useSubmitPostMutation } from "./mutations";
import "./styles.css";

export default function PostEditor() {
  const { user } = useSession();

  const mutation = useSubmitPostMutation();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "shrvan gay",
      }),
    ],
    immediatelyRender: false,
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  function onSubmit() {
    mutation.mutate(input, {
      onSuccess: () => {
        editor?.commands.clearContent();
      },
    });
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-5 shadow-sm">
      <div className="flex gap-5">
        <AvatarComponent.Avatar>
          <AvatarComponent.AvatarImage src={user.avatarUrl as string} />
          <AvatarComponent.AvatarFallback>
            {user.username[0]}
          </AvatarComponent.AvatarFallback>
        </AvatarComponent.Avatar>
        <EditorContent
          editor={editor}
          className="w-full rounded-2xl bg-background px-5 py-3 resize-y min-h-[6rem] max-h-[40vh] overflow-auto scrollbar-hide"
        />
      </div>
      <div className="flex justify-end">
        <LoadingButton
          onClick={onSubmit}
          loading={mutation.isPending}
          disabled={!input.trim()}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}
