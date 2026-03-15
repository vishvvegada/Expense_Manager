import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const userId = parseInt(params.id);

  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { UserID: userId },
      select: {
        UserID: true,
        UserName: true,
        EmailAddress: true,
        RoleID: true,
        MobileNo: true,
        ProfileImage: true,
        Created: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET USER ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
