
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const startDate = searchParams.get('startDate'); // YYYY-MM-DD
        const endDate = searchParams.get('endDate');     // YYYY-MM-DD

        let whereClause: any = {};

        if (userId) {
            whereClause.UserID = parseInt(userId);
        }

        if (startDate && endDate) {
            // Apply date filter to both expense and income queries if needed
            // For simplicity in this summary endpoint, we might just filter by user
            // But let's add date filtering logic
        }

        // 1. Total Expenses
        const expenseAgg = await prisma.expense.aggregate({
            where: whereClause,
            _sum: { Amount: true }
        });
        const totalExpenses = expenseAgg._sum.Amount ? Number(expenseAgg._sum.Amount) : 0;

        // 2. Total Income
        const incomeAgg = await prisma.income.aggregate({
            where: whereClause,
            _sum: { Amount: true }
        });
        const totalIncome = incomeAgg._sum.Amount ? Number(incomeAgg._sum.Amount) : 0;

        // 3. Balance
        const balance = totalIncome - totalExpenses;

        // 4. Category-wise Expenses
        const categoryExpenses = await prisma.expense.groupBy({
            where: whereClause,
            by: ['CategoryID'],
            _sum: {
                Amount: true
            }
        });

        // Fetch category names
        const categoryIds = categoryExpenses.map(e => e.CategoryID).filter(id => id !== null) as number[];
        const categories = await prisma.category.findMany({
            where: { CategoryID: { in: categoryIds } }
        });

        const categoryBreakdown = categoryExpenses.map(item => {
            const category = categories.find(c => c.CategoryID === item.CategoryID);
            return {
                categoryName: category?.CategoryName || 'Uncategorized',
                amount: Number(item._sum.Amount)
            };
        });

        return NextResponse.json({
            totalIncome,
            totalExpenses,
            balance,
            categoryBreakdown
        });

    } catch (error) {
        console.error("REPORTS API ERROR:", error);
        return NextResponse.json({ error: 'Failed to generate reports' }, { status: 500 });
    }
}
