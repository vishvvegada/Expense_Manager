"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import EditUserModal from "./EditUserModal";

type EditProfileButtonProps = {
    user: {
        UserID: number;
        UserName: string;
        EmailAddress: string;
        MobileNo: string | null;
    };
};

export default function EditProfileButton({ user }: EditProfileButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 ml-3 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                title="Edit Profile"
            >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
            </button>
            <EditUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={user}
            />
        </>
    );
}
