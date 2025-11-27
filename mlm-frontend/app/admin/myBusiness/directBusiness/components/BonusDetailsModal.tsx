"use client";

import React from "react";
import { X } from "lucide-react";

export default function BonusDetailsModal({ item, onClose }: any) {
  if (!item) return null;

  const shouldScroll = item.bonus_history.length > 4;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl p-5 relative border border-green-100">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-bold text-green-800 mb-4"> Direct Business</h2>

        {/* ================= TOP (User Info + Bonus Summary) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* User Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 shadow-sm">
            <h3 className="text-sm font-semibold text-green-800 mb-2">
              User Information
            </h3>

            <div className="space-y-1 text-xs text-green-900">
              <p><b>User ID:</b> {item.user_id}</p>
              <p><b>Name:</b> {item.name}</p>
              <p><b>Phone:</b> {item.phone}</p>
              <p><b>Position:</b> {item.position}</p>
              <p><b>Current BV:</b> {item.current_bv}</p>
              <p>
                <b>Joined:</b>{" "}
                {new Date(item.joined_date).toLocaleDateString("en-GB")}
              </p>
            </div>
          </div>

          {/* Bonus Summary */}
          <div className="bg-white border border-green-200 rounded-lg p-3 shadow-sm">
            <h3 className="text-sm font-semibold text-green-800 mb-2">
              Bonus Summary
            </h3>

            <div className="space-y-1 text-xs text-green-900">
              <p>
                <b>Total BV Received:</b>{" "}
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded font-semibold text-xs">
                  {item.bonus_received} BV
                </span>
              </p>

              <p>
                <b>Bonus Count:</b>{" "}
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded font-semibold text-xs">
                  {item.bonus_count}
                </span>
              </p>

              <p>
                <b>Last Bonus Date:</b>{" "}
                {new Date(item.last_bonus_date).toLocaleDateString("en-GB")}
              </p>
            </div>
          </div>
        </div>

        {/* ================= BONUS HISTORY ================= */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-green-800 mb-2 underline">
           Direct Business Receieved History 
          </h3> 

          {item.bonus_history.length === 0 ? (
            <p className="text-gray-500 text-xs">No bonus history</p>
          ) : (
            <div
              className={`space-y-2 pr-2 ${
                shouldScroll ? "max-h-52 overflow-y-auto" : ""
              }`}
            >
              {item.bonus_history.map((entry: any, idx: number) => (
                <div
                  key={idx}
                  className="p-2 bg-green-50 border border-green-100 rounded-lg shadow-sm flex justify-between items-center text-xs"
                >
                  <div>
                    <p className="text-green-700 font-medium">
                      {entry.amount} BV
                    </p>
                    <p className="text-gray-600 text-[10px]">
                      {new Date(entry.date).toLocaleDateString("en-GB")}
                    </p>
                  </div>

                  <span className="px-2 py-0.5 bg-white border border-green-200 rounded text-[10px] font-semibold text-green-700 shadow-sm">
                    Received
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
