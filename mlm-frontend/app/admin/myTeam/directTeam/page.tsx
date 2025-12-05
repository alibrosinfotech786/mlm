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

          {/* <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
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
          </div> */}

          {/* DIRECT TEAM TABLE */}
<div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">

  {/* SEARCH BAR */}
  <div className="p-4 border-b flex justify-between items-center">
    <input
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setPage(1);
      }}
      placeholder="Search by name / mobile / user ID"
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

  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead className="bg-green-600 text-white uppercase text-xs tracking-wide sticky top-0 z-10">
        <tr>
          <th className="px-4 py-3 border-r">S.No</th>
          <th className="px-4 py-3 border-r">Reg. Date</th>
          <th className="px-4 py-3 border-r">User ID</th>
          <th className="px-4 py-3 border-r">Name</th>
          <th className="px-4 py-3 border-r">Mobile No.</th>
          <th className="px-4 py-3 border-r">Placement</th>
          <th className="px-4 py-3 border-r">Activation Date</th>
          <th className="px-4 py-3 border-r">BV</th>
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan={8} className="text-center py-6">
              Loading...
            </td>
          </tr>
        ) : teamData.length === 0 ? (
          <tr>
            <td colSpan={8} className="text-center py-6 text-gray-500">
              No Direct Team Members Found
            </td>
          </tr>
        ) : (
          teamData.map((row, index) => (
            <tr key={index} className="border-b hover:bg-green-50 transition">
              <td className="px-4 py-3 border-r">{(page - 1) * entries + index + 1}</td>
              <td className="px-4 py-3 border-r">{row.regDate}</td>
              <td className="px-4 py-3 border-r">{row.userId}</td>
              <td className="px-4 py-3 border-r">{row.name}</td>
              <td className="px-4 py-3 border-r">{row.mobile}</td>
              <td className="px-4 py-3 border-r">{row.placement}</td>
              <td className="px-4 py-3 border-r">{row.activationDate}</td>
              <td className="px-4 py-3 border-r">{row.bv}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>

  {/* PAGINATION */}
  <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t gap-4">

    {/* PAGE BUTTONS */}
    <div className="flex items-center gap-2">

      {/* PREVIOUS */}
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className={`px-3 py-1 border rounded text-sm ${
          page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-green-100"
        }`}
      >
        Prev
      </button>

      {/* PAGE NUMBERS */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => setPage(num)}
          className={`px-3 py-1 border rounded text-sm ${
            page === num
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
        className={`px-3 py-1 border rounded text-sm ${
          page === totalPages
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
