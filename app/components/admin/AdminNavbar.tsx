"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

// Since this is a client component, we might need to pass user data as props
// or fetch it via an API/Context. For now, we'll accept props.
type AdminNavbarProps = {
    user?: {
        UserName: string;
        EmailAddress: string;
    } | null;
};

export default function AdminNavbar({ user }: AdminNavbarProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        // Clear cookie - simplified by just redirecting to a logout endpoint or simply clearing client side if simple
        // Best practice: Call an API route to clear the cookie
        try {
            // For now, since we just set a cookie, we can manually expire it or rely on an API
            // Let's assume we create a logout API or just redirect to login which might handle it?
            // Actually, standard way: 
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Sign out failed", error);
        }
    };

    return (
        <nav className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 md:left-64 z-20 px-8 flex items-center justify-between">
            {/* Left Side - Page Title / Breadcrumbs could go here */}
            <div className="text-lg font-semibold text-gray-800">

            </div>

            {/* Right Side - Profile */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-all"
                >
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-800">{user?.UserName || "Admin User"}</p>
                        <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                        {/* Placeholder for user image if available, else generic icon */}
                        <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-2">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{user?.UserName || "Admin"}</h4>
                                <p className="text-xs text-gray-500 break-all">{user?.EmailAddress || "admin@example.com"}</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="p-3 rounded-lg bg-gray-50 mb-2">
                                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Role</p>
                                <p className="text-sm font-semibold text-gray-800">Super Administrator</p>
                            </div>

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
        </nav>
    );
}
