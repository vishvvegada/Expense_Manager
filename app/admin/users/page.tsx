import { getUsers } from "@/app/actions/admin";
import UserList from "@/app/components/admin/UserList";

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
    const users = await getUsers();

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
            </div>
            <UserList users={users} />
        </div>
    );
}
