"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/common/DataTable";

interface BusinessSummary {
  businessDate: string;
  leftPv: number;
  rightPv: number;
  leftCbp: number;
  rightCbp: number;
}

export default function BusinessSummaryPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  // ✅ Demo Data (replace with API later)
  const summaryData: BusinessSummary[] = [
    {
      businessDate: "2024-10-12",
      leftPv: 120,
      rightPv: 100,
      leftCbp: 300,
      rightCbp: 280,
    },
    {
      businessDate: "2024-10-13",
      leftPv: 140,
      rightPv: 115,
      leftCbp: 320,
      rightCbp: 290,
    },
    {
      businessDate: "2024-10-14",
      leftPv: 160,
      rightPv: 140,
      leftCbp: 350,
      rightCbp: 310,
    },
    {
      businessDate: "2024-10-15",
      leftPv: 180,
      rightPv: 160,
      leftCbp: 400,
      rightCbp: 370,
    },
    {
      businessDate: "2024-10-16",
      leftPv: 200,
      rightPv: 190,
      leftCbp: 420,
      rightCbp: 410,
    },
    {
      businessDate: "2024-10-17",
      leftPv: 210,
      rightPv: 200,
      leftCbp: 430,
      rightCbp: 420,
    },
    {
      businessDate: "2024-10-18",
      leftPv: 250,
      rightPv: 220,
      leftCbp: 450,
      rightCbp: 440,
    },
    {
      businessDate: "2024-10-19",
      leftPv: 270,
      rightPv: 240,
      leftCbp: 480,
      rightCbp: 460,
    },
    {
      businessDate: "2024-10-20",
      leftPv: 300,
      rightPv: 260,
      leftCbp: 500,
      rightCbp: 480,
    },
    {
      businessDate: "2024-10-21",
      leftPv: 320,
      rightPv: 280,
      leftCbp: 520,
      rightCbp: 500,
    },
  ];

  // ===== Table Columns =====
  const columns: { key: keyof BusinessSummary; label: string }[] = [
    { key: "businessDate", label: "Business Date" },
    { key: "leftPv", label: "Left PV" },
    { key: "rightPv", label: "Right PV" },
    { key: "leftCbp", label: "Left CBP" },
    { key: "rightCbp", label: "Right CBP" },
  ];

  // ===== Filter + Pagination Logic =====
  const filteredData = summaryData.filter(
    (item) =>
      item.businessDate.toLowerCase().includes(search.toLowerCase()) ||
      item.leftPv.toString().includes(search)
  );

  const totalPages = Math.ceil(filteredData.length / entries);
  const startIndex = (page - 1) * entries;
  const paginatedData = filteredData.slice(startIndex, startIndex + entries);

  const handlePrevious = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages || 1));

  const handleSubmit = () => {
    console.log("Filter applied:", { fromDate, toDate });
    // Later: fetch API data based on fromDate & toDate
  };

  // ===== Footer Totals =====
  const totalLeftPv = summaryData.reduce((sum, item) => sum + item.leftPv, 0);
  const totalRightPv = summaryData.reduce((sum, item) => sum + item.rightPv, 0);
  const totalLeftCbp = summaryData.reduce((sum, item) => sum + item.leftCbp, 0);
  const totalRightCbp = summaryData.reduce(
    (sum, item) => sum + item.rightCbp,
    0
  );

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ===== PAGE HEADER ===== */}
          <div>
            <h1 className="text-2xl font-bold text-green-800">
              Business Summary
            </h1>
            <p className="text-green-700 text-sm">
              View your daily business performance based on PV and CBP values.
            </p>
          </div>

          {/* ===== FILTER SECTION ===== */}
          <div className="bg-white shadow-md rounded-xl border border-green-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3 items-end">
              {/* From Date */}
              <div className="flex flex-col">
                <label
                  htmlFor="fromDate"
                  className="text-sm font-medium text-green-800 mb-1"
                >
                  From Date:
                </label>
                <input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border border-green-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              {/* To Date */}
              <div className="flex flex-col">
                <label
                  htmlFor="toDate"
                  className="text-sm font-medium text-green-800 mb-1"
                >
                  To Date:
                </label>
                <input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border border-green-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="bg-green-700 text-white px-6 py-2 rounded-md font-medium hover:bg-green-800 transition self-end"
              >
                Submit
              </button>
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

          {/* ===== FOOTER TOTALS ===== */}
          <div className="bg-white border border-green-100 shadow-sm rounded-lg p-4 flex flex-wrap justify-end gap-6 text-green-800 font-medium text-sm">
            <p>
              Left PV:{" "}
              <span className="font-semibold text-green-700">
                {totalLeftPv.toFixed(2)}
              </span>
            </p>
            <p>
              Right PV:{" "}
              <span className="font-semibold text-green-700">
                {totalRightPv.toFixed(2)}
              </span>
            </p>
            <p>
              Left CBP:{" "}
              <span className="font-semibold text-green-700">
                {totalLeftCbp.toFixed(2)}
              </span>
            </p>
            <p>
              Right CBP:{" "}
              <span className="font-semibold text-green-700">
                {totalRightCbp.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
