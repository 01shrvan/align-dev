"use client";

import { useEffect, useState } from "react";
import { Compass } from "@/lib/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const LOADING_MESSAGES = [
  "Thinking...",
  "Scanning the network...",
  "Finding your vibe matches...",
  "Analyzing profiles...",
  "Crafting response...",
];

export default function BotLoading() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Avatar className="w-8 h-8 mt-1 border border-border shrink-0 shadow-sm bg-background">
        <AvatarFallback className="bg-primary/5 text-primary">
          <Compass size={16} />
        </AvatarFallback>
      </Avatar>

      <div className="flex items-center gap-3 mt-2">
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
        </div>
        <span className="text-sm text-muted-foreground animate-pulse font-medium transition-all duration-300">
          {LOADING_MESSAGES[messageIndex]}
        </span>
      </div>
    </div>
  );
}
