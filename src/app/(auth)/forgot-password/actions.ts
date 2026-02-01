"use server";

import { nodemailerUtils } from "@/lib/emails/nodemailer";
import prisma from "@/lib/prisma";
import { forgotPasswordSchema, ForgotPasswordValues } from "@/lib/validation";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function requestPasswordReset(
  values: ForgotPasswordValues,
): Promise<{ error?: string; success?: string }> {
  try {
    const { email } = forgotPasswordSchema.parse(values);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !user.email || !user.passwordHash) {
      return {
        success:
          "If an account exists with this email, we sent you a reset link.",
      };
    }

    const resetToken = generateIdFromEntropySize(40);
    const resetPasswordTokenExpiresAt = new Date(
      Date.now() + 1000 * 60 * 60 * 2,
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordTokenExpiresAt,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    await nodemailerUtils.sendPasswordResetEmail(
      user.email,
      resetLink,
      user.username,
    );

    return {
      success:
        "If an account exists with this email, we sent you a reset link.",
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
