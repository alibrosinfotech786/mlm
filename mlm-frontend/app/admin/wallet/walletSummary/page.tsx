"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/common/DataTable";

interface WalletSummary {
  tranDate: string;
  description: string;
  cr: number;
  dr: number;
  balance: number;
}

export default function WalletSummaryPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  // ✅ Demo wallet summary data
  const walletData: WalletSummary[] = [
    {
      tranDate: "2024-10-12",
      description: "Wallet credited via bank transfer (TXN123456)",
      cr: 5000,
      dr: 0,
      balance: 5000,
    },
    {
      tranDate: "2024-10-13",
      description: "Purchase of Starter Package 1095",
      cr: 0,
      dr: 1095,
      balance: 3905,
    },
    {
      tranDate: "2024-10-14",
      description: "Referral bonus credited",
      cr: 250,
      dr: 0,
      balance: 4155,
    },
    {
      tranDate: "2024-10-15",
      description: "Wallet top-up via UPI (TXN123459)",
      cr: 2000,
      dr: 0,
      balance: 6155,
    },
    {
      tranDate: "2024-10-16",
      description: "Purchase - Ved-Ojus product",
      cr: 0,
      dr: 2995,
      balance: 3160,
    },
    {
      tranDate: "2024-10-17",
      description: "Commission earned on direct team sales",
      cr: 400,
      dr: 0,
      balance: 3560,
    },
    {
      tranDate: "2024-10-18",
      description: "Withdrawal request processed",
      cr: 0,
      dr: 2000,
      balance: 1560,
    },
    {
      tranDate: "2024-10-19",
      description: "Cashback credited for monthly milestone",
      cr: 500,
      dr: 0,
      balance: 2060,
    },
    {
      tranDate: "2024-10-20",
      description: "Purchase - Moringa Powder",
      cr: 0,
      dr: 450,
      balance: 1610,
    },
    {
      tranDate: "2024-10-21",
      description: "Direct referral bonus credited",
      cr: 300,
      dr: 0,
      balance: 1910,
    },
  ];

  // ===== Table Columns =====
  const columns: { key: keyof WalletSummary; label: string }[] = [
    { key: "tranDate", label: "Tran Date" },
    { key: "description", label: "Description" },
    { key: "cr", label: "CR (₹)" },
    { key: "dr", label: "DR (₹)" },
    { key: "balance", label: "Balance (₹)" },
  ];

  // ===== Filter & Pagination Logic =====
  const filteredData = walletData.filter(
    (item) =>
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.tranDate.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / entries);
  const startIndex = (page - 1) * entries;
  const paginatedData = filteredData.slice(startIndex, startIndex + entries);

  const handlePrevious = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages || 1));

  // ===== Totals Calculation =====
  const totalCR = walletData.reduce((sum, item) => sum + item.cr, 0);
  const totalDR = walletData.reduce((sum, item) => sum + item.dr, 0);
  const finalBalance = walletData[walletData.length - 1].balance;

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ===== PAGE HEADER ===== */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-green-800">
                Wallet Summary
              </h1>
              <p className="text-green-700 text-sm">
                View all credit, debit, and balance transactions in your wallet.
              </p>
            </div>
          </div>

          {/* ===== TABLE SECTION ===== */}
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
              emptyMessage="No wallet transactions available"
            />
          </div>

          {/* ===== FOOTER TOTALS ===== */}
          <div className="bg-white border border-green-100 shadow-sm rounded-lg p-4 flex flex-wrap justify-end gap-6 text-green-800 font-medium text-sm">
            <p>
              Total Credit:{" "}
              <span className="font-semibold text-green-700">
                ₹{totalCR.toFixed(2)}
              </span>
            </p>
            <p>
              Total Debit:{" "}
              <span className="font-semibold text-green-700">
                ₹{totalDR.toFixed(2)}
              </span>
            </p>
            <p>
              Final Balance:{" "}
              <span className="font-semibold text-green-700">
                ₹{finalBalance.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
