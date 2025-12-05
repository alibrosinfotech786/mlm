"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/common/DataTable";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

interface WalletSummary {
  tranDate: string;
  transactionId: string;
  description: string;
  cr: number;
  dr: number;
  balance: number;
}

export default function WalletSummaryPage() {
  const [walletData, setWalletData] = useState<WalletSummary[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0); // ⬅ NEW STATE
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchWalletHistory = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user?.user_id) return;

    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `${ProjectApiList.WALLET_TRANSACTION_SUMMARY}?user_id=${user.user_id}&page=${page}&per_page=${entries}&search=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        const histories = res.data.wallet_histories;

        // 🧮 Set Current Balance from latest transaction
        if (histories.data.length > 0) {
          setCurrentBalance(Number(histories.data[0].new_balance));
        }

        const formatted = histories.data.map((item: any) => {
          const isCredit = item.type === "credit";
          return {
            tranDate: item.created_at?.split("T")[0] ?? "-",
            transactionId: item.transaction_id ?? "-",
            description: item.reason.replace(/_/g, " "),
            cr: isCredit ? Number(item.amount_change) : 0,
            dr: !isCredit ? Math.abs(Number(item.amount_change)) : 0,
            balance: Number(item.new_balance),
          };
        });

        setWalletData(formatted);
        setTotalPages(histories.last_page || 1);
        setPage(histories.current_page || 1);
      }
    } catch (error) {
      console.error("Wallet History Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchWalletHistory();
    }, 300);
    return () => clearTimeout(debounce);
  }, [search, page, entries]);

  const handlePrevious = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  const columns: Column<WalletSummary>[] = [
    { key: "tranDate", label: "Tran Date" },
    { key: "transactionId", label: "Transaction ID" },
    { key: "description", label: "Description" },
    {
      key: "cr",
      label: "CR (₹)",
      render: (value: number) =>
        value > 0 ? (
          <span className="text-green-600 font-semibold">₹{value}</span>
        ) : (
          "-"
        ),
    },
    {
      key: "dr",
      label: "DR (₹)",
      render: (value: number) =>
        value > 0 ? (
          <span className="text-red-600 font-semibold">₹{value}</span>
        ) : (
          "-"
        ),
    },
    {
      key: "balance",
      label: "Balance (₹)",
      render: (value: number) => (
        <span className="text-blue-600 font-bold">₹{value}</span>
      ),
    },
  ];

  return (
    <>
      {/* <AdminHeader /> */}
      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* 🟢 Current Wallet Balance Card */}
          <div className="bg-white shadow-md rounded-xl p-4 border border-green-200">
            <p className="text-green-700 font-medium">Current Wallet Balance</p>
            <h2 className="text-3xl font-bold text-green-800">₹{currentBalance.toFixed(2)}</h2>
          </div>

          <h1 className="text-2xl font-bold text-green-800">Wallet Summary</h1>

          {/* <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
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
              emptyMessage="No wallet history found"
            />
          </div> */}

          {/* WALLET SUMMARY TABLE */}
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">

            {/* SEARCH + ENTRIES */}
            <div className="p-4 border-b flex justify-between items-center">

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search transaction or description..."
                className="border px-3 py-2 rounded-md w-72 text-sm"
              />

              <div className="flex items-center gap-2 text-sm">
                <span>Show</span>
                <select
                  value={entries}
                  onChange={(e) => {
                    setEntries(Number(e.target.value));
                    setPage(1);
                  }}
                  className="border rounded px-2 py-1"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
                <span>entries</span>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-green-600 text-white uppercase text-xs tracking-wide sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 border-r">Tran Date</th>
                    <th className="px-4 py-3 border-r">Transaction ID</th>
                    <th className="px-4 py-3 border-r">Description</th>
                    <th className="px-4 py-3 border-r">CR (₹)</th>
                    <th className="px-4 py-3 border-r">DR (₹)</th>
                    <th className="px-4 py-3">Balance (₹)</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6">Loading...</td>
                    </tr>
                  ) : walletData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-gray-500">
                        No wallet history found
                      </td>
                    </tr>
                  ) : (
                    walletData.map((row, index) => (
                      <tr key={index} className="border-b hover:bg-green-50">

                        <td className="px-4 py-3 border-r">{row.tranDate}</td>

                        <td className="px-4 py-3 border-r">{row.transactionId}</td>

                        <td className="px-4 py-3 border-r capitalize">{row.description}</td>

                        <td className="px-4 py-3 border-r">
                          {row.cr > 0 ? (
                            <span className="text-green-600 font-semibold">
                              ₹{row.cr}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td className="px-4 py-3 border-r">
                          {row.dr > 0 ? (
                            <span className="text-red-600 font-semibold">
                              ₹{row.dr}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td className="px-4 py-3 text-blue-600 font-bold">
                          ₹{row.balance}
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t gap-4">

              <div className="flex items-center gap-2">
                {/* Prev */}
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className={`px-3 py-1 border rounded text-sm ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-green-100"
                    }`}
                >
                  Prev
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-3 py-1 border rounded text-sm ${num === page
                        ? "bg-green-600 text-white border-green-600"
                        : "hover:bg-green-100"
                      }`}
                  >
                    {num}
                  </button>
                ))}

                {/* Next */}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className={`px-3 py-1 border rounded text-sm ${page === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-100"
                    }`}
                >
                  Next
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>
    </>
  );
}
