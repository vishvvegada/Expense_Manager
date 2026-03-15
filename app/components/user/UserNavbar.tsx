"use client";

import { LogOut, ChevronDown, User as UserIcon, Menu, X, LayoutDashboard, ListOrdered, PieChart, Edit } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import EditUserModal from "./EditUserModal";

type UserNavbarProps = {
    user: {
        UserName: string;
        ProfileImage?: string | null;
        EmailAddress: string;
        MobileNo?: string | null;
    };
    userId: number;
};

export default function UserNavbar({ user, userId }: UserNavbarProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleSignOut = async () => {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        router.push("/login"); // Redirect to login
        router.refresh();
    };

    const navItems = [
        { name: 'Dashboard', href: `/user/dashboard`, icon: LayoutDashboard },
        { name: 'Transactions', href: `/user/transactions`, icon: ListOrdered },
        { name: 'Analysis', href: `/user/analysis`, icon: PieChart },
        { name: 'Budgets', href: `/user/budgets`, icon: ListOrdered },
        { name: 'Insights', href: `/user/insights`, icon: ListOrdered },
        { name: 'Reports', href: `/user/reports`, icon: ListOrdered },
    ];

    return (
        <nav className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 md:left-64 z-20 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Expense Manager
                </h1>
            </div>

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-all"
                >
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900">{user.UserName}</p>
                        <p className="text-xs text-gray-500">{user.EmailAddress}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                        {user.ProfileImage ? (
                            <Image
                                src={user.ProfileImage}
                                alt={user.UserName}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <UserIcon className="w-5 h-5 text-blue-600" />
                        )}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-4 pb-4 mb-4 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                                {user.ProfileImage ? (
                                    <Image
                                        src={user.ProfileImage}
                                        alt={user.UserName}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <UserIcon className="w-6 h-6 text-blue-600" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{user.UserName}</h3>
                                <p className="text-xs text-gray-500">User</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <button
                                onClick={() => {
                                    setIsProfileOpen(false);
                                    setIsEditModalOpen(true);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-medium text-sm"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Profile
                            </button>

                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-xl p-4 md:hidden flex flex-col gap-2 animate-in slide-in-from-top-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === item.href
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}

            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={{
                    UserID: userId,
                    UserName: user.UserName,
                    EmailAddress: user.EmailAddress,
                    MobileNo: user.MobileNo || null
                }}
            />
        </nav>
    );
}
