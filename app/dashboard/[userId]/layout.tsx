import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import UserNavbar from "@/app/components/user/UserNavbar";
import UserSidebar from "@/app/components/user/UserSidebar";
import { redirect } from "next/navigation";

export default async function UserLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ userId: string }>;
}) {
    const { userId } = await params;
    const session = await getSession();

    if (!session || String(session.userId) !== userId) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { UserID: parseInt(userId) },
        select: {
            UserName: true,
            EmailAddress: true,
            ProfileImage: true,
            MobileNo: true,
        },
    });

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <UserNavbar user={user} userId={parseInt(userId)} />
            <UserSidebar userId={parseInt(userId)} />
            <main className="pt-20 md:pl-64 min-h-screen transition-all duration-300">
                <div className="p-6 md:p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
