"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

import CreateRoleModal from "./components/CreateRoleModal";
import EditRoleModal from "./components/EditRoleModal";
import DeleteRoleModal from "./components/DeleteRoleModal";

import { Plus, Edit, Trash2 } from "lucide-react";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(null);

  const fetchRoles = async () => {
    try {
      const res = await axiosInstance.get(ProjectApiList.api_getRoles);
      setRoles(res.data.roles || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Roles</h1>
          <p className="text-gray-600 text-sm mt-1">
            {roles.length} roles available
          </p>
        </div>

        <button
          onClick={() => setOpenCreateModal(true)}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Role
        </button>
      </div>

      <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Role Name</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Created</th>
                <th className="py-3 px-4 text-left">Updated</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse border-b">
                    <td className="py-4 px-4">
                      <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-40 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-20 bg-gray-200 mx-auto rounded"></div>
                    </td>
                  </tr>
                ))
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    No roles found.
                  </td>
                </tr>
              ) : (
                roles.map((role: any) => (
                  <tr
                    key={role.role_id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">{role.role_id}</td>
                    <td className="py-3 px-4 font-medium">{role.name}</td>
                    <td className="py-3 px-4">{role.description || "-"}</td>
                    <td className="py-3 px-4">{formatDateTime(role.created_at)}</td>
                    <td className="py-3 px-4">{formatDateTime(role.updated_at)}</td>

                    <td className="py-3 px-4">
                      <div className="flex justify-center items-center gap-4">
                        <button
                          onClick={() => setOpenEditModal(role)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" /> 
                          {/* Edit */}
                        </button>

                        <button
                          onClick={() => setOpenDeleteModal(role)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" /> 
                          {/* Delete */}
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

      {openCreateModal && (
        <CreateRoleModal onClose={() => setOpenCreateModal(false)} onCreated={fetchRoles} />
      )}

      {openEditModal && (
        <EditRoleModal
          role={openEditModal}
          onClose={() => setOpenEditModal(null)}
          onUpdated={fetchRoles}
        />
      )}

      {openDeleteModal && (
        <DeleteRoleModal
          role={openDeleteModal}
          onClose={() => setOpenDeleteModal(null)}
          onDeleted={fetchRoles}
        />
      )}
    </div>
  );
}
