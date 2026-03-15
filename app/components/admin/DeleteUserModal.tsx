"use client";

import { X, AlertTriangle } from "lucide-react";

type DeleteUserModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    userName: string;
    isDeleting: boolean;
};

export default function DeleteUserModal({ isOpen, onClose, onConfirm, userName, isDeleting }: DeleteUserModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-red-50 p-6 border-b border-red-100 flex items-start gap-4">
                    <div className="p-3 bg-red-100 rounded-full text-red-600 shrink-0">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-red-900">Delete User Account?</h3>
                        <p className="text-sm text-red-700 mt-1">
                            You are about to delete <strong>{userName}</strong>. This action is permanent and will remove all their data.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-auto text-red-400 hover:text-red-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to proceed? This cannot be undone.
                    </p>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all flex items-center gap-2"
                        >
                            {isDeleting ? "Deleting..." : "Yes, Delete User"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
