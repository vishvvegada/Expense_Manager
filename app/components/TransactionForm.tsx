"use client";

import React, { useRef, useState } from "react";
import { Calendar, DollarSign, FileText, Tag, User as UserIcon, Briefcase, Plus, X } from "lucide-react";

type Option = {
    id: number;
    name: string;
};

type TransactionFormProps = {
    type: "EXPENSE" | "INCOME";
    userId: string;
    categories: Option[];
    people: Option[];
    projects: Option[];
    onSubmit: (formData: FormData) => Promise<void>;
    isLoading?: boolean;
};

export default function TransactionForm({
    type,
    userId,
    categories,
    people,
    projects,
    onSubmit,
    isLoading = false,
}: TransactionFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isAddingPerson, setIsAddingPerson] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append("userId", userId);
        formData.append("type", type);

        await onSubmit(formData);

        // Reset form and states
        formRef.current?.reset();
        setIsAddingCategory(false);
        setIsAddingPerson(false);
    };

    const isExpense = type === "EXPENSE";
    const themeColor = isExpense ? "red" : "green";

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {/* Date & Amount Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="date"
                            name="date"
                            required
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="number"
                            name="amount"
                            step="0.01"
                            required
                            placeholder="0.00"
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Category & People Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Field */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <button
                            type="button"
                            onClick={() => setIsAddingCategory(!isAddingCategory)}
                            className={`text-xs flex items-center gap-1 font-medium ${isAddingCategory ? "text-red-500" : "text-blue-600"
                                }`}
                        >
                            {isAddingCategory ? (
                                <>
                                    <X className="w-3 h-3" /> Cancel
                                </>
                            ) : (
                                <>
                                    <Plus className="w-3 h-3" /> New
                                </>
                            )}
                        </button>
                    </div>

                    <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                        {isAddingCategory ? (
                            <input
                                type="text"
                                name="newCategory"
                                placeholder="Enter new category name"
                                required
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                autoFocus
                            />
                        ) : (
                            <select
                                name="categoryId"
                                required
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                            >
                                <option value="">Select Category</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                {/* Person Field */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Person</label>
                        <button
                            type="button"
                            onClick={() => setIsAddingPerson(!isAddingPerson)}
                            className={`text-xs flex items-center gap-1 font-medium ${isAddingPerson ? "text-red-500" : "text-blue-600"
                                }`}
                        >
                            {isAddingPerson ? (
                                <>
                                    <X className="w-3 h-3" /> Cancel
                                </>
                            ) : (
                                <>
                                    <Plus className="w-3 h-3" /> New
                                </>
                            )}
                        </button>
                    </div>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                        {isAddingPerson ? (
                            <input
                                type="text"
                                name="newPerson"
                                placeholder="Enter new person name"
                                required
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                autoFocus
                            />
                        ) : (
                            <select
                                name="peopleId"
                                required
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                            >
                                <option value="">Select Person</option>
                                {people.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </div>

            {/* Project Row */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project (Optional)</label>
                <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                        name="projectId"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                    >
                        <option value="">Select Project</option>
                        {projects.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-1/4 w-4 h-4 text-gray-400" />
                    <textarea
                        name="description"
                        rows={3}
                        placeholder="What was this for?"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 rounded-lg font-medium text-white shadow-lg shadow-${themeColor}-500/30 transition-all active:scale-[0.98] ${isLoading ? "bg-gray-400 cursor-not-allowed" : isExpense ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                    }`}
            >
                {isLoading ? "Saving..." : `Add ${isExpense ? "Expense" : "Income"}`}
            </button>
        </form>
    );
}
