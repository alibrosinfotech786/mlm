"use client";

import Image from "next/image";
import React from "react";

interface TreeNodeProps {
  id: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({ id }) => {
  const isVacant = id === "Vacant";

  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex items-center justify-center shadow-md ${
          isVacant
            ? "border-gray-400 bg-white"
            : "border-green-600 bg-green-100"
        }`}
      >
        <Image
          src={isVacant ? "/images/treeuser2.png" : "/images/treeuser1.png"}
          alt={isVacant ? "Vacant" : "User"}
          width={40}
          height={40}
          className="object-contain"
        />
      </div>
      <p
        className={`text-sm mt-2 ${
          isVacant ? "text-gray-500" : "text-green-800 font-semibold"
        }`}
      >
        {id}
      </p>
    </div>
  );
};

export default TreeNode;
