import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use a strong env variable

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: number };
        return decoded;
    } catch (error) {
        return null;
    }
}

export async function getCurrentUser() {
    const session = await getSession();
    if (!session) return null;

    const user = await prisma.user.findUnique({
        where: { UserID: session.userId },
        select: {
            UserID: true,
            UserName: true,
            EmailAddress: true,
            ProfileImage: true,
            RoleID: true,
            MobileNo: true,
            // We don't verify password hash here, just return user info
        },
    });

    return user;
}
