import { getExpenses } from "@/app/actions/admin";
import TransactionList from "@/app/components/admin/TransactionList";

export const dynamic = 'force-dynamic';

export default async function ExpensesPage() {
    const expenses = await getExpenses();

    // Map to TransactionList compatible format (TransactionList handles both, but type might need adjustment if strict)
    // TransactionList expects 'type' to be 'income' | 'expense'

    return (
        <div className="p-8 space-y-8 min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Manage Expenses</h1>
            </div>
            <TransactionList transactions={expenses} />
        </div>
    );
}
