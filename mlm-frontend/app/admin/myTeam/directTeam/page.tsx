"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/common/DataTable";

interface TeamMember {
    regDate: string;
    userId: string;
    name: string;
    mobile: string;
    placement: string;
    activationDate: string;
    pv: number;
    cbp: number;
}

export default function DirectTeamPage() {
    const [search, setSearch] = useState<string>("");
    const [entries, setEntries] = useState<number>(10);
    const [page, setPage] = useState<number>(1);

    // Sample / Empty Data for now
    const teamData: TeamMember[] = [
        {
            regDate: "10 Nov 2025",
            userId: "TA123456",
            name: "Amit Sharma",
            mobile: "9876543210",
            placement: "Left",
            activationDate: "15 Nov 2025",
            pv: 120,
            cbp: 3000,
        },
        {
            regDate: "15 Nov 2025",
            userId: "TA654321",
            name: "Priya Verma",
            mobile: "8765432109",
            placement: "Right",
            activationDate: "18 Nov 2025",
            pv: 140,
            cbp: 3500,
        },
    ];

    // ===== Columns for DataTable =====
    // ===== Columns for DataTable =====
    const columns: { key: keyof TeamMember; label: string }[] = [
        { key: "regDate", label: "Reg. Date" },
        { key: "userId", label: "User ID" },
        { key: "name", label: "Name" },
        { key: "mobile", label: "Mobile No." },
        { key: "placement", label: "Placement" },
        { key: "activationDate", label: "Activation Date" },
        { key: "pv", label: "PV" },
        { key: "cbp", label: "CBP" },
    ];


    // ===== Filtered + Paginated Data =====
    const filteredData = teamData.filter(
        (member) =>
            member.name.toLowerCase().includes(search.toLowerCase()) ||
            member.userId.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / entries);
    const startIndex = (page - 1) * entries;
    const paginatedData = filteredData.slice(startIndex, startIndex + entries);

    const handlePrevious = () => setPage((p) => Math.max(p - 1, 1));
    const handleNext = () =>
        setPage((p) => Math.min(p + 1, totalPages || 1));

    return (
        <>
            <AdminHeader />

            <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* ===== Page Header ===== */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-green-800">Direct Team</h1>
                            <p className="text-green-700 text-sm">
                                Manage and track your direct team members easily.
                            </p>
                        </div>

                    </div>

                    <DataTable
                        columns={columns}
                        data={paginatedData}
                        page={page}
                        totalPages={totalPages}
                        entries={entries}
                        search={search}
                        onSearchChange={(val) => setSearch(val)}
                        onEntriesChange={(val) => setEntries(val)}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        emptyMessage="No Direct Team Members Found"
                    />



                </div>
            </section>
        </>
    );
}
