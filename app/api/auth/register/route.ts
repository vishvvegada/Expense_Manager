import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password, mobile } = await req.json();

    if (!name || !email || !password || !mobile) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: { EmailAddress: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 }
      );
    }

    await prisma.user.create({
      data: {
        RoleID: 2, // Default User Role
        UserName: name,
        EmailAddress: email,
        Password: password, // Note: Consider hashing
        MobileNo: mobile,
        Created: new Date(),
        Modified: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
