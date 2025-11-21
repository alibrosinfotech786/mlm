"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/common/DataTable";

interface LevelTeam {
  level: number;
  totalTeam: number;
  pv: number;
  cbp: number;
}

export default function LevelTeamPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  // Demo data (empty now)
  const levelData: LevelTeam[] = [];

  // Table columns
  const columns: { key: keyof LevelTeam; label: string }[] = [
    { key: "level", label: "Level" },
    { key: "totalTeam", label: "Total Team" },
    { key: "pv", label: "PV" },
    { key: "cbp", label: "CBP" },
  ];

  // ===== Filter + Pagination Logic =====
  const filteredData = levelData.filter((item) =>
    item.level.toString().includes(search)
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
              <h1 className="text-2xl font-bold text-green-800">Level Team</h1>
              <p className="text-green-700 text-sm">
                View your downline performance and level-based PV/CBP summary.
              </p>
            </div>
          </div>

          {/* ===== DATA TABLE ===== */}
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
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
