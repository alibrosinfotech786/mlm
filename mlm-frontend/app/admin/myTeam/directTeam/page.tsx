"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/common/DataTable";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

export default function DirectTeamPage() {
  const [teamData, setTeamData] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");
  const [entries, setEntries] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDirectTeam = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user?.user_id) return;

    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `${ProjectApiList.SPONSORED_USERS}?user_id=${user.user_id}&page=${page}&per_page=${entries}&search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const sponsored = res.data.sponsored_users;
        const formatted = sponsored.data.map((item: any) => ({
          regDate: item.created_at?.split("T")[0] || "-",
          userId: item.user_id || "-",
          name: item.name || "-",
          mobile: item.phone || "-",
          placement: item.position || "-",
          activationDate: item.created_at?.split("T")[0] || "-",
          bv: Number(item.bv) || 0,
          cbp: Number(item.wallet_balance) || 0,
        }));

        setTeamData(formatted);
        setTotalPages(sponsored.last_page || 1);
        setPage(sponsored.current_page || 1);
      }
    } catch (error) {
      console.error("Direct Team Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchDirectTeam();
    }, 350);

    return () => clearTimeout(debounceFetch);
  }, [search, page, entries]);

  const handlePrevious = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  const columns = [
    { key: "regDate", label: "Reg. Date" },
    { key: "userId", label: "User ID" },
    { key: "name", label: "Name" },
    { key: "mobile", label: "Mobile No." },
    { key: "placement", label: "Placement" },
    { key: "activationDate", label: "Activation Date" },
    { key: "bv", label: "BV" },
  ];

  return (
    <>
      {/* <AdminHeader /> */}

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">

          <h1 className="text-2xl font-bold text-green-800">Direct Team</h1>

          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
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
                setPage(1);
              }}
              onPrevious={handlePrevious}
              onNext={handleNext}
              emptyMessage="No Direct Team Members Found"
            />
          </div>

        </div>
      </section>
    </>
  );
}
