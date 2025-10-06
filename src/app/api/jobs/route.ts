import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getJobDataInclude, JobsPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
        const type = req.nextUrl.searchParams.get("type") || undefined;

        const pageSize = 10;

        const { user } = await validateRequest();

        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const jobs = await prisma.job.findMany({
            where: type ? { type: type as any } : undefined,
            include: getJobDataInclude(user.id),
            orderBy: { createdAt: "desc" },
            take: pageSize + 1,
            cursor: cursor ? { id: cursor } : undefined,
        });

        const nextCursor = jobs.length > pageSize ? jobs[pageSize].id : null;

        const data: JobsPage = {
            jobs: jobs.slice(0, pageSize),
            nextCursor,
        };

        return Response.json(data);
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}