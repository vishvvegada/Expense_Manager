import { getDashboardData } from "@/app/actions/dashboard";
import BudgetWidget from "@/app/components/user/BudgetWidget";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function BudgetsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const data = await getDashboardData(user.UserID.toString());

    if (!data) {
        return <div className="p-8 text-center text-red-500">Failed to load budget data.</div>;
    }

    const { budget, currentMonthExpenses } = data;

    return (
        <div className="p-6 md:p-8 space-y-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900">Monthly Budgets</h1>
            <p className="text-gray-500">Set and track your monthly spending goals</p>

            <div className="max-w-2xl">
                <BudgetWidget
                    budget={budget}
                    currentMonthExpenses={currentMonthExpenses}
                    userId={user.UserID}
                />
            </div>
        </div>
    );
}
