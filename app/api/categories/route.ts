
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const type = searchParams.get('type');

        let whereClause: any = {};
        if (userId) {
            whereClause.UserID = parseInt(userId);
        }
        if (type) {
            if (type === 'income') whereClause.IsIncome = true;
            if (type === 'expense') whereClause.IsExpense = true;
        }

        const categories = await prisma.category.findMany({
            where: whereClause,
            include: {
                subCategories: true
            },
            orderBy: {
                CategoryName: 'asc'
            }
        });

        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { CategoryName, IsExpense, IsIncome, UserID, IsActive = true, Description, Sequence } = body;

        const newCategory = await prisma.category.create({
            data: {
                CategoryName,
                IsExpense,
                IsIncome,
                IsActive,
                Description,
                UserID: parseInt(UserID),
                Created: new Date(),
                Modified: new Date(),
                Sequence: Sequence ? Number(Sequence) : null
            }
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { CategoryID, ...data } = body;

        if (!CategoryID) {
            return NextResponse.json({ error: 'CategoryID is required' }, { status: 400 });
        }

        const updatedCategory = await prisma.category.update({
            where: { CategoryID: parseInt(CategoryID) },
            data: {
                ...data,
                UserID: data.UserID ? parseInt(data.UserID) : undefined,
                Modified: new Date()
            }
        });

        return NextResponse.json(updatedCategory);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.category.delete({
            where: { CategoryID: parseInt(id) }
        });

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
