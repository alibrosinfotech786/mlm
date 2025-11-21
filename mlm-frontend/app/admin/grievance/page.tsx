"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/common/DataTable";
import AddGrievanceModal from "./components/AddGrievanceModal";

interface Grievance {
  date: string;
  grievanceId: string;
  subject: string;
  description: string;
  attachment?: string;
  status: string;
}

export default function GrievancePage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Preloaded grievance list (demo data)
  const [grievances, setGrievances] = useState<Grievance[]>([
    {
      date: "2024-10-10",
      grievanceId: "GRV101",
      subject: "Delay in Product Delivery",
      description: "I ordered a product 10 days ago but haven’t received it yet.",
      attachment: "invoice_101.pdf",
      status: "Pending",
    },
    {
      date: "2024-10-12",
      grievanceId: "GRV102",
      subject: "Wrong Product Delivered",
      description: "Received an incorrect item compared to what I ordered.",
      attachment: "photo_102.jpg",
      status: "Resolved",
    },
    {
      date: "2024-10-13",
      grievanceId: "GRV103",
      subject: "Wallet Balance Not Updated",
      description:
        "Wallet top-up was successful, but the balance hasn’t been reflected yet.",
      attachment: "txn_receipt_103.png",
      status: "Pending",
    },
    {
      date: "2024-10-14",
      grievanceId: "GRV104",
      subject: "Incorrect PV Calculation",
      description: "PV points for my last purchase seem to be miscalculated.",
      attachment: "",
      status: "Resolved",
    },
    {
      date: "2024-10-15",
      grievanceId: "GRV105",
      subject: "Commission Not Received",
      description:
        "Commission for the last month’s direct referral sales is missing.",
      attachment: "referral_report.pdf",
      status: "Pending",
    },
    {
      date: "2024-10-16",
      grievanceId: "GRV106",
      subject: "Login Issues",
      description:
        "Unable to log in to my dashboard. Keeps showing invalid credentials.",
      attachment: "",
      status: "Resolved",
    },
    {
      date: "2024-10-17",
      grievanceId: "GRV107",
      subject: "Payment Deducted but Order Not Placed",
      description:
        "Amount was deducted but the order didn’t reflect in my account.",
      attachment: "payment_proof_107.png",
      status: "Pending",
    },
    {
      date: "2024-10-18",
      grievanceId: "GRV108",
      subject: "Aadhar Verification Issue",
      description: "System fails to verify my Aadhar details during KYC update.",
      attachment: "aadhar_error.png",
      status: "Resolved",
    },
    {
      date: "2024-10-19",
      grievanceId: "GRV109",
      subject: "Shipping Address Change Request",
      description:
        "Need to update shipping address for my recent order placed on 17 Oct.",
      attachment: "",
      status: "Pending",
    },
    {
      date: "2024-10-20",
      grievanceId: "GRV110",
      subject: "Referral Link Not Working",
      description:
        "My referral link is showing an error page when new users try to sign up.",
      attachment: "screenshot_referral_error.jpg",
      status: "Pending",
    },
  ]);

  // ✅ Add new grievance handler
  const handleAddGrievance = (data: any) => {
    const newGrievance: Grievance = {
      date: new Date().toLocaleDateString("en-IN"),
      grievanceId: `GRV${Math.floor(Math.random() * 10000)}`,
      subject: data.subject,
      description: data.description,
      attachment: data.attachment?.[0]?.name || "",
      status: "Pending",
    };
    setGrievances((prev) => [newGrievance, ...prev]);
  };

  // ✅ Strongly typed columns
  const columns: Column<Grievance>[] = [
    { key: "date", label: "Date" },
    { key: "grievanceId", label: "Grievance ID" },
    { key: "subject", label: "Subject" },
    { key: "description", label: "Description" },
    {
      key: "attachment",
      label: "Attachment",
      render: (value) =>
        value ? (
          <span className="text-green-700 font-medium">📎 {value}</span>
        ) : (
          "-"
        ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value === "Resolved"
              ? "bg-green-100 text-green-700"
              : value === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const totalPages = Math.ceil(grievances.length / entries);
  const startIndex = (page - 1) * entries;
  const paginatedData = grievances.slice(startIndex, startIndex + entries);

  const handlePrevious = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages || 1));

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-green-800">Grievance</h1>
              <p className="text-green-700 text-sm">
                View, add, and track your raised grievances.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-green-700 text-white rounded-md hover:bg-green-600 transition font-medium shadow"
            >
              + Add New Grievance
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
            <DataTable<Grievance>
              columns={columns}
              data={paginatedData}
              page={page}
              totalPages={totalPages}
              entries={entries}
              search={search}
              onSearchChange={setSearch}
              onEntriesChange={setEntries}
              onPrevious={handlePrevious}
              onNext={handleNext}
              emptyMessage="No grievances found"
            />
          </div>
        </div>
      </section>

      {/* Modal */}
      <AddGrievanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddGrievance}
      />
    </>
  );
}
