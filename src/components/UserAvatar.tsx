import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface UserAvatarProps {
  avatarUrl?: string | null | undefined;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  size = 48,
  className,
}: UserAvatarProps) {
  return (
    <div
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <User 
        size={size * 0.6} 
        className="text-muted-foreground"
      />
    </div>
  );
}