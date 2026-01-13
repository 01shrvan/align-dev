"use client";

import LoadingButton from "@/components/LoadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { verifyEmailSchema, VerifyEmailValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { resendVerificationEmail, verifyEmail } from "./actions";

export default function VerifyEmailForm() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const [isResendPending, startResendTransition] = useTransition();

  const form = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: VerifyEmailValues) {
    setError(undefined);
    startTransition(async () => {
      const { error } = await verifyEmail(values);
      if (error) setError(error);
    });
  }

  async function onResend() {
    setError(undefined);
    startResendTransition(async () => {
      const { error, success } = await resendVerificationEmail();
      if (error) {
        setError(error);
        toast.error(error);
      }
      if (success) {
        toast.success(success);
      }
    });
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {error && <p className="text-center text-destructive">{error}</p>}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter 6-digit code"
                    type="text"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton loading={isPending} type="submit" className="w-full">
            Verify Email
          </LoadingButton>
        </form>
      </Form>
      <div className="text-center text-sm">
        <span className="text-gray-400">Didn&apos;t receive a code? </span>
        <Button
          variant="link"
          className="p-0 h-auto font-medium text-blue-400 hover:underline"
          onClick={onResend}
          disabled={isResendPending || isPending}
        >
          {isResendPending ? "Sending..." : "Resend"}
        </Button>
      </div>
    </div>
  );
}
