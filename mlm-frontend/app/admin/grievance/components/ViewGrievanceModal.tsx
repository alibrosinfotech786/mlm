"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface Grievance {
  id: number;
  subject: string;
  description: string;
  attachment?: string | null;
  status: string;
  created_at?: string;
  user_id?: string;
  user_name?: string;
  grievance_id?: string;
  // any other fields returned
}

interface Props {
  item: Grievance | null;
  onClose: () => void;
}

export default function ViewGrievanceModal({ item, onClose }: Props) {
  if (!item) return null;

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl p-4 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-green-700"
        >
          <X size={20} />
        </button>

        {/* LEFT: DETAILS */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-green-800">{item.subject}</h3>

          <div className="text-sm text-gray-700 space-y-1">
            <p><b>Grievance ID:</b> {item.grievance_id ?? item.id}</p>
            {/* <p><b>Raised By:</b> {item.user_id ?? "—"}</p> */}
              <p><b>Created By:</b> {item?.user_name} ({item?.user_id})</p> 
            <p><b>Date:</b> {item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</p>
            <p>
              <b>Status:</b>{" "}
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                item.status === "resolved"
                ? "bg-green-100 text-green-800"
                : item.status === "in_progress"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
              }`}>
                {item.status}
              </span>
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-green-800">Description</h4>
            <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{item.description}</p>
          </div>
        </div>

        {/* RIGHT: Attachment / proof */}
        <div className="flex flex-col items-center justify-start">
          <h4 className="text-sm font-medium text-green-800 mb-2">Attachment / Proof</h4>

          {item.attachment ? (
            <>
              {/* show image preview if image else show link */}
              {(item.attachment.endsWith(".png") ||
                item.attachment.endsWith(".jpg") ||
                item.attachment.endsWith(".jpeg")) ? (
                <div className="w-full flex items-center justify-center">
                  <Image
                    src={item.attachment.startsWith("http") ? item.attachment : `${BASE_URL}/${item.attachment}`}
                    alt="attachment"
                    width={320}
                    height={240}
                    className="rounded border"
                    unoptimized
                  />
                </div>
              ) : (
                <a
                  href={item.attachment.startsWith("http") ? item.attachment : `${BASE_URL}/${item.attachment}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-700 underline"
                >
                  View Attachment
                </a>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500">No attachment provided</p>
          )}
        </div>
      </div>
    </div>
  );
}
