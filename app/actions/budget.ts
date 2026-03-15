"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function setBudget(formData: FormData) {
    const userId = formData.get("userId") as string;
    const amount = formData.get("amount") as string;
    const month = formData.get("month") as string; // 1-12
    const year = formData.get("year") as string;

    if (!userId || !amount || !month || !year) {
        throw new Error("Missing required fields");
    }

    const numericAmount = parseFloat(amount);
    const numericMonth = parseInt(month);
    const numericYear = parseInt(year);

    // Check if budget exists for this month/year
    const existingBudget = await prisma.budget.findFirst({
        where: {
            UserID: parseInt(userId),
            Month: numericMonth,
            Year: numericYear,
        },
    });

    if (existingBudget) {
        await prisma.budget.update({
            where: {
                BudgetID: existingBudget.BudgetID,
            },
            data: {
                Amount: numericAmount,
            },
        });
    } else {
        await prisma.budget.create({
            data: {
                UserID: parseInt(userId),
                Amount: numericAmount,
                Month: numericMonth,
                Year: numericYear,
            },
        });
    }

    revalidatePath("/user/dashboard");
    return { success: true };
}

export async function getBudget(userId: number, month: number, year: number) {
    const budget = await prisma.budget.findFirst({
        where: {
            UserID: userId,
            Month: month,
            Year: year,
        },
    });

    return budget;
}
