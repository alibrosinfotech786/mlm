"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/common/DataTable";

interface TeamMember {
  regDate: string;
  userId: string;
  name: string;
  sponsorUserId: string;
  placement: string;
  level: number;
  activationDate: string;
  pv: number;
  cbp: number;
  billAmount: number;
}

// ✅ Actual Data
const teamData: TeamMember[] = [
  {
    regDate: "2024-10-12",
    userId: "TA1001",
    name: "Vishal Verma",
    sponsorUserId: "TA9001",
    placement: "Left",
    level: 1,
    activationDate: "2024-10-14",
    pv: 120,
    cbp: 300,
    billAmount: 2500,
  },
  {
    regDate: "2024-10-14",
    userId: "TA1002",
    name: "Aman Kumar",
    sponsorUserId: "TA9002",
    placement: "Right",
    level: 1,
    activationDate: "2024-10-16",
    pv: 100,
    cbp: 250,
    billAmount: 2200,
  },
  {
    regDate: "2024-10-15",
    userId: "TA1003",
    name: "Priya Sharma",
    sponsorUserId: "TA9001",
    placement: "Left",
    level: 2,
    activationDate: "2024-10-17",
    pv: 150,
    cbp: 310,
    billAmount: 2700,
  },
  {
    regDate: "2024-10-18",
    userId: "TA1004",
    name: "Rahul Mehta",
    sponsorUserId: "TA9003",
    placement: "Right",
    level: 2,
    activationDate: "2024-10-20",
    pv: 90,
    cbp: 200,
    billAmount: 1800,
  },
  {
    regDate: "2024-10-19",
    userId: "TA1005",
    name: "Sneha Gupta",
    sponsorUserId: "TA9004",
    placement: "Left",
    level: 3,
    activationDate: "2024-10-22",
    pv: 130,
    cbp: 270,
    billAmount: 2400,
  },
];

export default function AllTeamPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  // ✅ Remove the empty teamData redeclaration below
  // const teamData: TeamMember[] = []; ❌

  // Columns for DataTable
  const columns: { key: keyof TeamMember; label: string }[] = [
    { key: "regDate", label: "Reg. Date" },
    { key: "userId", label: "User ID" },
    { key: "name", label: "Name" },
    { key: "sponsorUserId", label: "Spon User ID" },
    { key: "placement", label: "Placement" },
    { key: "level", label: "Level" },
    { key: "activationDate", label: "Activation Date" },
    { key: "pv", label: "PV" },
    { key: "cbp", label: "CBP" },
    { key: "billAmount", label: "Bill Amount ₹" },
  ];

  // Filtered + paginated data
  const filteredData = teamData.filter(
    (member) =>
      member.name?.toLowerCase().includes(search.toLowerCase()) ||
      member.userId?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / entries);
  const startIndex = (page - 1) * entries;
  const paginatedData = filteredData.slice(startIndex, startIndex + entries);

  const handlePrevious = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages || 1));

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ===== PAGE HEADER ===== */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-green-800">All Team</h1>
              <p className="text-green-700 text-sm">
                Manage and track your All team members easily.
              </p>
            </div>
          </div>

          {/* ===== DATA TABLE ===== */}
          <div className="bg-white rounded-b-xl shadow-md border border-green-100 overflow-hidden">
            <DataTable
              columns={columns}
              data={paginatedData}
              page={page}
              totalPages={totalPages}
              entries={entries}
              search={search}
              onSearchChange={setSearch}
              onEntriesChange={setEntries}
              onPrevious={handlePrevious}
              onNext={handleNext}
              emptyMessage="No data available in table"
            />
          </div>
        </div>
      </section>
    </>
  );
}
