"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getAdminData() {
    const [users, incomeAgg, expenseAgg, incomes, expenses] = await Promise.all([
        prisma.user.findMany({
            orderBy: { Created: "desc" },
            select: {
                UserID: true,
                UserName: true,
                EmailAddress: true,
                RoleID: true,
                Created: true,
            },
        }),
        prisma.income.groupBy({
            by: ["IncomeDate"],
            _sum: { Amount: true },
        }),
        prisma.expense.groupBy({
            by: ["ExpenseDate"],
            _sum: { Amount: true },
        }),
        prisma.income.findMany({
            orderBy: { IncomeDate: "desc" },
            include: {
                user: { select: { UserName: true } },
                category: { select: { CategoryName: true } },
            },
        }),
        prisma.expense.findMany({
            orderBy: { ExpenseDate: "desc" },
            include: {
                user: { select: { UserName: true } },
                category: { select: { CategoryName: true } },
            },
        }),
    ]);

    // Process Chart Data (Aggregated by Month)
    const chartDataMap = new Map<string, { Income: number; Expense: number }>();

    // Helper to format date as "MMM YYYY"
    const getMonthYear = (date: Date) => {
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    incomes.forEach((inc) => {
        const key = getMonthYear(inc.IncomeDate);
        const current = chartDataMap.get(key) || { Income: 0, Expense: 0 };
        current.Income += Number(inc.Amount);
        chartDataMap.set(key, current);
    });

    expenses.forEach((exp) => {
        const key = getMonthYear(exp.ExpenseDate);
        const current = chartDataMap.get(key) || { Income: 0, Expense: 0 };
        current.Expense += Number(exp.Amount);
        chartDataMap.set(key, current);
    });

    const chartData = Array.from(chartDataMap.entries()).map(([name, data]) => ({
        name,
        ...data,
    })).reverse();

    // Combine Transactions
    const allTransactions = [
        ...incomes.map((i) => ({
            id: `inc-${i.IncomeID}`,
            type: "income" as const,
            amount: Number(i.Amount),
            date: i.IncomeDate,
            category: i.category?.CategoryName || "Uncategorized",
            user: i.user?.UserName || "Unknown",
            description: i.Description,
            detail: i.IncomeDetail,
        })),
        ...expenses.map((e) => ({
            id: `exp-${e.ExpenseID}`,
            type: "expense" as const,
            amount: Number(e.Amount),
            date: e.ExpenseDate,
            category: e.category?.CategoryName || "Uncategorized",
            user: e.user?.UserName || "Unknown",
            description: e.Description,
            detail: e.ExpenseDetail,
        })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate Totals
    const totalIncome = incomes.reduce((sum, i) => sum + Number(i.Amount), 0);
    const totalExpense = expenses.reduce((sum, e) => sum + Number(e.Amount), 0);
    const balance = totalIncome - totalExpense;

    return {
        stats: {
            totalUsers: users.length,
            totalIncome,
            totalExpense,
            balance,
        },
        users,
        chartData,
        transactions: allTransactions,
    };
}

export async function getUsers() {
    return await prisma.user.findMany({
        orderBy: { Created: "desc" },
        select: {
            UserID: true,
            UserName: true,
            EmailAddress: true,
            RoleID: true,
            Created: true,
        },
    });
}

export async function getIncomes() {
    const incomes = await prisma.income.findMany({
        orderBy: { IncomeDate: "desc" },
        include: {
            user: { select: { UserName: true } },
            category: { select: { CategoryName: true } },
        },
    });

    return incomes.map((i) => ({
        id: `inc-${i.IncomeID}`,
        type: "income" as const,
        amount: Number(i.Amount),
        date: i.IncomeDate,
        category: i.category?.CategoryName || "Uncategorized",
        user: i.user?.UserName || "Unknown",
        description: i.Description,
        detail: i.IncomeDetail,
    }));
}

export async function getExpenses() {
    const expenses = await prisma.expense.findMany({
        orderBy: { ExpenseDate: "desc" },
        include: {
            user: { select: { UserName: true } },
            category: { select: { CategoryName: true } },
        },
    });

    return expenses.map((e) => ({
        id: `exp-${e.ExpenseID}`,
        type: "expense" as const,
        amount: Number(e.Amount),
        date: e.ExpenseDate,
        category: e.category?.CategoryName || "Uncategorized",
        user: e.user?.UserName || "Unknown",
        description: e.Description,
        detail: e.ExpenseDetail,
    }));
}

// Fixed: Prevent deleting admins and remove password check
export async function deleteUser(userId: number) {
    try {
        const userToDelete = await prisma.user.findUnique({
            where: { UserID: userId },
            select: { RoleID: true },
        });

        if (!userToDelete) {
            return { success: false, error: "User not found" };
        }

        if (userToDelete.RoleID === 1) {
            return { success: false, error: "Cannot delete an Admin user." };
        }

        // Delete related data first (Cascade logic)
        await prisma.expense.deleteMany({ where: { UserID: userId } });
        await prisma.income.deleteMany({ where: { UserID: userId } });
        await prisma.people.deleteMany({ where: { UserID: userId } });
        await prisma.category.deleteMany({ where: { UserID: userId } });
        await prisma.subCategory.deleteMany({ where: { UserID: userId } });
        await prisma.project.deleteMany({ where: { UserID: userId } });

        await prisma.user.delete({
            where: { UserID: userId },
        });

        // Revalidate admin user list
        revalidatePath("/admin/users");

        return { success: true };
    } catch (error) {
        console.error("Delete User Error:", error);
        return { success: false, error: "Failed to delete user" };
    }
}

// New: Add User Action
export async function addUser(formData: FormData) {
    try {
        const userName = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const mobile = formData.get("mobile") as string;
        const roleId = parseInt(formData.get("roleId") as string);

        // Basic validation
        if (!userName || !email || !password || !roleId) {
            return { success: false, error: "Missing required fields" };
        }

        const existingUser = await prisma.user.findFirst({
            where: { EmailAddress: email },
        });

        if (existingUser) {
            return { success: false, error: "User with this email already exists" };
        }

        await prisma.user.create({
            data: {
                UserName: userName,
                EmailAddress: email,
                Password: password, // In a real app, hash this!
                MobileNo: mobile || "",
                RoleID: roleId,
                Created: new Date(),
                Modified: new Date(),
            },
        });

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Add User Error:", error);
        return { success: false, error: "Failed to create user" };
    }
}

export async function getUserDetails(userId: number) {
    try {
        const user = await prisma.user.findUnique({
            where: { UserID: userId },
            select: {
                UserID: true,
                UserName: true,
                EmailAddress: true,
                RoleID: true,
                Created: true,
                MobileNo: true,
            },
        });

        if (!user) return null;

        // Fetch User's Data for Charts & Transactions
        const [incomes, expenses] = await Promise.all([
            prisma.income.findMany({
                where: { UserID: userId },
                orderBy: { IncomeDate: "desc" },
                include: { category: true },
            }),
            prisma.expense.findMany({
                where: { UserID: userId },
                orderBy: { ExpenseDate: "desc" },
                include: { category: true },
            }),
        ]);

        // Process Chart Data
        const chartDataMap = new Map<string, { Income: number; Expense: number }>();
        const getMonthYear = (date: Date) => date.toLocaleDateString("en-US", { month: "short", year: "numeric" });

        incomes.forEach((inc) => {
            const key = getMonthYear(inc.IncomeDate);
            const current = chartDataMap.get(key) || { Income: 0, Expense: 0 };
            current.Income += Number(inc.Amount);
            chartDataMap.set(key, current);
        });

        expenses.forEach((exp) => {
            const key = getMonthYear(exp.ExpenseDate);
            const current = chartDataMap.get(key) || { Income: 0, Expense: 0 };
            current.Expense += Number(exp.Amount);
            chartDataMap.set(key, current);
        });

        const graphData = Array.from(chartDataMap.entries()).map(([name, data]) => ({
            name,
            income: data.Income,
            expense: data.Expense,
        })).reverse();

        // Process Category Data for Pie Chart (Expenses only)
        const categoryMap = new Map<string, number>();
        expenses.forEach((exp) => {
            const catName = exp.category?.CategoryName || "Uncategorized";
            categoryMap.set(catName, (categoryMap.get(catName) || 0) + Number(exp.Amount));
        });

        const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({
            name,
            value,
        }));

        // Process Income Category Data
        const incomeCategoryMap = new Map<string, number>();
        incomes.forEach((inc) => {
            const catName = inc.category?.CategoryName || "Uncategorized";
            incomeCategoryMap.set(catName, (incomeCategoryMap.get(catName) || 0) + Number(inc.Amount));
        });

        const incomeCategoryData = Array.from(incomeCategoryMap.entries()).map(([name, value]) => ({
            name,
            value,
        }));

        // Combine Transactions
        const transactions = [
            ...incomes.map((i) => ({
                id: `inc-${i.IncomeID}`,
                type: "income" as const,
                amount: Number(i.Amount),
                date: i.IncomeDate,
                category: i.category?.CategoryName || "Uncategorized",
                user: user.UserName,
                description: i.Description,
                detail: i.IncomeDetail,
            })),
            ...expenses.map((e) => ({
                id: `exp-${e.ExpenseID}`,
                type: "expense" as const,
                amount: Number(e.Amount),
                date: e.ExpenseDate,
                category: e.category?.CategoryName || "Uncategorized",
                user: user.UserName,
                description: e.Description,
                detail: e.ExpenseDetail,
            })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const totalIncome = incomes.reduce((sum, i) => sum + Number(i.Amount), 0);
        const totalExpense = expenses.reduce((sum, e) => sum + Number(e.Amount), 0);

        return {
            user,
            stats: {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
            },
            graphData,
            categoryData,
            incomeCategoryData,
            transactions,
        };

    } catch (error) {
        console.error("Get User Details Error:", error);
        return null; // Handle error gracefully in UI
    }
}

// Admin Categories Action
export async function getAdminCategories() {
    return await prisma.category.findMany({
        orderBy: { Created: "desc" },
        include: {
            user: { select: { UserName: true } }
        }
    });
}

// Admin Projects Action
export async function getAdminProjects() {
    return await prisma.project.findMany({
        orderBy: { Created: "desc" },
        include: {
            user: { select: { UserName: true } }
        }
    });
}

// Admin Reports Action
export async function getAdminReports() {
    const [totalUsers, totalIncomes, totalExpenses, totalIncomeAmount, totalExpenseAmount] = await Promise.all([
        prisma.user.count(),
        prisma.income.count(),
        prisma.expense.count(),
        prisma.income.aggregate({ _sum: { Amount: true } }),
        prisma.expense.aggregate({ _sum: { Amount: true } })
    ]);

    return {
        totalUsers,
        totalTransactions: totalIncomes + totalExpenses,
        totalIncome: Number(totalIncomeAmount._sum.Amount || 0),
        totalExpense: Number(totalExpenseAmount._sum.Amount || 0),
        netBalance: Number(totalIncomeAmount._sum.Amount || 0) - Number(totalExpenseAmount._sum.Amount || 0)
    };
}

// Update User Action
export async function updateUser(userId: number, formData: FormData) {
    try {
        const userName = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const roleId = parseInt(formData.get("roleId") as string);

        if (!userName || !email || !roleId) {
            return { success: false, error: "Missing required fields" };
        }

        const existingUser = await prisma.user.findFirst({
            where: { 
                EmailAddress: email,
                NOT: { UserID: userId } 
            },
        });

        if (existingUser) {
            return { success: false, error: "Email is already taken by another user" };
        }

        const dataToUpdate: any = {
            UserName: userName,
            EmailAddress: email,
            RoleID: roleId,
            Modified: new Date(),
        };

        if (password) {
            dataToUpdate.Password = password; // In a real app, hash this!
        }

        await prisma.user.update({
            where: { UserID: userId },
            data: dataToUpdate,
        });

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Update User Error:", error);
        return { success: false, error: "Failed to update user" };
    }
}
