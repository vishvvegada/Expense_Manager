"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { addTransaction } from "@/app/actions/transaction";

type AddTransactionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    userId: number;
    categories: { id: number; name: string }[];
    people: { id: number; name: string }[];
    defaultType?: "INCOME" | "EXPENSE";
};

export default function AddTransactionModal({ isOpen, onClose, userId, categories, people, defaultType = "EXPENSE" }: AddTransactionModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [type, setType] = useState<"INCOME" | "EXPENSE">(defaultType);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Reset type when modal opens with a specific default
    React.useEffect(() => {
        if (isOpen) {
            setType(defaultType);
        }
    }, [isOpen, defaultType]);

    // Form States
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState<string>("");
    const [peopleId, setPeopleId] = useState<string>("");
    const [newCategory, setNewCategory] = useState("");
    const [newPerson, setNewPerson] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData();
        formData.append("userId", userId.toString());
        formData.append("type", type);
        formData.append("amount", amount);
        formData.append("date", date);
        formData.append("description", description);
        formData.append("categoryId", categoryId);
        formData.append("peopleId", peopleId);
        formData.append("newCategory", newCategory);
        formData.append("newPerson", newPerson);

        try {
            const result = await addTransaction(formData);
            if (result.success) {
                onClose();
                // Reset form
                setAmount("");
                setDescription("");
                setCategoryId("");
                setPeopleId("");
                setNewCategory("");
                setNewPerson("");
            } else {
                setError(result.error || "Failed to add transaction");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)' }}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/20 flex flex-col">
                <div className="flex items-center justify-between p-6 sm:px-8 sm:pt-8 sm:pb-6 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-xl z-10">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Add Transaction</h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">Record your new income or expense</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-700 bg-gray-50/50">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 sm:space-y-7">
                    {error && (
                        <div className="bg-rose-50/80 border border-rose-200 text-rose-600 p-4 rounded-xl text-sm font-medium flex items-start gap-3">
                            <X className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Type Selection */}
                    <div className="flex p-1.5 bg-gray-100/80 rounded-2xl w-full shadow-inner border border-gray-200/50">
                        <label className={`flex-1 relative flex items-center justify-center gap-2 py-3.5 rounded-xl cursor-pointer text-center transition-all duration-300 ${type === 'INCOME' ? 'bg-white text-emerald-600 shadow-sm font-bold scale-[1.02] border border-gray-100' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 font-medium'}`}>
                            <input type="radio" name="type" value="INCOME" checked={type === 'INCOME'} onChange={() => setType('INCOME')} className="hidden" />
                            <ArrowUpCircle className="w-5 h-5" />
                            Income
                        </label>
                        <label className={`flex-1 relative flex items-center justify-center gap-2 py-3.5 rounded-xl cursor-pointer text-center transition-all duration-300 ${type === 'EXPENSE' ? 'bg-white text-rose-600 shadow-sm font-bold scale-[1.02] border border-gray-100' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 font-medium'}`}>
                            <input type="radio" name="type" value="EXPENSE" checked={type === 'EXPENSE'} onChange={() => setType('EXPENSE')} className="hidden" />
                            <ArrowDownCircle className="w-5 h-5" />
                            Expense
                        </label>
                    </div>

                    {/* Amount & Date */}
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Amount</label>
                            <div className="relative">
                                <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${type === 'INCOME' ? 'text-emerald-500' : 'text-rose-500'}`}>$</span>
                                <input
                                    type="number"
                                    required
                                    min="0.01"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-semibold text-gray-900"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Date</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Category */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Category</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900 appearance-none"
                            >
                                <option value="" disabled>Select Category...</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                                <option value="new" className="font-bold text-indigo-600">+ Add New Category</option>
                            </select>
                            {categoryId === "new" && (
                                <input
                                    type="text"
                                    placeholder="New Category Name"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="mt-3 w-full px-4 py-3 bg-indigo-50/50 border border-indigo-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-indigo-300"
                                />
                            )}
                        </div>

                        {/* Person */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Person</label>
                            <select
                                value={peopleId}
                                onChange={(e) => setPeopleId(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900 appearance-none"
                            >
                                <option value="" disabled>Select Person...</option>
                                {people.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                                <option value="new" className="font-bold text-indigo-600">+ Add New Person</option>
                            </select>
                            {peopleId === "new" && (
                                <input
                                    type="text"
                                    placeholder="New Person Name"
                                    value={newPerson}
                                    onChange={(e) => setNewPerson(e.target.value)}
                                    className="mt-3 w-full px-4 py-3 bg-indigo-50/50 border border-indigo-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-indigo-300"
                                />
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none h-24 font-medium text-gray-900"
                            placeholder="Add notes or details..."
                        />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-6 mt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-bold w-full sm:w-auto text-center"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-8 py-3.5 text-white rounded-xl transition-all shadow-md active:scale-95 font-bold flex items-center justify-center gap-2 border disabled:opacity-50 w-full sm:w-auto ${
                                type === 'INCOME' 
                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border-emerald-500/50 shadow-emerald-500/20 hover:shadow-emerald-500/30' 
                                    : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 border-rose-500/50 shadow-rose-500/20 hover:shadow-rose-500/30'
                            }`}
                        >
                            {isSubmitting ? 'Saving...' : `Add ${type === 'INCOME' ? 'Income' : 'Expense'}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    if (!mounted) return null;

    return createPortal(modalContent, document.body);
}
