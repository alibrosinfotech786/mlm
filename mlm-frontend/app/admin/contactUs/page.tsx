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

          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
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
          </div>
        </div>
      </section>

      {/* View Modal */}
      <ViewContactModal item={viewItem} onClose={() => setViewItem(null)} />
    </>
  );
}
