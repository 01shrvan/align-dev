"use server";

import { validateRequest } from "@/auth";
import { nodemailerUtils } from "@/lib/emails/nodemailer";
import { generateSecureOTP } from "@/lib/generate-otp";
import prisma from "@/lib/prisma";
import { verifyEmailSchema, VerifyEmailValues } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export async function verifyEmail(
  values: VerifyEmailValues,
): Promise<{ error: string }> {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return { error: "Unauthorized" };
    }

    const { code } = verifyEmailSchema.parse(values);

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        isEmailVerified: true,
        verificationCode: true,
        verificationCodeExpiresAt: true,
      },
    });

    if (!dbUser) {
      return { error: "User not found" };
    }

    if (dbUser.isEmailVerified) {
      return redirect("/onboarding");
    }

    if (!dbUser.verificationCode || dbUser.verificationCode !== code) {
      return { error: "Invalid verification code" };
    }

    if (
      !dbUser.verificationCodeExpiresAt ||
      dbUser.verificationCodeExpiresAt < new Date()
    ) {
      return { error: "Verification code expired" };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationCode: null,
        verificationCodeExpiresAt: null,
      },
    });

    return redirect("/onboarding");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}

export async function resendVerificationEmail(): Promise<{
  error?: string;
  success?: string;
}> {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return { error: "Unauthorized" };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || !dbUser.email) {
      return { error: "User not found or email missing" };
    }

    if (dbUser.isEmailVerified) {
      return { error: "Email already verified" };
    }

    const otp = generateSecureOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: otp,
        verificationCodeExpiresAt: otpExpiry,
      },
    });

    const result = await nodemailerUtils.sendVerificationEmail(
      dbUser.email,
      otp,
    );

    if (!result.success) {
      return { error: result.error };
    }

    return { success: "Verification email sent" };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
}
