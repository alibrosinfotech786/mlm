"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/common/DataTable";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";
import AddGrievanceModal from "./components/AddGrievanceModal";
import ViewGrievanceModal from "./components/ViewGrievanceModal";
import EditGrievanceModal from "./components/EditGrievanceModal";

// import AddGrievanceModal from "./components/AddGrievanceModal";
// import ViewGrievanceModal from "./components/ViewGrievanceModal";
// import EditGrievanceModal from "./components/EditGrievanceModal";

interface Grievance {
  id: number;
  subject: string;
  description: string;
  attachment?: string | null;
  status: string;
  created_at: string;
  user_id?: string;
  user_name?: string;
  grievance_id?: string; // optional external id if any
  // any other props returned by API...
}

export default function GrievancePage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewItem, setViewItem] = useState<Grievance | null>(null);
  const [editItem, setEditItem] = useState<Grievance | null>(null);

  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsAdmin(parsed.role === "Admin");
      }
    }
  }, []);

  const formatPrettyDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`; // 24 Dec 2025
  };


  // Fetch paginated list
  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // API: /grievances?page=...&per_page=...&search=...
      const res = await axiosInstance.get(
        `${ProjectApiList.GRIEVANCES_LIST}?page=${page}&per_page=${entries}&search=${encodeURIComponent(
          search
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res?.data?.success) {
        // response shape assumed: { success: true, grievances: { current_page, data, last_page, ... } }
        const payload = res.data.grievances;
        setGrievances(
          (payload.data || []).map((g: any) => ({
            ...g,
            user_name: g.user?.name || "Unknown User",
            user_id: g.user?.user_id || "-",
          }))
        );

        setTotalPages(payload.last_page || 1);
        setPage(payload.current_page || 1);
      } else {
        setGrievances([]);
      }
    } catch (err) {
      console.error("Fetch grievances error", err);
      toast.error("Failed to load grievances");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => fetchGrievances(), 300);
    return () => clearTimeout(debounce);
  }, [page, entries, search]);

  // Create handler called from AddGrievanceModal (data contains file list)
  const handleCreate = async (formData: FormData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axiosInstance.post(
        ProjectApiList.GRIEVANCE_STORE,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res?.data?.success) {
        toast.success("Grievance submitted");
        setIsAddOpen(false);
        fetchGrievances();
      } else {
        toast.error(res?.data?.message || "Failed to create grievance");
      }
    } catch (err: any) {
      console.error("Create grievance", err);
      if (err?.response?.data?.errors) {
        Object.values(err.response.data.errors).forEach((m: any) =>
          toast.error((m as any)[0])
        );
      } else {
        toast.error("Failed to create grievance");
      }
    } finally {
      setLoading(false);
    }
  };

  const openView = async (id: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(
        `${ProjectApiList.GRIEVANCE_SHOW}?id=${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res?.data?.success) {
        setViewItem(res.data.grievance || res.data.data || null);
      } else {
        toast.error("Failed to load grievance details");
      }
    } catch (err) {
      console.error("View grievance", err);
      toast.error("Failed to load grievance details");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = async (id: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(
        `${ProjectApiList.GRIEVANCE_SHOW}?id=${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res?.data?.success) {
        setEditItem(res.data.grievance || res.data.data || null);
      } else {
        toast.error("Failed to load grievance for edit");
      }
    } catch (err) {
      console.error("Edit grunt", err);
      toast.error("Failed to load grievance for edit");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number, formData: FormData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axiosInstance.post(ProjectApiList.GRIEVANCE_UPDATE, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.data?.success) {
        toast.success("Grievance updated");
        setEditItem(null);
        fetchGrievances();
      } else {
        toast.error(res?.data?.message || "Failed to update");
      }
    } catch (err: any) {
      console.error("Update error", err);
      if (err?.response?.data?.errors) {
        Object.values(err.response.data.errors).forEach((m: any) =>
          toast.error((m as any)[0])
        );
      } else {
        toast.error("Failed to update grievance");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axiosInstance.post(
        ProjectApiList.GRIEVANCE_STATUS,
        { id, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res?.data?.success) {
        toast.success("Status updated");
        fetchGrievances();
      } else {
        toast.error(res?.data?.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Status update error", err);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this grievance?")) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axiosInstance.post(
        ProjectApiList.GRIEVANCE_DELETE,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res?.data?.success) {
        toast.success("Grievance deleted");
        fetchGrievances();
      } else {
        toast.error(res?.data?.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Delete error", err);
      toast.error("Failed to delete grievance");
    } finally {
      setLoading(false);
    }
  };

  // Table columns
  const columns: Column<Grievance>[] = [
    {
      key: "created_at",
      label: "Date",
      render: (val) => <span>{formatPrettyDate(val)}</span>,
    }
    ,
    { key: "user_name", label: "User Name" },
    { key: "grievance_id" as any, label: "Grievance ID" }, // optional field
    { key: "subject", label: "Subject" },
    {
      key: "description",
      label: "Description",
      render: (val: any) => (
        <p className="max-w-[200px] truncate" title={val}>
          {val}
        </p>
      ),
    },
    {
      key: "attachment",
      label: "Attachment",
      render: (val: string | null, row: Grievance) =>
        val ? (
          <button
            onClick={() => openView(row.id)}
            className="text-green-700 underline"
          >
            View
          </button>
        ) : (
          "-"
        ),
    },
    {
      key: "status",
      label: "Status",
      render: (val: string, row: Grievance) => (
        <div className="flex items-center gap-2">

          {/* 🔥 STATUS DROPDOWN — only for Admin */}
          {isAdmin ? (
            <select
              value={val}
              onChange={(e) => handleStatusUpdate(row.id, e.target.value)}
              className={`px-2 py-1 rounded text-xs border ${val === "resolved"
                ? "bg-green-100 border-green-300 text-green-800"
                : val === "in_progress"
                  ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                  : val === "pending"
                    ? "bg-gray-100 border-gray-300 text-gray-800"
                    : "bg-gray-100 border-gray-300 text-gray-800"
                }`}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          ) : (
            // Normal user sees readable status only
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${val === "resolved"
                ? "bg-green-100 text-green-700"
                : val === "in_progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
                }`}
            >
              {val.replace("_", " ").toUpperCase()}
            </span>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex gap-2">

            {/* View is allowed for everyone */}
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => openView(row.id)}
            >
              Details
            </button>

            {/* Edit — only NON-Admin */}
            {!isAdmin && (
              <button
                className="text-sm text-indigo-600 hover:underline"
                onClick={() => openEdit(row.id)}
              >
                Edit
              </button>
            )}

            {/* Delete — only NON-Admin */}
            {!isAdmin && (
              <button
                className="text-sm text-red-600 hover:underline"
                onClick={() => handleDelete(row.id)}
              >
                Delete
              </button>
            )}

          </div>
        </div>
      ),
    }

  ];

  const handlePrevious = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));


  return (
    <>
      {/* <AdminHeader /> */}

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-green-800">Grievances</h1>
              <p className="text-green-700 text-sm">
                Create, view and manage grievances (you & admin can edit/delete).
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!isAdmin && (
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="px-4 py-2 bg-green-700 text-white rounded-md"
                >
                  + Add Grievance
                </button>
              )}
            </div>

          </div>

          {/* <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
            <DataTable
              columns={columns}
              data={grievances}
              loading={loading}
              page={page}
              totalPages={totalPages}
              entries={entries}
              search={search}
              onSearchChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
              onEntriesChange={(val) => {
                setEntries(val);
                setPage(1);
              }}
              onPrevious={handlePrevious}
              onNext={handleNext}
              emptyMessage="No grievances found"
            />
          </div> */}

          {/* CUSTOM GRIEVANCE TABLE */}
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">

            {/* 🔍 SEARCH + ENTRIES */}
            <div className="p-4 border-b flex justify-between items-center">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search grievance..."
                className="border px-3 py-2 rounded-md w-72 text-sm"
              />

              <div className="flex items-center gap-2 text-sm">
                <span>Show</span>
                <select
                  value={entries}
                  onChange={(e) => {
                    setEntries(Number(e.target.value));
                    setPage(1);
                  }}
                  className="border rounded px-2 py-1"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
                <span>entries</span>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-green-600 text-white uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 border-r">Date</th>
                    <th className="px-4 py-3 border-r">User</th>
                    <th className="px-4 py-3 border-r">Grievance ID</th>
                    <th className="px-4 py-3 border-r">Subject</th>
                    <th className="px-4 py-3 border-r">Description</th>
                    <th className="px-4 py-3 border-r">Attachment</th>
                    <th className="px-4 py-3">Status / Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center">Loading...</td>
                    </tr>
                  ) : grievances.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-gray-500">
                        No grievances found
                      </td>
                    </tr>
                  ) : (
                    grievances.map((row) => (
                      <tr key={row.id} className="border-b hover:bg-green-50">

                        {/* DATE */}
                        <td className="px-4 py-3 border-r">
                          {formatPrettyDate(row.created_at)}
                        </td>

                        {/* USER */}
                        <td className="px-4 py-3 border-r">{row.user_name}</td>

                        {/* GRIEVANCE ID */}
                        <td className="px-4 py-3 border-r">{row.grievance_id || "-"}</td>

                        {/* SUBJECT */}
                        <td className="px-4 py-3 border-r">{row.subject}</td>

                        {/* DESCRIPTION */}
                        <td className="px-4 py-3 border-r">
                          <p className="max-w-[200px] truncate" title={row.description}>
                            {row.description}
                          </p>
                        </td>

                        {/* ATTACHMENT */}
                        <td className="px-4 py-3 border-r">
                          {row.attachment ? (
                            <button
                              onClick={() => openView(row.id)}
                              className="text-green-700 underline"
                            >
                              View
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* STATUS + ACTIONS */}
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-2">

                            {/* STATUS DROPDOWN */}
                            {isAdmin ? (
                              <select
                                value={row.status}
                                onChange={(e) =>
                                  handleStatusUpdate(row.id, e.target.value)
                                }
                                className={`px-2 py-1 text-xs rounded border ${row.status === "resolved"
                                    ? "bg-green-100 border-green-300 text-green-800"
                                    : row.status === "in_progress"
                                      ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                                      : "bg-gray-100 border-gray-300 text-gray-700"
                                  }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                              </select>
                            ) : (
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold text-center ${row.status === "resolved"
                                    ? "bg-green-100 text-green-700"
                                    : row.status === "in_progress"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                              >
                                {row.status.replace("_", " ").toUpperCase()}
                              </span>
                            )}

                            {/* ACTION BUTTONS */}
                            <div className="flex items-center gap-3">

                              {/* VIEW */}
                              <button
                                onClick={() => openView(row.id)}
                                className="text-blue-600 text-xs hover:underline"
                              >
                                Details
                              </button>

                              {/* EDIT (User only) */}
                              {!isAdmin && (
                                <button
                                  onClick={() => openEdit(row.id)}
                                  className="text-indigo-600 text-xs hover:underline"
                                >
                                  Edit
                                </button>
                              )}

                              {/* DELETE (User only) */}
                              {!isAdmin && (
                                <button
                                  onClick={() => handleDelete(row.id)}
                                  className="text-red-600 text-xs hover:underline"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="p-4 border-t flex justify-between items-center">

              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={`px-3 py-1 border rounded ${page === 1 ? "opacity-50" : "hover:bg-green-100"
                  }`}
              >
                Prev
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-3 py-1 border rounded ${num === page ? "bg-green-600 text-white" : "hover:bg-green-100"
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className={`px-3 py-1 border rounded ${page === totalPages ? "opacity-50" : "hover:bg-green-100"
                  }`}
              >
                Next
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* Modals */}
      <AddGrievanceModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={(data) => {
          // data is FormData (constructed in modal)
          handleCreate(data as unknown as FormData);
        }}
      />

      <ViewGrievanceModal
        item={viewItem}
        onClose={() => setViewItem(null)}
      />

      <EditGrievanceModal
        item={editItem}
        onClose={() => setEditItem(null)}
        onSubmit={(id: any, fd: any) => handleUpdate(id, fd)}
      />
    </>
  );
}
