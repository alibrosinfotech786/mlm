"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/common/DataTable";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";

interface BusinessSummary {
  date: string;
  left_team_bv: string;
  right_team_bv: string;
}

export default function BusinessSummaryPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  const [data, setData] = useState<BusinessSummary[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState<any>({});

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const userId = user?.user_id;

  // Format Date to DD MMM YYYY
  const formatPrettyDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // ======================= FETCH API =======================
  const fetchSummary = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const url = `${ProjectApiList.BINARY_TEAM_BV}?user_id=${userId}&page=${page}&per_page=${entries}${fromDate ? `&from_date=${fromDate}` : ""
        }${toDate ? `&to_date=${toDate}` : ""}${search ? `&search=${search}` : ""}`;

      const res = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res?.data?.success) {
        setData(res.data.date_wise_bv || []);
        setSummary(res.data.summary || {});

        const p = res.data.pagination;
        setTotalPages(p?.last_page || 1);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load business summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [page, entries, search]);

  const handleSubmit = () => {
    setPage(1);
    fetchSummary();
  };

  // ======================= COLUMNS =======================
  const columns: Column<BusinessSummary>[] = [
    {
      key: "date",
      label: "Business Date",
      render: (v, row) => formatPrettyDate(row.date),
    },
    {
      key: "left_team_bv",
      label: "Left BV",
      render: (v, row) => (
        <span className="font-semibold text-green-700">{row.left_team_bv} BV</span>
      ),
    },
    {
      key: "right_team_bv",
      label: "Right BV",
      render: (v, row) => (
        <span className="font-semibold text-green-700">{row.right_team_bv} BV</span>
      ),
    },
  ];

  // ======================= PAGINATION =======================
  const handlePrevious = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <>
      {/* <AdminHeader /> */}

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* PAGE HEADER */}
          <div>
            <h1 className="text-2xl font-bold text-green-800">
              Business Summary
            </h1>
            <p className="text-green-700 text-sm">
              View your daily business performance based on Left / Right BV.
            </p>
          </div>

          {/* FILTER BOX */}
          <div className="bg-white shadow-md rounded-xl border border-green-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3 items-end">

              <div className="flex flex-col">
                <label className="text-sm font-medium text-green-800 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border border-green-300 rounded-md px-3 py-1.5 text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-green-800 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border border-green-300 rounded-md px-3 py-1.5 text-sm"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="bg-green-700 text-white px-6 py-2 rounded-md font-medium hover:bg-green-800 transition"
              >
                Submit
              </button>
            </div>
          </div>

          {/* SUMMARY BOX */}
          <div className="bg-white border border-green-100 shadow-sm rounded-lg p-5 flex flex-wrap gap-6 text-green-800 font-semibold text-base">
            <p>
              Left BV:{" "}
              <span className="text-green-700">{summary.total_left_bv}</span>
            </p>
            <p>
              Right BV:{" "}
              <span className="text-green-700">{summary.total_right_bv}</span>
            </p>
          </div>

          {/* ================= TABLE ================= */}
          {/* <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
            <DataTable
              columns={columns}
              data={data}
              loading={loading}
              page={page}
              totalPages={totalPages}
              entries={entries}
              search={search}
              onSearchChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              onEntriesChange={(v) => {
                setEntries(v);
                setPage(1);
              }}
              onPrevious={handlePrevious}
              onNext={handleNext}
              emptyMessage="No business records found"
            />
          </div> */}

          {/* BUSINESS SUMMARY TABLE */}
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">

            {/* SEARCH + ENTRIES */}
            <div className="p-4 border-b flex justify-between items-center">

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by date (DD/MM/YYYY)"
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
                    <th className="px-4 py-3 border-r">Business Date</th>
                    <th className="px-4 py-3 border-r">Left BV</th>
                    <th className="px-4 py-3 border-r">Right BV</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="text-center py-6">
                        Loading...
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-gray-500">
                        No business records found
                      </td>
                    </tr>
                  ) : (
                    data.map((row, index) => (
                      <tr key={index} className="border-b hover:bg-green-50 transition">
                        <td className="px-4 py-3 border-r">
                          {formatPrettyDate(row.date)}
                        </td>

                        <td className="px-4 py-3 border-r text-green-700 font-semibold">
                          {row.left_team_bv} BV
                        </td>

                        <td className="px-4 py-3 border-r text-green-700 font-semibold">
                          {row.right_team_bv} BV
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

                {/* PREV BUTTON */}
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className={`px-3 py-1 border rounded text-sm ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-green-100"
                    }`}
                >
                  Prev
                </button>

                {/* PAGE NUMBERS */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-3 py-1 border rounded text-sm ${page === num
                        ? "bg-green-600 text-white border-green-600"
                        : "hover:bg-green-100"
                      }`}
                  >
                    {num}
                  </button>
                ))}

                {/* NEXT BUTTON */}
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
