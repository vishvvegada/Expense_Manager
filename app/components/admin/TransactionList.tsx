"use client";

import React, { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Search } from "lucide-react";

type Transaction = {
    id: string;
    type: "income" | "expense";
    amount: number;
    date: Date;
    category: string;
    user: string;
    description: string | null;
    detail: string | null;
};

type TransactionListProps = {
    transactions: Transaction[];
};

export default function TransactionList({ transactions }: TransactionListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState("ALL");

    // Extract unique users for filter dropdown
    const uniqueUsers = Array.from(new Set(transactions.map(t => t.user))).sort();

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch =
            t.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesUser = selectedUser === "ALL" || t.user === selectedUser;

        return matchesSearch && matchesUser;
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">All Transactions</h2>
                <div className="flex gap-4 w-full sm:w-auto">
                    <select
                        className="pl-4 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white appearance-none cursor-pointer"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="ALL">All Users</option>
                        {uniqueUsers.map(user => (
                            <option key={user} value={user}>{user}</option>
                        ))}
                    </select>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-y border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredTransactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${tx.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {tx.type === 'income' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                                        {tx.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{tx.user}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{tx.category}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={tx.description || tx.detail || ''}>
                                    {tx.description || tx.detail || '-'}
                                </td>
                                <td className={`px-6 py-4 text-sm font-bold text-right ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        {filteredTransactions.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No transactions found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
