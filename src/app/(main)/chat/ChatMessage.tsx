"use client";

import { useState, memo } from "react";
import { Compass, User as UserIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Typewriter } from "@/components/ui/Typewriter";

interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  occupation: string | null;
  bio: string | null;
  interests: string[];
  tags: string[];
}

interface Message {
  role: "user" | "assistant";
  content: string;
  users?: User[];
}

interface ChatMessageProps {
  message: Message;
  userAvatarUrl?: string | null;
  shouldAnimate?: boolean;
}

function ChatMessage({
  message,
  userAvatarUrl,
  shouldAnimate = false,
}: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const [typingComplete, setTypingComplete] = useState(
    !isAssistant || !shouldAnimate,
  );

  return (
    <div
      className={cn(
        "flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-300",
        !isAssistant ? "flex-row-reverse" : "flex-row",
      )}
    >
      <Avatar
        className={cn(
          "w-8 h-8 mt-1 border border-border shrink-0 shadow-sm",
          isAssistant ? "bg-background" : "",
        )}
      >
        {isAssistant ? (
          <AvatarFallback className="bg-primary/5 text-primary">
            <Compass size={16} />
          </AvatarFallback>
        ) : (
          <>
            <AvatarImage src={userAvatarUrl || undefined} />
            <AvatarFallback className="bg-muted">
              <UserIcon size={16} />
            </AvatarFallback>
          </>
        )}
      </Avatar>

      <div
        className={cn(
          "flex flex-col max-w-[85%] text-sm sm:text-base leading-relaxed",
          !isAssistant ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "relative px-5 py-3 rounded-2xl shadow-sm border",
            !isAssistant
              ? "bg-primary text-primary-foreground border-primary/50 rounded-br-sm"
              : "bg-card text-foreground border-border rounded-bl-sm",
          )}
        >
          {isAssistant && shouldAnimate ? (
            <Typewriter
              text={message.content}
              speed={10}
              className="whitespace-pre-wrap block"
              onComplete={() => setTypingComplete(true)}
            />
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
        </div>

        {typingComplete && message.users && message.users.length > 0 && (
          <div className="mt-4 w-full grid gap-3 sm:grid-cols-2 animate-in fade-in zoom-in-95 duration-500">
            {message.users.slice(0, 4).map((foundUser) => (
              <Link
                key={foundUser.id}
                href={`/users/${foundUser.username}`}
                className="flex flex-col p-3 bg-card/50 hover:bg-card transition-all rounded-xl border border-dashed border-border hover:border-solid hover:border-primary/30 group/card relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover/card:bg-primary/50 transition-all duration-300"></div>
                <div className="flex items-center gap-3 mb-2 pl-2">
                  <Avatar className="w-9 h-9 border border-border">
                    <AvatarImage src={foundUser.avatarUrl || undefined} />
                    <AvatarFallback>
                      {foundUser.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-sm text-foreground group-hover/card:text-primary transition-colors">
                      {foundUser.displayName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      @{foundUser.username}
                    </p>
                  </div>
                </div>

                <div className="pl-2">
                  {foundUser.occupation && (
                    <div className="mb-1.5 text-xs font-medium text-primary/80">
                      {foundUser.occupation}
                    </div>
                  )}

                  {foundUser.bio && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2.5">
                      {foundUser.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1 mt-auto">
                    {foundUser.interests.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-secondary/50 border border-border/50 px-1.5 py-0.5 rounded-md text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ChatMessage);
