import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();

    const incomeAgg = await prisma.income.aggregate({
      _sum: { Amount: true },
    });
    const totalIncome = incomeAgg._sum.Amount ? Number(incomeAgg._sum.Amount) : 0;

    const expenseAgg = await prisma.expense.aggregate({
      _sum: { Amount: true },
    });
    const totalExpense = expenseAgg._sum.Amount ? Number(expenseAgg._sum.Amount) : 0;

    const recentExpenses = await prisma.expense.findMany({
      take: 5,
      orderBy: { ExpenseDate: 'desc' },
      include: { category: true },
      // Note: Original query filtered/joined differently, but this matches the dashboard page logic.
      // If we want exact parity with the old "recentExpenses" which only showed expenses, this is correct.
      // The dashboard page actually combines income and expenses, but this API endpoint
      // seems to have been designed just for expenses or maybe the dashboard was updated to do more.
      // I will return what the implementation plan implies, but keep it consistent with the previous return structure.
    });

    // Formatting recent expenses to match expected frontend structure if necessary, or just returning pure data.
    // The previous raw query returned: Amount, ExpenseDate, CategoryName
    const formattedRecentExpenses = recentExpenses.map(e => ({
      Amount: Number(e.Amount),
      ExpenseDate: e.ExpenseDate,
      CategoryName: e.category?.CategoryName
    }));

    return NextResponse.json({
      totalUsers,
      totalExpense,
      totalIncome,
      recentExpenses: formattedRecentExpenses,
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD API ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
