"use client";

import { useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

export default function CreateRoleModal({ onClose, onCreated }:any) {
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(false);

  const modules = [
    "Dashboard",
    "Manage Role",
    "Manage Users",
    "Add Events",
    "Join Events",
    "Add Training",
    "Join Training",
    "Profile",
    "Update KYC",
    "Change Password",
    "Welcome Letter",
    "ID Card",
    "All Team",
    "Direct Team",
    "Left Team",
    "Right Team",
    "Tree View",
    "Direct Business",
    "Team Business",
    "Business Summary",
    "Wallet Request",
    "Wallet Status",
    "Wallet Summary",
    "Add Products",
    "All Orders",
    "Buy Products",
    "Orders Status",
    "Orders Summary",
    "Sponser Income",
    "Matching Income",
    "Sponser Matching Income",
    "Repurchasing Income",
    "Grievance",
    "BV Summary"
  ];

  const [permissions, setPermissions] = useState(
    modules.map((module) => ({
      module,
      create: false,
      read: false,
      update: false,
      delete: false,
    }))
  );

  const togglePermission = (i:any, key:any) => {
    const updated:any = [...permissions];
    updated[i][key] = !updated[i][key];
    setPermissions(updated);
  };

  const toggleSelectAll = () => {
    const allSelected = permissions.every((p) => p.create && p.read && p.update && p.delete);

    setPermissions(
      permissions.map((p) => ({
        ...p,
        create: !allSelected,
        read: !allSelected,
        update: !allSelected,
        delete: !allSelected,
      }))
    );
  };

  const handleSubmit = async () => {
    if (!roleName.trim()) return;

    setLoading(true);

    try {
      const finalPermissions = permissions.filter(
        (p) => p.create || p.read || p.update || p.delete
      );

      await axiosInstance.post(ProjectApiList.api_createRoles, {
        name: roleName,
        description: roleName,
        permissions: finalPermissions,
      });

      onCreated();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-3">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl p-6 border">

        <h2 className="text-2xl font-semibold mb-4">Create Role</h2>

        <input
          type="text"
          className="w-full px-3 py-2 border rounded mb-4"
          placeholder="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />

        <div className="flex items-center gap-2 mb-3">
          <input type="checkbox" onChange={toggleSelectAll} />
          <span>Select All</span>
        </div>

        <div className="border rounded max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-2">Module</th>
                <th className="p-2">Create</th>
                <th className="p-2">Read</th>
                <th className="p-2">Update</th>
                <th className="p-2">Delete</th>
              </tr>
            </thead>

            <tbody>
              {permissions.map((perm:any, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{perm.module}</td>

                  {["create", "read", "update", "delete"].map((key) => (
                    <td key={key} className="text-center p-2">
                      <input
                        type="checkbox"
                        checked={perm[key]}
                        onChange={() => togglePermission(index, key)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-700 text-white px-4 py-2 rounded"
          >
            {loading ? "Creating..." : "Create Role"}
          </button>
        </div>
      </div>
    </div>
  );
}
