"use client";

import { useState } from "react";
import { ArrowRight, PiggyBank } from "lucide-react";
import SetBudgetModal from "./SetBudgetModal";

type BudgetWidgetProps = {
    budget: { Amount: number } | null;
    currentMonthExpenses: number;
    userId: number;
};

export default function BudgetWidget({ budget, currentMonthExpenses, userId }: BudgetWidgetProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const budgetAmount = budget ? budget.Amount : 0;
    const percentUsed = budgetAmount > 0 ? Math.min((currentMonthExpenses / budgetAmount) * 100, 100) : 0;
    const remaining = Math.max(0, budgetAmount - currentMonthExpenses);

    return (
        <>
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-7 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-500 text-white relative overflow-hidden group">
                {/* Background Icon */}
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <PiggyBank size={120} />
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-4 opacity-90">
                            <PiggyBank className="w-5 h-5" />
                            <span className="font-semibold text-sm tracking-wide uppercase">Monthly Budget</span>
                        </div>

                        <div className="mb-4">
                            {budgetAmount > 0 ? (
                                <>
                                    <p className="text-3xl font-bold font-mono">
                                        ${currentMonthExpenses.toLocaleString()}
                                        <span className="text-lg text-indigo-200 font-sans ml-1">/ ${budgetAmount.toLocaleString()}</span>
                                    </p>
                                    <p className="text-indigo-200 text-sm mt-1">
                                        ${remaining.toLocaleString()} remaining
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-3xl font-bold">$0.00</p>
                                    <p className="text-indigo-200 text-sm mt-1">Budget not set</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="w-full bg-indigo-900/40 rounded-full h-2 mb-4 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ease-out ${percentUsed > 100 ? 'bg-red-400' : percentUsed > 85 ? 'bg-yellow-300' : 'bg-green-400'
                                    }`}
                                style={{ width: `${percentUsed}%` }}
                            ></div>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-bold py-2 px-3 rounded-lg backdrop-blur-sm transition-colors flex items-center gap-1 w-max"
                        >
                            {budget ? "Edit Budget" : "Set Goal"} <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>

            <SetBudgetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userId={userId}
                currentBudget={budget ? budget.Amount : null}
            />
        </>
    );
}
