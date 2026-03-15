import { getIncomes } from "@/app/actions/admin";
import TransactionList from "@/app/components/admin/TransactionList";

export const dynamic = 'force-dynamic';

export default async function IncomesPage() {
    const incomes = await getIncomes();

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Income Details</h1>
            </div>
            <TransactionList transactions={incomes} />
        </div>
    );
}
