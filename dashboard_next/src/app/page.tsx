"use client";

import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-blue-700">Dashboard</h1>
        <p>Bem-vindo ao sistema!</p>
      </main>
    </div>
  );
}
