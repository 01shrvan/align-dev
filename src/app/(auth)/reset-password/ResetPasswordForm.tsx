"use client";

import LoadingButton from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { resetPassword } from "./actions";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordValues) {
    setError(undefined);
    startTransition(async () => {
      const { error } = await resetPassword(token, values);
      if (error) setError(error);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <p className="text-center text-destructive text-sm">{error}</p>
        )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm font-normal">
                New Password
              </FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="New Password"
                  {...field}
                  className="bg-black border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 h-12 rounded-lg"
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm font-normal">
                Confirm Password
              </FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Confirm Password"
                  {...field}
                  className="bg-black border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 h-12 rounded-lg"
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        <LoadingButton loading={isPending} type="submit" className="w-full">
          Reset Password
        </LoadingButton>
      </form>
    </Form>
  );
}
