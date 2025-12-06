"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import toast from "react-hot-toast";

interface BVRequest {
  id: number;
  requestDate: string;
  userName: string;
  userId: string;
  bvAmount: number;
  paymentAmount: number;
  paymentMethod: string;
  transactionId: string;
  referenceId: string;
  remark: string;
  attachment: string | null;
  status: string;
  approvedBy: string | null;
  approvedAt: string | null;
}

export default function BVStatusPage() {
  const [bvList, setBvList] = useState<BVRequest[]>([]);
  const [selectedRow, setSelectedRow] = useState<BVRequest | null>(null);

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";
  const user = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : {};

  const userId = user?.user_id;

  /* =====================================================
      FETCH BV REQUEST LIST
  ====================================================== */
  const fetchBVRequests = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axiosInstance.get(
        `/bv-topup-requests?user_id=${userId}&page=${page}&per_page=${entries}&search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const bv = res.data.bv_topup_requests;

        const formatted = bv.data.map((item: any) => ({
          id: item.id,
          requestDate: item.created_at?.split("T")[0] ?? "-",
          userName: item.user?.name ?? "-",
          userId: item.user?.user_id ?? "-",
          bvAmount: Number(item.bv_amount) || 0,
          paymentAmount: Number(item.payment_amount) || 0,
          paymentMethod: item.payment_method,
          transactionId: item.transaction_id,
          referenceId: item.payment_reference,
          remark: item.remark,
          attachment: item.attachment ? `${BASE_URL}/${item.attachment}` : null,
          status: item.status,
          approvedBy: item.approver?.name || null,
          approvedAt: item.approved_at
            ? item.approved_at.split("T")[0]
            : null,
        }));

        setBvList(formatted);
        setTotalPages(bv.last_page || 1);
        setPage(bv.current_page || 1);
      }
    } catch {
      toast.error("Failed to load BV requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchBVRequests, 350);
    return () => clearTimeout(debounce);
  }, [page, entries, search]);

  const handlePrevious = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">

      {/* =======================
          MODAL FOR DETAILS
      ======================== */}
      {selectedRow && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-xl relative">

            {/* Close */}
            <button
              onClick={() => setSelectedRow(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-green-800 mb-4 underline">
              BV Request Details
            </h2>

            {/* TWO COLUMN GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* LEFT SIDE */}
              <div className="space-y-3 text-sm text-gray-700">
                <p><b>Date:</b> {selectedRow.requestDate}</p>
                <p><b>User:</b> {selectedRow.userName} ({selectedRow.userId})</p>
                <p><b>BV Amount:</b> {selectedRow.bvAmount}</p>
                <p><b>Payment Amount:</b> ₹{selectedRow.paymentAmount}</p>
                <p><b>Method:</b> {selectedRow.paymentMethod}</p>
                <p><b>Transaction ID:</b> {selectedRow.transactionId}</p>
                <p><b>Reference ID:</b> {selectedRow.referenceId}</p>

                <p><b>Status:</b> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold capitalize 
                    ${selectedRow.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : selectedRow.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                    {selectedRow.status}
                  </span>
                </p>

                {selectedRow.approvedBy && (
                  <>
                    <p><b>Approved By:</b> {selectedRow.approvedBy}</p>
                    <p><b>Approved At:</b> {selectedRow.approvedAt}</p>
                  </>
                )}

                <p><b>Remark:</b></p>
                <p className="p-2 bg-gray-100 rounded">{selectedRow.remark}</p>
              </div>

              {/* RIGHT SIDE — IMAGE */}
              <div className="flex flex-col items-center justify-center">
                {selectedRow.attachment ? (
                  <>
                    <img
                      src={selectedRow.attachment}
                      alt="Attachment"
                      className="rounded-md border max-h-64 object-contain shadow"
                    />
                    <a
                      href={selectedRow.attachment}
                      download
                      target="_blank"
                      className="mt-3 bg-green-700 text-white px-4 py-2 rounded-md text-sm hover:bg-green-800"
                    >
                      View Proof
                    </a>
                  </>
                ) : (
                  <p className="text-gray-500">No attachment</p>
                )}
              </div>

            </div>

            <button
              onClick={() => setSelectedRow(null)}
              className="w-full mt-6 bg-green-700 text-white py-2 rounded hover:bg-green-800"
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* =======================
          MAIN PAGE CONTENT
      ======================== */}
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-green-800">BV Status</h1>
        <p className="text-green-700 text-sm">
          Track your BV top-up requests and approval status.
        </p>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">

          {/* SEARCH + ENTRIES */}
          <div className="p-4 border-b flex justify-between items-center">
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by transaction / reference"
              className="border px-3 py-2 rounded-md w-72 text-sm"
            />

            <div className="flex items-center gap-2 text-sm">
              <span>Show</span>
              <select
                value={entries}
                onChange={(e) => { setEntries(Number(e.target.value)); setPage(1); }}
                className="border rounded px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
              <span>entries</span>
            </div>
          </div>

          {/* TABLE BODY */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-green-600 text-white uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 border-r">Date</th>
                  <th className="px-4 py-3 border-r">BV</th>
                  <th className="px-4 py-3 border-r">Payment</th>
                  <th className="px-4 py-3 border-r">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6">Loading...</td>
                  </tr>
                ) : bvList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      No records found
                    </td>
                  </tr>
                ) : (
                  bvList.map((row) => (
                    <tr key={row.id} className="border-b hover:bg-green-50">
                      <td className="px-4 py-3 border-r">{row.requestDate}</td>
                      <td className="px-4 py-3 border-r">{row.bvAmount}</td>
                      <td className="px-4 py-3 border-r">{row.paymentAmount}</td>
                      <td className="px-4 py-3 border-r text-xs capitalize">
                        <span className={`px-3 py-1 rounded-full font-semibold ${
                          row.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : row.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td
                        onClick={() => setSelectedRow(row)}
                        className="px-4 py-3 text-blue-600 underline cursor-pointer"
                      >
                        View Details
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center p-4 border-t">
            <button
              disabled={page === 1}
              onClick={handlePrevious}
              className="px-3 py-1 border rounded"
            >
              Prev
            </button>

            <span>Page {page} of {totalPages}</span>

            <button
              disabled={page === totalPages}
              onClick={handleNext}
              className="px-3 py-1 border rounded"
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
