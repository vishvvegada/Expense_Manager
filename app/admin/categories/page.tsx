
import { getAdminCategories } from "@/app/actions/admin";
import { Layers } from "lucide-react";

export default async function AdminCategoriesPage() {
    const categories = await getAdminCategories();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-500">Manage expense and income categories</p>
                </div>
                <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    <span>{categories.length} Total</span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Type</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Created By</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map((cat) => (
                            <tr key={cat.CategoryID} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{cat.CategoryName}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${cat.IsExpense ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                        {cat.IsExpense ? 'Expense' : 'Income'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{cat.user.UserName}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    {new Date(cat.Created).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${cat.IsActive ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {cat.IsActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No categories found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
