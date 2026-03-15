import { getDashboardData } from "@/app/actions/dashboard";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function InsightsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const data = await getDashboardData(user.UserID.toString());

    if (!data) {
        return <div className="p-8 text-center text-red-500">Failed to load insights.</div>;
    }

    const { insights } = data;

    return (
        <div className="p-6 md:p-8 space-y-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900">Smart Insights</h1>
            <p className="text-gray-500">AI-driven analysis of your financial health</p>

            <div className="space-y-4 max-w-3xl">
                {insights && insights.length > 0 ? (
                    insights.map((insight: any, index: number) => (
                        <div key={index} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex gap-4 items-start transition-transform hover:scale-[1.01]">
                            <div className={`p-2 rounded-lg text-2xl ${insight.type === 'warning' || insight.type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                                }`}>
                                {insight.type === 'warning' || insight.type === 'danger' ? '⚠️' : '💡'}
                            </div>
                            <div>
                                <h3 className={`font-semibold text-lg mb-1 capitalize ${insight.type === 'danger' ? 'text-red-600' : 'text-gray-800'
                                    }`}>
                                    {insight.type === 'danger' ? 'Alert' : 'Insight'}
                                </h3>
                                <p className="text-gray-600">
                                    {insight.text}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center gap-3 text-center">
                        <span className="text-4xl">ℹ️</span>
                        <h3 className="text-lg font-semibold text-gray-900">No Insights Available Yet</h3>
                        <p className="text-gray-500">
                            Add more expenses and income transactions to generate personalized insights.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
