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
      <AdminHeader />

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* PAGE HEADER */}
          <h1 className="text-2xl font-bold text-green-800">Level Team</h1>
          <p className="text-green-700 text-sm -mt-2">
            View all team members and their level-based BV.
          </p>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
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
          </div>
        </div>
      </section>

      {/* DETAILS MODAL */}
      <LevelTeamModal item={viewItem} onClose={() => setViewItem(null)} />
    </>
  );
}
