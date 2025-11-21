"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/common/DataTable";

interface BusinessReport {
  date: string;
  username: string;
  pv: number;
  cbp: number;
}

export default function DirectBusinessReportPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  // ✅ Demo Data (Replace with API later)
  const reportData: BusinessReport[] = [
    { date: "2024-10-12", username: "Vishal Verma", pv: 120, cbp: 300 },
    { date: "2024-10-13", username: "Aman Kumar", pv: 95, cbp: 250 },
    { date: "2024-10-14", username: "Priya Sharma", pv: 150, cbp: 310 },
    { date: "2024-10-15", username: "Rahul Mehta", pv: 80, cbp: 200 },
    { date: "2024-10-16", username: "Sneha Gupta", pv: 130, cbp: 270 },
    { date: "2024-10-17", username: "Mohit Singh", pv: 200, cbp: 350 },
    { date: "2024-10-18", username: "Neha Patel", pv: 180, cbp: 300 },
    { date: "2024-10-19", username: "Arjun Yadav", pv: 160, cbp: 280 },
    { date: "2024-10-20", username: "Pooja Rani", pv: 190, cbp: 330 },
    { date: "2024-10-21", username: "Ravi Kumar", pv: 210, cbp: 360 },
    { date: "2024-10-22", username: "Rohan Das", pv: 140, cbp: 290 },
    { date: "2024-10-23", username: "Anjali Singh", pv: 175, cbp: 320 },
    { date: "2024-10-24", username: "Deepak Yadav", pv: 205, cbp: 355 },
  ];

  // ===== Filtered + Paginated Data =====
  const filteredData = reportData.filter(
    (item) =>
      item.username?.toLowerCase().includes(search.toLowerCase()) ||
      item.date?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / entries);
  const startIndex = (page - 1) * entries;
  const paginatedData = filteredData.slice(startIndex, startIndex + entries);

  const handlePrevious = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages || 1));

  // ====== Total PV/CBP Calculations ======
  const totalPV = reportData.reduce((sum, item) => sum + item.pv, 0);
  const totalCBP = reportData.reduce((sum, item) => sum + item.cbp, 0);

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ===== Page Header ===== */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-green-800">
                Direct Business Report
              </h1>
              <p className="text-green-700 text-sm">
                Track your direct business growth and PV/CBP statistics.
              </p>
            </div>
          </div>

          {/* ===== Data Table ===== */}
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
            <DataTable
              columns={[
                { key: "date", label: "Date" },
                { key: "username", label: "Username" },
                { key: "pv", label: "PV" },
                { key: "cbp", label: "CBP" },
              ]}
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

          {/* ===== Footer Totals ===== */}
          <div className="bg-white border border-green-100 shadow-sm rounded-lg p-4 flex flex-wrap justify-end gap-6 text-green-800 font-medium text-sm">
            <p>
              Total PV:{" "}
              <span className="font-semibold text-green-700">{totalPV}</span>
            </p>
            <p>
              Total CBP:{" "}
              <span className="font-semibold text-green-700">{totalCBP}</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
