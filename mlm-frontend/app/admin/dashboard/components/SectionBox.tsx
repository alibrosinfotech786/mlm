"use client";

import React from "react";

export default function SectionBox({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] 
        transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)] p-6 ${className}`}
    >
      {/* Title Row */}
      <div className="flex items-center gap-2 mb-4">
        {icon && (
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-700 shadow-sm">
            {icon}
          </div>
        )}

        <h3 className="text-[17px] font-medium text-gray-800">
          {title}
        </h3>
      </div>

      {/* Accent Divider */}
      <div className="h-[2px] w-full bg-gradient-to-r from-green-400/40 to-transparent mb-4 rounded-full"></div>

      {/* Content */}
      <div className="text-gray-700 text-[14px] leading-relaxed">
        {children}
      </div>
    </div>
  );
}
