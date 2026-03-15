"use client";

import Link from "next/link";
import { LayoutDashboard, Users, Wallet, Folder } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen px-6 py-8">
      <h1 className="text-2xl font-bold text-blue-400 mb-10">
        Admin Panel
      </h1>

      <nav className="space-y-4">
        <Link href="/admin/dashboard" className="flex items-center gap-3 hover:text-blue-400">
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link href="#" className="flex items-center gap-3 hover:text-blue-400">
          <Users size={20} /> Users
        </Link>
        <Link href="#" className="flex items-center gap-3 hover:text-blue-400">
          <Wallet size={20} /> Expenses
        </Link>
        <Link href="#" className="flex items-center gap-3 hover:text-blue-400">
          <Folder size={20} /> Projects
        </Link>
      </nav>
    </aside>
  );
}
