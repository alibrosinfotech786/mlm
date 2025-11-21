"use client";

import React from "react";

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="relative w-full h-28 sm:h-36 md:h-44 lg:h-48 xl:h-52 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-r from-green-500 to-green-300 flex items-center justify-center text-center px-4">
        <h1
          className="
            text-2xl 
            sm:text-3xl 
            md:text-4xl 
            lg:text-5xl 
            font-extrabold 
            text-white 
            tracking-wide 
            drop-shadow-lg 
            leading-tight
          "
        >
          {title}
        </h1>
      </div>
    </header>
  );
}
