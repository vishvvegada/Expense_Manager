import { getDashboardData } from "@/app/actions/dashboard";
import AdminUserCharts from "@/app/components/admin/AdminUserCharts";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AnalysisPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const data = await getDashboardData(user.UserID.toString());

    if (!data) {
        return <div className="p-8 text-center text-red-500">Failed to load analysis.</div>;
    }

    const { graphData, categoryData, incomeCategoryData } = data;

    // Map graph data to lowercase keys for AdminUserCharts compatibility
    const mappedGraphData = graphData.map(item => ({
        name: item.name,
        income: item.income,
        expense: item.expense
    }));

    return (
        <div className="p-6 md:p-8 space-y-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900">Spending Analysis</h1>
            <p className="text-gray-500">Deep dive into your financial habits</p>

            <AdminUserCharts
                monthlyData={mappedGraphData}
                categoryData={categoryData}
                incomeCategoryData={incomeCategoryData}
            />
        </div>
    );
}
