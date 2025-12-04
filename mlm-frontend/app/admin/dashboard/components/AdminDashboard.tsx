"use client";

import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import SectionBox from "./SectionBox";
import { Users, ShoppingBag, Wallet, PlusCircle } from "lucide-react";

import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

// 🎨 Recharts
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend,
    ComposedChart,
} from "recharts";

export default function AdminDashboard() {
    const [overview, setOverview] = useState<any>(null);
    const [recentJoins, setRecentJoins] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    
    // Loading states for each section
    const [loadingOverview, setLoadingOverview] = useState(true);
    const [loadingSalesChart, setLoadingSalesChart] = useState(true);
    const [loadingUserGrowth, setLoadingUserGrowth] = useState(true);
    const [loadingUserDistribution, setLoadingUserDistribution] = useState(true);
    const [loadingOrdersSalesTrend, setLoadingOrdersSalesTrend] = useState(true);
    const [loadingRecentJoins, setLoadingRecentJoins] = useState(true);
    const [loadingRecentOrders, setLoadingRecentOrders] = useState(true);

    // Chart data states
    const [salesChartData, setSalesChartData] = useState<any[]>([]);
    const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
    const [userDistribution, setUserDistribution] = useState<any[]>([]);
    const [ordersSalesChart, setOrdersSalesChart] = useState<any[]>([]);

    // API endpoints
    const API_ENDPOINTS = {
        monthlySales: "/admin/charts/monthly-sales",
        userGrowth: "/admin/charts/user-growth",
        userDistribution: "/admin/charts/user-distribution",
        ordersSalesTrend: "/admin/charts/orders-sales-trend",
        recentJoins: "/admin/recent-joins",
        recentOrders: "/admin/recent-orders",
    };

    const PIE_COLORS = ["#16a34a", "#fb923c"];

    // ---------------- API CALLS ----------------
    async function loadDashboard() {
        setLoadingOverview(true);
        try {
            const res = await axiosInstance.get(ProjectApiList.adminDashboard);
            if (res?.data?.success) {
                setOverview(res.data.data);
            }
        } catch (err) {
            console.log("Dashboard API Error:", err);
        } finally {
            setLoadingOverview(false);
        }
    }

    async function loadMonthlySales() {
        setLoadingSalesChart(true);
        try {
            const res = await axiosInstance.get(API_ENDPOINTS.monthlySales);
            if (res?.data?.success) {
                setSalesChartData(res.data.data);
            }
        } catch (err) {
            console.log("Monthly Sales API Error:", err);
            setSalesChartData([]);
        } finally {
            setLoadingSalesChart(false);
        }
    }

    async function loadUserGrowth() {
        setLoadingUserGrowth(true);
        try {
            const res = await axiosInstance.get(API_ENDPOINTS.userGrowth);
            if (res?.data?.success) {
                setUserGrowthData(res.data.data);
            }
        } catch (err) {
            console.log("User Growth API Error:", err);
            setUserGrowthData([]);
        } finally {
            setLoadingUserGrowth(false);
        }
    }

    async function loadUserDistribution() {
        setLoadingUserDistribution(true);
        try {
            const res = await axiosInstance.get(API_ENDPOINTS.userDistribution);
            if (res?.data?.success) {
                setUserDistribution(res.data.data);
            }
        } catch (err) {
            console.log("User Distribution API Error:", err);
            // Fallback using overview data if available
            if (overview) {
                setUserDistribution([
                    { name: "Active Users", value: overview?.active_users || 0 },
                    {
                        name: "Inactive Users",
                        value: (overview?.total_users || 0) - (overview?.active_users || 0),
                    },
                ]);
            } else {
                setUserDistribution([]);
            }
        } finally {
            setLoadingUserDistribution(false);
        }
    }

    async function loadOrdersSalesTrend() {
        setLoadingOrdersSalesTrend(true);
        try {
            const res = await axiosInstance.get(API_ENDPOINTS.ordersSalesTrend);
            if (res?.data?.success) {
                // Transform the data to match the chart format
                const transformedData = res.data.data.map((item: any) => ({
                    month: item.date,
                    orders: item.orders,
                    sales: item.sales,
                }));
                setOrdersSalesChart(transformedData);
            }
        } catch (err) {
            console.log("Orders Sales Trend API Error:", err);
            setOrdersSalesChart([]);
        } finally {
            setLoadingOrdersSalesTrend(false);
        }
    }

    async function loadRecentJoins() {
        setLoadingRecentJoins(true);
        try {
            const res = await axiosInstance.get(API_ENDPOINTS.recentJoins);
            if (res?.data?.success) {
                // Transform the data to match the table format
                const transformedData = res.data.data.map((user: any) => ({
                    id: user.user_id,
                    name: user.name,
                    joined: user.joined_at,
                    email: user.email,
                    phone: user.phone,
                    location: user.location,
                }));
                setRecentJoins(transformedData);
            }
        } catch (err) {
            console.log("Recent Joins API Error:", err);
            setRecentJoins([]);
        } finally {
            setLoadingRecentJoins(false);
        }
    }

    async function loadRecentOrders() {
        setLoadingRecentOrders(true);
        try {
            const res = await axiosInstance.get(API_ENDPOINTS.recentOrders);
            if (res?.data?.success) {
                // Transform the data to match the table format
                const transformedData = res.data.data.map((order: any) => ({
                    id: order.order_id,
                    order_number: order.order_number,
                    amount: order.amount,
                    status: order.status.toLowerCase(),
                    user_name: order.user_name,
                    ordered_at: order.ordered_at,
                }));
                setOrders(transformedData);
            }
        } catch (err) {
            console.log("Recent Orders API Error:", err);
            setOrders([]);
        } finally {
            setLoadingRecentOrders(false);
        }
    }

    // Load all data
    useEffect(() => {
        loadDashboard();
        loadMonthlySales();
        loadUserGrowth();
        loadUserDistribution();
        loadOrdersSalesTrend();
        loadRecentJoins();
        loadRecentOrders();
    }, []);

    // Update user distribution when overview changes (fallback)
    useEffect(() => {
        if (overview && userDistribution.length === 0 && !loadingUserDistribution) {
            setUserDistribution([
                { name: "Active Users", value: overview?.active_users || 0 },
                {
                    name: "Inactive Users",
                    value: (overview?.total_users || 0) - (overview?.active_users || 0),
                },
            ]);
        }
    }, [overview, userDistribution.length, loadingUserDistribution]);

    // =============================================================
    return (
        <div className="min-h-screen p-6 bg-green-50/60">
            <div className="max-w-7xl mx-auto space-y-6">

                <h1 className="text-3xl font-semibold text-green-900 tracking-tight">
                    Admin Dashboard
                </h1>

                {/* ================= STAT CARDS ================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {loadingOverview ? (
                        Array(8).fill(0).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-white rounded-lg p-5 border border-green-200">
                                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <>
                            <StatCard title="Total Users" value={overview?.total_users ?? "..."} />
                            <StatCard title="Active Users" value={overview?.active_users ?? "..."} />
                            <StatCard title="Total Orders" value={overview?.total_orders ?? "..."} />
                              <StatCard
                                title="Total Sales"
                                value={overview?.total_sales ?? 0}
                                suffix=" ₹"
                            />

                            <StatCard title="Today's Joins" value={overview?.todays_joins ?? "..."} />
                          
                            <StatCard
                                title="New Registrations (This Week)"
                                value={overview?.new_registrations_this_week ?? 0}
                            />
                            <StatCard
                                title="Pending Orders"
                                value={overview?.pending_orders ?? 0}
                            />
                            <StatCard
                                title="Pending Grievances"
                                value={overview?.pending_grievances ?? 0}
                            />
                        </>
                    )}
                </div>

                {/* ================= QUICK ACTIONS ================= */}
                <div className="rounded-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <a href="/admin/users" className="
                            flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                            border border-green-300 bg-white text-green-800
                            hover:bg-green-50 hover:border-green-400
                            transition shadow-sm cursor-pointer no-underline
                        ">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-700">
                                <Users size={16} />
                            </div>
                            Manage Users
                        </a>

                        <a href="/admin/orders/allOrders" className="
                            flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                            border border-green-300 bg-white text-green-800
                            hover:bg-green-50 hover:border-green-400
                            transition shadow-sm cursor-pointer no-underline
                        ">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-700">
                                <ShoppingBag size={16} />
                            </div>
                            Manage Orders
                        </a>

                        <a href="/admin/wallet/allWalletRequests" className="
                            flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                            border border-green-300 bg-white text-green-800
                            hover:bg-green-50 hover:border-green-400
                            transition shadow-sm cursor-pointer no-underline
                        ">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-700">
                                <Wallet size={16} />
                            </div>
                            All Wallet Request
                        </a>

                        <a href="/admin/products" className="
                            flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                            border border-green-300 bg-white text-green-800
                            hover:bg-green-50 hover:border-green-400
                            transition shadow-sm cursor-pointer no-underline
                        ">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-700">
                                <PlusCircle size={16} />
                            </div>
                            Add Product
                        </a>
                    </div>
                </div>

                {/* ================= CHARTS ================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* SALES */}
                    <SectionBox title="Monthly Sales Overview">
                        <div className="w-full h-64">
                            {loadingSalesChart ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                </div>
                            ) : salesChartData.length > 0 ? (
                                <ResponsiveContainer>
                                    <BarChart data={salesChartData}>
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="sales" fill="#15803d" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500">
                                    No sales data available
                                </div>
                            )}
                        </div>
                    </SectionBox>

                    {/* USER GROWTH */}
                    <SectionBox title="User Growth Trend">
                        <div className="w-full h-64">
                            {loadingUserGrowth ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                </div>
                            ) : userGrowthData.length > 0 ? (
                                <ResponsiveContainer>
                                    <LineChart data={userGrowthData}>
                                        <CartesianGrid strokeDasharray="4 4" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="users"
                                            stroke="#166534"
                                            strokeWidth={2}
                                            dot={{ r: 4, fill: "#166534" }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500">
                                    No user growth data available
                                </div>
                            )}
                        </div>
                    </SectionBox>

                    {/* PIE */}
                    <SectionBox title="User Distribution (Active vs Inactive)">
                        <div className="w-full h-64">
                            {loadingUserDistribution ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                </div>
                            ) : userDistribution.length > 0 ? (
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={userDistribution}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={85}
                                            dataKey="value"
                                            label
                                        >
                                            {userDistribution.map((_, i) => (
                                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Legend />
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500">
                                    No user distribution data available
                                </div>
                            )}
                        </div>
                    </SectionBox>

                    {/* ORDERS + SALES */}
                    <SectionBox title="Orders & Sales Trend">
                        <div className="w-full h-64">
                            {loadingOrdersSalesTrend ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                </div>
                            ) : ordersSalesChart.length > 0 ? (
                                <ResponsiveContainer>
                                    <ComposedChart data={ordersSalesChart}>
                                        <CartesianGrid stroke="#eaeaea" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Legend />
                                        <Tooltip />

                                        <Bar
                                            dataKey="orders"
                                            barSize={28}
                                            fill="#16a34a"
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="sales"
                                            stroke="#0d9488"
                                            strokeWidth={3}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500">
                                    No orders & sales trend data available
                                </div>
                            )}
                        </div>
                    </SectionBox>
                </div>

                {/* ================= TABLES ================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Joins */}
                    <SectionBox title="Recent Joins">
                        {loadingRecentJoins ? (
                            <div className="py-12 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            </div>
                        ) : recentJoins.length > 0 ? (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-gray-600 text-xs border-b">
                                        <th className="py-2 text-left">User ID</th>
                                        <th className="py-2 text-left">Name</th>
                                        <th className="py-2 text-left">Joined At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentJoins.slice(0, 10).map((u) => (
                                        <tr key={u.id} className="border-b hover:bg-green-50/50">
                                            <td className="py-2 text-gray-600">{u.id}</td>
                                            <td className="py-2 font-medium text-gray-800">{u.name}</td>
                                            <td className="py-2 text-gray-600">{u.joined}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="py-8 text-center text-gray-500">
                                No recent joins data available
                            </div>
                        )}
                    </SectionBox>

                    {/* Recent Orders */}
                    <SectionBox title="Recent Orders">
                        {loadingRecentOrders ? (
                            <div className="py-12 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            </div>
                        ) : orders.length > 0 ? (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-gray-600 text-xs border-b">
                                        <th className="py-2 text-left">Order</th>
                                        <th className="py-2 text-left">Amount</th>
                                        <th className="py-2 text-left">Status</th>
                                        <th className="py-2 text-left">Ordered At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 10).map((o) => (
                                        <tr key={o.id} className="border-b hover:bg-green-50/50">
                                            <td className="py-2">{o.order_number}</td>
                                            <td className="py-2 font-medium">₹ {o.amount}</td>
                                            <td className="py-2 capitalize">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium
                                                    ${o.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                        o.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            o.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'}`}
                                                >
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td className="py-2 text-gray-600">{o.ordered_at}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="py-8 text-center text-gray-500">
                                No recent orders data available
                            </div>
                        )}
                    </SectionBox>
                </div>

            </div>
        </div>
    );
}