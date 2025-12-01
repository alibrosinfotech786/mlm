
"use client";

import React from "react";
import {
  Users,
  UserPlus,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowRight,
  IndianRupee,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";

export default function DashboardPage() {
  const stats = [
    {
      id: 1,
      title: "Total Members",
      value: "1,248",
      icon: <Users className="w-6 h-6 text-green-600" />,
      change: "+12 this week",
    },
    {
      id: 2,
      title: "Direct Referrals",
      value: "376",
      icon: <UserPlus className="w-6 h-6 text-green-600" />,
      change: "+28 new joins",
    },
    {
      id: 3,
      title: "Total Earnings",
      value: "₹4,56,920",
      icon: <IndianRupee className="w-6 h-6 text-green-600" />,
      change: "↑ 15% from last month",
    },
    {
      id: 4,
      title: "Pending Payouts",
      value: "₹72,500",
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      change: "4 requests pending",
    },
  ];

  const activities = [
    {
      id: 1,
      name: "Rahul Verma",
      action: "joined under user ID #1023",
      time: "2 hours ago",
    },
    {
      id: 2,
      name: "Sneha Kapoor",
      action: "completed payout request",
      time: "5 hours ago",
    },
    {
      id: 3,
      name: "Amit Sharma",
      action: "added 3 new referrals",
      time: "1 day ago",
    },
  ];

  return (
    <>

      <AdminHeader />

      <div className="min-h-screen bg-gray-50 px-6 py-8 md:px-12">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-green-700 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, Admin 👋</p>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col gap-3 transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="p-2 bg-green-50 rounded-lg">{item.icon}</span>
                <span className="text-sm text-gray-500">{item.change}</span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{item.value}</h2>
                <p className="text-sm text-gray-500 mt-1">{item.title}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Activity + Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" /> Recent Activity
              </h3>
              <button className="text-green-600 text-sm font-medium hover:underline flex items-center gap-1">
                View All <ArrowRight size={14} />
              </button>
            </div>
            <ul className="space-y-4">
              {activities.map((a) => (
                <li key={a.id} className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {a.name}{" "}
                      <span className="text-gray-500 font-normal">{a.action}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* MLM Overview (Chart placeholder) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center items-center text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Network Growth Overview
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Visualize how your MLM network is expanding month over month.
            </p>
            {/* Placeholder for chart (add Recharts or Chart.js later) */}
            <div className="w-full h-48 flex items-center justify-center bg-green-50 text-green-600 rounded-md border border-green-100">
              Chart Visualization Coming Soon 📊
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
