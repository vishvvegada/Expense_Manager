"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { ArrowUpCircle, ArrowDownCircle, ListOrdered, Trash2, AlertTriangle, Edit, Search, Filter } from "lucide-react";
import { deleteTransaction } from "../../actions/transaction";
import Modal from "../Modal";
import AddTransactionModal from "./AddTransactionModal";
import EditTransactionModal from "./EditTransactionModal";

type Transaction = {
    id: number;
    type: "INCOME" | "EXPENSE";
    date: Date;
    amount: number;
    category: { id?: number; CategoryName: string; LogoPath: string | null } | null;
    people: { id?: number; PeopleName: string } | null;
    subCategory?: { SubCategoryName: string } | null;
    description?: string | null;
    detail?: string | null;
};

type UserTransactionListProps = {
    transactions: Transaction[];
    userId: number;
    categories: { id: number; name: string }[];
    people: { id: number; name: string }[];
    title?: string;
};

export default function UserTransactionList({ transactions, userId, categories, people, title }: UserTransactionListProps) {
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [confirmation, setConfirmation] = useState<{ id: number; type: "INCOME" | "EXPENSE" } | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingTx, setEditingTx] = useState<any | null>(null);
    
    // Filters & Search
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");

    const filteredTransactions = useMemo(() => {
        return transactions.filter((t) => {
            if (filterType !== "ALL" && t.type !== filterType) return false;
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const desc = t.description?.toLowerCase() || "";
                const cat = t.category?.CategoryName.toLowerCase() || "";
                const person = t.people?.PeopleName.toLowerCase() || "";
                return desc.includes(term) || cat.includes(term) || person.includes(term);
            }
            return true;
        });
    }, [transactions, filterType, searchTerm]);

    const handleDeleteClick = (id: number, type: "INCOME" | "EXPENSE") => {
        setConfirmation({ id, type });
    };

    const confirmDelete = async () => {
        if (!confirmation) return;

        setDeletingId(confirmation.id);
        try {
            const result = await deleteTransaction(confirmation.id, confirmation.type, userId);
            if (!result.success) {
                alert(result.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to delete transaction");
        } finally {
            setDeletingId(null);
            setConfirmation(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Control Bar */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/80 p-4 md:p-5 flex flex-col lg:flex-row justify-between items-center gap-4 transition-all hover:border-indigo-100/50">
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                        />
                    </div>
                    {/* Filter */}
                    <div className="flex bg-gray-100/80 p-1 rounded-xl w-full sm:w-auto overflow-x-auto no-scrollbar">
                        {(["ALL", "INCOME", "EXPENSE"] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                                    filterType === type
                                        ? "bg-white text-indigo-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                                }`}
                            >
                                {type === "ALL" ? "All" : type === "INCOME" ? "Income" : "Expense"}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full lg:w-auto flex items-center gap-3">
                    {title && <h3 className="font-bold text-gray-800 text-lg hidden lg:block mr-2">{title}</h3>}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-full lg:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 font-medium"
                    >
                        <span className="text-xl leading-none font-light mb-0.5">+</span> Add Transaction
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-transparent space-y-3">
                {filteredTransactions.map((t) => (
                    <div
                        key={`${t.type}-${t.id}`}
                        className="bg-white border border-gray-100 rounded-2xl p-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/40 hover:-translate-y-1 hover:border-indigo-100 group"
                    >
                        <div className="flex items-start md:items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                t.type === 'INCOME' 
                                    ? 'bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white' 
                                    : 'bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white'
                            } transition-colors duration-300`}>
                                {t.type === 'INCOME' ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors text-base">
                                    {t.category?.CategoryName || 'Uncategorized'}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 text-sm mt-1 opacity-80">
                                    <span className="text-gray-500 font-medium">{format(new Date(t.date), 'MMM d, yyyy')}</span>
                                    {t.type === 'EXPENSE' && t.subCategory && (
                                        <>
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                            <span className="text-gray-600">{t.subCategory.SubCategoryName}</span>
                                        </>
                                    )}
                                    {t.people?.PeopleName && (
                                        <>
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                            <span className="text-gray-600 flex items-center gap-1.5">
                                                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                                                    {t.people.PeopleName.charAt(0)}
                                                </span>
                                                {t.people.PeopleName}
                                            </span>
                                        </>
                                    )}
                                </div>
                                {t.description && (
                                    <p className="text-sm text-gray-500/90 mt-1.5 line-clamp-1 italic">{t.description}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-4 md:pt-0 border-t border-gray-100 md:border-t-0 mt-2 md:mt-0">
                            <div className={`font-bold text-xl text-right tracking-tight ${
                                t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                            }`}>
                                {t.type === 'INCOME' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                            </div>
                            
                            <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={() => setEditingTx({ ...t, peopleData: t.people })}
                                    className="p-2.5 bg-gray-50 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                    title="Edit Transaction"
                                >
                                    <Edit className="w-4.5 h-4.5" />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(t.id, t.type)}
                                    disabled={deletingId === t.id}
                                    className="p-2.5 bg-gray-50 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-50"
                                    title="Delete Transaction"
                                >
                                    <Trash2 className="w-4.5 h-4.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredTransactions.length === 0 && (
                    <div className="bg-white/50 border border-gray-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center backdrop-blur-sm">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center shadow-inner mb-4">
                            <ListOrdered className="w-10 h-10 text-indigo-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">No transactions found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search term.</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={!!confirmation}
                onClose={() => setConfirmation(null)}
                title="Confirm Deletion"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-rose-600 bg-rose-50 p-4 rounded-xl border border-rose-100/50">
                        <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                        <p className="text-sm font-medium">This action cannot be undone.</p>
                    </div>
                    <p className="text-gray-600 px-1">
                        Are you sure you want to delete this transaction? It will be permanently removed from your records.
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                        <button
                            onClick={() => setConfirmation(null)}
                            className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            disabled={!!deletingId}
                            className="px-5 py-2.5 text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors text-sm font-semibold disabled:opacity-50 flex items-center gap-2 shadow-md shadow-rose-200"
                        >
                            {deletingId ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </Modal>

            <AddTransactionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                userId={userId}
                categories={categories}
                people={people}
            />

            <EditTransactionModal
                isOpen={!!editingTx}
                onClose={() => setEditingTx(null)}
                userId={userId}
                categories={categories}
                people={people}
                transaction={editingTx}
            />
        </div>
    );
}
