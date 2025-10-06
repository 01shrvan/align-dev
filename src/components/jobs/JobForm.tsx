"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createJobSchema, CreateJobInput } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateJobMutation } from "./mutations";
import LoadingButton from "@/components/LoadingButton";
import { Briefcase, X } from "lucide-react";

interface JobFormProps {
  onSuccess?: () => void;
}

export default function JobForm({ onSuccess }: JobFormProps) {
  const [showForm, setShowForm] = useState(false);
  const mutation = useCreateJobMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateJobInput>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      isRemote: false,
      type: "FULL_TIME",
    },
  });

  const jobType = watch("type");
  const isRemote = watch("isRemote");

  const onSubmit = (data: CreateJobInput) => {
    mutation.mutate(data, {
      onSuccess: () => {
        reset();
        setShowForm(false);
        onSuccess?.();
      },
    });
  };

  if (!showForm) {
    return (
      <Button
        onClick={() => setShowForm(true)}
        className="w-full"
        variant="outline"
      >
        <Briefcase className="mr-2 h-4 w-4" />
        Post a Job/Internship
      </Button>
    );
  }

  return (
    <div className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Post Opportunity</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowForm(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            placeholder="e.g. Frontend Developer"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            placeholder="e.g. Tech Corp"
            {...register("company")}
          />
          {errors.company && (
            <p className="text-sm text-destructive">{errors.company.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select
            value={jobType}
            onValueChange={(value) => setValue("type", value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INTERNSHIP">Internship</SelectItem>
              <SelectItem value="FULL_TIME">Full Time</SelectItem>
              <SelectItem value="PART_TIME">Part Time</SelectItem>
              <SelectItem value="CONTRACT">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g. Mumbai, India"
            {...register("location")}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isRemote"
            checked={isRemote}
            onCheckedChange={(checked) => setValue("isRemote", !!checked)}
          />
          <Label htmlFor="isRemote" className="cursor-pointer">
            Remote Position
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe the role, requirements, and responsibilities..."
            rows={6}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="applyUrl">Application URL</Label>
          <Input
            id="applyUrl"
            type="url"
            placeholder="https://company.com/apply"
            {...register("applyUrl")}
          />
          {errors.applyUrl && (
            <p className="text-sm text-destructive">
              {errors.applyUrl.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="applyEmail">Application Email</Label>
          <Input
            id="applyEmail"
            type="email"
            placeholder="careers@company.com"
            {...register("applyEmail")}
          />
          {errors.applyEmail && (
            <p className="text-sm text-destructive">
              {errors.applyEmail.message}
            </p>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          * At least one application method (URL or Email) is required
        </p>

        <div className="flex gap-3 pt-2">
          <LoadingButton
            type="submit"
            loading={mutation.isPending}
            className="flex-1"
          >
            Post
          </LoadingButton>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowForm(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}