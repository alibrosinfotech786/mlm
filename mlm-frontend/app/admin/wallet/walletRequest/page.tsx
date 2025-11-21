"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import Image from "next/image";

export default function WalletRequestPage() {
  const [depositBy, setDepositBy] = useState("By UPI");
  const [depositTo, setDepositTo] = useState("By Wallet");
  const [amount, setAmount] = useState("");
  const [txnId, setTxnId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Here you'll later handle API submission
    console.log({
      depositBy,
      depositTo,
      amount,
      txnId,
      remarks,
      file,
    });
    alert("Wallet request submitted!");
  };

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* ===== HEADER ===== */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-green-800">
                Wallet Request
              </h1>
              <p className="text-green-700 text-sm">
                Submit your deposit details to add funds to your wallet.
              </p>
            </div>
          </div>

          {/* ===== FORM ===== */}
          <div className="bg-white shadow-md rounded-xl border border-green-100 p-6">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {/* ===== LEFT FORM ===== */}
              <div className="md:col-span-2 space-y-5">
                {/* Deposit By */}
                <div>
                  <label
                    htmlFor="depositBy"
                    className="block text-sm font-medium text-green-800 mb-1"
                  >
                    Deposit By
                  </label>
                  <select
                    id="depositBy"
                    value={depositBy}
                    onChange={(e) => setDepositBy(e.target.value)}
                    className="w-full border border-green-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    <option>By UPI</option>
                    <option>By Bank Transfer</option>
                    <option>By Cash</option>
                  </select>
                </div>

                {/* Deposit To */}
                <div>
                  <label
                    htmlFor="depositTo"
                    className="block text-sm font-medium text-green-800 mb-1"
                  >
                    Deposit To
                  </label>
                  <select
                    id="depositTo"
                    value={depositTo}
                    onChange={(e) => setDepositTo(e.target.value)}
                    className="w-full border border-green-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    <option>By Wallet</option>
                    <option>By Account</option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-green-800 mb-1"
                  >
                    Deposit Amount
                  </label>
                  <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter deposit amount"
                    className="w-full border border-green-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                {/* Transaction ID */}
                <div>
                  <label
                    htmlFor="txnId"
                    className="block text-sm font-medium text-green-800 mb-1"
                  >
                    Trnx. ID / Ref. No
                  </label>
                  <input
                    id="txnId"
                    type="text"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    placeholder="Enter transaction ID or reference number"
                    className="w-full border border-green-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                {/* Remarks */}
                <div>
                  <label
                    htmlFor="remarks"
                    className="block text-sm font-medium text-green-800 mb-1"
                  >
                    Remark / Description
                  </label>
                  <textarea
                    id="remarks"
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter any additional details..."
                    className="w-full border border-green-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    Message Length: {remarks.length} characters
                  </p>
                </div>

                {/* File Upload */}
                <div>
                  <label
                    htmlFor="file"
                    className="block text-sm font-medium text-green-800 mb-1"
                  >
                    Attachment
                  </label>
                  <input
                    id="file"
                    type="file"
                    onChange={(e) =>
                      setFile(e.target.files ? e.target.files[0] : null)
                    }
                    className="w-full border border-green-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    className="w-full bg-green-700 text-white py-2 rounded-md font-medium hover:bg-green-800 transition"
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* ===== RIGHT SECTION (BANK DETAILS) ===== */}
              <div className="bg-green-50 rounded-xl border border-green-100 p-4">
                <h3 className="text-lg font-semibold text-red-600 mb-4">
                  Bank Details
                </h3>

                <div className="flex flex-col items-center">
                  <Image
                    src="/images/qr-sample.png" // Replace with your actual QR or bank image
                    alt="Bank QR Code"
                    width={100}
                    height={100}
                    className="rounded-md border border-gray-300"
                  />

                  <div className="mt-4 text-sm text-green-800 space-y-1 text-center">
                    <p>
                      <span className="font-semibold">Bank Name:</span> HDFC Bank
                    </p>
                    <p>
                      <span className="font-semibold">Account No:</span>{" "}
                      1234567890
                    </p>
                    <p>
                      <span className="font-semibold">IFSC Code:</span> HDFC0001234
                    </p>
                    <p>
                      <span className="font-semibold">UPI ID:</span>{" "}
                      yourname@hdfcbank
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
