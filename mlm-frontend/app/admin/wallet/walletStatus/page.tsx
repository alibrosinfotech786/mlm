"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/common/DataTable";

interface WalletStatus {
  requestDate: string;
  requestBy: string;
  requestTo: string;
  amount: number;
  transactionId: string;
  description: string;
  attachment: string;
  status: string;
}

export default function WalletStatusPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  // ✅ Demo Data (Replace with API later)
  const walletData: WalletStatus[] = [
    {
      requestDate: "2024-10-12",
      requestBy: "Vishal Verma",
      requestTo: "Admin",
      amount: 2500,
      transactionId: "TXN123456",
      description: "Wallet top-up via bank transfer",
      attachment: "/uploads/txn1.png",
      status: "Approved",
    },
    {
      requestDate: "2024-10-13",
      requestBy: "Aman Kumar",
      requestTo: "Admin",
      amount: 1500,
      transactionId: "TXN123457",
      description: "Recharge through UPI",
      attachment: "/uploads/txn2.png",
      status: "Pending",
    },
    {
      requestDate: "2024-10-14",
      requestBy: "Priya Sharma",
      requestTo: "Admin",
      amount: 2000,
      transactionId: "TXN123458",
      description: "Payment proof attached",
      attachment: "/uploads/txn3.png",
      status: "Rejected",
    },
    {
      requestDate: "2024-10-15",
      requestBy: "Rahul Mehta",
      requestTo: "Admin",
      amount: 3000,
      transactionId: "TXN123459",
      description: "Wallet funding via net banking",
      attachment: "/uploads/txn4.png",
      status: "Approved",
    },
    {
      requestDate: "2024-10-16",
      requestBy: "Sneha Gupta",
      requestTo: "Admin",
      amount: 1800,
      transactionId: "TXN123460",
      description: "Recharge through Paytm",
      attachment: "/uploads/txn5.png",
      status: "Pending",
    },
    {
      requestDate: "2024-10-17",
      requestBy: "Mohit Singh",
      requestTo: "Admin",
      amount: 5000,
      transactionId: "TXN123461",
      description: "Added for order purchase",
      attachment: "/uploads/txn6.png",
      status: "Approved",
    },
  ];

  // ✅ Columns Definition
  const columns: Column<WalletStatus>[] = [
    { key: "requestDate", label: "Request Date" },
    { key: "requestBy", label: "Request By" },
    { key: "requestTo", label: "Request To" },
    { key: "amount", label: "Amount (₹)" },
    { key: "transactionId", label: "Transaction ID" },
    { key: "description", label: "Description" },
    {
      key: "attachment",
      label: "Attachment",
      render: (value: any) =>
        value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 hover:underline"
          >
            View
          </a>
        ) : (
          "-"
        ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: any) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value === "Approved"
              ? "bg-green-100 text-green-700"
              : value === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : value === "Rejected"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {value || "Pending"}
        </span>
      ),
    },
  ];

  // ===== Filter + Pagination =====
  const filteredData = walletData.filter(
    (item) =>
      item.requestBy.toLowerCase().includes(search.toLowerCase()) ||
      item.transactionId.toLowerCase().includes(search.toLowerCase())
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
              <h1 className="text-2xl font-bold text-green-800">
                Wallet Status
              </h1>
              <p className="text-green-700 text-sm">
                Track your wallet funding requests and their approval status.
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
              emptyMessage="No wallet records found"
            />
          </div>
        </div>
      </section>
    </>
  );
}
