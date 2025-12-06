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
}

export default function AllBVRequestsPage() {
  const [bvList, setBvList] = useState<BVRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<BVRequest | null>(null);

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

  /* =====================================================
     FETCH BV REQUEST LIST
  ====================================================== */
  const fetchBVRequests = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/bv-topup-requests?page=${page}&per_page=${entries}&search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const bvReq = res.data.bv_topup_requests;

        const formatted = bvReq.data.map((item: any) => ({
          id: item.id,
          requestDate: item.created_at?.split("T")[0] ?? "-",
          userName: item.user?.name ?? "-",
          userId: item.user?.user_id ?? "-",
          bvAmount: Number(item.bv_amount) || 0,
          paymentAmount: Number(item.payment_amount) || 0,
          paymentMethod: item.payment_method || "-",
          transactionId: item.transaction_id || "-",
          referenceId: item.payment_reference || "-",
          remark: item.remark ?? "-",
          attachment: item.attachment ? `${BASE_URL}/${item.attachment}` : null,
          status: item.status || "pending",
        }));

        setBvList(formatted);
        setTotalPages(bvReq.last_page || 1);
        setPage(bvReq.current_page || 1);
      }
    } catch {
      toast.error("Failed to load BV requests");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     UPDATE STATUS
  ====================================================== */
 const updateStatus = async (
  id: number,
  status: "approved" | "pending" | "rejected"
) => {
  try {
    let rejection_reason = null;

    // If rejected → ask for reason
    if (status === "rejected") {
      rejection_reason = prompt("Enter rejection reason:");

      if (!rejection_reason || rejection_reason.trim() === "") {
        toast.error("Rejection reason is required!");
        return;
      }
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    await axiosInstance.post(
      "/bv-topup-requests/approve",
      {
        id,
        status,
        rejection_reason,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    toast.success("Status updated successfully!");
    fetchBVRequests();
  } catch (err) {
    console.error(err);
    toast.error("Failed to update status");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    const debounce = setTimeout(fetchBVRequests, 400);
    return () => clearTimeout(debounce);
  }, [page, entries, search]);

  const handlePrevious = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-green-800">All BV Requests</h1>
        <p className="text-green-700 text-sm">
          View and manage BV top-up requests.
        </p>

        {/* TABLE CONTAINER */}
        <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">

          {/* SEARCH + ENTRIES */}
          <div className="p-4 border-b flex justify-between items-center">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name / transaction ID"
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
                  <th className="px-4 py-3 border-r">Date</th>
                  <th className="px-4 py-3 border-r">User</th>
                  <th className="px-4 py-3 border-r">BV</th>
                  <th className="px-4 py-3 border-r">Payment</th>
                  <th className="px-4 py-3 border-r">Status</th>
                  <th className="px-4 py-3 border-r">Details</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6">Loading...</td>
                  </tr>
                ) : bvList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No BV requests found
                    </td>
                  </tr>
                ) : (
                  bvList.map((row) => (
                    <tr key={row.id} className="border-b hover:bg-green-50 transition">
                      <td className="px-4 py-3 border-r">{row.requestDate}</td>
                      <td className="px-4 py-3 border-r">{row.userName}</td>
                      <td className="px-4 py-3 border-r">{row.bvAmount}</td>
                      <td className="px-4 py-3 border-r">{row.paymentAmount}</td>

                      {/* STATUS */}
                      <td className="px-4 py-3 border-r">
                        <select
                          value={row.status.toLowerCase()}
                          onChange={(e) =>
                            updateStatus(
                              row.id,
                              e.target.value as "approved" | "pending" | "rejected"
                            )
                          }
                          className={`rounded-md px-2 py-1 text-xs cursor-pointer ${row.status === "approved"
                              ? "bg-green-200 text-green-800"
                              : row.status === "pending"
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-red-200 text-red-800"
                            }`}
                        >
                          <option value="approved">Approved</option>
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>

                      {/* DETAILS BUTTON */}
                      <td className="px-4 py-3 border-r">
                        <button
                          onClick={() => setSelectedRequest(row)}
                          className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
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
          <div className="flex justify-between items-center p-4 border-t">
            <button
              disabled={page === 1}
              onClick={handlePrevious}
              className="px-3 py-1 border rounded"
            >
              Prev
            </button>

            <span className="text-sm">Page {page} of {totalPages}</span>

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

      {/* ===========================
          DETAILS MODAL
      ============================ */}
      {selectedRequest && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
    <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6">

      <h2 className="text-lg font-bold text-green-700 mb-4">
        BV Request Details
      </h2>

      {/* 2 COLUMN LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT SIDE — DETAILS */}
        <div className="space-y-3 text-sm">
          <p><b>User:</b> {selectedRequest.userName} ({selectedRequest.userId})</p>
          <p><b>Date:</b> {selectedRequest.requestDate}</p>
          <p><b>BV Amount:</b> {selectedRequest.bvAmount}</p>
          <p><b>Payment Amount:</b> ₹{selectedRequest.paymentAmount}</p>
          <p><b>Payment Method:</b> {selectedRequest.paymentMethod}</p>
          <p><b>Transaction ID:</b> {selectedRequest.transactionId}</p>
          <p><b>Reference ID:</b> {selectedRequest.referenceId}</p>
          <p><b>Remark:</b> {selectedRequest.remark}</p>
        </div>

        {/* RIGHT SIDE — IMAGE PREVIEW */}
        <div className="flex justify-center items-start">
          {selectedRequest.attachment ? (
            <a
              href={selectedRequest.attachment}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={selectedRequest.attachment}
                alt="Attachment"
                className="w-56 h-56 object-cover rounded border border-green-300 shadow-md hover:scale-105 transition cursor-pointer"
              />
            </a>
          ) : (
            <div className="text-gray-500 text-sm">No Attachment</div>
          )}
        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setSelectedRequest(null)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}



    </section>
  );
}
