"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import toast from "react-hot-toast";

export default function TeamPerformanceBonusPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const userId = user?.user_id;

  const formatDate = (dt: string) =>
    new Date(dt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const fetchReports = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(
        `/users/team-performance-bonuses?user_id=${userId}&side=left&per_page=10&page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const report = res.data.team_performance_bonuses;

        const rows = report.data.map((item: any) => ({
          date: formatDate(item.created_at),

          left_bv: item.left_current_bv,
          right_bv: item.right_current_bv,
          matching_bv: item.matching_bv,

          bonus_percentage: item.bonus_percentage + "%",
          bonus_amount: item.bonus_amount,

          // PREV CF
          prev_left_cf: item.previous_left_carry_forward ?? "-",
          prev_right_cf: item.previous_right_carry_forward ?? "-",

          // NEW CF
          new_left_cf: item.new_left_carry_forward ?? "-",
          new_right_cf: item.new_right_carry_forward ?? "-",

          // TOTAL BV
          total_left_bv: item.left_total_bv ?? "-",
          total_right_bv: item.right_total_bv ?? "-",

          // TEAM COUNTS
          left_team_count: item.left_team_count ?? "-",
          right_team_count: item.right_team_count ?? "-",

          // WALLET UPDATE
          previous_wallet: item.previous_wallet_balance ?? "-",
          new_wallet: item.new_wallet_balance ?? "-",

          status: item.status,
        }));


        setEvents(rows);
        setTotalPages(report.last_page || 1);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load team performance bonuses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page]);

  const columns = [
    { key: "srno", label: "S.No", render: (_: any, __: any, i: number) => (page - 1) * 10 + i + 1 },
    { key: "date", label: "Date" },

    { key: "left_bv", label: "Left BV" },
    { key: "right_bv", label: "Right BV" },

    { key: "matching_bv", label: "Matching BV" },
    { key: "bonus_percentage", label: "Bonus %" },
    { key: "bonus_amount", label: "Bonus Amount" },

    // 🔥 PREVIOUS CF SPLIT
    { key: "prev_left_cf", label: "Prev Left CF" },
    { key: "prev_right_cf", label: "Prev Right CF" },

    // 🔥 NEW CF SPLIT
    { key: "new_left_cf", label: "New Left CF" },
    { key: "new_right_cf", label: "New Right CF" },

    // 🔥 TOTAL BV
    { key: "total_left_bv", label: "Total Left BV" },
    { key: "total_right_bv", label: "Total Right BV" },

    // 🔥 TEAM COUNT SPLIT
    { key: "left_team_count", label: "Left Team Count" },
    { key: "right_team_count", label: "Right Team Count" },

    // 🔥 WALLET SPLIT
    { key: "previous_wallet", label: "Previous Wallet" },
    { key: "new_wallet", label: "New Wallet" },

    { key: "status", label: "Status" },
  ];

  return (
    <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-green-800">
          Team Performance Bonus (Matching Income Report)
        </h1>
        <p className="text-green-700 text-sm">
          View full bonus calculations and BV reports.
        </p>

        <div className="w-full overflow-x-auto rounded-lg border border-green-200 shadow-sm">

          <table className="table-fixed text-sm min-w-[1600px]">
            {/* 👆 Table itself forced to wide width */}

            <thead className="bg-green-600 text-white uppercase text-xs tracking-wide sticky top-0 z-10">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 border-r font-semibold whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-6 text-gray-600">
                    Loading...
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-6 text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                events.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-green-50 border-b">
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-3 border-r whitespace-nowrap"
                      >
                        {col.render
                          ? col.render(row[col.key], row, rowIndex)
                          : row[col.key] ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>

          </table>

        </div>



        {/* PAGINATION */}
        <div className="px-4 flex justify-between items-center">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded">
            Prev
          </button>

          <span className="text-sm">Page {page} of {totalPages}</span>

          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded">
            Next
          </button>
        </div>

      </div>
    </section>
  );
}
