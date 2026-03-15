import { getDashboardData } from "@/app/actions/dashboard";
import DashboardActions from "@/app/components/user/DashboardActions";
import BudgetWidget from "@/app/components/user/BudgetWidget";
import { getCurrentUser } from "@/lib/auth";
import { ArrowRight, BarChart3, FileText, Lightbulb, Wallet, TrendingUp, TrendingDown, Activity, CalendarDays, Zap } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getDashboardData(user.UserID.toString());

  if (!data) {
    return <div className="flex h-screen items-center justify-center bg-gray-50 text-red-500 font-medium">Failed to load dashboard data.</div>;
  }

  const {
    stats,
    transactions,
    budget,
    currentMonthExpenses,
    insights,
    categories,
    people
  } = data;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="relative min-h-screen bg-[#f8fafc] overflow-hidden selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/80 via-[#f8fafc] to-[#f8fafc] -z-10 pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/40 blur-[120px] mix-blend-multiply -z-10 pointer-events-none animate-pulse duration-10000"></div>
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-200/40 blur-[120px] mix-blend-multiply -z-10 pointer-events-none animate-pulse duration-7000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] rounded-full bg-blue-100/40 blur-[120px] mix-blend-multiply -z-10 pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto p-6 md:p-8 lg:p-10 space-y-10 relative z-10">

        {/* 1. Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6 rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/60 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-white/60 to-transparent -z-10 pointer-events-none"></div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-white/80 border border-white shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Dashboard Active</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-br from-gray-900 via-slate-800 to-gray-600 bg-clip-text text-transparent pb-1">
              Overview
            </h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">
              Welcome back, <span className="font-bold text-indigo-700">{user.UserName}</span>. Here's your financial pulse.
            </p>
          </div>

          <div className="flex-[0_0_auto] z-20 w-full sm:w-auto">
             <DashboardActions
              userId={user.UserID}
              categories={categories}
              people={people}
            />
          </div>
        </div>

        {/* 2. Key Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">

          {/* Income Card */}
          <div className="group relative overflow-hidden bg-white/80 backdrop-blur-xl p-7 rounded-[2rem] shadow-sm border border-white/60 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-500">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-100/80 to-transparent rounded-bl-full -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3.5 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg shadow-sm">
                <Activity className="w-3 h-3" /> Income
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Income</p>
              <h3 className="text-4xl font-black text-gray-900 tracking-tight">${stats.totalIncome.toLocaleString()}</h3>
            </div>
          </div>

          {/* Expense Card */}
          <div className="group relative overflow-hidden bg-white/80 backdrop-blur-xl p-7 rounded-[2rem] shadow-sm border border-white/60 hover:shadow-2xl hover:shadow-rose-500/10 hover:-translate-y-1 transition-all duration-500">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-rose-100/80 to-transparent rounded-bl-full -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3.5 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl text-white shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform duration-500">
                <TrendingDown className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg shadow-sm">
                <Activity className="w-3 h-3" /> Expense
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Expense</p>
              <h3 className="text-4xl font-black text-gray-900 tracking-tight">${stats.totalExpense.toLocaleString()}</h3>
            </div>
          </div>

          {/* Balance Card */}
          <div className={`group relative overflow-hidden bg-white/80 backdrop-blur-xl p-7 rounded-[2rem] shadow-sm border hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ${stats.balance >= 0 ? 'border-white/60 hover:shadow-indigo-500/10' : 'border-red-100/60 hover:shadow-red-500/10'}`}>
            <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl rounded-bl-full -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-500 ${stats.balance >= 0 ? 'from-indigo-100/80 to-transparent' : 'from-red-100/80 to-transparent'}`}></div>
            <div className="flex justify-between items-start mb-6">
               <div className={`p-3.5 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-500 ${stats.balance >= 0 ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30' : 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/30'}`}>
                <Zap className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border shadow-sm ${stats.balance >= 0 ? 'text-indigo-600 bg-indigo-50 border-indigo-100' : 'text-red-600 bg-red-50 border-red-100'}`}>
                <Wallet className="w-3 h-3" /> Net
              </span>
            </div>
            <div>
              <p className={`text-sm font-bold uppercase tracking-widest mb-1 ${stats.balance >= 0 ? 'text-gray-400' : 'text-red-400'}`}>Net Balance</p>
              <h3 className={`text-4xl font-black tracking-tight ${stats.balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                ${stats.balance.toLocaleString()}
              </h3>
            </div>
          </div>

          {/* Monthly Budgeting Widget (Functional) */}
          <div id="budgets" className="h-full relative z-20">
            <BudgetWidget
              budget={budget}
              currentMonthExpenses={currentMonthExpenses}
              userId={user.UserID}
            />
          </div>
        </div>

        {/* 3. Feature Links & Summaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Analysis Link */}
          <Link href="/user/analysis" className="group block h-full outline-none">
            <div className="relative bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white/60 h-full hover:shadow-xl hover:bg-white transition-all duration-500 hover:-translate-y-1 overflow-hidden z-10 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl -mx-10 -my-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
              
              <div className="relative z-10 mb-8">
                <div className="w-16 h-16 flex items-center justify-center bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all duration-500 mb-6 border border-purple-100">
                  <BarChart3 className="w-8 h-8 group-hover:scale-110 transition-transform duration-500" strokeWidth={2} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Spending Analysis</h3>
                <p className="text-gray-500 font-medium leading-relaxed">Visualize your monthly trends, category breakdowns, and track where your money goes.</p>
              </div>
              
              <div className="relative z-10 flex items-center text-purple-600 font-bold group-hover:text-purple-700 transition-colors">
                <span className="text-lg">View Analytics</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-500" />
              </div>
            </div>
          </Link>

          {/* Reports Link */}
          <Link href="/user/reports" className="group block h-full outline-none">
            <div className="relative bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white/60 h-full hover:shadow-xl hover:bg-white transition-all duration-500 hover:-translate-y-1 overflow-hidden z-10 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl -mx-10 -my-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
              
              <div className="relative z-10 mb-8">
                <div className="w-16 h-16 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-500 mb-6 border border-blue-100">
                  <FileText className="w-8 h-8 group-hover:scale-110 transition-transform duration-500" strokeWidth={2} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Financial Reports</h3>
                <p className="text-gray-500 font-medium leading-relaxed">View detailed statements, filter specific periods, and export your transaction history.</p>
              </div>
              
              <div className="relative z-10 flex items-center text-blue-600 font-bold group-hover:text-blue-700 transition-colors">
                <span className="text-lg">Generate Reports</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-500" />
              </div>
            </div>
          </Link>

          {/* Insights Preview */}
          <Link href="/user/insights" className="group block h-full outline-none">
            <div className="relative bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-8 rounded-[2rem] shadow-lg shadow-orange-500/20 h-full hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 hover:-translate-y-1 overflow-hidden z-10 flex flex-col justify-between text-white border border-amber-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mx-10 -my-10 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 pointer-events-none z-0"></div>
              
              <div className="relative z-10 mb-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 flex items-center justify-center bg-white/20 backdrop-blur-md text-white rounded-2xl shadow-inner border border-white/30 group-hover:bg-white group-hover:text-orange-500 transition-all duration-500">
                    <Lightbulb className="w-8 h-8 group-hover:scale-110 transition-transform duration-500" strokeWidth={2.5} />
                  </div>
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm border border-white/30">AI Insight</span>
                </div>
                <h3 className="text-3xl font-bold mb-3 tracking-tight">Smart Insight</h3>
                <p className="font-medium text-white/90 leading-relaxed text-lg line-clamp-3 text-pretty">
                  {insights && insights.length > 0 ? `"${insights[0].text}"` : "Check back later for personalized insights based on your spending habits."}
                </p>
              </div>
              
              <div className="relative z-10 flex items-center font-bold text-white group-hover:text-orange-950 transition-colors bg-white/20 hover:bg-white/30 w-fit px-5 py-2.5 rounded-xl backdrop-blur-md border border-white/30 shadow-sm">
                <span>View More Insights</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-500" />
              </div>
            </div>
          </Link>
        </div>

        {/* 4. Recent Activity Preview */}
        <div className="bg-white/70 backdrop-blur-2xl p-8 lg:p-10 rounded-[2.5rem] shadow-sm border border-white/60 relative overflow-hidden">
           {/* Subtle corner decoration */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-50/50 via-white/10 to-transparent -z-10 opacity-80 pointer-events-none rounded-bl-full"></div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                   <CalendarDays className="w-6 h-6" />
                 </div>
                 <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Recent Activity</h2>
              </div>
              <p className="text-gray-500 font-semibold ml-12">Your latest 5 financial movements</p>
            </div>
            <Link href="/user/transactions">
              <button className="px-6 py-3 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-600 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 group border border-indigo-100">
                View All History <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          <div className="flex flex-col gap-4 relative z-10">
             {recentTransactions.map((t) => (
              <div key={`${t.type}-${t.id}`} className="group relative flex items-center justify-between p-6 bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-500 hover:-translate-y-1 overflow-hidden cursor-pointer">
                {/* Hover line effect */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${t.type === 'INCOME' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                
                <div className="flex items-center gap-5 md:gap-6 z-10">
                  <div className={`w-16 h-16 flex items-center justify-center rounded-2xl shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${t.type === 'INCOME' ? 'bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gradient-to-br from-rose-100 to-rose-50 text-rose-600 border border-rose-100'}`}>
                    {t.type === 'INCOME' ? <TrendingUp className="w-7 h-7" strokeWidth={2.5} /> : <TrendingDown className="w-7 h-7" strokeWidth={2.5} /> }
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-xl group-hover:text-indigo-700 transition-colors">{t.description || "Untitled Transaction"}</p>
                    <div className="flex items-center gap-2.5 mt-2">
                      <span className="text-sm font-bold text-gray-400">{new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 tracking-wider uppercase border border-gray-200">{t.category?.CategoryName || 'Uncategorized'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right z-10">
                  <span className={`font-black text-2xl md:text-3xl tracking-tight block ${t.type === 'INCOME' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <div className="text-center py-20 bg-white/50 backdrop-blur-md rounded-[2rem] border-2 border-dashed border-gray-200">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-5 shadow-inner">
                  <Wallet className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-2xl font-black text-gray-900 mb-2">No recent activity</p>
                <p className="text-gray-500 font-semibold text-lg">Start tracking your financial journey by adding a transaction above.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
