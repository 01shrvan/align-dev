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
      "Must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Required"),
  password: z.string().min(1, "Required"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const onboardingSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required")
    .max(50, "Display name is too long"),
  bio: z.string().trim().max(500, "Bio is too long").optional(),
  interests: z
    .array(z.string())
    .min(3, "Select at least 3 interests")
    .max(10, "Select at most 10 interests"),
  location: z.string().trim().max(100, "Location is too long").optional(),
  age: z
    .number()
    .int()
    .min(15, "Must be at least 15 years old")
    .max(120, "Invalid age")
    .optional(),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]).optional(),
  occupation: z.string().trim().max(100, "Occupation is too long").optional(),
});

export type OnboardingValues = z.infer<typeof onboardingSchema>;

export const createPostSchema = z.object({
  content: z.string().trim().min(1, "Post content is required"),
});

export type CreatePostValues = z.infer<typeof createPostSchema>;

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Must be at most 1000 characters"),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;