import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        let whereClause: any = {};
        if (userId) {
            whereClause.UserID = parseInt(userId);
        }

        const expenses = await prisma.expense.findMany({
            where: whereClause,
            include: {
                category: true,
                project: true,
                people: true
            },
            orderBy: {
                ExpenseDate: 'desc'
            }
        });

        return NextResponse.json(expenses);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { ExpenseDate, CategoryID, SubCategoryID, PeopleID, ProjectID, Amount, ExpenseDetail, AttachmentPath, Description, UserID } = body;

        const newExpense = await prisma.expense.create({
            data: {
                ExpenseDate: new Date(ExpenseDate),
                CategoryID,
                SubCategoryID,
                PeopleID: parseInt(PeopleID),
                ProjectID,
                Amount,
                ExpenseDetail,
                AttachmentPath,
                Description,
                UserID: parseInt(UserID),
                Created: new Date(),
                Modified: new Date()
            }
        });

        return NextResponse.json(newExpense, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { ExpenseID, ...data } = body;

        if (!ExpenseID) {
            return NextResponse.json({ error: 'ExpenseID is required' }, { status: 400 });
        }

        const updatedExpense = await prisma.expense.update({
            where: { ExpenseID: parseInt(ExpenseID) },
            data: {
                ...data,
                ExpenseDate: data.ExpenseDate ? new Date(data.ExpenseDate) : undefined,
                Modified: new Date()
            }
        });

        return NextResponse.json(updatedExpense);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.expense.delete({
            where: { ExpenseID: parseInt(id) }
        });

        return NextResponse.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
    }
}
