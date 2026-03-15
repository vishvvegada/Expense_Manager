"use client";

import { useState } from "react";
import Modal from "../Modal";
import { setBudget } from "@/app/actions/budget";

type SetBudgetModalProps = {
    isOpen: boolean;
    onClose: () => void;
    userId: number;
    currentBudget: number | null;
};

export default function SetBudgetModal({ isOpen, onClose, userId, currentBudget }: SetBudgetModalProps) {
    const [amount, setAmount] = useState(currentBudget ? currentBudget.toString() : "");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const now = new Date();
        const formData = new FormData();
        formData.append("userId", userId.toString());
        formData.append("amount", amount);
        formData.append("month", (now.getMonth() + 1).toString());
        formData.append("year", now.getFullYear().toString());

        try {
            await setBudget(formData);
            onClose();
        } catch (error) {
            console.error("Failed to set budget", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Set Monthly Budget">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Budget Amount ($)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g. 5000"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? "Saving..." : "Save Budget"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
