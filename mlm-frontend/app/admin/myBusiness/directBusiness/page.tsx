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
      <AdminHeader />

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
              emptyMessage="No bonus records found"
            />
          </div>

        </div>
      </section>

      {/* MODAL */}
      <ReferralDetailsModal item={viewItem} onClose={() => setViewItem(null)} />
    </>
  );
}
