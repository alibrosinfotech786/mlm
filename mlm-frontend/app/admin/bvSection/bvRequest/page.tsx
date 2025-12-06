"use client";

import React, { useState } from "react";
import Image from "next/image";
import axiosInstance from "@/app/api/axiosInstance";
import toast from "react-hot-toast";

export default function BVRequestPage() {
  const [bvAmount, setBvAmount] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentRef, setPaymentRef] = useState("");
  const [remark, setRemark] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);

  const [confirmModal, setConfirmModal] = useState(false);

  /* =========================================================
     FINAL API SUBMISSION
  ========================================================= */
  const handleFinalSubmit = async () => {
    setApiLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("bv_amount", bvAmount);
      formData.append("payment_amount", paymentAmount);
      formData.append("payment_method", paymentMethod);
      formData.append("payment_reference", paymentRef);
      formData.append("remark", remark);

      if (file) formData.append("attachment", file);

      const res = await axiosInstance.post(
        "/bv-topup-requests/store",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("BV request submitted successfully!");

        setBvAmount("");
        setPaymentAmount("");
        setPaymentRef("");
        setRemark("");
        setFile(null);

        setConfirmModal(false);
      }
    } catch (error: any) {
      if (error?.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((msg: any) =>
          toast.error(msg[0])
        );
      } else {
        toast.error("Failed to submit BV request!");
      }
    } finally {
      setApiLoading(false);
    }
  };

  /* =========================================================
     MAIN FORM SUBMIT → OPEN CONFIRMATION MODAL
  ========================================================= */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bvAmount || !paymentAmount || !paymentRef) {
      toast.error("BV Amount, Payment Amount & Reference ID are required.");
      return;
    }

    setSubmitLoading(true);

    setTimeout(() => {
      setSubmitLoading(false);
      setConfirmModal(true);
    }, 300);
  };

  return (
    <>
      {/* 🔥 Fullscreen Loader While API Running */}
      {apiLoading && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]">
          <div className="flex flex-col items-center gap-3">
            <span className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
            <p className="text-white text-sm">Submitting BV request...</p>
          </div>
        </div>
      )}

      {/* 🔔 Confirmation Modal */}
      {confirmModal && !apiLoading && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white shadow-xl p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-bold text-green-700 mb-3">
              Confirm BV Request
            </h2>

            <p className="text-sm text-gray-700 mb-1">
              <b>BV Amount:</b> {bvAmount}
            </p>

            <p className="text-sm text-gray-700 mb-1">
              <b>Payment Amount:</b> ₹{paymentAmount}
            </p>

            <p className="text-sm text-gray-700 mb-4">
              <b>Reference ID:</b> {paymentRef}
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700"
                onClick={() => setConfirmModal(false)}
                disabled={apiLoading}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 rounded-md bg-green-700 text-white hover:bg-green-800 disabled:opacity-60"
                onClick={handleFinalSubmit}
                disabled={apiLoading}
              >
                {apiLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Submitting...
                  </span>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN PAGE */}
      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-2">
          <h1 className="text-2xl font-bold text-green-800">BV Request</h1>
          <p className="text-green-700 pb-5">Top up BV for your account.</p>

          <div className="bg-white shadow-md rounded-xl border border-green-100 p-6">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="md:col-span-2 space-y-5">
                {/* BV Amount */}
                <div>
                  <label className="block text-sm text-green-800">
                    BV Amount
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bvAmount}
                    onChange={(e) => setBvAmount(e.target.value)}
                    className="w-full border border-green-300 rounded-md px-3 py-2"
                    placeholder="Enter BV amount"
                  />
                </div>

                {/* Payment Amount */}
                <div>
                  <label className="block text-sm text-green-800">
                    Payment Amount
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full border border-green-300 rounded-md px-3 py-2"
                    placeholder="Enter payment amount"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm text-green-800">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full border border-green-300 rounded-md px-3 py-2"
                  >
                    <option>Bank Transfer</option>
                    <option>UPI</option>
                    <option>Cash</option>
                  </select>
                </div>

                {/* Reference ID */}
                <div>
                  <label className="block text-sm text-green-800">
                    Payment Reference ID
                  </label>
                  <input
                    type="text"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="Enter reference number"
                    className="w-full border border-green-300 rounded-md px-3 py-2"
                  />
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-sm text-green-800">
                    Remark
                  </label>
                  <textarea
                    rows={3}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    className="w-full border border-green-300 rounded-md px-3 py-2"
                  ></textarea>
                </div>

                {/* Attachment */}
                <div>
                  <label className="block text-sm text-green-800">
                    Payment Proof (Attachment)
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setFile(e.target.files ? e.target.files[0] : null)
                    }
                    className="w-full border border-green-300 rounded-md px-3 py-2"
                  />
                </div>

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 disabled:opacity-60"
                  >
                    {submitLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Processing...
                      </span>
                    ) : (
                      "Submit BV Request"
                    )}
                  </button>
                </div>
              </div>

              {/* STATIC INFO PANEL */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="text-lg font-semibold text-blue-700 mb-4">
                  Payment Instructions
                </h3>

                <Image
                  src="/images/qr.jpg"
                  alt="QR"
                  width={140}
                  height={140}
                  className="mx-auto rounded-lg border border-green-300 shadow-sm"
                />

                <p className="text-center text-xs mt-2 text-gray-600">
                  Scan to Pay via UPI
                </p>

                <div className="mt-4 text-sm text-green-900 space-y-1 text-center">
                  <p>
                    <b>Bank:</b> HDFC Bank
                  </p>
                  <p>
                    <b>Acc No:</b> 1234567890
                  </p>
                  <p>
                    <b>IFSC:</b> HDFC0001234
                  </p>
                  <p>
                    <b>UPI ID:</b> yourname@hdfcbank
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
