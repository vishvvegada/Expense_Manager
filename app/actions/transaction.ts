"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addTransaction(formData: FormData) {
    const type = formData.get("type") as string;
    const userId = parseInt(formData.get("userId") as string);
    const date = new Date(formData.get("date") as string);
    const amount = parseFloat(formData.get("amount") as string);
    const description = formData.get("description") as string;

    // Optional Project
    const projectIdRaw = formData.get("projectId");
    const projectId = projectIdRaw ? parseInt(projectIdRaw as string) : null;

    let categoryId = parseInt(formData.get("categoryId") as string);
    let peopleId = parseInt(formData.get("peopleId") as string);

    const newCategoryName = formData.get("newCategory") as string;
    const newPersonName = formData.get("newPerson") as string;

    if (isNaN(userId) || isNaN(amount)) {
        throw new Error("Invalid form data: userId or amount missing");
    }

    try {
        // Handle New Category
        if (newCategoryName) {
            const newCategory = await prisma.category.create({
                data: {
                    CategoryName: newCategoryName,
                    UserID: userId,
                    IsExpense: type === "EXPENSE",
                    IsIncome: type === "INCOME",
                    IsActive: true,
                    Created: new Date(),
                    Modified: new Date(),
                },
            });
            categoryId = newCategory.CategoryID;
        }

        // Handle New Person
        if (newPersonName) {
            const newPerson = await prisma.people.create({
                data: {
                    PeopleName: newPersonName,
                    UserID: userId,
                    // Required fields placeholders as per schema
                    Password: "",
                    Email: "",
                    MobileNo: "",
                    Created: new Date(),
                    Modified: new Date(),
                    IsActive: true,
                },
            });
            peopleId = newPerson.PeopleID;
        }

        // Validate IDs after potential creation
        if (isNaN(categoryId) || isNaN(peopleId)) {
            throw new Error("Invalid form data: Category or Person missing");
        }

        const commonData = {
            Amount: amount,
            CategoryID: categoryId,
            PeopleID: peopleId,
            ProjectID: isNaN(projectId!) ? null : projectId,
            Description: description,
            UserID: userId,
            Created: new Date(),
            Modified: new Date(),
        };

        if (type === "EXPENSE") {
            await prisma.expense.create({
                data: {
                    ...commonData,
                    ExpenseDate: date,
                    ExpenseDetail: description,
                },
            });
        } else {
            await prisma.income.create({
                data: {
                    ...commonData,
                    IncomeDate: date,
                    IncomeDetail: description,
                },
            });
        }

        revalidatePath("/user/dashboard");
        revalidatePath("/user/transactions");
        revalidatePath("/user/analysis");
        revalidatePath("/user/reports");
        revalidatePath("/user/budgets");
        revalidatePath("/user/insights");
        return { success: true };
    } catch (error) {
        console.error("Transaction Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to create transaction" };
    }
}

export async function updateTransaction(transactionId: number, formData: FormData) {
    const type = formData.get("type") as string;
    const userId = parseInt(formData.get("userId") as string);
    const date = new Date(formData.get("date") as string);
    const amount = parseFloat(formData.get("amount") as string);
    const description = formData.get("description") as string;

    const projectIdRaw = formData.get("projectId");
    const projectId = projectIdRaw ? parseInt(projectIdRaw as string) : null;

    let categoryId = parseInt(formData.get("categoryId") as string);
    let peopleId = parseInt(formData.get("peopleId") as string);

    const newCategoryName = formData.get("newCategory") as string;
    const newPersonName = formData.get("newPerson") as string;

    if (isNaN(userId) || isNaN(amount) || isNaN(transactionId)) {
        throw new Error("Invalid form data: userId, transactionId, or amount missing");
    }

    try {
        // Handle New Category
        if (newCategoryName) {
            const newCategory = await prisma.category.create({
                data: {
                    CategoryName: newCategoryName,
                    UserID: userId,
                    IsExpense: type === "EXPENSE",
                    IsIncome: type === "INCOME",
                    IsActive: true,
                    Created: new Date(),
                    Modified: new Date(),
                },
            });
            categoryId = newCategory.CategoryID;
        }

        // Handle New Person
        if (newPersonName) {
            const newPerson = await prisma.people.create({
                data: {
                    PeopleName: newPersonName,
                    UserID: userId,
                    Password: "",
                    Email: "",
                    MobileNo: "",
                    Created: new Date(),
                    Modified: new Date(),
                    IsActive: true,
                },
            });
            peopleId = newPerson.PeopleID;
        }

        if (isNaN(categoryId) || isNaN(peopleId)) {
            throw new Error("Invalid form data: Category or Person missing");
        }

        const commonData = {
            Amount: amount,
            CategoryID: categoryId,
            PeopleID: peopleId,
            ProjectID: isNaN(projectId!) ? null : projectId,
            Description: description,
            Modified: new Date(),
        };

        if (type === "EXPENSE") {
            await prisma.expense.update({
                where: { ExpenseID: transactionId, UserID: userId },
                data: {
                    ...commonData,
                    ExpenseDate: date,
                    ExpenseDetail: description,
                },
            });
        } else {
            await prisma.income.update({
                where: { IncomeID: transactionId, UserID: userId },
                data: {
                    ...commonData,
                    IncomeDate: date,
                    IncomeDetail: description,
                },
            });
        }

        revalidatePath("/user/dashboard");
        revalidatePath("/user/transactions");
        revalidatePath("/user/analysis");
        revalidatePath("/user/reports");
        revalidatePath("/user/budgets");
        revalidatePath("/user/insights");
        return { success: true };
    } catch (error) {
        console.error("Update Transaction Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to update transaction" };
    }
}

export async function deleteTransaction(transactionId: number, type: "INCOME" | "EXPENSE", userId: number) {
    try {
        if (type === "EXPENSE") {
            await prisma.expense.delete({
                where: {
                    ExpenseID: transactionId,
                    UserID: userId, // Ensure ownership
                },
            });
        } else {
            await prisma.income.delete({
                where: {
                    IncomeID: transactionId,
                    UserID: userId, // Ensure ownership
                },
            });
        }

        revalidatePath("/user/dashboard");
        revalidatePath("/user/transactions");
        revalidatePath("/user/analysis");
        revalidatePath("/user/reports");
        revalidatePath("/user/budgets");
        revalidatePath("/user/insights");
        return { success: true };
    } catch (error) {
        console.error("Delete Error:", error);
        return { success: false, error: "Failed to delete transaction" };
    }
}
