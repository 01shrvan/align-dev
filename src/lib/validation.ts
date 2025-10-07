// import { z } from "zod";

// const requiredString = z.string().trim().min(1, "Required");

// export const signUpSchema = z.object({
//   email: requiredString.email("Invalid email address"),
//   username: requiredString.regex(
//     /^[a-zA-Z0-9_-]+$/,
//     "Only letters, numbers, - and _ allowed",
//   ),
//   password: requiredString.min(8, "Must be at least 8 characters"),
// });

// export type SignUpValues = z.infer<typeof signUpSchema>;

// export const loginSchema = z.object({
//   username: requiredString,
//   password: requiredString,
// });

// export type LoginValues = z.infer<typeof loginSchema>;

// export const createPostSchema = z.object({
//   content: requiredString,
// });

import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email"),
  username: z
    .string()
    .trim()
    .min(1, "Required")
    .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, - and _ allowed"),
  password: z
    .string()
    .min(8, "Must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Must contain at least one lowercase letter, one uppercase letter, and one number",
    ),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Required"),
  password: z.string().min(1, "Required"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const onboardingSchema = z.object({
  displayName: z.string().trim().min(1, "Display name is required"),
  story: z.string().optional(),
  creating: z.string().optional(),
  why: z.string().optional(),
  interests: z.array(z.string()).min(3, "Select at least 3 interests"),
  bio: z.string().optional(),
  location: z.string().optional(),
  age: z.number().int().min(13).max(120).optional(),
  gender: z
    .enum(["male", "female", "other", "prefer-not-to-say"])
    .optional(),
  occupation: z.string().optional(),
});

export type OnboardingValues = z.infer<typeof onboardingSchema>;

export const createPostSchema = z.object({
  content: z.string().trim().min(1, "Post content is required"),
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
});

export type CreatePostValues = z.infer<typeof createPostSchema>;

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Must be at most 1000 characters"),
});

export const createCommentSchema = z.object({
  content: requiredString,
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;

export const createJobSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(100),
    company: z.string().min(1, "Company name is required").max(100),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(5000),
    type: z.enum(["INTERNSHIP", "FULL_TIME", "PART_TIME", "CONTRACT"]),
    location: z.string().max(100).optional(),
    isRemote: z.boolean().default(false),
    applyUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    applyEmail: z.string().email("Must be a valid email").optional().or(z.literal("")),
  })
  .refine((data) => data.applyUrl || data.applyEmail, {
    message: "Either application URL or email is required",
    path: ["applyUrl"],
  });

export type CreateJobInput = z.infer<typeof createJobSchema>;