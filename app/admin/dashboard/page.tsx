import { getAdminData } from "@/app/actions/admin";
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import AdminCharts from "@/app/components/admin/AdminCharts";
import UserList from "@/app/components/admin/UserList";
import TransactionList from "@/app/components/admin/TransactionList";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const data = await getAdminData();
  const { stats, users, chartData, transactions } = data;

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="w-8 h-8 text-blue-600" />}
          trend="Total Platform Users"
          color="bg-blue-50 border-blue-200"
        />
        <StatCard
          title="Total Income"
          value={`$${stats.totalIncome.toFixed(2)}`}
          icon={<TrendingUp className="w-8 h-8 text-green-600" />}
          trend="Lifetime Earnings"
          color="bg-green-50 border-green-200"
        />
        <StatCard
          title="Total Expenses"
          value={`$${stats.totalExpense.toFixed(2)}`}
          icon={<TrendingDown className="w-8 h-8 text-red-600" />}
          trend="Lifetime Spending"
          color="bg-red-50 border-red-200"
        />
        <StatCard
          title="Net Balance"
          value={`$${stats.balance.toFixed(2)}`}
          icon={<DollarSign className="w-8 h-8 text-purple-600" />}
          trend="Current Holdings"
          color="bg-purple-50 border-purple-200"
        />
      </div>

      {/* Charts Section */}
      <AdminCharts data={chartData} />

      {/* Navigation Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a href="/admin/users" className="block group">
          <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-all group-hover:border-blue-300">
            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Manage Users
            </h2>
            <p className="text-gray-600">View detailed user list and manage accounts.</p>
          </div>
        </a>

        <a href="/admin/incomes" className="block group">
          <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-all group-hover:border-green-300">
            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              View Income Details
            </h2>
            <p className="text-gray-600">See comprehensive income transactions and reports.</p>
          </div>
        </a>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: any) {
  return (
    <div className={`p-6 rounded-xl border shadow-sm transition-all hover:shadow-md ${color} bg-white`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
        </div>
        <div className="p-2 bg-white rounded-lg shadow-sm">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm text-gray-600">
        <span className="font-medium">{trend}</span>
      </div>
    </div>
  );
}


