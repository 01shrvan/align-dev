"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "@/lib/icons";
import JobCard from "@/components/jobs/JobCard";
import JobForm from "@/components/jobs/JobForm";
import { JobsPage } from "@/lib/types";
import kyInstance from "@/lib/ky";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function JobsPageComponent() {
  const [filter, setFilter] = useState<string | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["job-feed", filter],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/jobs",
          pageParam
            ? {
                searchParams: {
                  cursor: pageParam,
                  ...(filter && { type: filter }),
                },
              }
            : filter
              ? { searchParams: { type: filter } }
              : undefined,
        )
        .json<JobsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const jobs = data?.pages.flatMap((page) => page.jobs) || [];

  if (status === "pending") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === "success" && !jobs.length && !hasNextPage) {
    return (
      <div className="space-y-5 px-4 sm:px-6 lg:px-8">
        <JobForm />
        <p className="text-center text-muted-foreground">
          No job postings yet. Be the first to post!
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading jobs.
      </p>
    );
  }

  return (
    <div className="space-y-5 px-4 sm:px-6 lg:px-8">
      <JobForm />

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === null ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter(null)}
        >
          All
        </Button>
        <Button
          variant={filter === "INTERNSHIP" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("INTERNSHIP")}
        >
          Internships
        </Button>
        <Button
          variant={filter === "FULL_TIME" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("FULL_TIME")}
        >
          Full Time
        </Button>
        <Button
          variant={filter === "PART_TIME" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("PART_TIME")}
        >
          Part Time
        </Button>
        <Button
          variant={filter === "CONTRACT" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("CONTRACT")}
        >
          Contract
        </Button>
      </div>

      <InfiniteScrollContainer
        className="space-y-5"
        onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
        {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
      </InfiniteScrollContainer>
    </div>
  );
}