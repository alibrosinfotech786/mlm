"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import SectionBox from "./SectionBox";

import {
    Wallet,
    Users,
    Crown,
    Gift,
    ArrowUpCircle,
    UserCheck,
    Sparkles,
    Coins,
    Medal,
    UsersRound,
    TrendingUp,
} from "lucide-react";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

export default function UserDashboard() {
    const [username, setUsername] = useState("");
    const [dashboard, setDashboard] = useState<any>(null);

    // NEW STATES FOR APIs
    const [monthlyGrowth, setMonthlyGrowth] = useState<any[]>([]);
    const [bonusBreakdown, setBonusBreakdown] = useState<any[]>([]);

    console.log(bonusBreakdown, "bonusBreakdown------------>")

    /* ===================== LOAD USER FROM LOCAL ===================== */
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            const parse = JSON.parse(stored);
            setUsername(parse?.name || "");

            fetchDashboard(parse.user_id);
            fetchMonthlyGrowth(parse.user_id);
            fetchBonusBreakdown(parse.user_id);
        }
    }, []);

    /* ===================== FETCH DASHBOARD API ===================== */
    async function fetchDashboard(user_id: string) {
        try {
            const res = await axiosInstance.get(
                `${ProjectApiList.COMPREHENSIVE_DASHBOARD}?user_id=${user_id}`
            );
            if (res.data.success) setDashboard(res.data);
        } catch (err) {
            console.log("Dashboard fetch error:", err);
        }
    }

    /* ===================== FETCH MONTHLY GROWTH API ===================== */
    async function fetchMonthlyGrowth(user_id: string) {
        try {
            const res = await axiosInstance.get(
                `${ProjectApiList.MONTHLY_GROWTH}?user_id=${user_id}`
            );

            if (res.data.success) {
                const formatted = res.data.data.map((item: any) => ({
                    month: item.month,
                    earning: Number(item.bv_earned),
                }));
                setMonthlyGrowth(formatted);
            }
        } catch (err) {
            console.log("Monthly Growth error", err);
        }
    }

    /* ===================== FETCH BONUS BREAKDOWN API ===================== */
    async function fetchBonusBreakdown(user_id: string) {
        try {
            const res = await axiosInstance.get(
                `${ProjectApiList.BONUS_BREAKDOWN}?user_id=${user_id}`
            );

            if (res.data.success) {
                const formatted = res.data.data.map((item: any) => ({
                    bonus: item.name,
                    amount: item.value,
                }));
                setBonusBreakdown(formatted);
            }
        } catch (err) {
            console.log("Bonus Breakdown error:", err);
        }
    }

    if (!dashboard) {
        return (
            <div className="min-h-screen flex items-center justify-center text-green-700 text-xl">
                Loading Dashboard...
            </div>
        );
    }

    /* ===================== STATIC CARDS (KEEP AS IT IS) ===================== */
    const incomeCards1 = [
        { label: "Referral Bonus", value: 0, icon: <UserCheck size={22} /> },
        { label: "Performance Bonus", value: 0, icon: <ArrowUpCircle size={22} /> },
        { label: "Sponsor Royalty", value: 0, icon: <Crown size={22} /> },
        { label: "Rank Bonus", value: 0, icon: <Medal size={22} /> },
        { label: "Repurchase Income", value: 0, icon: <Gift size={22} /> },
        { label: "Fast Track Bonus", value: 0, icon: <ArrowUpCircle size={22} /> },
        { label: "Star Achiever Pool", value: 0, icon: <Sparkles size={22} /> },
        { label: "Loyalty Bonus", value: 0, icon: <Coins size={22} /> },
        { label: "Direct Income", value: 0, icon: <Users size={22} /> },

        { label: "Total Left Team", value: 0, icon: <UsersRound size={22} /> },
        { label: "Total Right Team", value: 0, icon: <UsersRound size={22} /> },
        { label: "All Team", value: 0, icon: <Users size={22} /> },
    ];

    /* ===================== API → CARDS ===================== */
    const incomeCards = [
        {
            label: "Current BV",
            value: dashboard.financial_summary.current_bv,
            icon: <TrendingUp size={22} />,
        },
        {
            label: "Referral Bonus",
            value: dashboard.financial_summary.total_referral_bonus,
            icon: <UserCheck size={22} />,
        },
        {
            label: "Level Bonus",
            value: dashboard.financial_summary.total_level_bonus,
            icon: <ArrowUpCircle size={22} />,
        },
        {
            label: "Total Orders",
            value: dashboard.sales_performance.total_orders,
            icon: <Gift size={22} />,
        },
        {
            label: "Completed Orders",
            value: dashboard.sales_performance.completed_orders,
            icon: <Gift size={22} />,
        },
        {
            label: "Total Sales Value",
            value: dashboard.sales_performance.total_sales_value,
            icon: <Wallet size={22} />,
        },
        {
            label: "Total Team Size",
            value: dashboard.team_performance.total_team_size,
            icon: <UsersRound size={22} />,
        },
        {
            label: "Active Team Members",
            value: dashboard.team_performance.active_team_members,
            icon: <Users size={22} />,
        },
        {
            label: "Left Team Size",
            value: dashboard.team_performance.left_team_size,
            icon: <Users size={22} />,
        },
        {
            label: "Right Team Size",
            value: dashboard.team_performance.right_team_size,
            icon: <Users size={22} />,
        },
        {
            label: "Direct Referrals",
            value: dashboard.team_performance.direct_referrals,
            icon: <UserCheck size={22} />,
        },
        {
            label: "Left Team BV",
            value: dashboard.binary_team.left_team_bv,
            icon: <Coins size={22} />,
        },
        {
            label: "Right Team BV",
            value: dashboard.binary_team.right_team_bv,
            icon: <Coins size={22} />,
        },
        {
            label: "Matching BV",
            value: dashboard.binary_team.matching_bv,
            icon: <Sparkles size={22} />,
        },
        {
            label: "Carry Forward Left",
            value: dashboard.binary_team.carry_forward_left,
            icon: <ArrowUpCircle size={22} />,
        },
        {
            label: "Carry Forward Right",
            value: dashboard.binary_team.carry_forward_right,
            icon: <ArrowUpCircle size={22} />,
        },
    ];

    /* ===================== PIE CHART ===================== */
    const teamPieData = [
        { name: "Left Team", value: dashboard.team_performance.left_team_size },
        { name: "Right Team", value: dashboard.team_performance.right_team_size },
    ];
    const PIE_COLORS = ["#15803d", "#4ade80"];

    /* ======================================================
       QUICK ACTIONS BUTTONS
  ====================================================== */
    const actions = [
        {
            icon: <Users size={26} />,
            text: "Profile",
            link: "/admin/myAccount/profile", 
        },
        {
            icon: <Gift size={26} />,
            text: "Buy Products",
            link: "/admin/orders/buyOrders", 
        },
        {
            icon: <Wallet size={26} />,
            text: "Wallet Summary",
            link: "/admin/wallet/walletSummary",
        },
        {
            icon: <TrendingUp size={26} />,
            text: "BV Summary",
            link: "/admin/wallet/bvSummary", 
        },
    ];


    /* ===================== FINAL JSX ===================== */
    return (
        <div className="min-h-screen p-6 bg-green-50">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* TITLE */}
                <h1 className="text-3xl font-semibold text-green-900">
                    Welcome, {username}
                </h1>

                {/* STATIC CARDS */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {incomeCards1.map((item) => (
                        <div
                            key={item.label}
                            className="p-4 bg-white rounded-xl border border-green-200 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-green-700">{item.icon}</div>
                                <span className="text-xs text-gray-500">{item.label}</span>
                            </div>
                            <h2 className="text-xl font-bold text-green-800">{item.value}</h2>
                        </div>
                    ))}
                </div> */}

                <hr />

                {/* API CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {incomeCards.map((item) => (
                        <div
                            key={item.label}
                            className="p-4 bg-white rounded-xl border border-green-200 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-green-700">{item.icon}</div>
                                <span className="text-xs text-gray-500">{item.label}</span>
                            </div>
                            <h2 className="text-xl font-bold text-green-800">{item.value}</h2>
                        </div>
                    ))}
                </div>

                {/* CHART ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Monthly Income Growth */}
                    <SectionBox title="Monthly Growth">
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyGrowth}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="earning"
                                        stroke="#15803d"
                                        strokeWidth={3}
                                        dot={{ r: 5, fill: "#15803d" }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </SectionBox>

                    {/* Bonus Breakdown */}
                    <SectionBox title="Bonus Breakdown">
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={bonusBreakdown}>

                                    <XAxis
                                        dataKey="bonus"
                                        tick={{ fontSize: 12 }}
                                        interval={0}
                                        angle={-30}
                                        textAnchor="end"
                                        stroke="#059669"
                                    />
                                    <YAxis stroke="#059669" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#ecfdf5",
                                            border: "1px solid #34d399",
                                            borderRadius: "8px",
                                            color: "#065f46",
                                        }}
                                    />

                                    <Bar
                                        dataKey="amount"
                                        fill="#16a34a"
                                        barSize={32}
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </SectionBox>


                </div>

                {/* TEAM PIE */}
                <SectionBox title="Team Strength">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={teamPieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    label
                                    dataKey="value"
                                >
                                    {teamPieData.map((entry, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </SectionBox>

                {/* QUICK ACTIONS SECTION */}
                <SectionBox title="Quick Actions">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {actions.map((action) => (
                            <a
                                key={action.text}
                                href={action.link}
                                className="p-4 rounded-lg border border-green-300 bg-green-50 text-green-800 
                           hover:bg-green-100 hover:shadow-md transition flex flex-col items-center"
                            >
                                {action.icon}
                                <span className="mt-2 text-sm font-medium">{action.text}</span>
                            </a>
                        ))}
                    </div>
                </SectionBox>


            </div>
        </div>
    );
}
