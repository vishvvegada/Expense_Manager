
import { getAdminProjects } from "@/app/actions/admin";
import { FolderKanban } from "lucide-react";

export default async function AdminProjectsPage() {
    const projects = await getAdminProjects();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                    <p className="text-gray-500">Overview of all user projects</p>
                </div>
                <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                    <FolderKanban className="w-5 h-5" />
                    <span>{projects.length} Total</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.ProjectID} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                <FolderKanban className="w-6 h-6" />
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${project.IsActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                {project.IsActive ? 'Active' : 'Archived'}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.ProjectName}</h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.Description || "No description provided."}</p>

                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-sm">
                            <span className="text-gray-500">Client/Owner</span>
                            <span className="font-medium text-gray-900">{project.user.UserName}</span>
                        </div>
                        <div className="pt-2 flex items-center justify-between text-sm">
                            <span className="text-gray-500">Created</span>
                            <span className="font-medium text-gray-900">{new Date(project.Created).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100">
                        <p className="text-gray-500">No projects found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
