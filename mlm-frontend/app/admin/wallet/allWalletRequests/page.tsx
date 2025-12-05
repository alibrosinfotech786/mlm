"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/common/DataTable";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

interface WalletStatus {
  id: number;
  requestDate: string;
  requestBy: string;
  requestTo: string;
  amount: number;
  transactionId: string;
  description: string;
  attachment: string | null;
  status: string;
}

export default function AllWalletRequests() {
  const [walletData, setWalletData] = useState<WalletStatus[]>([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

  const fetchWalletStatus = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `${ProjectApiList.WALLET_TRANSACTION_LIST}?page=${page}&per_page=${entries}&search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const transactions = res.data.transactions;

        const formatted = transactions.data.map((item: any) => ({
          id: item.id,
          requestDate: item.created_at?.split("T")[0] ?? "-",
          requestBy: item.user?.name ?? "-",
          requestTo: "Admin",
          amount: Number(item.deposit_amount) || 0,
          transactionId: item.auto_transaction_id ?? "-",
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

  const updateStatus = async (
    id: number,
    status: "approved" | "rejected" | "pending"
  ) => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      await axiosInstance.post(
        ProjectApiList.WALLET_TRANSACTION_APPROVE,
        { id, status }, // <-- REMOVE JSON.stringify
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh the list after update
      fetchWalletStatus();
    } catch (error) {
      console.error("Update Status Error:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchWalletStatus();
    }, 400);

    return () => clearTimeout(debounce);
  }, [page, entries, search]);

  const handlePrevious = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  // ⭐ Updated Badge Dropdown Column
  const columns: Column<WalletStatus>[] = [
    { key: "requestDate", label: "Request Date" },
    { key: "requestBy", label: "Request By" },
    { key: "requestTo", label: "Request To" },
    { key: "amount", label: "Amount (₹)" },
    { key: "transactionId", label: "Transaction ID" },
    {
      key: "description",
      label: "Description",
      render: (value: string) => (
        <p className="max-w-[120px] truncate text-gray-700" title={value}>
          {value}
        </p>
      ),
    },
    {
      key: "attachment",
      label: "Attachment",
      render: (value: string | null) =>
        value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 hover:underline font-medium"
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
      render: (value: string, row: WalletStatus) => {
        // Status-based styling
        const statusStyles: Record<string, string> = {
          approved:
            "bg-green-100 text-green-700 border border-green-400 font-semibold",
          pending:
            "bg-yellow-100 text-yellow-700 border border-yellow-400 font-semibold",
          rejected:
            "bg-red-100 text-red-700 border border-red-400 font-semibold",
        };

        return (
          <select
            value={value.toLowerCase()}
            disabled={loading}
            onChange={(e) =>
              updateStatus(
                row.id,
                e.target.value as "approved" | "rejected" | "pending"
              )
            }
            className={`rounded-md px-2 py-1 text-xs cursor-pointer focus:ring-2 focus:ring-green-600 disabled:opacity-50 
          ${statusStyles[value.toLowerCase()] || ""}`}
          >
            <option value="approved" className="text-green-700">
              Approved
            </option>
            <option value="pending" className="text-yellow-700">
              Pending
            </option>
            <option value="rejected" className="text-red-700">
              Rejected
            </option>
          </select>
        );
      },
    },


  ];

  return (
    <>
      {/* <AdminHeader /> */}
      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-green-800">All Wallet Requests</h1>
          <p className="text-green-700 text-sm">
            Track wallet requests and approve/reject them here.
          </p>

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
              emptyMessage="No wallet request records found"
            />
          </div> */}

          {/* WALLET REQUESTS TABLE */}
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">

            {/* SEARCH + ENTRIES */}
            <div className="p-4 border-b flex justify-between items-center">

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by user / transaction ID"
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
                    <th className="px-4 py-3 border-r">Request Date</th>
                    <th className="px-4 py-3 border-r">Request By</th>
                    <th className="px-4 py-3 border-r">Request To</th>
                    <th className="px-4 py-3 border-r">Amount (₹)</th>
                    <th className="px-4 py-3 border-r">Transaction ID</th>
                    <th className="px-4 py-3 border-r">Description</th>
                    <th className="px-4 py-3 border-r">Attachment</th>
                    <th className="px-4 py-3 border-r">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-6">
                        Loading...
                      </td>
                    </tr>
                  ) : walletData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-6 text-gray-500">
                        No wallet request records found
                      </td>
                    </tr>
                  ) : (
                    walletData.map((row, index) => (
                      <tr key={index} className="border-b hover:bg-green-50 transition">

                        <td className="px-4 py-3 border-r">{row.requestDate}</td>

                        <td className="px-4 py-3 border-r">{row.requestBy}</td>

                        <td className="px-4 py-3 border-r">{row.requestTo}</td>

                        <td className="px-4 py-3 border-r font-semibold text-green-700">
                          ₹{row.amount}
                        </td>

                        <td className="px-4 py-3 border-r">{row.transactionId}</td>

                        <td className="px-4 py-3 border-r max-w-[150px] truncate" title={row.description}>
                          {row.description}
                        </td>

                        {/* ATTACHMENT */}
                        <td className="px-4 py-3 border-r">
                          {row.attachment ? (
                            <a
                              href={row.attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-700 hover:underline font-medium"
                            >
                              View
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* STATUS DROPDOWN */}
                        <td className="px-4 py-3 border-r">
                          <select
                            value={row.status.toLowerCase()}
                            onChange={(e) =>
                              updateStatus(
                                row.id,
                                e.target.value as "approved" | "pending" | "rejected"
                              )
                            }
                            disabled={loading}
                            className={`rounded-md px-2 py-1 text-xs cursor-pointer focus:ring-2 focus:ring-green-600 
                  ${row.status.toLowerCase() === "approved"
                                ? "bg-green-100 text-green-700 border border-green-400"
                                : row.status.toLowerCase() === "pending"
                                  ? "bg-yellow-100 text-yellow-700 border border-yellow-400"
                                  : "bg-red-100 text-red-700 border border-red-400"
                              }`}
                          >
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t gap-4">

              {/* Pagination Controls */}
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
