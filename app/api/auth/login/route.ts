import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        EmailAddress: email,
        Password: password, // Note: Consider hashing passwords in production
      },
      select: {
        UserID: true,
        RoleID: true,
        EmailAddress: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.UserID, role: user.RoleID },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set Cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
      path: '/',
    });

    return NextResponse.json({
      success: true,
      userId: user.UserID,
      role: user.RoleID,
      redirectTo:
        user.RoleID === 1
          ? "/admin/dashboard"
          : `/user/dashboard`,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
