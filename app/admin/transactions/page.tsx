import { getIncomes, getExpenses } from "@/app/actions/admin";
import TransactionList from "@/app/components/admin/TransactionList";

export const dynamic = 'force-dynamic';

export default async function TransactionsPage() {
    const [incomes, expenses] = await Promise.all([getIncomes(), getExpenses()]);

    // Combine and sort by date descending
    const allTransactions = [...incomes, ...expenses].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="p-8 space-y-8 min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">All Transactions</h1>
            </div>
            <TransactionList transactions={allTransactions} />
        </div>
    );
}
