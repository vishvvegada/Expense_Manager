"use server";

import prisma from "@/lib/prisma";

export async function getDashboardData(userId: string) {
    const id = parseInt(userId);
    if (isNaN(id)) return null;

    // Helper for date calculations
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const user = await prisma.user.findUnique({
        where: { UserID: id },
        select: {
            UserID: true,
            UserName: true,
            EmailAddress: true,
            RoleID: true,
            MobileNo: true,
            ProfileImage: true,
        },
    });

    const [categories, people, projects] = await Promise.all([
        prisma.category.findMany({
            where: { UserID: id, IsActive: true },
            select: { CategoryID: true, CategoryName: true },
            orderBy: { Sequence: "asc" },
        }),
        prisma.people.findMany({
            where: { UserID: id, IsActive: true },
            select: { PeopleID: true, PeopleName: true },
        }),
        prisma.project.findMany({
            where: { UserID: id, IsActive: true },
            select: { ProjectID: true, ProjectName: true },
        }),
    ]);

    const [incomes, expenses, budget] = await Promise.all([
        prisma.income.findMany({
            where: { UserID: id },
            orderBy: { IncomeDate: "desc" },
            include: { category: true, people: true },
        }),
        prisma.expense.findMany({
            where: { UserID: id },
            orderBy: { ExpenseDate: "desc" },
            include: { category: true, people: true },
        }),
        prisma.budget.findFirst({
            where: {
                UserID: id,
                Month: currentMonth,
                Year: currentYear,
            }
        })
    ]);

    // Calculate current month expenses
    const currentMonthExpenses = expenses.filter(e => {
        const d = new Date(e.ExpenseDate);
        return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
    }).reduce((sum, e) => sum + Number(e.Amount), 0);

    // Calculate last month expenses for comparison
    const lastMonthExpenses = expenses.filter(e => {
        const d = new Date(e.ExpenseDate);
        return d.getMonth() + 1 === lastMonth && d.getFullYear() === lastMonthYear;
    }).reduce((sum, e) => sum + Number(e.Amount), 0);

    // Generate Smart Insights
    const insights = [];

    // Insight 1: Spending trend
    if (currentMonthExpenses > lastMonthExpenses && lastMonthExpenses > 0) {
        const increase = ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
        insights.push({
            type: "warning",
            text: `Spending is ${increase.toFixed(0)}% higher than last month.`
        });
    } else if (currentMonthExpenses < lastMonthExpenses) {
        const decrease = ((lastMonthExpenses - currentMonthExpenses) / lastMonthExpenses) * 100;
        insights.push({
            type: "success",
            text: `Great job! You spent ${decrease.toFixed(0)}% less than last month.`
        });
    }

    // Insight 2: Budget alert
    if (budget && currentMonthExpenses > Number(budget.Amount)) {
        insights.push({
            type: "danger",
            text: `You have exceeded your monthly budget of $${Number(budget.Amount).toLocaleString()}.`
        });
    } else if (budget) {
        const percentUsed = (currentMonthExpenses / Number(budget.Amount)) * 100;
        if (percentUsed > 80) {
            insights.push({
                type: "warning",
                text: `Heads up! You've used ${percentUsed.toFixed(0)}% of your monthly budget.`
            });
        }
    }

    // Fallback insight if no data
    if (insights.length === 0) {
        insights.push({
            type: "info",
            text: "Track your expenses regularly to get smart insights."
        });
    }

    // Process Chart Data (Last 6 Months)
    const graphData = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthLabel = d.toLocaleString('en-US', { month: 'short' });
        const year = d.getFullYear();
        const monthIndex = d.getMonth();

        const calculateTotal = (items: any[]) => items
            .filter(item => {
                const date = new Date(item.IncomeDate || item.ExpenseDate);
                return date.getMonth() === monthIndex && date.getFullYear() === year;
            })
            .reduce((sum, item) => sum + Number(item.Amount), 0);

        graphData.push({
            name: monthLabel,
            income: calculateTotal(incomes),
            expense: calculateTotal(expenses)
        });
    }

    // Process Category Data (All time for now, or could be filtered)
    const categoryMap = new Map<string, number>();
    expenses.forEach((exp) => {
        const catName = exp.category?.CategoryName || "Uncategorized";
        categoryMap.set(catName, (categoryMap.get(catName) || 0) + Number(exp.Amount));
    });
    const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));

    const incomeCategoryMap = new Map<string, number>();
    incomes.forEach((inc) => {
        const catName = inc.category?.CategoryName || "Uncategorized";
        incomeCategoryMap.set(catName, (incomeCategoryMap.get(catName) || 0) + Number(inc.Amount));
    });
    const incomeCategoryData = Array.from(incomeCategoryMap.entries()).map(([name, value]) => ({ name, value }));

    const totalIncome = incomes.reduce((sum, i) => sum + Number(i.Amount), 0);
    const totalExpense = expenses.reduce((sum, e) => sum + Number(e.Amount), 0);

    // Combine Transactions
    const transactions = [
        ...incomes.map((i) => ({
            id: i.IncomeID,
            type: "INCOME" as const,
            amount: Number(i.Amount),
            date: i.IncomeDate,
            category: i.category ? { id: i.category.CategoryID, CategoryName: i.category.CategoryName, LogoPath: i.category.LogoPath } : null,
            people: i.people ? { id: i.people.PeopleID, PeopleName: i.people.PeopleName } : null,
            description: i.Description,
            detail: i.IncomeDetail,
        })),
        ...expenses.map((e) => ({
            id: e.ExpenseID,
            type: "EXPENSE" as const,
            amount: Number(e.Amount),
            date: e.ExpenseDate,
            category: e.category ? { id: e.category.CategoryID, CategoryName: e.category.CategoryName, LogoPath: e.category.LogoPath } : null,
            people: e.people ? { id: e.people.PeopleID, PeopleName: e.people.PeopleName } : null,
            description: e.Description,
            detail: e.ExpenseDetail,
        })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10); // Limit to recent 10 for dashboard

    return {
        user,
        categories: categories.map((c) => ({ id: c.CategoryID, name: c.CategoryName })),
        people: people.map((p) => ({ id: p.PeopleID, name: p.PeopleName })),
        projects: projects.map((p) => ({ id: p.ProjectID, name: p.ProjectName })),
        graphData,
        categoryData,
        incomeCategoryData,
        transactions,
        stats: {
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense,
        },
        budget: budget ? { ...budget, Amount: Number(budget.Amount) } : null,
        currentMonthExpenses,
        insights
    };
}
