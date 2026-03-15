"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUser(userId: number, formData: FormData) {
    const userName = formData.get("userName") as string;
    const emailAddress = formData.get("emailAddress") as string;
    const mobileNo = formData.get("mobileNo") as string;

    if (!userId || !userName || !emailAddress || !mobileNo) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        await prisma.user.update({
            where: {
                UserID: userId,
            },
            data: {
                UserName: userName,
                EmailAddress: emailAddress,
                MobileNo: mobileNo,
                Modified: new Date(),
            }
        });

        revalidatePath("/user/dashboard");
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Update User Error:", error);
        return { success: false, error: "Failed to update user information" };
    }
}
