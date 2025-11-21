"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface Props {
  stockFilter: string;
  setStockFilter: (f: string) => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
}

export default function ProductFilters({
  stockFilter,
  setStockFilter,
  categoryFilter,
  setCategoryFilter,
}: Props) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-sm w-full md:w-1/4 h-fit sticky top-24">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Filters</h3>

      {/* STOCK FILTER */}
      <div className="mb-6">
        <p className="text-sm font-medium text-foreground mb-2">Stock</p>

        <div className="space-y-2 text-sm">
          <RadioItem
            label="All"
            checked={stockFilter === "All"}
            onChange={() => setStockFilter("All")}
          />

          <RadioItem
            label="In Stock"
            checked={stockFilter === "In Stock"}
            onChange={() => setStockFilter("In Stock")}
          />

          <RadioItem
            label="Out of Stock"
            checked={stockFilter === "Out of Stock"}
            onChange={() => setStockFilter("Out of Stock")}
          />
        </div>
      </div>

      {/* CATEGORY FILTER */}
      <div className="mb-6">
        <p className="text-sm font-medium text-foreground mb-2">Category</p>

        <div className="space-y-2 text-sm">
          <RadioItem
            label="All"
            checked={categoryFilter === "All"}
            onChange={() => setCategoryFilter("All")}
          />

          <RadioItem
            label="Personal Care"
            checked={categoryFilter === "Personal Care"}
            onChange={() => setCategoryFilter("Personal Care")}
          />

          <RadioItem
            label="Health Care"
            checked={categoryFilter === "Health Care"}
            onChange={() => setCategoryFilter("Health Care")}
          />
        </div>
      </div>

      <Button
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        onClick={() => {
          setStockFilter("All");
          setCategoryFilter("All");
        }}
      >
        Clear Filter
      </Button>
    </div>
  );
}

/* RADIO COMPONENT with GREEN THEMING */
function RadioItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="
          h-4 w-4 cursor-pointer
          accent-green-600
          focus:ring-green-600
          focus:outline-green-600
        "
      />
      <span className="text-foreground">{label}</span>
    </label>
  );
}
