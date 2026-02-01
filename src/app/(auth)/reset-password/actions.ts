"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { resetPasswordSchema, ResetPasswordValues } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export async function resetPassword(
  token: string,
  values: ResetPasswordValues,
): Promise<{ error?: string }> {
  try {
    const { password } = resetPasswordSchema.parse(values);

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordTokenExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return {
        error: "Invalid or expired password reset token.",
      };
    }

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordTokenExpiresAt: null,
      },
    });

    await lucia.invalidateUserSessions(user.id);

    redirect("/login");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
