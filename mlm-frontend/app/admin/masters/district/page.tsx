"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";

interface StateType {
  id: number;
  name: string;
}

interface DistrictType {
  id: number;
  name: string;
  code: string;
  state_id: number;
  state?: {
    id: number;
    name: string;
    code: string;
  };
}

export default function DistrictPage() {
  const [states, setStates] = useState<StateType[]>([]);
  const [districts, setDistricts] = useState<DistrictType[]>([]);
  const [loading, setLoading] = useState(true);

  /* Pagination + Search */
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  /* Form States */
  const [form, setForm] = useState({
    name: "",
    code: "",
    state_id: "",
    status: true,
  });

  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    code: "",
    state_id: "",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const isCreateDisabled =
    !form.name.trim() || !form.code.trim() || !form.state_id.trim();

  // Helper to normalize API list responses (array OR paginated object)
  function parseListResponse(res: any) {
    const data = res?.data;
    if (!data) return [];
    // case: res.data is already the array
    if (Array.isArray(data)) return data;
    // case: res.data.data is array (some APIs return data directly)
    if (Array.isArray(data.data)) return data.data;
    // case: res.data.data.data is array (Laravel pagination)
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (res?.data?.data?.data && Array.isArray(res.data.data.data))
      return res.data.data.data;
    // fallback: try common nested spots
    if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
  }

  // More robust parser for Laravel-style pagination payload
  function parsePaginatedPayload(res: any) {
    const payload = res?.data?.data;
    if (!payload) return { list: [], last_page: 1 };
    const list = payload?.data || payload || [];
    const last_page = payload?.last_page || payload?.lastPage || 1;
    return { list, last_page };
  }

  /* ---------------- FETCH STATES ---------------- */
  const fetchStates = async () => {
    try {
      const res = await axiosInstance.get(ProjectApiList.getState);

      // handle both simple array and paginated responses
      // try Laravel pagination first
      const payload = res?.data?.data;
      if (payload && Array.isArray(payload.data)) {
        setStates(payload.data);
      } else if (Array.isArray(res?.data?.data)) {
        setStates(res.data.data);
      } else if (Array.isArray(res?.data)) {
        setStates(res.data);
      } else {
        // fallback: try parseListResponse
        const list = parseListResponse(res);
        setStates(list);
      }
    } catch (err) {
      console.error("fetchStates error", err);
      toast.error("Failed to load states");
      setStates([]);
    }
  };

  /* ---------------- FETCH DISTRICTS (Pagination + Search) ---------------- */
  const fetchDistricts = async () => {
    setLoading(true);

    try {
      const res = await axiosInstance.get(
        `${ProjectApiList.getDistrict}?page=${page}&per_page=${entries}&search=${encodeURIComponent(
          search
        )}`
      );

      // Laravel style: res.data.data.data
      const payload = res?.data?.data;
      if (payload && Array.isArray(payload.data)) {
        setDistricts(payload.data);
        setTotalPages(payload.last_page || payload?.lastPage || 1);
      } else {
        // fallback: use parseListResponse
        const list = parseListResponse(res);
        setDistricts(list);
        // attempt to read last_page in multiple places
        const lastPage =
          res?.data?.data?.last_page ||
          res?.data?.last_page ||
          res?.data?.lastPage ||
          1;
        setTotalPages(lastPage);
      }
    } catch (err) {
      console.error("fetchDistricts error", err);
      toast.error("Failed to load districts");
      setDistricts([]);
      setTotalPages(1);
    }

    setLoading(false);
  };

  useEffect(() => {
    // load states once (no pagination)
    fetchStates();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchDistricts();
    }, 300);
    return () => clearTimeout(delay);
  }, [page, entries, search]);

  /* ---------------- CREATE ---------------- */
  const handleCreate = async () => {
    setIsCreating(true);

    try {
      await axiosInstance.post(ProjectApiList.postDistrict, {
        ...form,
        state_id: Number(form.state_id),
      });

      toast.success("District created successfully!");
      setForm({ name: "", code: "", state_id: "", status: true });

      // refresh to first page to show new item
      setPage(1);
      fetchDistricts();
    } catch (err) {
      console.error("create error", err);
      toast.error("Failed to create district");
    } finally {
      setIsCreating(false);
      setShowCreateConfirm(false);
    }
  };

  /* ---------------- OPEN EDIT ---------------- */
  const openEdit = async (id: number) => {
    try {
      const res = await axiosInstance.get(
        `${ProjectApiList.getDistrict}/show?id=${id}`
      );
      const d: DistrictType = res.data?.data;
      setEditId(id);
      setEditForm({
        name: d.name,
        code: d.code,
        state_id: String(d.state_id),
      });
      setShowEditModal(true);
    } catch (err) {
      console.error("openEdit error", err);
      toast.error("Failed to load district");
    }
  };

  /* ---------------- UPDATE ---------------- */
  const handleUpdate = async () => {
    if (!editId) return;

    try {
      await axiosInstance.post(ProjectApiList.updateDistrict, {
        id: editId,
        ...editForm,
        state_id: Number(editForm.state_id),
      });

      toast.success("District updated!");
      setShowEditModal(false);
      fetchDistricts();
    } catch (err) {
      console.error("update error", err);
      toast.error("Failed to update district");
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this district?")) return;

    try {
      await axiosInstance.post(ProjectApiList.deleteDistrict, { id });
      toast.success("District deleted");
      // if last item on page deleted, move back a page if needed
      fetchDistricts();
    } catch (err) {
      console.error("delete error", err);
      toast.error("Failed to delete");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-green-800">District Management</h1>
        <p className="text-green-700 text-sm">Manage, add and update district information.</p>
      </div>

      {/* CREATE CARD */}
      <div className="bg-white rounded-xl p-6 shadow border border-green-100">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Add New District</h2>

        <div className="grid sm:grid-cols-4 gap-4">
          <input
            className="border p-2 rounded focus:ring-2 focus:ring-green-500"
            placeholder="District Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="border p-2 rounded focus:ring-2 focus:ring-green-500"
            placeholder="Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />

          <select
            className="border p-2 rounded focus:ring-2 focus:ring-green-500"
            value={form.state_id}
            onChange={(e) => setForm({ ...form, state_id: e.target.value })}
          >
            <option value="">Select State</option>
            {Array.isArray(states) && states.length > 0 ? (
              states.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))
            ) : (
              <option disabled>Loading states...</option>
            )}
          </select>

          <button
            disabled={isCreateDisabled}
            onClick={() => setShowCreateConfirm(true)}
            className={`rounded-lg py-2 font-semibold text-white transition ${
              isCreateDisabled ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 shadow"
            }`}
          >
            Save
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <input
          placeholder="Search district..."
          className="border p-2 rounded w-full sm:w-64 focus:ring-2 focus:ring-green-500"
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-50 border-b">
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Code</th>
                <th className="p-3 font-semibold">State</th>
                <th className="p-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-3"><div className="h-4 bg-gray-200 rounded w-10" /></td>
                    <td className="p-3"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                    <td className="p-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                    <td className="p-3"><div className="h-4 bg-gray-200 rounded w-28" /></td>
                    <td className="p-3"><div className="h-4 bg-gray-200 rounded w-16 mx-auto" /></td>
                  </tr>
                ))
              ) : districts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">No districts found.</td>
                </tr>
              ) : (
                districts.map((d) => (
                  <tr key={d.id} className="border-b hover:bg-green-50 transition">
                    <td className="p-3">{d.id}</td>
                    <td className="p-3">{d.name}</td>
                    <td className="p-3">{d.code}</td>
                    <td className="p-3">{d.state?.name || "N/A"}</td>
                    <td className="p-3 flex gap-2 justify-center">
                      <button onClick={() => openEdit(d.id)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Edit</button>
                      <button onClick={() => handleDelete(d.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
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
          className={`px-4 py-2 rounded ${page <= 1 ? "bg-gray-300" : "bg-green-600 text-white hover:bg-green-700"}`}
        >
          Previous
        </button>

        <span className="font-semibold text-green-800">Page {page} of {totalPages}</span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className={`px-4 py-2 rounded ${page >= totalPages ? "bg-gray-300" : "bg-green-600 text-white hover:bg-green-700"}`}
        >
          Next
        </button>
      </div>

      {/* CREATE CONFIRM MODAL */}
      {showCreateConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow space-y-4">
            <h2 className="text-lg font-bold text-green-800">Confirm Create</h2>
            <p className="text-sm text-gray-600">Are you sure you want to create this district?</p>

            <div className="flex gap-3">
              <button onClick={() => setShowCreateConfirm(false)} className="w-1/2 bg-gray-500 py-2 rounded text-white">Cancel</button>
              <button disabled={isCreating} onClick={handleCreate} className="w-1/2 bg-green-600 text-white py-2 rounded">
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
            <h2 className="text-lg font-bold text-green-800">Edit District</h2>

            <input className="border p-2 w-full rounded focus:ring-2 focus:ring-green-500" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            <input className="border p-2 w-full rounded focus:ring-2 focus:ring-green-500" value={editForm.code} onChange={(e) => setEditForm({ ...editForm, code: e.target.value })} />
            <select className="border p-2 w-full rounded focus:ring-2 focus:ring-green-500" value={editForm.state_id} onChange={(e) => setEditForm({ ...editForm, state_id: e.target.value })}>
              <option value="">Select State</option>
              {states.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            <button onClick={handleUpdate} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">Update</button>
            <button onClick={() => setShowEditModal(false)} className="w-full bg-gray-500 py-2 rounded text-white">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
