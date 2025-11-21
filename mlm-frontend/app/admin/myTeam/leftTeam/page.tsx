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

export default function LeftTeamPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  // ✅ Sample Data (Only Left Placement)
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
    {
      regDate: "2024-10-21",
      userId: "TA1007",
      name: "Neha Patel",
      sponsorUserId: "TA9003",
      placement: "Left",
      level: 4,
      activationDate: "2024-10-25",
      pv: 180,
      cbp: 300,
      billAmount: 3100,
    },
    {
      regDate: "2024-10-23",
      userId: "TA1009",
      name: "Pooja Rani",
      sponsorUserId: "TA9004",
      placement: "Left",
      level: 5,
      activationDate: "2024-10-28",
      pv: 190,
      cbp: 330,
      billAmount: 2900,
    },
  ];

  // ✅ Columns for DataTable
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

  // ✅ Filtered + Paginated Data
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
              <h1 className="text-2xl font-bold text-green-800">Left Team</h1>
              <p className="text-green-700 text-sm">
                Manage and monitor your left-side team members easily.
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
              emptyMessage="No Left Team members found"
            />
          </div>
        </div>
      </section>
    </>
  );
}
