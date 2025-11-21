"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 ml-64 overflow-y-auto">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
