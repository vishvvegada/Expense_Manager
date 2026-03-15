"use client";

import { useState, useEffect } from "react";
import { X, UserCheck, Mail, Lock, Smartphone, Shield } from "lucide-react";

type EditUserModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (userId: number, formData: FormData) => Promise<void>;
    isLoading: boolean;
    user: {
        UserID: number;
        UserName: string;
        EmailAddress: string;
        RoleID: number;
    } | null;
};

export default function EditUserModal({ isOpen, onClose, onConfirm, isLoading, user }: EditUserModalProps) {
    const [role, setRole] = useState("2");

    useEffect(() => {
        if (user) {
            setRole(user.RoleID.toString());
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await onConfirm(user.UserID, formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-emerald-50 p-6 border-b border-emerald-100 flex items-start gap-4">
                    <div className="p-3 bg-emerald-100 rounded-full text-emerald-600 shrink-0">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-emerald-900">Edit User Details</h3>
                        <p className="text-sm text-emerald-700 mt-1">
                            Modify the details of {user.UserName}.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-auto text-emerald-400 hover:text-emerald-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                name="name"
                                required
                                defaultValue={user.UserName}
                                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                name="email"
                                type="email"
                                required
                                defaultValue={user.EmailAddress}
                                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password (Leave blank to keep current)</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                name="password"
                                type="password"
                                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="******"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                name="roleId"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none bg-white"
                            >
                                <option value="2">User</option>
                                <option value="1">Admin</option>
                            </select>
                        </div>
                        {role === "1" && (
                            <p className="text-xs text-amber-600 mt-1">
                                ⚠️ Admin users have full access to management features.
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all flex items-center gap-2"
                        >
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

