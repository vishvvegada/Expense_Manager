"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ListOrdered,
    BarChart3,
    PiggyBank,
    FileText,
    Lightbulb
} from "lucide-react";

type UserSidebarProps = {
    userId: number;
};

export default function UserSidebar({ userId }: UserSidebarProps) {
    const pathname = usePathname();

    const sidebarItems = [
        {
            name: "Dashboard",
            href: `/user/dashboard`,
            icon: LayoutDashboard
        },
        {
            name: "Transactions",
            href: `/user/transactions`,
            icon: ListOrdered
        },
        {
            name: "Analysis",
            href: `/user/analysis`,
            icon: BarChart3
        },
        {
            name: "Budgets",
            href: `/user/budgets`,
            icon: PiggyBank
        },
        {
            name: "Reports",
            href: `/user/reports`,
            icon: FileText
        },
        {
            name: "Insights",
            href: `/user/insights`,
            icon: Lightbulb
        }
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 pt-20 hidden md:flex flex-col z-10">
            <div className="px-4 space-y-2 flex-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
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
        </aside>
    );
}
