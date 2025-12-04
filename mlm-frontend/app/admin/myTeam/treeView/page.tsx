"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import TreeView from "./components/TreeView";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";

interface TreeNode {
  id: string;
  name: string;
  photo?: string | null;

  phone?: string;
  sponsor_name?: string | null;
  bv?: string | number;

  left?: TreeNode | null;
  right?: TreeNode | null;
}


const MAX_LEVEL = 4;

export default function TreeViewPage() {
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [searchId, setSearchId] = useState("");
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

  const transformNode = (node: any): TreeNode => {
    if (!node || !node.user)
      return { id: "Vacant", name: "Vacant", photo: null };

    const lvl = node.level;
    const user = node.user;

    const cleanChildren = (node.children || []).filter(
      (c: any) => c && c.user
    );

    const leftChild = cleanChildren.find((c: any) => c.user.position === "left");
    const rightChild = cleanChildren.find(
      (c: any) => c.user.position === "right"
    );

    // ⭐ LEVEL 4 (stop recursion)
    if (lvl >= MAX_LEVEL)
      return {
        id: user.user_id,
        name: user.name,
        phone: user.phone,
        sponsor_name: user.sponsor_name,
        bv: user.bv,
        photo: user.profile_picture ? `${BASE_URL}/${user.profile_picture}` : null,
        left: null,
        right: null,
      };

    // ⭐ LEVEL 0–3 — include phone, sponsor, bv HERE ALSO
    return {
      id: user.user_id,
      name: user.name,
      phone: user.phone,
      sponsor_name: user.sponsor_name,
      bv: user.bv,
      photo: user.profile_picture ? `${BASE_URL}/${user.profile_picture}` : null,

      left: leftChild
        ? transformNode(leftChild)
        : { id: "Vacant", name: "Vacant", photo: null },

      right: rightChild
        ? transformNode(rightChild)
        : { id: "Vacant", name: "Vacant", photo: null },
    };
  };


  const fetchTree = async (uid?: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axiosInstance.get(
        `${ProjectApiList.MLM_HIERARCHY}?user_id=${uid || ""}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const formatted = transformNode(res.data.mlm_hierarchy);
        setTreeData(formatted);
        setUserDetails(res.data.mlm_hierarchy.user);
      } else toast.error("User not found");
    } catch {
      toast.error("Error fetching tree");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    if (u?.user_id) {
      setSearchId(u.user_id);
      fetchTree(u.user_id);
    }
  }, []);

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-green-50/40 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">

          <h1 className="text-2xl font-bold text-green-800">Tree View</h1>

          {/* Search + Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Search */}
            <div className="bg-white p-5 rounded-xl shadow-md">
              <h2 className="text-lg font-bold mb-3 text-green-800">Search Member</h2>

              <div className="flex gap-2">
                <input
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="border px-3 py-2 rounded-lg w-full text-sm"
                  placeholder="Enter User ID"
                />
                <button
                  onClick={() => fetchTree(searchId)}
                  className="bg-green-700 text-white px-4 rounded-lg"
                >
                  Search
                </button>
                <button
                  onClick={() => {
                    const u = JSON.parse(localStorage.getItem("user") || "{}");
                    if (u?.user_id) {
                      setSearchId(u.user_id);
                      fetchTree(u.user_id);
                    }
                  }}
                  className="bg-gray-500 text-white px-4 rounded-lg hover:bg-gray-600"
                >
                  Reset
                </button>

              </div>
            </div>

            {/* Details */}
            <div className="bg-white p-5 rounded-xl shadow-md">
              <h2 className="text-lg font-bold mb-3 text-green-800">Member Details</h2>

              {userDetails ? (
                <div className="text-sm text-green-900 leading-5">
                  <p><b>User ID:</b> {userDetails.user_id}</p>
                  <p><b>Name:</b> {userDetails.name}</p>
                  <p><b>Phone:</b> {userDetails.phone}</p>
                  <p><b>Sponsor:</b> {userDetails.sponsor_name || "N/A"}</p>
                  <p><b>BV:</b> {userDetails.bv}</p>
                </div>
              ) : (
                <p className="text-gray-400">No user selected</p>
              )}
            </div>

          </div>

          {/* Tree */}
          <div className="bg-white rounded-xl shadow-md border p-2 h-[600px] overflow-auto">
            {loading ? (
              <p className="text-center py-10 text-green-700">Loading Tree...</p>
            ) : treeData ? (
              <div className="scale-[0.60] mx-auto">
                <TreeView
                  data={treeData}
                  onNodeDoubleClick={(id) => {
                    setSearchId(id);
                    fetchTree(id);
                  }}
                />
              </div>
            ) : (
              <p className="text-red-600 text-center py-10">No Data</p>
            )}
          </div>

        </div>
      </section>
    </>
  );
}
