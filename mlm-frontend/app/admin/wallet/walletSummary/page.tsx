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
      <AdminHeader />
      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* 🟢 Current Wallet Balance Card */}
          <div className="bg-white shadow-md rounded-xl p-4 border border-green-200">
            <p className="text-green-700 font-medium">Current Wallet Balance</p>
            <h2 className="text-3xl font-bold text-green-800">₹{currentBalance.toFixed(2)}</h2>
          </div>

          <h1 className="text-2xl font-bold text-green-800">Wallet Summary</h1>

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
              emptyMessage="No wallet history found"
            />
          </div>
        </div>
      </section>
    </>
  );
}
