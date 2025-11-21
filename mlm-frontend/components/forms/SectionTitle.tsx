"use client";

import React from "react";

export default function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-lg font-semibold text-primary mb-4 border-b border-border pb-2">
      {title}
    </h2>
  );
}
