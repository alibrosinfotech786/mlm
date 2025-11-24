"use client";

import Image from "next/image";
import React from "react";

interface TreeNodeProps {
  id: string;
  name: string;
  photo?: string | null;
  onDoubleClick: () => void;
}
const TreeNode: React.FC<TreeNodeProps> = ({ id, name, photo, onDoubleClick }) => {
  const isVacant = id === "Vacant";
  const initials = name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      onDoubleClick={onDoubleClick}
      className="flex flex-col items-center text-center cursor-pointer active:scale-95 transition"
    >
      <div
        className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center shadow-sm ${
          isVacant ? "border-gray-400 bg-white" : "border-green-600 bg-green-50"
        }`}
      >
        {photo && !isVacant ? (
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover rounded-full"
            unoptimized
          />
        ) : (
          <span className="text-xs font-bold text-green-700">{initials}</span>
        )}
      </div>

      {!isVacant && (
        <>
          <p className="mt-1 text-[9px] font-medium text-green-800 max-w-[50px] truncate">
            {name}
          </p>
          <p className="text-[7px] text-gray-500 max-w-[55px] truncate">
            {id}
          </p>
        </>
      )}
    </div>
  );
};

export default TreeNode;
