"use client";

import React, { useEffect, useState } from "react";
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

// ================= MOCK DATA ==================
const mockUserOverview = {
    user: {
        id: "USR2001",
        name: "John Doe",
        rank: "Silver",
        sponsor: "USR1001",
        joined: "2024-03-15",
        active_status: "Active",
    },

    wallet_balance: 4520.0,
    used_wallet: 1200.0,

    referral_bonus: 850.0,
    performance_bonus: 1200.0,
    sponsor_royalty: 550.0,
    rank_bonus: 300.0,
    repurchase_income: 600.0,
    fast_track_bonus: 900.0,
    star_achiever_pool: 1100.0,
    loyalty_bonus: 450.0,

    direct_income: 1250.5,
    level_income: 420.25,
    matching_income: 310.75,

    total_left_team: 120,
    total_right_team: 95,
    all_team: 215,
};

export default function UserDashboard() {
    const [overview, setOverview] = useState<any>(null);

    useEffect(() => {
        setOverview(mockUserOverview);
    }, []);

    // ========= TOTAL EARNING CALCULATION ==========
    const totalEarning =
        overview?.referral_bonus +
        overview?.performance_bonus +
        overview?.sponsor_royalty +
        overview?.rank_bonus +
        overview?.repurchase_income +
        overview?.fast_track_bonus +
        overview?.star_achiever_pool +
        overview?.loyalty_bonus +
        overview?.direct_income +
        overview?.level_income +
        overview?.matching_income;

    // ========= INCOME CARDS ============
    const incomeCards = [
        { label: "Referral Bonus", value: overview?.referral_bonus, icon: <UserCheck size={22} /> },
        { label: "Performance Bonus", value: overview?.performance_bonus, icon: <ArrowUpCircle size={22} /> },
        { label: "Sponsor Royalty", value: overview?.sponsor_royalty, icon: <Crown size={22} /> },
        { label: "Rank Bonus", value: overview?.rank_bonus, icon: <Medal size={22} /> },
        { label: "Repurchase Income", value: overview?.repurchase_income, icon: <Gift size={22} /> },
        { label: "Fast Track Bonus", value: overview?.fast_track_bonus, icon: <ArrowUpCircle size={22} /> },
        { label: "Star Achiever Pool", value: overview?.star_achiever_pool, icon: <Sparkles size={22} /> },
        { label: "Loyalty Bonus", value: overview?.loyalty_bonus, icon: <Coins size={22} /> },
        { label: "Direct Income", value: overview?.direct_income, icon: <Users size={22} /> },

        { label: "Total Left Team", value: overview?.total_left_team, icon: <UsersRound size={22} /> },
        { label: "Total Right Team", value: overview?.total_right_team, icon: <UsersRound size={22} /> },
        { label: "All Team", value: overview?.all_team, icon: <Users size={22} /> },
    ];

    // ========= TEAM PIE CHART ===========
    const teamPieData = [
        { name: "Left Team", value: overview?.total_left_team },
        { name: "Right Team", value: overview?.total_right_team },
    ];
    const PIE_COLORS = ["#15803d", "#4ade80"];

    // ========= MONTHLY INCOME LINE CHART ===========
    const monthlyIncomeData = [
        { month: "Jan", earning: 12000 },
        { month: "Feb", earning: 15000 },
        { month: "Mar", earning: 17000 },
        { month: "Apr", earning: 20000 },
        { month: "May", earning: 22500 },
        { month: "Jun", earning: 26000 },
    ];

    // ========= BONUS BREAKDOWN BAR CHART ===========
    const bonusBreakdownData = [
        { bonus: "Referral", amount: overview?.referral_bonus },
        { bonus: "Performance", amount: overview?.performance_bonus },
        { bonus: "Royalty", amount: overview?.sponsor_royalty },
        { bonus: "Rank", amount: overview?.rank_bonus },
        { bonus: "Repurchase", amount: overview?.repurchase_income },
    ];

    return (
        <div className="min-h-screen p-6 bg-green-50">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* ---------- TITLE ----------- */}
                <h1 className="text-3xl font-semibold text-green-900">
                    Welcome, {overview?.user?.name}
                </h1>

                {/* ---------- INCOME CARDS ----------- */}
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

             

                {/* ================== TWO CHARTS IN ONE ROW ================== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* 🔥 Monthly Income Growth Chart */}
                    <SectionBox title="Monthly Income Growth">
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyIncomeData}>
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

                    {/* 🔥 Bonus Breakdown Chart */}
                    <SectionBox title="Bonus Breakdown">
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={bonusBreakdownData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="bonus" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="amount" fill="#16a34a" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </SectionBox>

                </div>

                {/* ---------- TEAM PIE CHART ----------- */}
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
                                    {teamPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </SectionBox>

                {/* ---------- QUICK ACTIONS ----------- */}
                <SectionBox title="Quick Actions">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                        <button className="p-4 rounded-lg border border-green-300 bg-green-50 text-green-800 hover:bg-green-100 flex flex-col items-center">
                            <Gift size={26} /> Buy Products
                        </button>

                        <button className="p-4 rounded-lg border border-green-300 bg-green-50 text-green-800 hover:bg-green-100 flex flex-col items-center">
                            <UsersRound size={26} /> Genealogy
                        </button>

                        <button className="p-4 rounded-lg border border-green-300 bg-green-50 text-green-800 hover:bg-green-100 flex flex-col items-center">
                            <UserCheck size={26} /> My Referrals
                        </button>

                        <button className="p-4 rounded-lg border border-green-300 bg-green-50 text-green-800 hover:bg-green-100 flex flex-col items-center">
                            <Wallet size={26} /> Withdraw
                        </button>

                    </div>
                </SectionBox>
            </div>
        </div>
    );
}
