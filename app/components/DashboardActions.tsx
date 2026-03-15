"use client";

import React, { useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";
import Modal from "./Modal";
import TransactionForm from "./TransactionForm";
import { addTransaction } from "../actions/transaction";

type Option = { id: number; name: string };

type DashboardActionsProps = {
    userId: string;
    categories: Option[];
    people: Option[];
    projects: Option[];
};

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DashboardActions({
    userId,
    categories,
    people,
    projects,
}: DashboardActionsProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [isExpenseOpen, setIsExpenseOpen] = useState(false);
    const [isIncomeOpen, setIsIncomeOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const action = searchParams.get("action");
        if (action === "expense") {
            setIsExpenseOpen(true);
        } else if (action === "income") {
            setIsIncomeOpen(true);
        }
    }, [searchParams]);

    const handleClose = () => {
        setIsExpenseOpen(false);
        setIsIncomeOpen(false);
        // Remove query param without full reload
        router.replace(pathname, { scroll: false });
    };

    const handleTransactionSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            const result = await addTransaction(formData);
            if (result.success) {
                handleClose();
                router.refresh(); // Ensure client data is fresh
            } else {
                alert(result.error || "Failed to save transaction.");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to save transaction.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex gap-4 mt-6">
                <button
                    onClick={() => setIsExpenseOpen(true)}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-md transition-all active:scale-95"
                >
                    <MinusCircle className="w-5 h-5" />
                    Add Expense
                </button>
                <button
                    onClick={() => setIsIncomeOpen(true)}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md transition-all active:scale-95"
                >
                    <PlusCircle className="w-5 h-5" />
                    Add Income
                </button>
            </div>

            <Modal
                isOpen={isExpenseOpen}
                onClose={handleClose}
                title="Add New Expense"
            >
                <TransactionForm
                    type="EXPENSE"
                    userId={userId}
                    categories={categories}
                    people={people}
                    projects={projects}
                    onSubmit={handleTransactionSubmit}
                    isLoading={isSubmitting}
                />
            </Modal>

            <Modal
                isOpen={isIncomeOpen}
                onClose={handleClose}
                title="Add New Income"
            >
                <TransactionForm
                    type="INCOME"
                    userId={userId}
                    categories={categories} // Ideally filter for income categories if distinguished in DB
                    people={people}
                    projects={projects}
                    onSubmit={handleTransactionSubmit}
                    isLoading={isSubmitting}
                />
            </Modal>
        </>
    );
}
