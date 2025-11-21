"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import TreeView from "./components/TreeView";
// import TreeView from "@/components/tree/TreeView";

interface MemberStatus {
  totalLeft: number;
  totalRight: number;
  activeRegistration: number;
  pointValue: number;
  pointCbp: number;
}

export default function TreeViewPage() {
  const [searchId, setSearchId] = useState("");
  const [status] = useState<MemberStatus>({
    totalLeft: 0,
    totalRight: 0,
    activeRegistration: 0,
    pointValue: 0,
    pointCbp: 0,
  });

  const treeData = {
    id: "VW831949",
    left: {
      id: "Vacant",
      left: { id: "Vacant" },
      right: { id: "Vacant" },
    },
    right: {
      id: "Vacant",
      left: { id: "Vacant" },
      right: { id: "Vacant" },
    },
  };

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* ===== Page Header ===== */}
          <div>
            <h1 className="text-2xl font-bold text-green-800">Tree View</h1>
            <p className="text-green-700 text-sm">
              Visualize your downline network and placement hierarchy.
            </p>
          </div>

          {/* ===== Top Boxes ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search Member */}
            <div className="bg-white shadow-md rounded-xl border border-green-100 p-5">
              <h2 className="text-lg font-semibold text-green-800 mb-4">
                Search Member
              </h2>
              <label
                htmlFor="search"
                className="block text-sm text-green-700 mb-1 font-medium"
              >
                Enter User ID
              </label>
              <div className="flex gap-2">
                <input
                  id="search"
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter User ID"
                  className="flex-1 border border-green-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <button className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800 transition">
                  Search
                </button>
              </div>
            </div>

            {/* Member Status */}
            <div className="bg-white shadow-md rounded-xl border border-green-100 p-5">
              <h2 className="text-lg font-semibold text-green-800 mb-4">
                Member Status
              </h2>
              <table className="min-w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-green-200 text-green-700">
                    <th className="text-left py-2 font-medium">Status</th>
                    <th className="text-right font-medium">Total Left</th>
                    <th className="text-right font-medium">Total Right</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 text-green-800">Total Registration</td>
                    <td className="text-right">{status.totalLeft}</td>
                    <td className="text-right">{status.totalRight}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-green-800">Active Registration</td>
                    <td className="text-right">{status.activeRegistration}</td>
                    <td className="text-right">{status.activeRegistration}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-green-800">Point Value</td>
                    <td className="text-right">{status.pointValue}</td>
                    <td className="text-right">{status.pointValue}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-green-800">Point CBP</td>
                    <td className="text-right">{status.pointCbp}</td>
                    <td className="text-right">{status.pointCbp}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ===== Tree Section ===== */}
          <div className="bg-white rounded-xl shadow-md border border-green-100 p-6 overflow-x-auto">
            <TreeView data={treeData} />
          </div>
        </div>
      </section>
    </>
  );
}
