import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import UserCharts from "@/app/components/user/UserCharts";
import { redirect } from "next/navigation";
import { format } from "date-fns";

type PageProps = {
    params: Promise<{
        userId: string;
    }>;
};

export default async function AnalyticsPage(props: PageProps) {
    const params = await props.params;
    const { userId } = params;
    const session = await getSession();

    if (!session || String(session.userId) !== userId) {
        redirect("/login");
    }

    // 1. Fetch expenses for category distribution
    const expenses = await prisma.expense.findMany({
        where: { UserID: parseInt(userId) },
        include: { category: true }
    });

    // 2. Fetch incomes for monthly comparison & distribution
    const incomes = await prisma.income.findMany({
        where: { UserID: parseInt(userId) },
        include: { category: true }
    });

    // Process Data for Charts

    // Expense Category Data
    const categoryMap = new Map<string, number>();
    expenses.forEach(e => {
        const catName = e.category?.CategoryName || 'Uncategorized';
        categoryMap.set(catName, (categoryMap.get(catName) || 0) + Number(e.Amount));
    });

    const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({
        name,
        value
    }));

    // Income Category Data
    const incomeCategoryMap = new Map<string, number>();
    incomes.forEach(i => {
        const catName = i.category?.CategoryName || 'Uncategorized';
        incomeCategoryMap.set(catName, (incomeCategoryMap.get(catName) || 0) + Number(i.Amount));
    });

    const incomeCategoryData = Array.from(incomeCategoryMap.entries()).map(([name, value]) => ({
        name,
        value
    }));

    // Monthly Data (Income vs Expense)
    const monthlyMap = new Map<string, { income: number; expense: number }>();

    // Helper to get month key "Jan 2024"
    const getMonthKey = (date: Date) => format(date, 'MMM yyyy');

    incomes.forEach(i => {
        const key = getMonthKey(i.IncomeDate);
        const current = monthlyMap.get(key) || { income: 0, expense: 0 };
        monthlyMap.set(key, { ...current, income: current.income + Number(i.Amount) });
    });

    expenses.forEach(e => {
        const key = getMonthKey(e.ExpenseDate);
        const current = monthlyMap.get(key) || { income: 0, expense: 0 };
        monthlyMap.set(key, { ...current, expense: current.expense + Number(e.Amount) });
    });

    // Convert map to array and use simple reverse for now (assuming data is relatively recent/ordered by DB insert often aligns, but safer to sort if strict)
    const monthlyData = Array.from(monthlyMap.entries()).map(([name, data]) => ({
        name,
        ...data
    })).reverse().slice(0, 6).reverse();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-500">Visual insights into your financial health</p>
            </div>

            <UserCharts
                monthlyData={monthlyData}
                categoryData={categoryData}
                incomeCategoryData={incomeCategoryData}
            />
        </div>
    );
}
