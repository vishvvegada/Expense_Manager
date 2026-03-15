import React from "react";
import { User, Mail, Phone, Shield } from "lucide-react";

type UserInfoProps = {
    user: {
        UserName: string;
        EmailAddress: string;
        MobileNo: string;
        RoleID: number;
        ProfileImage?: string | null;
    };
};

export default function UserInfoCard({ user }: UserInfoProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                    {user.ProfileImage ? (
                        <img
                            src={user.ProfileImage}
                            alt={user.UserName}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        user.UserName.charAt(0).toUpperCase()
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{user.UserName}</h2>
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mt-1">
                        User ID: {user.RoleID === 1 ? 'Admin' : 'User'}
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">{user.EmailAddress}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">{user.MobileNo || 'No mobile number'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">Role ID: {user.RoleID}</span>
                </div>
            </div>
        </div>
    );
}
