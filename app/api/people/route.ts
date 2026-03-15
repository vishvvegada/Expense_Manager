import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    try {
        const whereClause = userId ? { UserID: parseInt(userId) } : {};

        if (userId && isNaN(parseInt(userId))) {
            return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
        }

        const people = await prisma.people.findMany({
            where: whereClause,
            orderBy: {
                PeopleName: 'asc'
            }
        });

        return NextResponse.json(people);
    } catch (error) {
        console.error("GET PEOPLE ERROR:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            PeopleName,
            Email,
            MobileNo,
            Description,
            UserID
        } = body;

        if (!UserID || !PeopleName || !Email || !MobileNo) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Since PeopleCode and Password are required in schema but not seemingly relevant for a simple list of people someone pays...
        // I will check the schema again. 
        // Step 29: PeopleCode String?, Password String @VarChar(50).
        // Wait, why do 'People' have a password? 
        // Maybe 'People' are also login users? Or is this a legacy schema issue?
        // I will set a default dummy password for now if it's required, or check if I can make it optional in schema (but I am not supposed to modify schema unless asked).
        // The schema says: Password String @db.VarChar(50) -> Required.
        // This is weird for an "Expense Manager" where 'People' usually means 'Payee'.
        // I will provide a default '123456' for now to satisfy the constraint.

        const newPerson = await prisma.people.create({
            data: {
                PeopleName,
                Email,
                MobileNo,
                Description,
                PeopleCode: `P-${Date.now()}`, // Generate a code
                Password: 'default-password', // Placeholder as per schema requirement
                IsActive: true,
                UserID: parseInt(UserID),
                Created: new Date(),
                Modified: new Date()
            }
        });

        return NextResponse.json(newPerson);
    } catch (error) {
        console.error("CREATE PEOPLE ERROR:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
