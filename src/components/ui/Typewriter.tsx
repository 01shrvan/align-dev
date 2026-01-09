"use client";

import { useEffect, useState, useRef } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export function Typewriter({
  text,
  speed = 10,
  onComplete,
  className,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    let i = 0;

    const intervalId = setInterval(() => {
      if (i >= text.length) {
        clearInterval(intervalId);
        setIsComplete(true);
        if (onCompleteRef.current) onCompleteRef.current();
        return;
      }

      setDisplayedText(text.slice(0, i + 1));
      i++;
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && (
        <span className="animate-pulse ml-0.5 inline-block h-4 w-1.5 bg-primary/60 align-middle" />
      )}
    </span>
  );
}
