"use client";

import Image from "next/image";
import React, { useState } from "react";

interface TreeNodeData {
  id: string;
  name: string;
  photo?: string | null;

  phone?: string;
  sponsor_name?: string | null;
  bv?: string | number;

  left?: TreeNodeData | null;
  right?: TreeNodeData | null;
}

interface TreeNodeProps {
  id: string;
  name: string;
  data: TreeNodeData;
  photo?: string | null;
  onDoubleClick: () => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  id,
  name,
  data,
  photo,
  onDoubleClick,
}) => {
  const isVacant = id === "Vacant";
  const initials = name?.charAt(0)?.toUpperCase() ?? "V";

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center cursor-pointer"
      onMouseEnter={() => !isVacant && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onDoubleClick={onDoubleClick}
    >
      {/* Node Circle */}
      <div
        className={`relative w-10 h-10 rounded-full border flex items-center justify-center shadow-sm
          ${
            isVacant
              ? "border-red-600 bg-red-50" // ⭐ RED COLOR FOR VACANT
              : "border-green-600 bg-green-50"
          }
        `}
      >
        {photo && !isVacant ? (
          <Image
            src={photo}
            alt={name}
            fill
            unoptimized
            className="rounded-full object-cover"
          />
        ) : (
          <span
            className={`text-xs font-bold ${
              isVacant ? "text-red-700" : "text-green-700"
            }`}
          >
            {initials}
          </span>
        )}
      </div>

      {/* Name & ID */}
      {!isVacant && (
        <>
          <p className="text-[8px] mt-1 max-w-[60px] truncate text-green-800">
            {name}
          </p>
          <p className="text-[7px] text-gray-500 max-w-[65px] truncate">
            {id}
          </p>
        </>
      )}

      {/* Tooltip (Only for non-vacant users) */}
      {!isVacant && showTooltip && (
        <div
          className="
            absolute top-24 left-1/2 -translate-x-1/2 z-50
            bg-white border border-green-700 rounded-2xl shadow-2xl
            px-8 py-6 w-[420px]
            text-[16px] leading-[1.7rem] text-green-900
          "
        >
          <p className="text-[20px] font-bold text-green-800 mb-3 border-b pb-2">
            Member Details
          </p>

          <p>
            <b>User ID:</b> {id}
          </p>
          <p>
            <b>Name:</b> {name}
          </p>
          <p>
            <b>Phone:</b> {data?.phone || "N/A"}
          </p>
          <p>
            <b>Sponsor:</b> {data?.sponsor_name || "N/A"}
          </p>
          <p>
            <b>BV:</b> {data?.bv || "0.00"}
          </p>
        </div>
      )}
    </div>
  );
};

export default TreeNode;
