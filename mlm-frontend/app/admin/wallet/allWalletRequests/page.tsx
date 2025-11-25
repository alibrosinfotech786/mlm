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
      <AdminHeader />
      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-green-800">All Wallet Requests</h1>
          <p className="text-green-700 text-sm">
            Track wallet requests and approve/reject them here.
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
