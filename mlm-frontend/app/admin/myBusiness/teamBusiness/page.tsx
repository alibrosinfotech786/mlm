"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/common/DataTable";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";
import LevelTeamModal from "./components/LevelTeamModal";

interface TeamMember {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  joined_date: string;
  is_active: number;
  position: string;
  level: number;
  bv_generated: string;
  sponsor_id: string;
}

export default function LevelTeamPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  const [data, setData] = useState<TeamMember[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewItem, setViewItem] = useState<TeamMember | null>(null);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const userId = user?.user_id;

  // Format Date
  const prettyDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // =================== FETCH API ===================
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const url = `${ProjectApiList.TEAM_PERFORMANCE}?user_id=${userId}&page=${page}&per_page=${entries}&search=${search}`;

      const res = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res?.data?.success) {
        setData(res.data.team_members || []);

        const pagination = res.data.pagination;
        setTotalPages(pagination?.last_page || 1);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [page, entries, search]);

  // =================== TABLE COLUMNS ===================
  const columns: Column<TeamMember>[] = [
    {
      key: "joined_date" as any,
      label: "Joined",
      render: (v, row) => prettyDate(row.joined_date),
    },
    {
      key: "level",
      label: "Level",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "bv_generated" as any,
      label: "BV Generated",
      render: (v) => <span className="font-semibold text-green-700">{v}</span>,
    },
    {
      key: "position",
      label: "Position",
      render: (v) => <span className="capitalize">{v}</span>,
    },
    {
      key: "is_active" as any,
      label: "Status",
      render: (v) =>
        v === 1 ? (
          <span className="text-green-600 font-semibold">Active</span>
        ) : (
          <span className="text-red-600 font-semibold">Inactive</span>
        ),
    },
    {
      key: "actions" as any,
      label: "Actions",
      render: (v, row) => (
        <button
          className="text-blue-600 underline text-sm"
          onClick={() => setViewItem(row)}
        >
          View Details
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
          {/* PAGE HEADER */}
          <h1 className="text-2xl font-bold text-green-800">Level Team</h1>
          <p className="text-green-700 text-sm -mt-2">
            View all team members and their level-based BV.
          </p>

          {/* TABLE */}
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
              emptyMessage="No team members found"
            />
          </div> */}

          {/* LEVEL TEAM TABLE */}
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">

            {/* SEARCH + ENTRIES */}
            <div className="p-4 border-b flex justify-between items-center">

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name / position / level"
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
                    <th className="px-4 py-3 border-r">Level</th>
                    <th className="px-4 py-3 border-r">Name</th>
                    <th className="px-4 py-3 border-r">BV Generated</th>
                    <th className="px-4 py-3 border-r">Position</th>
                    <th className="px-4 py-3 border-r">Status</th>
                    <th className="px-4 py-3 border-r">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-6">
                        Loading...
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-gray-500">
                        No team members found
                      </td>
                    </tr>
                  ) : (
                    data.map((row, index) => (
                      <tr key={index} className="border-b hover:bg-green-50 transition">

                        <td className="px-4 py-3 border-r">
                          {prettyDate(row.joined_date)}
                        </td>

                        <td className="px-4 py-3 border-r">{row.level}</td>

                        <td className="px-4 py-3 border-r">{row.name}</td>

                        <td className="px-4 py-3 border-r text-green-700 font-semibold">
                          {row.bv_generated}
                        </td>

                        <td className="px-4 py-3 border-r capitalize">
                          {row.position}
                        </td>

                        <td className="px-4 py-3 border-r">
                          {row.is_active === 1 ? (
                            <span className="text-green-600 font-semibold">Active</span>
                          ) : (
                            <span className="text-red-600 font-semibold">Inactive</span>
                          )}
                        </td>

                        <td className="px-4 py-3 border-r">
                          <button
                            onClick={() => setViewItem(row)}
                            className="text-blue-600 underline text-sm"
                          >
                            View Details
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

                {/* PREVIOUS */}
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

      {/* DETAILS MODAL */}
      <LevelTeamModal item={viewItem} onClose={() => setViewItem(null)} />
    </>
  );
}
