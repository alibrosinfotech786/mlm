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
  left?: TreeNode;
  right?: TreeNode;
}

export default function TreeViewPage() {
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [searchId, setSearchId] = useState("");
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

  const transformNode = (node: any): TreeNode => {
    const user = node?.user;
    const children = node?.children || [];

    const leftChild = children.find((c: any) => c.user?.position === "left");
    const rightChild = children.find((c: any) => c.user?.position === "right");

    return {
      id: user?.user_id || "Vacant",
      name: user?.name || "Vacant",
      photo: user?.profile_picture ? `${BASE_URL}/${user.profile_picture}` : null,
      left: leftChild ? transformNode(leftChild) : undefined,
      right: rightChild ? transformNode(rightChild) : undefined,
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

      if (res.data.success && res.data.mlm_hierarchy) {
        const root = res.data.mlm_hierarchy.user;
        setUserDetails(root);

        const formatted = transformNode(res.data.mlm_hierarchy);
        setTreeData(formatted);
      } else {
        toast.error("User not found");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.user_id) setSearchId(user.user_id), fetchTree(user.user_id);
  }, []);

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">

          <h1 className="text-3xl font-bold text-green-800 mb-4">Tree View</h1>


          {/*==================== Search + Details ====================*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Search Box */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-green-100">
              <h2 className="text-lg font-bold text-green-800 mb-2">
                Search Member
              </h2>
              <label className="block text-sm text-green-700 mb-1 font-medium">
                Enter User ID
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter User ID"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={() => fetchTree(searchId)}
                  className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
                >
                  Search
                </button>
                <button
                  onClick={() => {
                    const user = JSON.parse(localStorage.getItem("user") || "{}");
                    setSearchId(user.user_id || "");
                    fetchTree(user.user_id);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* User Details Box */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-green-100">
              <h2 className="text-lg font-bold text-green-800 mb-2">
                Member Details
              </h2>

              {userDetails ? (
                <div className="text-sm text-green-900 space-y-1">
                  <p><b>User ID:</b> {userDetails.user_id}</p>
                  <p><b>Name:</b> {userDetails.name}</p>
                  {/* <p><b>Email:</b> {userDetails.email}</p> */}
                  <p><b>Phone:</b> {userDetails.phone}</p>
                  <p><b>Sponsor:</b> {userDetails.sponsor_name || "N/A"}</p>
                  <p><b>Position:</b> {userDetails.position || "Root"}</p>
                  <p><b>BV:</b> {userDetails.bv || "0.00"}</p>
                </div>
              ) : (
                <p className="text-gray-500">No user selected</p>
              )}
            </div>

          </div>

          {/*==================== Tree Section ====================*/}
          <div className="bg-white rounded-xl shadow-md border border-green-100 p-6 overflow-auto">
            {loading ? (
              <p className="text-center p-10 font-semibold text-green-700">
                Loading Tree View...
              </p>
            ) : treeData ? (
              <TreeView
                data={treeData}
                isRoot={true}
                onNodeDoubleClick={(id: string) => {
                  setSearchId(id);
                  fetchTree(id);
                }}
              />

            ) : (
              <p className="text-center text-red-600">No Data</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
