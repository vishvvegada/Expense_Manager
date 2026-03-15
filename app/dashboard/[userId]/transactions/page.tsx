import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import UserTransactionList from "@/app/components/user/UserTransactionList";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

type PageProps = {
    params: Promise<{
        userId: string;
    }>;
};

export default async function TransactionsPage(props: PageProps) {
    const params = await props.params;
    const { userId } = params;
    const session = await getSession();

    if (!session || String(session.userId) !== userId) {
        redirect("/login");
    }

    // Fetch all incomes, expenses, categories, and people
    const [incomes, expenses, categoriesData, peopleData] = await Promise.all([
        prisma.income.findMany({
            where: { UserID: parseInt(userId) },
            include: { category: true, people: true },
            orderBy: { IncomeDate: 'desc' }
        }),
        prisma.expense.findMany({
            where: { UserID: parseInt(userId) },
            include: { category: true, subCategory: true, people: true },
            orderBy: { ExpenseDate: 'desc' }
        }),
        prisma.category.findMany({
            where: { UserID: parseInt(userId), IsActive: true },
            select: { CategoryID: true, CategoryName: true },
            orderBy: { Sequence: "asc" }
        }),
        prisma.people.findMany({
            where: { UserID: parseInt(userId), IsActive: true },
            select: { PeopleID: true, PeopleName: true }
        })
    ]);

    // Combine and sort
    const allTransactions = [
        ...incomes.map(i => ({
            id: i.IncomeID,
            type: 'INCOME' as const,
            date: i.IncomeDate,
            amount: Number(i.Amount),
            category: i.category ? {
                id: i.category.CategoryID,
                CategoryName: i.category.CategoryName,
                LogoPath: i.category.LogoPath
            } : null,
            people: i.people ? {
                id: i.people.PeopleID,
                PeopleName: i.people.PeopleName
            } : null,
            description: i.Description,
            detail: i.IncomeDetail,
            subCategory: null
        })),
        ...expenses.map(e => ({
            id: e.ExpenseID,
            type: 'EXPENSE' as const,
            date: e.ExpenseDate,
            amount: Number(e.Amount),
            category: e.category ? {
                id: e.category.CategoryID,
                CategoryName: e.category.CategoryName,
                LogoPath: e.category.LogoPath
            } : null,
            people: e.people ? {
                id: e.people.PeopleID,
                PeopleName: e.people.PeopleName
            } : null,
            description: e.Description,
            detail: e.ExpenseDetail,
            subCategory: e.subCategory ? {
                ...e.subCategory,
                Sequence: e.subCategory.Sequence ? Number(e.subCategory.Sequence) : 0
            } : null
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalIncome = incomes.reduce((sum, i) => sum + Number(i.Amount), 0);
    const totalExpense = expenses.reduce((sum, e) => sum + Number(e.Amount), 0);
    const netBalance = totalIncome - totalExpense;

    return (
        <div className="p-0 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-gray-200/60 shadow-none">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent pb-1">Transactions</h1>
                    <p className="text-gray-500 mt-1 text-lg font-medium">History of all your incomes and expenses</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Net Balance Card */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 shadow-xl shadow-indigo-200 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <p className="font-medium text-indigo-50">Net Balance</p>
                        <div className="p-2 bg-white/20 rounded-xl">
                            <Wallet className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold relative z-10">${netBalance.toFixed(2)}</h3>
                </div>

                {/* Total Income Card */}
                <div className="bg-white rounded-3xl p-6 shadow-md shadow-gray-200/50 border-t-[4px] border-emerald-500 relative overflow-hidden group hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <p className="font-medium text-gray-500">Total Income</p>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 relative z-10">${totalIncome.toFixed(2)}</h3>
                </div>

                {/* Total Expense Card */}
                <div className="bg-white rounded-3xl p-6 shadow-md shadow-gray-200/50 border-t-[4px] border-rose-500 relative overflow-hidden group hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <p className="font-medium text-gray-500">Total Expense</p>
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                            <ArrowDownRight className="w-5 h-5" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 relative z-10">${totalExpense.toFixed(2)}</h3>
                </div>
            </div>

            <UserTransactionList
                transactions={allTransactions}
                userId={parseInt(userId)}
                categories={categoriesData.map(c => ({ id: c.CategoryID, name: c.CategoryName }))}
                people={peopleData.map(p => ({ id: p.PeopleID, name: p.PeopleName }))}
            />
        </div>
    );
}
