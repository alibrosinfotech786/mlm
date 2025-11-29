"use client";

import React from "react";
import { X, Mail, Phone, User, MessageSquare, Calendar } from "lucide-react";

interface Props {
  item: any;
  onClose: () => void;
}

export default function ViewContactModal({ item, onClose }: Props) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-xl relative animate-slideUp border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-800 mb-5 border-b pb-3">
          Contact Message Details
        </h2>

        {/* Content */}
        <div className="space-y-4 text-[15px] text-gray-700">

          {/* Name */}
          <InfoRow
            icon={<User className="w-4 h-4 text-gray-600" />}
            label="Name"
            value={item.name}
          />

          {/* Email */}
          <InfoRow
            icon={<Mail className="w-4 h-4 text-gray-600" />}
            label="Email"
            value={item.email}
          />

          {/* Phone */}
          <InfoRow
            icon={<Phone className="w-4 h-4 text-gray-600" />}
            label="Phone"
            value={item.phone}
          />

          {/* Subject */}
          <InfoRow
            icon={<MessageSquare className="w-4 h-4 text-gray-600" />}
            label="Subject"
            value={item.subject}
          />

          {/* Date */}
          <InfoRow
            icon={<Calendar className="w-4 h-4 text-gray-600" />}
            label="Received On"
            value={new Date(item.created_at).toLocaleString()}
          />

        </div>

        {/* Message Block */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-gray-600" />
            Message
          </h3>

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-gray-700 leading-relaxed text-sm">
            {item.message}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 transition text-sm"
          >
            Close
          </button>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.25s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }

        @keyframes slideUp {
          from { transform: translateY(15px); opacity: 0 }
          to { transform: translateY(0); opacity: 1 }
        }
      `}</style>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-800 break-all">{value}</p>
      </div>
    </div>
  );
}
