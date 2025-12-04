"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background text-foreground w-full max-w-full overflow-x-hidden">

        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Main area */}
        <div className="flex-1 flex flex-col md:ml-64 ml-0 w-full max-w-full">

          {/* Header */}
          <AdminHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

          <main className="flex-1 overflow-y-auto overflow-x-auto w-full">
            {children}
          </main>

        </div>

      </div>
    </ProtectedRoute>
  );
}
