"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  /* LOAD USER */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!stored) return toast.error("User not found");

        const parsed = JSON.parse(stored);
        const userId = parsed?.user_id;

        if (!userId) return toast.error("Invalid User ID");

        const res = await axiosInstance.get(
          `${ProjectApiList.USER_SHOW}?user_id=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) setUser(res.data.user);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
        Loading profile...
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
        No user data found.
      </div>
    );

  const joinDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  const BASE = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

  const profilePicture = user.profile_picture
    ? `${BASE}/${user.profile_picture}`.replace(/([^:]\/)\/+/g, "$1")
    : "/images/default-user.png";

  return (
    <section className="min-h-screen bg-linear-to-br from-green-50 via-white to-green-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-16 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* ======================== PROFILE HEADER ======================== */}
        <div className="relative bg-linear-to-r from-green-600 to-green-500 text-white rounded-2xl shadow-lg overflow-hidden mb-8 sm:mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between px-6 sm:px-10 py-8 sm:py-12 gap-6">

            {/* LEFT – PROFILE IMAGE + NAME */}
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">

              {/* PROFILE IMAGE */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <Image
                  src={profilePicture}
                  alt="Profile Photo"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* NAME & BASIC INFO */}
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide">
                  {user.name}
                </h1>

                {/* <p className="text-green-100 text-sm mt-1">
                  Rank: <span className="uppercase">{user.rank}</span>
                </p> */}

                <p className="text-green-100 text-sm mt-1">
                  Package: <span className="uppercase">{user.package}</span>
                </p>

                <p className="text-green-50 text-sm mt-2">
                  BV:{" "}
                  <span className="font-semibold text-yellow-200">
                    {user.bv}
                  </span>
                </p>
              </div>
            </div>

            {/* RIGHT ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href="/admin/myAccount/profile/editProfile"
                className="w-full sm:w-auto px-5 py-2.5 bg-yellow-300 text-green-900 font-semibold rounded-full shadow hover:bg-yellow-400 transition text-center"
              >
                Edit Profile
              </Link>

              <Link
                href="/admin/myAccount/changePassword"
                className="w-full sm:w-auto px-5 py-2.5 bg-white text-green-700 font-semibold rounded-full shadow hover:bg-green-50 transition text-center"
              >
                Change Password
              </Link>
            </div>

          </div>
        </div>

        {/* ======================== GRID LAYOUT ======================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">

          {/* LEFT (2 columns) */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">

            {/* PERSONAL INFO */}
            <InfoCard title="Personal Information">
              <InfoRow label="User ID" value={user.user_id} />
              <InfoRow label="Email Address" value={user.email} />
              <InfoRow label="Phone Number" value={user.phone} />
              <InfoRow label="Address" value={user.address || "N/A"} />
              <InfoRow label="Nominee" value={user.nominee || "N/A"} />
              <InfoRow label="Rank" value={user.rank} />
              <InfoRow label="Package" value={user.package} />
              <InfoRow label="BV" value={user.bv} />
            </InfoCard>

            {/* NETWORK INFO */}
            <InfoCard title="Network & Sponsor">
              <InfoRow label="Sponsor ID" value={user.sponsor_id || "N/A"} />
              <InfoRow label="Sponsor Name" value={user.sponsor_name || "N/A"} />
              <InfoRow label="Posting Side" value={user.position || "N/A"} />
            </InfoCard>

            {/* REFERRAL LINK */}
            <div>
              <h3 className="text-sm font-semibold text-green-800 mb-2">Your Referral Link</h3>

              <div className="flex flex-col sm:flex-row items-center gap-2 bg-white border border-green-200 rounded-full px-3 py-2 overflow-hidden">
                <span className="text-green-700 text-xs truncate w-full">
                  {`https://tathastuayurveda.world/auth/signup?referral=${user.user_id}`}
                </span>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://tathastuayurveda.world/auth/signup?referral=${user.user_id}`
                    );
                    toast.success("Referral link copied!");
                  }}
                  className="px-4 py-1 bg-green-600 text-white rounded-full text-xs hover:bg-green-700"
                >
                  Copy
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT CARD */}
          <div className="bg-white/80 backdrop-blur-md border border-green-100 rounded-2xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-green-800 mb-4">
              Account Overview
            </h3>

            <div className="text-green-700 text-sm space-y-2">
              <p>
                <span className="font-semibold">Active Since:</span> {joinDate}
              </p>

              <p>
                <span className="font-semibold">Posting Side:</span>{" "}
                {user.position || "N/A"}
              </p>

              <p>
                <span className="font-semibold">Sponsor:</span>{" "}
                {user.sponsor_name || "N/A"}
              </p>
            </div>

            <div className="mt-6">
              <Link href="/admin/myTeam/treeView">
                <button className="w-full sm:w-auto px-6 py-2.5 bg-linear-to-r from-green-500 to-green-700 text-white rounded-full font-semibold shadow hover:opacity-90 transition">
                  View Network
                </button>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

/* ======================== REUSABLE COMPONENTS ======================== */

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-green-100 rounded-2xl shadow-md hover:shadow-green-300/40 transition-all p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-green-700 mb-4 border-b border-green-100 pb-2">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-green-800">{label}</h4>
      <p className="text-gray-700 mt-1 text-sm break-words">{value}</p>
    </div>
  );
}
