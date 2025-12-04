"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/common/DataTable";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

interface BvHistory {
  id: number;
  created_at: string;
  reason: string;
  type: "credit" | "debit";
  bv_change: string;
  new_bv: string;
  reference_id: string;
}

interface TableRow {
  tranDate: string;
  description: string;
  cr: string;
  dr: string;
  balance: string;
}

export default function BvSummary() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  const [data, setData] = useState<BvHistory[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentBV, setCurrentBV] = useState(0);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setUserId(parsed.user_id);
    }
  }, []);

  // Fetch BV history (with pagination)
  const fetchBvHistory = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `${ProjectApiList.api_getBVHistoryofUser}?user_id=${userId}&per_page=${entries}&page=${page}`
      );

      const histories = res?.data?.histories;
      const result = histories?.data || [];

      setData(result);
      setTotalPages(histories?.last_page || 1);

      // Set latest BV
      if (result.length > 0) {
        setCurrentBV(res?.data?.total_bv);
      }
    } catch (err) {
      console.log("BV History Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchBvHistory();
  }, [page, entries, userId]);

  const columns: Column<TableRow>[] = [
    { key: "tranDate", label: "Tran Date" },
    { key: "description", label: "Description" },
    {
      key: "cr",
      label: "CR (BV)",
      render: (value) =>
        value !== "-" ? (
          <span className="text-green-600 font-semibold">{value}</span>
        ) : (
          "-"
        ),
    },
    {
      key: "dr",
      label: "DR (BV)",
      render: (value) =>
        value !== "-" ? (
          <span className="text-red-600 font-semibold">{value}</span>
        ) : (
          "-"
        ),
    },
    {
      key: "balance",
      label: "Available BV",
      render: (value) => (
        <span className="text-blue-700 font-semibold">{value}</span>
      ),
    },
  ];

  // Convert API → Table
  const mappedData: TableRow[] = data.map((item) => {
    const crAmount = item.type === "credit" ? parseFloat(item.bv_change) : 0;
    const drAmount = item.type === "debit" ? Math.abs(parseFloat(item.bv_change)) : 0;

    return {
      tranDate: new Date(item.created_at).toLocaleDateString(),
      description: `${item.reason.replace(/_/g, " ")} (Ref: ${item.reference_id})`,
      cr: crAmount ? `+${crAmount} BV` : "-",
      dr: drAmount ? `-${drAmount} BV` : "-",
      balance: `${parseFloat(item.new_bv)} BV`,
    };
  });

  // Search filter
  const filteredData = mappedData.filter(
    (row) =>
      row.description.toLowerCase().includes(search.toLowerCase()) ||
      row.tranDate.toLowerCase().includes(search.toLowerCase())
  );

  const handlePrevious = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Current BV Card */}
          <div className="bg-white shadow-md rounded-xl p-4 border border-green-200">
            <p className="text-green-700 font-medium">Current BV</p>
            <h2 className="text-3xl font-bold text-green-800">{currentBV} BV</h2>
          </div>

          <h1 className="text-2xl font-bold text-green-800">BV Summary</h1>

          <DataTable<TableRow>
            columns={columns}
            data={filteredData}
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
            emptyMessage="No BV history found"
          />
        </div>
      </section>
    </>
  );
}
