import { google, lucia } from "@/auth";
import kyInstance from "@/lib/ky";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { slugify } from "@/lib/utils";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const cookieStore = await cookies();

  const storedState = cookieStore.get("state")?.value;
  const storedCodeVerifier = cookieStore.get("code_verifier")?.value;

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    return new Response(null, { status: 400 });
  }

  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    );

    const googleUser = await kyInstance
      .get("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`,
        },
      })
      .json<{ id: string; name: string }>();

    const existingUser = await prisma.user.findUnique({
      where: {
        googleId: googleUser.id,
      },
    });

    if (existingUser) {
      if (!existingUser.isEmailVerified) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { isEmailVerified: true },
        });
      }

      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      console.log("Existing user login:", {
        userId: existingUser.id,
        isOnboarded: existingUser.isOnboarded,
        redirectTo: existingUser.isOnboarded ? "/" : "/onboarding",
      });

      const redirectUrl = existingUser.isOnboarded ? "/" : "/onboarding";

      return new Response(null, {
        status: 302,
        headers: {
          Location: redirectUrl,
        },
      });
    }

    const userId = generateIdFromEntropySize(10);
    const username = slugify(googleUser.name) + "-" + userId.slice(0, 4);

    console.log("Creating new user:", {
      userId,
      username,
      isOnboarded: false,
    });

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: googleUser.name,
          googleId: googleUser.id,
          isVerified: false,
          isEmailVerified: true,
          isOnboarded: false,
        },
      });
      await streamServerClient.upsertUser({
        id: userId,
        username,
        name: username,
      });
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    console.log("Redirecting new user to /onboarding");

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/onboarding",
      },
    });
  } catch (error) {
    console.error("OAuth error:", error);
    if (error instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
