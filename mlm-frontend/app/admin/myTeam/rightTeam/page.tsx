"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/common/DataTable";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

export default function RightTeamPage() {
  const [teamData, setTeamData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchTeam = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user?.user_id) return;

    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `${ProjectApiList.MLM_HIERARCHY_LIST}?user_id=${user.user_id}&side=right&page=${page}&per_page=${entries}&search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const pagination = res.data.pagination;

        const formattedData = res.data.downlines.map((item: any) => ({
          regDate: item.created_at?.split("T")[0] || "-",
          userId: item.user_id || "-",
          name: item.name || "-",
          phone: item.phone || "-",
          sponsorUserId: item.sponsor_id || "-",
          placement: item.position || "-",
          bv: Number(item.bv) || 0,
        }));

        setTeamData(formattedData);
        setTotalPages(pagination?.last_page || 1);
        setPage(pagination?.current_page || 1);
      }
    } catch (error) {
      console.error("Left Team Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [page, entries, search]); // update on search

  const handlePrevious = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  const columns = [
      {
    key: "sno",
    label: "S.No",
    render: (_: any, __: any, index: number) => {
      return (page - 1) * entries + index + 1;
    },
  },
    { key: "regDate", label: "Reg. Date" },
    { key: "userId", label: "User ID" },
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "sponsorUserId", label: "Sponsor ID" },
    // { key: "placement", label: "Placement" },
    { key: "bv", label: "BV" },
  ];

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">

          <h1 className="text-2xl font-bold text-green-800">Right Team</h1>

          <div className="bg-white rounded-b-xl shadow-md border border-green-100 overflow-hidden">
            <DataTable
              columns={columns}
              data={teamData}
              loading={loading}
              page={page}
              totalPages={totalPages}
              entries={entries}
              search={search}
              onSearchChange={setSearch}
              onEntriesChange={(val) => {
                setEntries(val);
                setPage(1); // reset to first page on entries change
              }}
              onPrevious={handlePrevious}
              onNext={handleNext}
              emptyMessage="No Left Team members found"
            />
          </div>

        </div>
      </section>
    </>
  );
}

