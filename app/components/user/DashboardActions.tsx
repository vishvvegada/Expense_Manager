"use client";

import { useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";
import AddTransactionModal from "./AddTransactionModal";

type DashboardActionsProps = {
    userId: number;
    categories: { id: number; name: string }[];
    people: { id: number; name: string }[];
};

export default function DashboardActions({ userId, categories, people }: DashboardActionsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"INCOME" | "EXPENSE">("EXPENSE");

    const openModal = (type: "INCOME" | "EXPENSE") => {
        setModalType(type);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-4">
                <button
                    onClick={() => openModal("INCOME")}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-95 text-white rounded-2xl font-bold transition-all shadow-sm hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 border border-emerald-400/50"
                >
                    <PlusCircle className="w-5 h-5" strokeWidth={2.5} />
                    <span>Add Income</span>
                </button>
                <button
                    onClick={() => openModal("EXPENSE")}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 active:scale-95 text-white rounded-2xl font-bold transition-all shadow-sm hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-1 border border-rose-400/50"
                >
                    <MinusCircle className="w-5 h-5" strokeWidth={2.5} />
                    <span>Add Expense</span>
                </button>
            </div>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userId={userId}
                categories={categories}
                people={people}
                defaultType={modalType}
            />
        </>
    );
}
