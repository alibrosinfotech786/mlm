"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  /* ==================================================
      LOAD USER FROM LOCALSTORAGE
  ================================================== */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");

      if (!stored) {
        toast.error("User not found");
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <>
        <AdminHeader />
        <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
          Loading profile...
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <AdminHeader />
        <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
          No user data found.
        </div>
      </>
    );
  }

  /* ==========================================
      PARSE VALUES
  ========================================== */

  const joinDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  const sponsorName = user.sponsor_name || "N/A";
  const sponsorId = user.sponsor_id || "N/A";

  const BASE = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

  // FIXED PROFILE IMAGE
  const profilePicture = user.profile_picture
    ? `${BASE}/${user.profile_picture}`.replace(/([^:]\/)\/+/g, "$1")
    : "/images/default-user.png";

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-linear-to-br from-green-50 via-white to-green-100 py-12 px-6 lg:px-20 font-sans">
        <div className="max-w-6xl mx-auto">

          {/* ===== Profile Banner ===== */}
          <div className="relative bg-linear-to-r from-green-600 to-green-500 text-white rounded-2xl shadow-lg overflow-hidden mb-10">

            <div className="flex flex-col md:flex-row items-center justify-between px-8 py-10 gap-6">

              {/* LEFT SIDE — PROFILE PIC + NAME */}
              <div className="flex items-center gap-6">

                {/* PROFILE IMAGE */}
                <div className="relative w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                  <Image
                    src={profilePicture}
                    alt="Profile Photo"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div>
                  <h1 className="text-3xl font-extrabold tracking-wide">
                    {user.name}
                  </h1>

                  <p className="text-green-100 text-sm tracking-wider mt-1">
                    Rank: <span className="uppercase">{user.rank}</span>
                  </p>

                  <p className="text-sm mt-2 text-green-50">
                    BV:{" "}
                    <span className="font-medium text-yellow-100">
                      {user.bv}
                    </span>
                  </p>
                </div>
              </div>

              {/* RIGHT BUTTONS */}
              <div className="flex gap-4">

                <Link
                  href="/admin/myAccount/profile/editProfile"
                  className="px-6 py-2.5 bg-yellow-300 text-green-900 font-semibold rounded-full shadow hover:bg-yellow-400 transition"
                >
                  Edit Profile
                </Link>

                <Link
                  href="/admin/myAccount/changePassword"
                  className="px-6 py-2.5 bg-white text-green-700 font-semibold rounded-full shadow hover:bg-green-50 transition"
                >
                  Change Password
                </Link>
              </div>
            </div>
          </div>

          {/* ===== DETAILS GRID ===== */}
          <div className="grid lg:grid-cols-3 gap-8">

            {/* LEFT SIDE CONTENT */}
            <div className="lg:col-span-2 space-y-8">

              <InfoCard title="Personal Information">
                <InfoRow label="User ID" value={user.user_id} />
                <InfoRow label="Email Address" value={user.email} />
                <InfoRow label="Phone Number" value={user.phone} />
                <InfoRow label="Address" value={user.address || "N/A"} />
                <InfoRow label="Nominee" value={user.nominee || "N/A"} />
                <InfoRow label="Rank" value={user.rank || "N/A"} />
                <InfoRow label="BV" value={user.bv || "0"} />
              </InfoCard>

              <InfoCard title="Network & Sponsor">
                <InfoRow label="Sponsor ID" value={sponsorId} />
                <InfoRow label="Sponsor Name" value={sponsorName} />
                <InfoRow label="Posting Side" value={user.position || "N/A"} />
              </InfoCard>

            </div>

            {/* RIGHT SIDE CARD */}
            <div className="bg-white/70 backdrop-blur-md border border-green-100 rounded-2xl shadow-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                Account Overview
              </h3>

              <div className="text-green-600 text-sm space-y-2">
                <p>
                  <span className="font-semibold text-green-800">Active Since:</span>{" "}
                  {joinDate}
                </p>

                <p>
                  <span className="font-semibold text-green-800">Posting Side:</span>{" "}
                  {user.position || "N/A"}
                </p>

                <p>
                  <span className="font-semibold text-green-800">Sponsor:</span>{" "}
                  {sponsorName}
                </p>
              </div>

              <div className="mt-6">
                <button className="px-6 py-2.5 bg-linear-to-r from-green-500 to-green-700 text-white rounded-full font-semibold shadow hover:opacity-90 transition">
                  View Network
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

/* ---------------------------------------------
    REUSABLE CARD COMPONENTS
--------------------------------------------- */
function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-green-100 rounded-2xl shadow-md hover:shadow-green-200/70 transition-all duration-300 p-6">
      <h2 className="text-lg font-semibold text-green-700 mb-4 border-b border-green-100 pb-2">
        {title}
      </h2>
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-green-800">{label}</h4>
      <p className="text-gray-700 mt-1 text-sm">{value}</p>
    </div>
  );
}
