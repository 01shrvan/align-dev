"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Briefcase, Loader2 } from "lucide-react";
import JobCard from "@/components/jobs/JobCard";
import JobForm from "@/components/jobs/JobForm";
import { JobsPage } from "@/lib/types";
import kyInstance from "@/lib/ky";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";

type JobFilter = "INTERNSHIP" | "FULL_TIME" | "PART_TIME" | "CONTRACT" | null;

export default function JobsContent() {
  const [filter, setFilter] = useState<JobFilter>(null);
  const [showForm, setShowForm] = useState(false);

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
    return <Loading />;
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading jobs.
      </p>
    );
  }

  return (
    <div className="flex-1 pl-5 ml-5 border-l border-dashed border-border md:pl-3 md:ml-3 md:border-none">
      <main className="flex w-full min-w-0 min-h-full">
        <div className="w-full min-w-0 space-y-5 border-r border-dashed border-border pr-5 mr-5 md:border-none md:pr-3 md:mr-3">
          <div className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4 flex-col sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold md:text-xl">Jobs & Internships</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Discover opportunities or post your own
                </p>
              </div>
              <Button onClick={() => setShowForm(!showForm)} size="lg" className="w-full sm:w-auto">
                Post Opportunity
              </Button>
            </div>
          </div>

          {showForm && (
            <JobForm onSuccess={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
          )}

          <div className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-4 shadow-sm">
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
          </div>

          {status === "success" && !jobs.length && !hasNextPage ? (
            <div className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-10 shadow-sm text-center">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2 md:text-base">No opportunities found</p>
              <p className="text-muted-foreground mb-4 text-sm">
                {filter
                  ? "Try changing your filter or be the first to post!"
                  : "Be the first to post a job opportunity!"}
              </p>
              {!showForm && (
                <Button onClick={() => setShowForm(true)}>
                  Post Opportunity
                </Button>
              )}
            </div>
          ) : (
            <InfiniteScrollContainer
              className="space-y-5"
              onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
            >
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
              {isFetchingNextPage && (
                <Loader2 className="mx-auto my-3 animate-spin" />
              )}
            </InfiniteScrollContainer>
          )}
        </div>
      </main>
    </div>
  );
}