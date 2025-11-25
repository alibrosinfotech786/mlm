"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import Image from "next/image";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";

export default function WalletRequestPage() {
  const [depositBy, setDepositBy] = useState("By UPI");
  const [depositTo, setDepositTo] = useState("By Wallet");
  const [amount, setAmount] = useState("");
  const [txnId, setTxnId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [confirmModal, setConfirmModal] = useState(false); // ⬅ Confirmation Modal

  const handleFinalSubmit = async () => {
    if (!amount || !txnId) {
      toast.error("Amount & Transaction ID are required.");
      return;
    }

    try {
      setLoading(true);
      setConfirmModal(false); // close modal

      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("deposit_by", depositBy);
      formData.append("deposit_to", depositTo);
      formData.append("deposit_amount", amount);
      formData.append("ref_transaction_id", txnId);
      formData.append("remark", remarks);

      if (file) formData.append("attachment", file);

      const res = await axiosInstance.post(
        ProjectApiList.WALLET_TRANSACTION_ADD,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("Wallet transaction request submitted!");

        setAmount("");
        setTxnId("");
        setRemarks("");
        setFile(null);
      }
    } catch (error: any) {
      if (error?.response?.data?.errors) {
        const validationErrors = error.response?.data?.errors;
        Object.values(validationErrors).forEach((errMsg: any) =>
          toast.error(errMsg[0])
        );
      } else {
        toast.error("Failed to submit wallet request!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmModal(true); // show confirm modal
  };

  return (
    <>
      <AdminHeader />

      {/* 🔔 Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white shadow-xl p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-bold text-green-700 mb-3">
              Confirm Wallet Request
            </h2>
            <p className="text-sm text-gray-700 mb-2">
              <b>Amount:</b> ₹{amount}
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <b>Transaction ID:</b> {txnId}
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700"
                onClick={() => setConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-green-700 text-white hover:bg-green-800"
                onClick={handleFinalSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-2">
          <h1 className="text-2xl font-bold text-green-800">Wallet Request</h1>
          <p className="text-green-700 pb-5">Submit deposit details to add funds.</p>

          <div className="bg-white shadow-md rounded-xl border border-green-100 p-6">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="md:col-span-2 space-y-5">
                {/* Deposit By */}
                <div>
                  <label className="block text-sm text-green-800">
                    Deposit By
                  </label>
                  <select
                    value={depositBy}
                    onChange={(e) => setDepositBy(e.target.value)}
                    className="w-full border border-green-300 rounded-md px-3 py-2"
                  >
                    <option>By UPI</option>
                    <option>By Bank Transfer</option>
                    <option>By Cash</option>
                  </select>
                </div>

                {/* Deposit To */}
                <div>
                  <label className="block text-sm text-green-800">
                    Deposit To
                  </label>
                  <select
                    value={depositTo}
                    onChange={(e) => setDepositTo(e.target.value)}
                    className="w-full border border-green-300 rounded-md px-3 py-2"
                  >
                    <option>By Wallet</option>
                    <option>By Account</option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm text-green-800">Deposit Amount</label>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (Number(val) >= 0) setAmount(val); // Block negative input in state
                    }}
                    placeholder="Enter amount"
                    className="w-full border border-green-300 rounded-md px-3 py-2"
                    onWheel={(e) => (e.target as HTMLInputElement).blur()} // Prevent scroll input change
                  />
                </div>


                {/* Transaction ID */}
                <div>
                  <label className="block text-sm text-green-800">
                    Trnx. ID / Ref No
                  </label>
                  <input
                    type="text"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    placeholder="Enter transaction ID"
                    className="w-full border border-green-300 rounded-md px-3 py-2"
                  />
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-sm text-green-800">
                    Remark / Description
                  </label>
                  <textarea
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full border border-green-300 rounded-md px-3 py-2"
                  ></textarea>
                </div>

                {/* Attachment */}
                <div>
                  <label className="block text-sm text-green-800">
                    Attachment
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
                    disabled={loading}
                    className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800"
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* Bank Info & Static QR */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="text-lg font-semibold text-red-600 mb-4">
                  Bank Details
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
