"use client";

import { useState, useRef, useEffect } from "react";
import { CornerDownLeft, Ghost } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession } from "../SessionProvider";
import { Textarea } from "@/components/ui/textarea";
import ChatMessage from "./ChatMessage";
import BotLoading from "./BotLoading";

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

export default function ChatPage() {
  const { user } = useSession();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "yo! i'm ava. tell me who you're looking for and i'll find 'em for you. no cap.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          users: data.users && data.users.length > 0 ? data.users : undefined,
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "my bad, something went wrong. try again in a bit.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto border-x border-dashed border-border/60 bg-background/30 relative shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)]">
      <div
        className="absolute inset-0 z-[-1] opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#888 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="flex-none flex items-center justify-between p-4 border-b border-dashed border-border/60 bg-background/60 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          {/*<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">*/}
            {/*<Ghost className="w-4 h-4 text-primary" />*/}
          {/*</div>*/}
          <div className="flex flex-col">
            <h1 className="text-xl font-bold leading-none">Ava</h1>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              v1.0 • Beta
            </span>
          </div>
        </div>
        <div className="text-[10px] text-muted-foreground font-mono bg-secondary/50 px-2 py-1 rounded border border-border/40">
          AI MATCHING
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
        <div className="flex flex-col min-h-full space-y-8">
          {messages.map((msg, idx) => (
            <ChatMessage
              key={idx}
              message={msg}
              userAvatarUrl={user.avatarUrl}
              shouldAnimate={idx === messages.length - 1}
            />
          ))}

          {isLoading && <BotLoading />}
          <div ref={scrollRef} className="h-4" />
        </div>
      </div>

      <div className="flex-none p-4 border-t border-dashed border-border/60 bg-background/60 backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-2 bg-background border border-border shadow-sm rounded-xl p-2 focus-within:ring-1 focus-within:ring-primary/30 focus-within:border-primary/50 transition-all">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Ava to find someone..."
              className="min-h-[44px] max-h-[200px] w-full resize-none border-0 bg-transparent py-3 px-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm sm:text-base shadow-none placeholder:text-muted-foreground/50"
              rows={1}
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSubmit()}
              disabled={isLoading || !input.trim()}
              size="icon"
              className={cn(
                "rounded-lg h-9 w-9 shrink-0 mb-1 transition-all duration-200",
                input.trim()
                  ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                  : "bg-muted text-muted-foreground hover:bg-muted opacity-50 cursor-not-allowed",
              )}
            >
              <CornerDownLeft className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center mt-2 px-1">
            <p className="text-[10px] text-muted-foreground">
              <span className="hidden sm:inline">Press </span>
              <kbd className="hidden sm:inline-flex items-center gap-1 bg-muted border border-border rounded px-1 text-[9px] font-mono text-muted-foreground">
                Enter ↵
              </kbd>
              <span className="hidden sm:inline"> to send</span>
            </p>
            <p className="text-[10px] text-muted-foreground opacity-60">
              Ava may display inaccurate info.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
