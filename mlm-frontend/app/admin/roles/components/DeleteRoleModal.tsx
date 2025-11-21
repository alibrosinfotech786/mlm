"use client";

import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DeleteRoleModal({
  role,
  onClose,
  onDeleted,
}: {
  role: any;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await axiosInstance.post(ProjectApiList.api_deleteRole, {
        role_id: role.role_id,
      });

      if (res.data.success) {
        toast.success("Role deleted successfully");
        onDeleted();
        onClose();
      } else {
        toast.error(res.data.message || "Failed to delete role");
      }
    } catch (error: any) {
      console.log(error);

      // Extract backend message safely
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to delete role";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-6 border">

        <h2 className="text-xl font-semibold text-red-600">Delete Role</h2>
        <p className="text-gray-600 text-sm mt-2">
          Are you sure you want to delete <b>{role.name}</b>?
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="bg-white border px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>

      </div>
    </div>
  );
}
