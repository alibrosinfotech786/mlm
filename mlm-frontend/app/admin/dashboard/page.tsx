"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";

export default function DashboardPage() {

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-lg text-red-600">
        No user found in localStorage.
      </div>
    );
  }

  const isAdmin = user?.role === "Admin";

  return (
    <>
      {/* {/* <AdminHeader /> */} 

      {/* SHOW SECTIONS BASED ON ROLE */}
      {/* <UserDashboard /> */}
      {isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </>
  );
}
