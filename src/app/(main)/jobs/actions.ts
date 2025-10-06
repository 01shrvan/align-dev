"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getJobDataInclude } from "@/lib/types";
import { createJobSchema } from "@/lib/validation";

export async function createJob(input: {
  title: string;
  company: string;
  description: string;
  type: "INTERNSHIP" | "FULL_TIME" | "PART_TIME" | "CONTRACT";
  location?: string;
  isRemote: boolean;
  applyUrl?: string;
  applyEmail?: string;
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const validatedData = createJobSchema.parse(input);

  const newJob = await prisma.job.create({
    data: {
      title: validatedData.title,
      company: validatedData.company,
      description: validatedData.description,
      type: validatedData.type,
      location: validatedData.location || null,
      isRemote: validatedData.isRemote,
      applyUrl: validatedData.applyUrl || null,
      applyEmail: validatedData.applyEmail || null,
      userId: user.id,
    },
    include: getJobDataInclude(user.id),
  });

  return newJob;
}

export async function deleteJob(id: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) throw new Error("Job not found");
  if (job.userId !== user.id) throw new Error("Unauthorized");

  const deletedJob = await prisma.job.delete({
    where: { id },
    include: getJobDataInclude(user.id),
  });

  return deletedJob;
}