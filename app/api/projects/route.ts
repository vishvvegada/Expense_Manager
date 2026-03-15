import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    try {
        const whereClause = userId ? { UserID: parseInt(userId) } : {};

        if (userId && isNaN(parseInt(userId))) {
            return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
        }

        const projects = await prisma.project.findMany({
            where: whereClause,
            orderBy: {
                ProjectName: 'asc'
            }
        });

        return NextResponse.json(projects);
    } catch (error) {
        console.error("GET PROJECTS ERROR:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            ProjectName,
            ProjectLogo,
            ProjectStartDate,
            ProjectEndDate,
            ProjectDetail,
            Description,
            UserID
        } = body;

        if (!UserID || !ProjectName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newProject = await prisma.project.create({
            data: {
                ProjectName,
                ProjectLogo,
                ProjectStartDate: ProjectStartDate ? new Date(ProjectStartDate) : null,
                ProjectEndDate: ProjectEndDate ? new Date(ProjectEndDate) : null,
                ProjectDetail,
                Description,
                IsActive: true,
                UserID: parseInt(UserID),
                Created: new Date(),
                Modified: new Date()
            }
        });

        return NextResponse.json(newProject);
    } catch (error) {
        console.error("CREATE PROJECT ERROR:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
