import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect, UsersPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") || "";
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const searchQuery = q.split(" ").join(" & ");

    const pageSize = 10;

    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { displayName: { search: searchQuery } },
          { username: { search: searchQuery } },
          { bio: { search: searchQuery } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      select: getUserDataSelect(user.id),
    });

    const nextCursor = users.length > pageSize ? users[pageSize].id : null;

    const data: UsersPage = {
      users: users.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
