"use client";

import React, { useEffect, useState } from "react";
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

// Row type for DataTable display
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
  const [userId, setUserId] = useState<string | null>(null);

  // Get user_id from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setUserId(parsed.user_id);
    }
  }, []);

  // Fetch BV History (Paginated from API)
  const fetchBvHistory = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `${ProjectApiList.api_getBVHistoryofUser}?user_id=${userId}&page=${page}`
      );
      const histories = res?.data?.histories;
      setData(histories?.data || []);
      setTotalPages(histories?.last_page || 1);
    } catch (err) {
      console.log("BV History Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBvHistory();
  }, [page, userId]);

  // Build Table columns (with text colored via render)
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

  // Convert API Data → Table Rows
  const mappedData: TableRow[] = data.map((item) => {
    const crAmount = item.type === "credit" ? parseFloat(item.bv_change) : 0;
    const drAmount = item.type === "debit" ? Math.abs(parseFloat(item.bv_change)) : 0;

    return {
      tranDate: new Date(item.created_at).toLocaleDateString(),
      description: `${item.reason.replace("_", " ")} (Ref: ${item.reference_id})`,
      cr: crAmount > 0 ? `+${crAmount} BV` : "-",
      dr: drAmount > 0 ? `-${drAmount} BV` : "-",
      balance: `${parseFloat(item.new_bv)} BV`,
    };
  });

  // Filtered Search Results
  const filteredData = mappedData.filter(
    (row) =>
      row.description.toLowerCase().includes(search.toLowerCase()) ||
      row.tranDate.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Controls
  const handlePrevious = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  // Totals (Based on raw BV history)
  const totalCR = data.reduce(
    (sum, item) =>
      item.type === "credit" ? sum + parseFloat(item.bv_change) : sum,
    0
  );

  const totalDR = data.reduce(
    (sum, item) =>
      item.type === "debit" ? sum + Math.abs(parseFloat(item.bv_change)) : sum,
    0
  );

  const finalBalance = data.length ? parseFloat(data[0].new_bv) : 0;

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header + Totals Top Right */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-green-800">BV Summary</h1>
              <p className="text-green-700 text-sm">
                View your earned and deducted BV history.
              </p>
            </div>

            {/* Totals UI */}
            <div className="bg-white border border-green-100 rounded-lg shadow p-3 flex flex-col sm:flex-row items-end gap-4 text-sm">
              <p>
                Total Credit:{" "}
                <span className="text-green-600 font-semibold">
                  +{totalCR} BV
                </span>
              </p>
              <p>
                Total Debit:{" "}
                <span className="text-red-600 font-semibold">
                  -{totalDR} BV
                </span>
              </p>
              <p>
                Final BV:{" "}
                <span className="text-blue-700 font-semibold">
                  {finalBalance} BV
                </span>
              </p>
            </div>
          </div>

          {/* Table */}
          <DataTable<TableRow>
            columns={columns}
            data={filteredData}
            loading={loading}
            page={page}
            totalPages={totalPages}
            entries={entries}
            search={search}
            onSearchChange={setSearch}
            onEntriesChange={setEntries}
            onPrevious={handlePrevious}
            onNext={handleNext}
            emptyMessage="No BV history found"
          />
        </div>
      </section>
    </>
  );
}
