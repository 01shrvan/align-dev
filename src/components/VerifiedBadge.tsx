import { BadgeCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VerifiedBadgeProps {
    className?: string;
    size?: number;
}

export default function VerifiedBadge({ className = "", size = 16 }: VerifiedBadgeProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <BadgeCheck
                        className={`text-white fill-blue-500 ${className}`}
                        size={size}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Verified Account</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
