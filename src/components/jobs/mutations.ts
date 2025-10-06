import { toast } from "sonner";
import { JobsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createJob, deleteJob } from "@/app/(main)/jobs/actions";
import { CreateJobInput } from "@/lib/validation";

export function useCreateJobMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createJob,
    onSuccess: async (newJob) => {
      const queryFilter: QueryFilters = {
        queryKey: ["job-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<JobsPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  jobs: [newJob, ...firstPage.jobs],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      toast.success("Job posted successfully");
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to post job. Please try again.");
    },
  });

  return mutation;
}

export function useDeleteJobMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: async (deletedJob) => {
      const queryFilter: QueryFilters = { queryKey: ["job-feed"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<JobsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              jobs: page.jobs.filter((j) => j.id !== deletedJob.id),
            })),
          };
        },
      );

      toast.success("Job deleted");
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to delete job. Please try again.");
    },
  });

  return mutation;
}