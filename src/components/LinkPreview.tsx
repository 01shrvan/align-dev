"use client";

import kyInstance from "@/lib/ky";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";

interface LinkPreviewProps {
  url: string;
}

interface LinkMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
}

export default function LinkPreview({ url }: LinkPreviewProps) {
  const { data: metadata, isLoading } = useQuery({
    queryKey: ["link-preview", url],
    queryFn: async () => {
      return kyInstance
        .get("/api/get-url-metadata", {
          searchParams: { url },
        })
        .json<LinkMetadata>();
    },
    staleTime: Infinity,
    retry: false,
  });

  const [imageError, setImageError] = useState(false);

  if (isLoading) {
    return (
      <div className="mt-2 w-full max-w-md animate-pulse rounded-xl border bg-card h-[200px]" />
    );
  }

  if (!metadata || !metadata.title) {
    return null;
  }

  let domain;
  try {
    domain = new URL(url).hostname;
  } catch {
    domain = "";
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="nofollow noreferrer noopener"
      className="block mt-2 w-full max-w-md overflow-hidden rounded-xl border bg-card ring-offset-background transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="flex flex-col">
        {metadata.image && !imageError && (
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            <Image
              src={metadata.image}
              alt={metadata.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              unoptimized
            />
          </div>
        )}
        <div className="p-3">
          <div className="text-sm font-semibold line-clamp-1 text-foreground mb-1">
            {metadata.title}
          </div>
          {metadata.description && (
            <div className="text-xs text-muted-foreground line-clamp-2 mb-1">
              {metadata.description}
            </div>
          )}
          <div className="text-xs text-muted-foreground truncate">{domain}</div>
        </div>
      </div>
    </a>
  );
}
