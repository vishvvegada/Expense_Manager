import AdminSidebar from "@/app/components/admin/AdminSidebar";
import AdminNavbar from "@/app/components/admin/AdminNavbar";
import { getCurrentUser } from "@/lib/auth";
// import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    // strict auth check - verify if role is admin (1)
    // if (!user || user.RoleID !== 1) {
    //   redirect("/login");
    // }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="md:ml-64 pt-16">
                <AdminNavbar user={user} />
                <main>
                    {children}
                </main>
            </div>
        </div>
    );
}
