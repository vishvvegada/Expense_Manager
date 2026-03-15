
import { getAdminReports } from "@/app/actions/admin";
import { FileBarChart, Users, ArrowLeftRight, TrendingUp, TrendingDown } from "lucide-react";

export default async function AdminReportsPage() {
    const stats = await getAdminReports();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">System Reports</h1>
                <p className="text-gray-500">Key metrics and system-wide statistics</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Users</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                            <ArrowLeftRight className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Transactions</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-lg text-green-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Volume (In)</p>
                            <h3 className="text-2xl font-bold text-gray-900">${stats.totalIncome.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-50 rounded-lg text-red-600">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Volume (Out)</p>
                            <h3 className="text-2xl font-bold text-gray-900">${stats.totalExpense.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Net Balance Status */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-lg">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">System Net Balance</h2>
                        <p className="text-gray-400">Total accumulated balance across all time</p>
                    </div>
                    <div className="text-center md:text-right">
                        <h3 className={`text-4xl font-bold ${stats.netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {stats.netBalance >= 0 ? '+' : ''}${stats.netBalance.toLocaleString()}
                        </h3>
                    </div>
                </div>
            </div>

            
        </div>
    );
}
