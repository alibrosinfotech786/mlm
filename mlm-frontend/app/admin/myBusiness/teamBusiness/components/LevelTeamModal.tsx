"use client";

import React from "react";
import { X, User, Phone, Mail, Star, BarChart3 } from "lucide-react";

export default function LevelTeamModal({ item, onClose }: any) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative animate-fadeIn border border-green-100">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-green-800 mb-5 flex items-center gap-2">
          <User className="text-green-700" size={20} /> Team Member Details
        </h2>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* LEFT BOX */}
          <div className="bg-green-50 border border-green-200 p-4 rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold text-green-700 mb-2">
              Personal Info
            </h3>

            <div className="space-y-1 text-sm text-green-900">
              <p><b>User ID:</b> {item.user_id}</p>
              <p><b>Name:</b> {item.name}</p>
              <p className="flex items-center gap-1">
                <Mail size={14} /> {item.email}
              </p>
              <p className="flex items-center gap-1">
                <Phone size={14} /> {item.phone}
              </p>
              <p>
                <b>Joined:</b>{" "}
                {new Date(item.joined_date).toLocaleDateString("en-GB")}
              </p>
            </div>
          </div>

          {/* RIGHT BOX */}
          <div className="bg-white border border-green-200 p-4 rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold text-green-700 mb-2">
              Team Stats
            </h3>

            <div className="space-y-1 text-sm text-green-900">
              <p className="flex items-center gap-1">
                <Star size={14} className="text-yellow-500" />
                <b>Level:</b> {item.level}
              </p>

              <p className="flex items-center gap-1">
                <BarChart3 size={14} className="text-green-700" />
                <b>BV Generated:</b>{" "}
                <span className="font-semibold text-green-700">{item.bv_generated}</span>
              </p>

              <p>
                <b>Position:</b>{" "}
                <span className="capitalize">{item.position}</span>
              </p>

              <p>
                <b>Status:</b>{" "}
                {item.is_active ? (
                  <span className="text-green-600 font-semibold">Active</span>
                ) : (
                  <span className="text-red-600 font-semibold">Inactive</span>
                )}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
