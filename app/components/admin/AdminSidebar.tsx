"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, TrendingUp, TrendingDown, Users, ArrowLeftRight, FolderKanban, FileBarChart, Layers } from "lucide-react";

const sidebarItems = [
    {
        name: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard // lucide-react icon
    },
    {
        name: "Users",
        href: "/admin/users",
        icon: Users
    },
    {
        name: "Categories",
        href: "/admin/categories",
        icon: Layers
    },
    {
        name: "Projects",
        href: "/admin/projects",
        icon: FolderKanban
    },
    {
        name: "Reports",
        href: "/admin/reports",
        icon: FileBarChart
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 pt-20 hidden md:block z-10">
            <div className="px-4 space-y-2">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                ? "bg-blue-50 text-blue-600 shadow-sm"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            <div className="absolute bottom-8 left-0 w-full px-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
                    <h3 className="font-bold text-sm mb-1">Expense Manager</h3>
                    <p className="text-xs text-blue-100 opacity-90">Admin Control Center</p>
                </div>
            </div>
        </aside>
    );
}
