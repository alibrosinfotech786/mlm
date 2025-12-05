"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/common/DataTable";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";
import ReferralDetailsModal from "./components/BonusDetailsModal";

interface BonusUser {
  user_id: string;
  name: string;
  phone: string;
  joined_date: string;
  // current_bv: string;
  position: string;
  bonus_received: string;
  bonus_count: number;
  last_bonus_date: string;
  bonus_history: {
    amount: string;
    date: string;
  }[];
}

export default function BonusReceivedPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  const [data, setData] = useState<BonusUser[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewItem, setViewItem] = useState<BonusUser | null>(null);

  const [totalBonus, setTotalBonus] = useState(0);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const userId = user?.user_id;

  const formatPrettyDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =================== FETCH API ===================
  const fetchBonusData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axiosInstance.get(
        `${ProjectApiList.BONUS_RECEIVED}?user_id=${userId}&page=${page}&per_page=${entries}&search=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res?.data?.success) {
        setData(res.data.bonus_received || []);

        const p = res.data.pagination;
        setTotalPages(p?.last_page || 1);

        setTotalBonus(res?.data?.total_bonus_received || 0);
      } else {
        toast.error("Failed to load bonus data");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonusData();
  }, [page, entries, search]);

  // =================== TABLE COLUMNS ===================
  const columns: Column<BonusUser>[] = [
    {
      key: "joined_date" as any,
      label: "Joined",
      render: (v, row) => formatPrettyDate(row.joined_date),
    },
    { key: "name" as any, label: "Name" },
    {
      key: "bonus_received" as any,
      label: "Bonus Received",
      render: (v, row) => (
        <span className="font-semibold text-green-700">{row.bonus_received} BV</span>
      ),
    },
    {
      key: "position" as any,
      label: "Position",
      render: (v, row) => <span className="capitalize">{row.position}</span>,
    },
    {
      key: "actions" as any,
      label: "Actions",
      render: (v, row) => (
        <button
          className="text-blue-600 underline text-sm"
          onClick={() => setViewItem(row)}
        >
          View Bonus History
        </button>
      ),
    },
  ];

  // =================== PAGINATION ===================
  const handlePrevious = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <>
      {/* <AdminHeader /> */}

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ======= HEADER ROW ======= */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-green-800">
                Direct Business
              </h1>
              <p className="text-green-700 text-sm -mt-1">
                Track bonuses received from referrals.
              </p>
            </div>

            <div className="bg-white border border-green-200 shadow-sm rounded-lg px-5 py-3 text-green-800 font-medium text-sm">
              Total Bonus:
              <span className="ml-2 text-green-700 font-bold">{totalBonus} BV</span>
            </div>
          </div>

          {/* ======= DATA TABLE ======= */}
          {/* <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
            <DataTable
              columns={columns}
              data={data}
              loading={loading}
              page={page}
              totalPages={totalPages}
              entries={entries}
              search={search}
              onSearchChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
              onEntriesChange={(val) => {
                setEntries(val);
                setPage(1);
              }}
              onPrevious={handlePrevious}
              onNext={handleNext}
              emptyMessage="No bonus records found"
            />
          </div> */}

          {/* BONUS RECEIVED TABLE */}
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">

            {/* SEARCH + ENTRIES */}
            <div className="p-4 border-b flex justify-between items-center">

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name / position"
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
                    <th className="px-4 py-3 border-r">Joined</th>
                    <th className="px-4 py-3 border-r">Name</th>
                    <th className="px-4 py-3 border-r">Bonus Received</th>
                    <th className="px-4 py-3 border-r">Position</th>
                    <th className="px-4 py-3 border-r">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6">
                        Loading...
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-500">
                        No bonus records found
                      </td>
                    </tr>
                  ) : (
                    data.map((row, index) => (
                      <tr key={index} className="border-b hover:bg-green-50 transition">

                        {/* Joined Date */}
                        <td className="px-4 py-3 border-r">
                          {formatPrettyDate(row.joined_date)}
                        </td>

                        {/* Name */}
                        <td className="px-4 py-3 border-r">{row.name}</td>

                        {/* Bonus Received */}
                        <td className="px-4 py-3 border-r text-green-700 font-semibold">
                          {row.bonus_received} BV
                        </td>

                        {/* Position */}
                        <td className="px-4 py-3 border-r capitalize">{row.position}</td>

                        {/* Actions */}
                        <td className="px-4 py-3 border-r">
                          <button
                            className="text-blue-600 underline text-sm"
                            onClick={() => setViewItem(row)}
                          >
                            View Bonus History
                          </button>
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

                {/* PREV */}
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className={`px-3 py-1 border rounded text-sm ${page === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-100"
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

                {/* NEXT */}
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

      {/* MODAL */}
      <ReferralDetailsModal item={viewItem} onClose={() => setViewItem(null)} />
    </>
  );
}
