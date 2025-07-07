import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const oldAvatarUrl = metadata.user.avatarUrl;

        // Delete old avatar if it exists
        if (oldAvatarUrl) {
          try {
            const key = oldAvatarUrl.split(
              `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
            )[1];

            if (key) {
              await new UTApi().deleteFiles(key);
            }
          } catch (deleteError) {
            console.warn("Failed to delete old avatar:", deleteError);
            // Continue with the upload process even if old file deletion fails
          }
        }

        // Use the new URL format
        const newAvatarUrl = file.url.replace(
          "/f/",
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        );

        // Update user in database
        await prisma.user.update({
          where: { id: metadata.user.id },
          data: {
            avatarUrl: newAvatarUrl,
          },
        });

        console.log("Avatar updated successfully:", newAvatarUrl);

        return { avatarUrl: newAvatarUrl };
      } catch (error) {
        console.error("Error in avatar upload completion:", error);
        throw new UploadThingError("Failed to update avatar");
      }
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;