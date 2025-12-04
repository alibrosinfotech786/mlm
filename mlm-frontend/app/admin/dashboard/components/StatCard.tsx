"use client";

import React from "react";
import { cn } from "@/lib/utils";

export default function StatCard({
  title,
  value,
  suffix,
  icon,
  desc,
  className,
}: {
  title: string;
  value: string | number;
  suffix?: string;
  icon?: React.ReactNode;
  desc?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "p-5 rounded-2xl border bg-white shadow-md hover:shadow-xl transition-all duration-300 group",
        "border-green-100 relative overflow-hidden",
        className
      )}
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full blur-2xl translate-x-6 -translate-y-6 group-hover:bg-green-300/40 transition-all" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-green-700 uppercase tracking-wide">
            {title}
          </p>

          {/* VALUE + RUPEE SIGN (BEFORE VALUE) */}
          <h3 className="mt-1 text-3xl font-medium text-green-900 flex items-center gap-1">
            {suffix && <span className="text-lg font-semibold">{suffix}</span>}
            {value}
          </h3>

          {desc && <p className="text-xs text-gray-500 mt-1">{desc}</p>}
        </div>

        {icon && (
          <div className="p-2 bg-green-100 text-green-700 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
