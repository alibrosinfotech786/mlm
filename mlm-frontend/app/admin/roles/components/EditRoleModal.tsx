"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

export default function EditRoleModal({ role, onClose, onUpdated }:any) {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [roleName, setRoleName] = useState("");

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
    "ContactUS",
    "BV Summary",
    "Add State",
    "Add District",
    "All Wallet Request",
  ];

  const [permissions, setPermissions] = useState<any>([]);

  const fetchRoleDetails = async () => {
    try {
      const res = await axiosInstance.get(
        `${ProjectApiList.api_getRolesById}?role_id=${role.role_id}`
      );

      const data = res.data.role;
      setRoleName(data.name);

      const perms:any = modules.map((module) => {
        const found = data.permissions?.find((p:any) => p.module === module);

        return (
          found || {
            module,
            create: false,
            read: false,
            update: false,
            delete: false,
          }
        );
      });

      setPermissions(perms);
    } catch (error) {
      console.log(error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleDetails();
  }, []);

  const togglePermission = (index:any, key:any) => {
    const updated:any = [...permissions];
    updated[index][key] = !updated[index][key];
    setPermissions(updated);
  };

  const toggleSelectAll = () => {
    const allSelected:any = permissions.every((p:any) => p.create && p.read && p.update && p.delete);

    setPermissions(
      permissions.map((p:any) => ({
        ...p,
        create: !allSelected,
        read: !allSelected,
        update: !allSelected,
        delete: !allSelected,
      }))
    );
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await axiosInstance.post(ProjectApiList.api_updateRole, {
        role_id: role.role_id,
        name: roleName,
        description: roleName,
        permissions,
      });

      onUpdated();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-3">
      <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Edit Role</h2>

        {initialLoading ? (
          <div className="text-center py-6 text-gray-500">Loading...</div>
        ) : (
          <>
            <input
              type="text"
              className="w-full border p-2 rounded mb-4"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />

            <div className="mb-3">
              <input type="checkbox" onChange={toggleSelectAll} /> Select All
            </div>

            <div className="border rounded max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Module</th>
                    <th className="p-2">Create</th>
                    <th className="p-2">Read</th>
                    <th className="p-2">Update</th>
                    <th className="p-2">Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {permissions.map((perm:any, i:any) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">{perm.module}</td>

                      {["create", "read", "update", "delete"].map((key) => (
                        <td className="text-center p-2" key={key}>
                          <input
                            type="checkbox"
                            checked={perm[key]}
                            onChange={() => togglePermission(i, key)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={onClose} className="border px-4 py-2 rounded">
                Cancel
              </button>

              <button onClick={handleSubmit} className="bg-green-700 text-white px-4 py-2 rounded">
                {loading ? "Updating..." : "Update Role"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
