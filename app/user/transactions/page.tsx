import { getDashboardData } from "@/app/actions/dashboard";
import UserTransactionList from "@/app/components/user/UserTransactionList";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TransactionsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const data = await getDashboardData(user.UserID.toString());

    if (!data) {
        return <div className="p-8 text-center text-red-500">Failed to load transactions.</div>;
    }

    const { transactions, categories, people } = data;

    // Filter and Sort
    const incomes = transactions
        .filter(t => t.type === 'INCOME')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const expenses = transactions
        .filter(t => t.type === 'EXPENSE')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="p-6 md:p-8 space-y-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center pb-2">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent pb-1">Transactions</h1>
                    <p className="text-gray-500 mt-1 text-lg font-medium">Manage your incomes and expenses seamlessly.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:gap-10">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-emerald-600 flex items-center gap-3">
                        <span className="p-2.5 bg-emerald-100/80 text-emerald-700 rounded-xl shadow-inner">↓</span> Incomes
                    </h2>
                    <div className="bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-sm border border-emerald-100/80 transition-all hover:shadow-md hover:border-emerald-200">
                        <UserTransactionList
                            transactions={incomes}
                            userId={user.UserID}
                            categories={categories}
                            people={people}
                            title="Income List"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-rose-600 flex items-center gap-3">
                        <span className="p-2.5 bg-rose-100/80 text-rose-700 rounded-xl shadow-inner">↑</span> Expenses
                    </h2>
                    <div className="bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-sm border border-rose-100/80 transition-all hover:shadow-md hover:border-rose-200">
                        <UserTransactionList
                            transactions={expenses}
                            userId={user.UserID}
                            categories={categories}
                            people={people}
                            title="Expense List"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
