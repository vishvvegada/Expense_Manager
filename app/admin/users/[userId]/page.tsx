import { getUserDetails } from "@/app/actions/admin";
import AdminUserCharts from "@/app/components/admin/AdminUserCharts";
import TransactionList from "@/app/components/admin/TransactionList";
import { ArrowLeft, Mail, Smartphone, Calendar, User, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

type PageProps = {
    params: Promise<{
        userId: string;
    }>;
};

export default async function AdminUserPage({ params }: PageProps) {
    const { userId } = await params;
    const data = await getUserDetails(parseInt(userId));

    if (!data) {
        notFound();
    }

    const { user, stats, graphData, categoryData, incomeCategoryData, transactions } = data;

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            {/* Header / Navigate Back */}
            <div className="flex items-center gap-4">
                <Link href="/admin/users" className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 line-clamp-1">{user.UserName}</h1>
                    <p className="text-sm text-gray-500">User Details & Financial Overview</p>
                </div>
            </div>

            {/* Top Cards: User Info & Key Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-lg font-bold">
                            {user.UserName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">{user.UserName}</h2>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.RoleID === 1 ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                {user.RoleID === 1 ? 'Administrator' : 'Standard User'}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {user.EmailAddress}
                        </div>
                        <div className="flex items-center gap-3">
                            <Smartphone className="w-4 h-4 text-gray-400" />
                            {user.MobileNo || "No mobile number"}
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            Joined {new Date(user.Created).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="flex items-center gap-3 text-green-600 mb-2">
                            <TrendingUp className="w-5 h-5" />
                            <span className="font-medium">Total Income</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">${stats.totalIncome.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="flex items-center gap-3 text-red-600 mb-2">
                            <TrendingDown className="w-5 h-5" />
                            <span className="font-medium">Total Expense</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">${stats.totalExpense.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="flex items-center gap-3 text-blue-600 mb-2">
                            <Wallet className="w-5 h-5" />
                            <span className="font-medium">Net Balance</span>
                        </div>
                        <p className={`text-3xl font-bold ${stats.balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                            ${stats.balance.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <AdminUserCharts monthlyData={graphData} categoryData={categoryData} incomeCategoryData={incomeCategoryData} />

            {/* Transactions */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                <TransactionList transactions={transactions} />
            </div>
        </div>
    );
}
