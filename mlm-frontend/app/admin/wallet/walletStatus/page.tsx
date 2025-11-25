"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/common/DataTable";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

interface WalletStatus {
  requestDate: string;
  requestBy: string;
  requestTo: string;
  amount: number;
  reftransactionId: string;
  description: string;
  attachment: string | null;
  status: string;
}

export default function WalletStatusPage() {
  const [walletData, setWalletData] = useState<WalletStatus[]>([]);
  const [selectedRow, setSelectedRow] = useState<WalletStatus | null>(null); // Modal Row
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

  const fetchWalletStatus = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.user_id) return;

    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `${ProjectApiList.WALLET_TRANSACTION_LIST}?user_id=${user.user_id}&page=${page}&per_page=${entries}&search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const transactions = res.data.transactions;

        const formatted = transactions.data.map((item: any) => ({
          requestDate: item.created_at?.split("T")[0] ?? "-",
          requestBy: item.user?.name ?? "-",
          requestTo: "Admin",
          amount: Number(item.deposit_amount) || 0,
          reftransactionId: item.ref_transaction_id ?? "-",
          description: item.remark ?? "-",
          attachment: item.attachment ? `${BASE_URL}/${item.attachment}` : null,
          status: item.status || "Pending",
        }));

        setWalletData(formatted);
        setTotalPages(transactions.last_page || 1);
        setPage(transactions.current_page || 1);
      }
    } catch (error) {
      console.error("Fetch Wallet Status Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => fetchWalletStatus(), 350);
    return () => clearTimeout(debounce);
  }, [page, entries, search]);

  const handlePrevious = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  // 🔥 Columns including Action -> "View Details"
  const columns: Column<WalletStatus>[] = [
    { key: "requestDate", label: "Request Date" },
    { key: "requestBy", label: "Request By" },
    { key: "requestTo", label: "Request To" },
    { key: "amount", label: "Amount (₹)" },
    { key: "reftransactionId", label: "Ref Transaction ID" },
    {
      key: "description",
      label: "Description",
      render: (value: string) => (
        <p className="max-w-[100px] truncate text-gray-700" title={value}>
          {value}
        </p>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${value === "approved"
            ? "bg-green-100 text-green-700"
            : value === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
            }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: "attachment",
      label: "Action",
      render: (_val: any, row: WalletStatus) => (
        <button
          onClick={() => setSelectedRow(row)}
          className="text-blue-600 underline text-xs font-medium"
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <>
      <AdminHeader />

      {/* 📌 Modal UI */}
      {selectedRow && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-xl relative">

            {/* Close Button (Top Right) */}
            <button
              onClick={() => setSelectedRow(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-green-800 mb-4 underline">
              Wallet Transaction Details
            </h2>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* LEFT SIDE: DETAILS */}
              <div className="space-y-3 text-sm text-gray-700">
                <p><span className="font-semibold">Request Date:</span> {selectedRow.requestDate}</p>
                <p><span className="font-semibold">Request By:</span> {selectedRow.requestBy}</p>
                <p className="flex gap-2 items-center">
                  <span className="font-semibold">Amount:</span>
                  <span className="text-green-700 font-bold">₹{selectedRow.amount}</span>
                </p>
                <p><span className="font-semibold">Ref Transaction ID:</span> {selectedRow.reftransactionId}</p>
                <p className="flex gap-2 items-center">
                  <span className="font-semibold">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold capitalize 
      ${selectedRow.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : selectedRow.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {selectedRow.status}
                  </span>
                </p>
                <p><span className="font-semibold">Description:</span></p>
                <p className="bg-gray-100 p-2 rounded-md text-gray-800 leading-5">
                  {selectedRow.description}
                </p>
              </div>

              {/* RIGHT SIDE: ATTACHMENT */}
              <div className="flex flex-col items-center justify-center">
                {selectedRow.attachment ? (
                  <>
                    <img
                      src={selectedRow.attachment}
                      alt="Payment Proof"
                      className="rounded-md border max-h-64 object-contain shadow"
                    />
                    <a
                      href={selectedRow.attachment}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 text-white bg-green-700 px-4 py-2 rounded-md hover:bg-green-800 text-sm"
                    >
                      View Proof
                    </a>
                  </>
                ) : (
                  <p className="text-gray-500">No attachment provided</p>
                )}
              </div>

            </div>

            {/* Footer Close Button */}
            <div className="mt-6">
              <button
                onClick={() => setSelectedRow(null)}
                className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}


      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-green-800">Wallet Status</h1>
          <p className="text-green-700 text-sm">
            Track your wallet requests and approval statuses.
          </p>

          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
            <DataTable
              columns={columns}
              data={walletData}
              loading={loading}
              page={page}
              totalPages={totalPages}
              entries={entries}
              search={search}
              onSearchChange={setSearch}
              onEntriesChange={(val) => {
                setEntries(val);
                setPage(1);
              }}
              onPrevious={handlePrevious}
              onNext={handleNext}
              emptyMessage="No wallet request records found"
            />
          </div>
        </div>
      </section>
    </>
  );
}
