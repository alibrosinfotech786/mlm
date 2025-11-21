// app/admin/users/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";
import CreateUserModal from "./components/CreateUserModal";
import EditUserModal from "./components/EditUserModal";
import DeleteUserModal from "./components/DeleteUserModal";
import Image from "next/image";

type Role = {
  id: number;
  role_id: string;
  name: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  sponsor_id?: string;
  sponsor_name?: string;
  position?: string;
  role?: string;
  role_id?: string;
  profile_picture?: string | null;
  created_at?: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // pagination
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // modals
  const [openCreate, setOpenCreate] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

  function buildImageUrl(path?: string | null) {
    if (!path) return "/no-img.png";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/${path}`.replace(/([^:]\/)\/+/g, "$1");
  }

  /* ======================================================
      FETCH ROLES
  ====================================================== */
  async function fetchRoles() {
    try {
      const res = await axiosInstance.get(ProjectApiList.api_getRoles);
      if (res.data?.roles) {
        setRoles(res.data.roles);
      }
    } catch {
      toast.error("Failed to load roles");
    }
  }

  /* ======================================================
      FETCH USERS WITH BACKEND PAGINATION + FILTERS
  ====================================================== */
  async function fetchUsers() {
    try {
      setLoading(true);

      // Build dynamic URL
      let url = `${ProjectApiList.USERS}?page=${page}&per_page=${entries}&search=${search}`;

      // ⛔ Only add role_id if a role is selected
      if (roleFilter !== "") {
        url += `&role_id=${roleFilter}`;
      }

      const res = await axiosInstance.get(url);

      if (res.data?.users?.data) {
        setUsers(res.data.users.data);
        setTotalUsers(res.data.users.total);
      }
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page, entries, roleFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(totalUsers / entries));

  function onCreated() {
    setOpenCreate(false);
    setPage(1);
    fetchUsers();
  }

  function onUpdated() {
    setEditUser(null);
    fetchUsers();
  }

  function onDeleted() {
    setDeleteUser(null);
    fetchUsers();
  }

  function formatPrettyDate(dateString?: string) {
    if (!dateString) return "-";
    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-green-50/40 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header + Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-green-800">Users</h1>
              <p className="text-green-700 text-sm">Manage all registered users</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">

              {/* Search */}
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name / email / phone"
                className="border px-3 py-2 rounded-md w-full sm:w-60 text-sm"
              />

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                className="border px-2 py-2 rounded-md text-sm"
              >
                <option value="">All Roles</option>
                {roles.map((r) => (
                  <option key={r.role_id} value={r.role_id}>
                    {r.name}
                  </option>
                ))}
              </select>

              {/* Entries per page */}
              {/* <select
                value={entries}
                onChange={(e) => {
                  setEntries(Number(e.target.value));
                  setPage(1);
                }}
                className="border px-2 py-2 rounded-md text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select> */}

              {/* Create User */}
              <button
                onClick={() => setOpenCreate(true)}
                className="bg-green-700 text-white px-4 py-2 rounded-md text-sm"
              >
                + Add User
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-md border overflow-hidden">
            <div className="overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-green-100 text-green-800 sticky top-0 z-10">
                  <tr>
                    <th className="p-3 border">#</th>
                    <th className="p-3 border">Avatar</th>
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Email</th>
                    <th className="p-3 border">Phone</th>
                    <th className="p-3 border">Sponsor</th>
                    <th className="p-3 border">Position</th>
                    <th className="p-3 border">Role</th>
                    <th className="p-3 border">Created</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr><td colSpan={10} className="p-6 text-center">Loading...</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan={10} className="p-6 text-center text-gray-500">No users found</td></tr>
                  ) : (
                    users.map((u, idx) => (
                      <tr key={u.id} className="hover:bg-green-50">
                        <td className="p-3 border">{(page - 1) * entries + idx + 1}</td>

                        <td className="p-3 border">
                          <div className="w-10 h-10 rounded-full bg-green-200 text-green-900 font-semibold flex items-center justify-center overflow-hidden">
                            {u.profile_picture ? (
                              <>
                                <Image
                                  src={buildImageUrl(u.profile_picture)}
                                  alt="avatar"
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                  unoptimized
                                />
                              </>
                            ) : (
                              u.name?.charAt(0)?.toUpperCase()
                            )}
                          </div>
                        </td>

                        <td className="p-3 border">{u.name}</td>
                        <td className="p-3 border">{u.email}</td>
                        <td className="p-3 border">{u.phone}</td>
                        <td className="p-3 border">{u.sponsor_name || "-"}</td>
                        <td className="p-3 border">{u.position || "-"}</td>
                        <td className="p-3 border">{u.role || "-"}</td>
                        <td className="p-3 border">{formatPrettyDate(u.created_at)}</td>

                        <td className="p-3 border text-center">
                          <div className="flex gap-3 justify-center">
                            <button
                              onClick={() => setEditUser(u)}
                              className="text-blue-600 hover:underline"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => setDeleteUser(u)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-green-800">
              Showing {(page - 1) * entries + 1}–
              {Math.min(page * entries, totalUsers)} of {totalUsers}
            </p>

            <div className="flex items-center gap-2">
              <select
                value={entries}
                onChange={(e) => {
                  setEntries(Number(e.target.value));
                  setPage(1);
                }}
                className="border px-2 py-2 rounded-md text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded"
              >
                Prev
              </button>

              <span className="text-sm">Page {page} / {totalPages}</span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded"
              >
                Next
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Modals */}
      {openCreate && (
        <CreateUserModal
          open={openCreate}
          onOpenChange={setOpenCreate}
          onCreated={onCreated}
        />
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          open={!!editUser}
          onOpenChange={() => setEditUser(null)}
          onUpdated={onUpdated}
        />
      )}

      {deleteUser && (
        <DeleteUserModal
          user={deleteUser}
          open={!!deleteUser}
          onOpenChange={() => setDeleteUser(null)}
          onDeleted={onDeleted}
        />
      )}
    </>
  );
}
