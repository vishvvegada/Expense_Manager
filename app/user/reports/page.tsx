import { getDashboardData } from "@/app/actions/dashboard";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import DownloadReportButton from "@/app/components/user/DownloadReportButton";

export default async function UserReportsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const data = await getDashboardData(user.UserID.toString());

    if (!data) {
        return <div className="p-8 text-center">Failed to load reports.</div>;
    }

    const { graphData, transactions } = data;

    // Calculate detailed stats
    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
                <DownloadReportButton 
                    transactions={transactions} 
                    totalIncome={totalIncome} 
                    totalExpense={totalExpense} 
                />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <h3 className="text-gray-600 text-sm font-medium">Total Income</h3>
                    <p className="text-2xl font-bold text-green-700">${totalIncome.toLocaleString()}</p>
                </div>
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                    <h3 className="text-gray-600 text-sm font-medium">Total Expense</h3>
                    <p className="text-2xl font-bold text-red-700">${totalExpense.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="text-gray-600 text-sm font-medium">Net Savings</h3>
                    <p className="text-2xl font-bold text-blue-700">${(totalIncome - totalExpense).toLocaleString()}</p>
                </div>
            </div>

            {/* Transaction History Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-white">
                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map((t) => (
                                <tr key={`${t.type}-${t.id}`} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(t.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                        {t.description}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                            {t.category?.CategoryName || "Uncategorized"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
