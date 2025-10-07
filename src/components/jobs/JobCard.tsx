"use client";

import { JobData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import * as AvatarComponent from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Mail, ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";
import { useSession } from "@/app/(main)/SessionProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import DeleteJobDialog from "./DeleteJobDialog";

interface JobCardProps {
  job: JobData;
}

export default function JobCard({ job }: JobCardProps) {
  const { user } = useSession();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isOwner = job.userId === user.id;

  const typeLabels = {
    INTERNSHIP: "Internship",
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    CONTRACT: "Contract",
  };

  return (
    <>
      <article className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex gap-3 items-start flex-1 min-w-0">
            <Link href={`/users/${job.user.username}`}>
              <AvatarComponent.Avatar>
                <AvatarComponent.AvatarImage src={job.user.avatarUrl as string} />
                <AvatarComponent.AvatarFallback>
                  {job.user.username[0]}
                </AvatarComponent.AvatarFallback>
              </AvatarComponent.Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{job.title}</h3>
              <p className="text-muted-foreground truncate">{job.company}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">{typeLabels[job.type]}</Badge>
                {job.isRemote && (
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="h-3 w-3" />
                    Remote
                  </Badge>
                )}
                {job.location && (
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate max-w-[150px]">{job.location}</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="flex-shrink-0">
                  <MoreHorizontal className="size-5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive hover:text-destructive focus:text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer"
                >
                  <Trash2 className="size-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <p className="text-sm whitespace-pre-line break-words line-clamp-4">
          {job.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border/50 gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground">
            Posted {formatRelativeDate(job.createdAt)}
          </span>
          <div className="flex gap-2 flex-shrink-0">
            {job.applyEmail && (
              <Button size="sm" variant="outline" asChild>
                <a href={`mailto:${job.applyEmail}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </a>
              </Button>
            )}
            {job.applyUrl && (
              <Button size="sm" asChild>
                <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Apply
                </a>
              </Button>
            )}
          </div>
        </div>
      </article>
      <DeleteJobDialog
        job={job}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </>
  );
}