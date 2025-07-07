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
          console.log(oldAvatarUrl);
          try {
            const key = oldAvatarUrl;

            if (key) {
              await new UTApi().deleteFiles(key);
            }
          } catch (deleteError) {
            console.warn("Failed to delete old avatar:", deleteError);
            // Continue with the upload process even if old file deletion fails
          }
        }

        // Update user in database
        await prisma.user.update({
          where: { id: metadata.user.id },
          data: {
            avatarUrl: file.ufsUrl,
          },
        });

        console.log("Avatar updated successfully:", file.ufsUrl);

        return { avatarUrl: file.ufsUrl };
      } catch (error) {
        console.error("Error in avatar upload completion:", error);
        throw new UploadThingError("Failed to update avatar");
      }
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
