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

export default function RightTeamPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  const teamData: TeamMember[] = []; // Empty now (connect API later)

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
              <h1 className="text-2xl font-bold text-green-800">Right Team</h1>
              <p className="text-green-700 text-sm">
                Manage and monitor your right-side team members easily.
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
              emptyMessage="No Right Team members found"
            />
          </div>
        </div>
      </section>
    </>
  );
}
