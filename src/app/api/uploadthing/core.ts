// import { validateRequest } from "@/auth";
// import prisma from "@/lib/prisma";
// import { createUploadthing, FileRouter } from "uploadthing/next";
// import { UploadThingError, UTApi } from "uploadthing/server";

// const f = createUploadthing();

// export const fileRouter = {
//   avatar: f({
//     image: { maxFileSize: "512KB" },
//   })
//     .middleware(async () => {
//       const { user } = await validateRequest();

//       if (!user) throw new UploadThingError("Unauthorized");

//       return { user };
//     })
//     .onUploadComplete(async ({ metadata, file }) => {
//       try {
//         const oldAvatarUrl = metadata.user.avatarUrl;

//         if (oldAvatarUrl) {
//           console.log(oldAvatarUrl);
//           try {
//             const key = oldAvatarUrl;

//             if (key) {
//               await new UTApi().deleteFiles(key);
//             }
//           } catch (deleteError) {
//             console.warn("Failed to delete old avatar:", deleteError);
//           }
//         }

//         await prisma.user.update({
//           where: { id: metadata.user.id },
//           data: {
//             avatarUrl: file.ufsUrl,
//           },
//         });

//         console.log("Avatar updated successfully:", file.ufsUrl);

//         return { avatarUrl: file.ufsUrl };
//       } catch (error) {
//         console.error("Error in avatar upload completion:", error);
//         throw new UploadThingError("Failed to update avatar");
//       }
//     }),
// } satisfies FileRouter;

// export type AppFileRouter = typeof fileRouter;


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

        if (oldAvatarUrl) {
          console.log(oldAvatarUrl);
          try {
            const key = oldAvatarUrl;

            if (key) {
              await new UTApi().deleteFiles(key);
            }
          } catch (deleteError) {
            console.warn("Failed to delete old avatar:", deleteError);
          }
        }

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
  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      const media = await prisma.media.create({
        data: {
          url: file.url.replace(
            "/f/",
            `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
          ),
          type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
        },
      });

      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;