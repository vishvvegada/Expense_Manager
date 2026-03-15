"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, User, Trash2, Plus, Edit } from "lucide-react";
import DeleteUserModal from "./DeleteUserModal";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import { deleteUser, addUser, updateUser } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

type UserData = {
    UserID: number;
    UserName: string;
    EmailAddress: string;
    RoleID: number;
    Created: Date;
};

type UserListProps = {
    users: UserData[];
};

export default function UserList({ users }: UserListProps) {
    const [isOpen, setIsOpen] = useState(true);

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleDeleteClick = (user: UserData) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedUser) return;
        setIsLoading(true);

        try {
            const result = await deleteUser(selectedUser.UserID);

            if (result.success) {
                setIsDeleteModalOpen(false);
                setSelectedUser(null);
                router.refresh();
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to delete user");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddUser = async (formData: FormData) => {
        setIsLoading(true);
        try {
            const result = await addUser(formData);
            if (result.success) {
                setIsAddModalOpen(false);
                router.refresh();
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to create user");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (user: UserData) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleEditUser = async (userId: number, formData: FormData) => {
        setIsLoading(true);
        try {
            const result = await updateUser(userId, formData);
            if (result.success) {
                setIsEditModalOpen(false);
                setSelectedUser(null);
                router.refresh();
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to update user");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex justify-end">
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add User
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                    aria-expanded={isOpen}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <h2 className="text-lg font-bold text-gray-800">All Users</h2>
                            <p className="text-sm text-gray-500">{users.length} Registered Users</p>
                        </div>
                    </div>
                    {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                </button>

                {isOpen && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-y border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.UserID} className="hover:bg-gray-50 group">
                                        <td className="px-6 py-4 text-sm text-gray-500">#{user.UserID}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                                                    {user.UserName.charAt(0).toUpperCase()}
                                                </div>
                                                {user.UserName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.EmailAddress}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.RoleID === 1 ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                                {user.RoleID === 1 ? 'Admin' : 'User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.Created).toLocaleDateString("en-US")}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <a
                                                    href={`/admin/users/${user.UserID}`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="View Details"
                                                >
                                                    <User className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                    title="Edit User"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                {user.RoleID !== 1 && (
                                                    <button
                                                        onClick={() => handleDeleteClick(user)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Confirm Delete Modal */}
                <DeleteUserModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    userName={selectedUser?.UserName || ""}
                    isDeleting={isLoading}
                />
                {/* Edit User Modal */}
                <EditUserModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onConfirm={handleEditUser}
                    isLoading={isLoading}
                    user={selectedUser}
                />

                {/* Add User Modal */}
                <AddUserModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onConfirm={handleAddUser}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
