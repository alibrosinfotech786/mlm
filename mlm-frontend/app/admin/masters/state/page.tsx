"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";

interface StateType {
  id: number;
  name: string;
  code: string;
  status: boolean;
}

export default function StatePage() {
  const [states, setStates] = useState<StateType[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState(10);
  const [search, setSearch] = useState("");

  const [totalPages, setTotalPages] = useState(1);

  /* CREATE FORM */
  const [form, setForm] = useState({
    name: "",
    code: "",
    status: true,
  });

  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const isCreateDisabled = form.name.trim() === "" || form.code.trim() === "";

  /* EDIT FORM */
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    code: "",
    status: true,
  });
  const [showEditModal, setShowEditModal] = useState(false);

  /* ============================
     FETCH STATES WITH PAGINATION
     ============================ */
  const fetchStates = async () => {
    setLoading(true);

    try {
      const res = await axiosInstance.get(
        `${ProjectApiList.getState}?page=${page}&per_page=${entries}&search=${encodeURIComponent(
          search
        )}`
      );

      const payload = res.data;

      // Laravel pagination structure
      const list = payload?.data || [];
      const totalPages = payload?.last_page || 1;

      setStates(list);
      setTotalPages(totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load states");
    }

    setLoading(false);
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchStates(), 300);
    return () => clearTimeout(delay);
  }, [page, entries, search]);

  /* ============================
          CREATE
     ============================ */
  const handleCreate = async () => {
    setIsCreating(true);

    try {
      await axiosInstance.post(ProjectApiList.postState, form);
      toast.success("State created successfully!");

      setForm({ name: "", code: "", status: true });
      fetchStates();
    } catch {
      toast.error("Create failed");
    }

    setIsCreating(false);
    setShowCreateConfirm(false);
  };

  /* ============================
          OPEN EDIT 
     ============================ */
  const openEdit = async (id: number) => {
    const res = await axiosInstance.get(
      `${ProjectApiList.getState}/show?id=${id}`
    );

    const data = res.data?.data;
    setEditId(id);

    setEditForm({
      name: data.name,
      code: data.code,
      status: data.status,
    });

    setShowEditModal(true);
  };

  /* ============================
          UPDATE
     ============================ */
  const handleUpdate = async () => {
    if (!editId) return;

    try {
      await axiosInstance.post(ProjectApiList.getState, {
        id: editId,
        ...editForm,
      });

      toast.success("State updated!");
      setShowEditModal(false);
      fetchStates();
    } catch {
      toast.error("Update failed");
    }
  };

  /* ============================
          DELETE
     ============================ */
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this state?")) return;

    try {
      await axiosInstance.post(ProjectApiList.deleteState, { id });
      toast.success("State deleted");
      fetchStates();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-green-800">State Management</h1>
        <p className="text-green-700 text-sm">
          Manage, add and update state information.
        </p>
      </div>

      {/* CREATE CARD */}
      <div className="bg-white rounded-xl p-6 shadow border border-green-100 space-y-4">
        <h2 className="text-xl font-semibold text-green-800">Add New State</h2>

        <div className="grid sm:grid-cols-3 gap-4">
          <input
            className="border p-2 rounded focus:ring-2 focus:ring-green-500"
            placeholder="State Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="border p-2 rounded focus:ring-2 focus:ring-green-500"
            placeholder="Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />

          <button
            disabled={isCreateDisabled}
            onClick={() => setShowCreateConfirm(true)}
            className={`rounded-lg py-2 font-semibold text-white transition ${
              isCreateDisabled
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 shadow"
            }`}
          >
            Save
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <input
          className="border p-2 rounded w-full sm:w-64 focus:ring-2 focus:ring-green-500"
          placeholder="Search state..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="border p-2 rounded focus:ring-2 focus:ring-green-500"
          value={entries}
          onChange={(e) => {
            setEntries(Number(e.target.value));
            setPage(1);
          }}
        >
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n} entries
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border border-green-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-green-50 border-b">
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Code</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-3">
                      <div className="h-4 w-10 bg-gray-200 rounded" />
                    </td>
                    <td className="p-3">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </td>
                    <td className="p-3">
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                    </td>
                    <td className="p-3">
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                    </td>
                    <td className="p-3">
                      <div className="h-4 w-20 bg-gray-200 rounded mx-auto" />
                    </td>
                  </tr>
                ))
              ) : states.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No states found.
                  </td>
                </tr>
              ) : (
                states.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-green-50/50">
                    <td className="p-3">{s.id}</td>
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{s.code}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          s.status
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {s.status ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => openEdit(s.id)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(s.id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center pt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className={`px-4 py-2 rounded ${
            page <= 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Previous
        </button>

        <span className="font-semibold text-green-800">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className={`px-4 py-2 rounded ${
            page >= totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Next
        </button>
      </div>

      {/* CREATE CONFIRM MODAL */}
      {showCreateConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow space-y-4">
            <h2 className="text-lg font-bold text-green-800">Confirm Create</h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to create this state?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateConfirm(false)}
                className="w-1/2 bg-gray-500 py-2 rounded text-white"
              >
                Cancel
              </button>

              <button
                disabled={isCreating}
                onClick={handleCreate}
                className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-2 rounded flex justify-center items-center gap-2"
              >
                {isCreating && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {isCreating ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow space-y-4">
            <h2 className="text-lg font-bold text-green-800">Edit State</h2>

            <input
              className="border p-2 w-full rounded focus:ring-2 focus:ring-green-500"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />

            <input
              className="border p-2 w-full rounded focus:ring-2 focus:ring-green-500"
              value={editForm.code}
              onChange={(e) =>
                setEditForm({ ...editForm, code: e.target.value })
              }
            />

            <button
              onClick={handleUpdate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              Update
            </button>

            <button
              onClick={() => setShowEditModal(false)}
              className="w-full bg-gray-500 py-2 rounded text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
