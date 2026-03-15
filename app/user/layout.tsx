import UserSidebar from "../components/user/UserSidebar";
import UserNavbar from "../components/user/UserNavbar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    // Prepare user object for Navbar (ensure properties match)
    const navbarUser = {
        UserName: user.UserName,
        EmailAddress: user.EmailAddress,
        ProfileImage: user.ProfileImage,
        MobileNo: user.MobileNo,
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <UserSidebar userId={user.UserID} />

            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                <UserNavbar user={navbarUser} userId={user.UserID} />

                <main className="flex-1 p-4 md:p-6 mt-16">
                    {children}
                </main>
            </div>
        </div>
    );
}
