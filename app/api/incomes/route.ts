import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        let whereClause: any = {};
        if (userId) {
            whereClause.UserID = parseInt(userId);
        }

        const incomes = await prisma.income.findMany({
            where: whereClause,
            include: {
                category: true,
                project: true,
                people: true
            },
            orderBy: {
                IncomeDate: 'desc'
            }
        });

        return NextResponse.json(incomes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch incomes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { IncomeDate, CategoryID, SubCategoryID, PeopleID, ProjectID, Amount, IncomeDetail, AttachmentPath, Description, UserID } = body;

        const newIncome = await prisma.income.create({
            data: {
                IncomeDate: new Date(IncomeDate),
                CategoryID,
                SubCategoryID,
                PeopleID: parseInt(PeopleID),
                ProjectID,
                Amount,
                IncomeDetail,
                AttachmentPath,
                Description,
                UserID: parseInt(UserID),
                Created: new Date(),
                Modified: new Date()
            }
        });

        return NextResponse.json(newIncome, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create income' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { IncomeID, ...data } = body;

        if (!IncomeID) {
            return NextResponse.json({ error: 'IncomeID is required' }, { status: 400 });
        }

        const updatedIncome = await prisma.income.update({
            where: { IncomeID: parseInt(IncomeID) },
            data: {
                ...data,
                IncomeDate: data.IncomeDate ? new Date(data.IncomeDate) : undefined,
                Modified: new Date()
            }
        });

        return NextResponse.json(updatedIncome);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update income' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.income.delete({
            where: { IncomeID: parseInt(id) }
        });

        return NextResponse.json({ message: 'Income deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete income' }, { status: 500 });
    }
}
