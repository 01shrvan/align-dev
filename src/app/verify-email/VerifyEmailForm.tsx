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
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { resendVerificationEmail, verifyEmail } from "./actions";

const OTP_LENGTH = 6;

interface OtpInputGroupProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  invalid: boolean;
  inputRef: (element: HTMLInputElement | null) => void;
}

function OtpInputGroup({
  value,
  onChange,
  onBlur,
  invalid,
  inputRef,
}: OtpInputGroupProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, index) => value[index] ?? "");

  function handleChange(index: number, rawValue: string) {
    const sanitizedValue = rawValue.replace(/\D/g, "");
    const nextDigits = [...digits];

    if (!sanitizedValue) {
      nextDigits[index] = "";
      onChange(nextDigits.join(""));
      return;
    }

    let cursor = index;
    for (const digit of sanitizedValue) {
      if (cursor >= OTP_LENGTH) break;
      nextDigits[cursor] = digit;
      cursor += 1;
    }

    onChange(nextDigits.join(""));
    inputRefs.current[Math.min(cursor, OTP_LENGTH - 1)]?.focus();
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      event.preventDefault();
      const nextDigits = [...digits];

      if (nextDigits[index]) {
        nextDigits[index] = "";
        onChange(nextDigits.join(""));
        return;
      }

      if (index > 0) {
        nextDigits[index - 1] = "";
        onChange(nextDigits.join(""));
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
      return;
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(index: number, event: React.ClipboardEvent<HTMLInputElement>) {
    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH - index);

    if (!pastedDigits) return;

    event.preventDefault();
    const nextDigits = [...digits];

    for (let i = 0; i < pastedDigits.length; i += 1) {
      nextDigits[index + i] = pastedDigits[i];
    }

    onChange(nextDigits.join(""));
    inputRefs.current[Math.min(index + pastedDigits.length, OTP_LENGTH - 1)]?.focus();
  }

  return (
    <div className="flex justify-center gap-2">
      {digits.map((digit, index) => (
        <Input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
            if (index === 0) {
              inputRef(element);
            }
          }}
          value={digit}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          name={`otp-digit-${index + 1}`}
          aria-label={`Verification code digit ${index + 1}`}
          aria-invalid={invalid}
          className="h-12 w-12 px-0 text-center font-mono text-lg"
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          onFocus={(event) => event.currentTarget.select()}
          onBlur={onBlur}
        />
      ))}
    </div>
  );
}

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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3"
          autoComplete="off"
        >
          {error && <p className="text-center text-destructive">{error}</p>}
          <FormField
            control={form.control}
            name="code"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-center">Verification Code</FormLabel>
                <FormControl>
                  <OtpInputGroup
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    invalid={fieldState.invalid}
                    inputRef={field.ref}
                  />
                </FormControl>
                <FormMessage className="text-center" />
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
