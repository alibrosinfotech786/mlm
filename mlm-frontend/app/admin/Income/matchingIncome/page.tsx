"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp } from "lucide-react";

interface LevelBonusEntry {
  level: number;
  users_count: number;
  min_bv: number | string;
  bonus: number;
  processed: boolean;
  message?: string;
}

interface ReportRow {
  id: number;
  user_id: string;
  total_bonus_credited: string;
  level_bonuses_data: LevelBonusEntry[];
  previous_bv: string;
  message: string;
  new_bv: string;
  status: string;
  created_at: string;
}

export default function LevelBonusReports() {
  const [data, setData] = useState<ReportRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const userId = user?.user_id;

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

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
        `/users/${userId}/level-bonus-reports?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const reports = res.data.reports.data || [];
        setData(reports);
        setTotalPages(res.data.reports.last_page || 1);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load level bonus reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page]);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <>
      {/* <AdminHeader /> */}

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* TITLE */}
          <div>
            <h1 className="text-2xl font-bold text-green-800">
              Matching Level Bonus.
            </h1>
            <p className="text-green-700 text-sm ">
              View your levelwise bonus history.
            </p>
          </div>

          {/* MAIN TABLE */}
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-green-100 text-green-800 text-sm">
                <tr>
                  <th className="p-3">Sr.No</th>
                  <th className="p-3">Created Date</th>
                  <th className="p-3">Previous BV</th>
                  <th className="p-3">New BV</th>
                  <th className="p-3">Total Bonus</th>
                  <th className="p-3">Status</th>
                  <th className="p-3"></th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-green-700">
                      Loading...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      No records found
                    </td>
                  </tr>
                ) : (
                  data.map((row, idx) => (
                    <React.Fragment key={row.id}>
                      {/* MAIN ROW */}
                      <tr
                        className="border-b hover:bg-green-50 cursor-pointer"
                        onClick={() => toggleRow(row.id)}
                      >
                        <td className="p-3">
                          {(page - 1) * 10 + idx + 1}
                        </td>
                        <td className="p-3">{formatDate(row.created_at)}</td>
                        <td className="p-3">{row.previous_bv}</td>
                        <td className="p-3">{row.new_bv}</td>
                        <td className="p-3 font-semibold text-green-700">
                          {row.total_bonus_credited}
                        </td>
                        <td className="p-3 capitalize">{row.status}</td>
                        <td className="p-3">
                          {expandedRows.includes(row.id) ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </td>
                      </tr>

                      {/* EXPANDED ROW */}
                      {expandedRows.includes(row.id) && (
                        <tr className="bg-green-50">
                          <td colSpan={7} className="p-4">
                            <div className="p-4 bg-white border border-green-200 rounded-lg shadow-sm">
                              <h3 className="text-green-800 font-semibold mb-3">
                                Level Bonus Details
                              </h3>

                              <table className="w-full text-sm border">
                                <thead className="bg-green-100 text-green-800">
                                  <tr>
                                    <th className="p-2">Level</th>
                                    <th className="p-2">Users</th>
                                    <th className="p-2">Min BV</th>
                                    <th className="p-2">Bonus</th>
                                    <th className="p-2">Status</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {row.level_bonuses_data.map(
                                    (lvl, i) => (
                                      <tr
                                        key={i}
                                        className="border-b align-top"
                                      >
                                        <td className="p-2">{lvl.level}</td>
                                        <td className="p-2">
                                          {lvl.users_count}
                                        </td>
                                        <td className="p-2">{lvl.min_bv}</td>
                                        <td className="p-2">{lvl.bonus}</td>

                                        <td className="p-2">
                                          {lvl.processed ? (
                                            <span className="text-green-700 font-semibold">
                                              Completed
                                            </span>
                                          ) : (
                                            <div className="flex flex-col">
                                              <span className="text-red-500 font-semibold">
                                                Not Completed
                                              </span>

                                              {lvl.message && (
                                                <span className="text-xs text-gray-600 mt-1 italic">
                                                  {lvl.message}
                                                </span>
                                              )}
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between py-4">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-4 py-2 bg-green-700 disabled:opacity-50 text-white rounded-lg"
            >
              Previous
            </button>

            <span className="text-green-800 font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="px-4 py-2 bg-green-700 disabled:opacity-50 text-white rounded-lg"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
