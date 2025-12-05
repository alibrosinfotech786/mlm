"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/common/DataTable";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";
import ViewContactModal from "./components/ViewContactModal";
// import ViewContactModal from "./components/ViewContactModal";

interface ContactMsg {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function ContactPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [contacts, setContacts] = useState<ContactMsg[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [viewItem, setViewItem] = useState<ContactMsg | null>(null);

  const formatPrettyDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `${ProjectApiList.get_contact_us}?page=${page}&per_page=${entries}&search=${encodeURIComponent(
          search
        )}`
      );

      if (res?.data?.success) {
        setContacts(res.data.data || []);
        setTotalPages(1); // API doesn't provide pagination, so default 1
      } else {
        setContacts([]);
      }
    } catch (err) {
      console.error("Fetch contacts error", err);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchContacts(), 300);
    return () => clearTimeout(delay);
  }, [page, entries, search]);

  const columns: Column<ContactMsg>[] = [
    {
      key: "created_at",
      label: "Date",
      render: (val) => <span>{formatPrettyDate(val)}</span>,
    },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "subject", label: "Subject" },
    {
      key: "message",
      label: "Message",
      render: (val: any) => (
        <p className="max-w-[200px] truncate" title={val}>
          {val}
        </p>
      ),
    },
    {
      key: "id",
      label: "Action",
      render: (_: any, row: ContactMsg) => (
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={() => setViewItem(row)}
        >
          View
        </button>
      ),
    },
  ];

  return (
    <>
      {/* <AdminHeader /> */}

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-green-800">Contact Messages</h1>
            <p className="text-green-700 text-sm">
              View messages submitted from website contact form.
            </p>
          </div>

          {/* <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
            <DataTable
              columns={columns}
              data={contacts}
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
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              emptyMessage="No contact messages found"
            />
          </div> */}

          {/* CUSTOM CONTACT TABLE */}
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">

            {/* 🔍 SEARCH + ENTRIES */}
            <div className="p-4 border-b flex justify-between items-center">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search message..."
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
                <thead className="bg-green-600 text-white uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 border-r">Date</th>
                    <th className="px-4 py-3 border-r">Name</th>
                    <th className="px-4 py-3 border-r">Email</th>
                    <th className="px-4 py-3 border-r">Phone</th>
                    <th className="px-4 py-3 border-r">Subject</th>
                    <th className="px-4 py-3 border-r">Message</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center">Loading...</td>
                    </tr>
                  ) : contacts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-gray-500">
                        No contact messages found
                      </td>
                    </tr>
                  ) : (
                    contacts.map((row) => (
                      <tr key={row.id} className="border-b hover:bg-green-50">

                        {/* DATE */}
                        <td className="px-4 py-3 border-r">
                          {formatPrettyDate(row.created_at)}
                        </td>

                        {/* NAME */}
                        <td className="px-4 py-3 border-r">{row.name}</td>

                        {/* EMAIL */}
                        <td className="px-4 py-3 border-r">{row.email}</td>

                        {/* PHONE */}
                        <td className="px-4 py-3 border-r">{row.phone}</td>

                        {/* SUBJECT */}
                        <td className="px-4 py-3 border-r">{row.subject}</td>

                        {/* MESSAGE (truncate) */}
                        <td className="px-4 py-3 border-r">
                          <p className="max-w-[200px] truncate" title={row.message}>
                            {row.message}
                          </p>
                        </td>

                        {/* ACTION */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setViewItem(row)}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View
                          </button>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="p-4 border-t flex justify-between items-center">

              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={`px-3 py-1 border rounded ${page === 1 ? "opacity-50" : "hover:bg-green-100"
                  }`}
              >
                Prev
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-3 py-1 border rounded ${num === page ? "bg-green-600 text-white" : "hover:bg-green-100"
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className={`px-3 py-1 border rounded ${page === totalPages ? "opacity-50" : "hover:bg-green-100"
                  }`}
              >
                Next
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* View Modal */}
      <ViewContactModal item={viewItem} onClose={() => setViewItem(null)} />
    </>
  );
}
