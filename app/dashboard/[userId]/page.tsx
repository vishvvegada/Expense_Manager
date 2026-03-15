import { notFound } from "next/navigation";
import { getDashboardData } from "@/app/actions/dashboard";
import UserInfoCard from "@/app/components/UserInfoCard";
import DashboardActions from "@/app/components/DashboardActions";

import UserCharts from "@/app/components/user/UserCharts";

type PageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function UserDashboard(props: PageProps) {
  const params = await props.params;
  const { userId } = params;

  const data = await getDashboardData(userId);

  if (!data || !data.user) {
    notFound();
  }

  const { user, categories, people, projects, graphData, categoryData, incomeCategoryData } = data;

  return (
    <div className="p-6 md:p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center pb-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent pb-1">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-lg font-medium">Manage your expenses and view reports in one place</p>
        </div>
      </div>

      <UserInfoCard user={user} />

      <UserCharts
        monthlyData={graphData}
        categoryData={categoryData}
        incomeCategoryData={incomeCategoryData}
      />

      <div className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100/80 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Quick Actions</h2>
        <p className="text-sm text-gray-500 mb-6 font-medium">Record a new transaction quickly</p>

        <DashboardActions
          userId={userId}
          categories={categories}
          people={people}
          projects={projects}
        />
      </div>
    </div>
  );
}
