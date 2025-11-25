"use client";

import React from "react";

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  page?: number;
  totalPages?: number;
  entries?: number;
  onEntriesChange?: (value: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  emptyMessage?: string;
  className?: string;
  showPagination?: boolean;
  showSearch?: boolean;
}

function DataTableInner<T>({
  columns,
  data,
  loading,
  page = 1,
  totalPages = 1,
  entries = 10,
  onEntriesChange,
  onPrevious,
  onNext,
  search = "",
  onSearchChange,
  emptyMessage = "No records found",
  className = "",
  showPagination = true,
  showSearch = true,
}: DataTableProps<T>) {
  return (
    <div
      className={`overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white ${className}`}
    >
      {/* ===== Search Bar ===== */}
      {showSearch && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm text-gray-700 font-medium tracking-wide">
            Search and filter results
          </h3>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="🔍 Search by name or ID..."
              className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* ===== Table ===== */}
      <table className="min-w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-5 py-3 border-b border-gray-200 text-xs uppercase tracking-wide"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 text-gray-800">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="py-10 text-center text-gray-500">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-14 text-center bg-gray-50 text-gray-500">
                No data found
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-5 py-3 border-b border-gray-100 text-sm"
                  >
                    {col.render
                      ? col.render((row as any)[col.key], row, index)
                      : (row as any)[col.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ===== Pagination + Entries ===== */}
      {showPagination && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-700">
          {/* Left: Show Entries */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="entries"
              className="text-sm text-gray-700 font-medium"
            >
              Show:
            </label>
            <select
              id="entries"
              value={entries}
              onChange={(e) =>
                onEntriesChange && onEntriesChange(Number(e.target.value))
              }
              className="border border-gray-300 bg-white rounded-md px-2 py-1 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {[5, 10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-500">entries</span>
          </div>

          {/* Right: Pagination Controls */}
          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <button
              onClick={onPrevious}
              disabled={page === 1}
              className="px-4 py-1.5 border border-gray-300 rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-700 text-sm font-medium">
              Page {page} of {totalPages || 1}
            </span>
            <button
              onClick={onNext}
              disabled={page === totalPages || totalPages === 0}
              className="px-4 py-1.5 border border-gray-300 rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const DataTable = <T,>(props: DataTableProps<T>) => <DataTableInner {...props} />;
export default DataTable;
