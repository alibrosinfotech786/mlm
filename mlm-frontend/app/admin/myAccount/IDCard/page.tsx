"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";

export default function IDCard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  /* ==========================================================
      FETCH USER DETAILS
  ========================================================== */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axiosInstance.get(ProjectApiList.USER, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res?.data?.success && res.data.user) {
          const u = res.data.user;

          setUser({
            name: u.name || "-",
            userId: u.user_id || "-",
            sponsorId: u.sponsor_id || "N/A",
            sponsorName: u.sponsor_name || "N/A",
            joinDate: u.created_at
              ? new Date(u.created_at).toDateString()
              : "-",
            rank: "Distributor",

            // ✅ real profile picture from backend
            photo: u.profile_picture
              ? `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}/${u.profile_picture}`
              : "",
          });
        } else {
          toast.error("User data not found");
        }
      } catch {
        toast.error("Failed to load user information");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <>
        <AdminHeader />
        <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
          Loading ID Card...
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <AdminHeader />
        <div className="min-h-screen flex justify-center items-center text-red-600 text-lg">
          Failed to load user data
        </div>
      </>
    );
  }

  /* Safe DP fallback */
  const photoSrc =
    user.photo && user.photo.trim() !== ""
      ? user.photo
      : "/images/default-user.png";

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-background flex flex-col items-center justify-center py-10 px-6 relative">

        {/* ===== ID Card ===== */}
        <div className="w-full max-w-sm bg-white border border-border rounded-2xl shadow-lg overflow-hidden relative print:shadow-none">

          {/* Header */}
          <div className="bg-green-700 p-5 flex flex-col items-center text-center">
            <Image
              src="/images/logo.png"
              alt="Tathastu Ayurveda Logo"
              width={80}
              height={80}
              className="rounded-full mb-2"
              priority
            />
            <h1 className="text-lg font-bold text-white tracking-wide uppercase">
              Tathastu Ayurveda
            </h1>
            <p className="text-white/80 text-xs tracking-widest">
              Healing Roots, Cultivating Prosperity
            </p>
          </div>

          {/* Profile Section */}
          <div className="flex flex-col items-center py-6 px-5">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-green-600 shadow-md bg-white">
              {user.photo && user.photo.trim() !== "" ? (
                <Image
                  src={photoSrc}
                  alt={`${user.name} Profile`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span className="flex items-center justify-center w-full h-full text-3xl font-semibold text-green-700 bg-green-100">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              )}

            </div>

            <h2 className="text-lg font-semibold text-foreground mt-4 capitalize">
              {user.name}
            </h2>

            <p className="text-sm text-green-700 font-medium mt-1">
              {user.rank}
            </p>
          </div>

          <hr className="border-t border-border my-2" />

          {/* Details */}
          <div className="px-6 py-4 text-sm text-foreground space-y-2">
            <Detail label="User ID" value={user.userId} />
            <Detail label="Sponsor ID" value={user.sponsorId} />
            <Detail label="Sponsor Name" value={user.sponsorName} />
            <Detail label="Join Date" value={user.joinDate} />
          </div>

          {/* Footer */}
          <div className="bg-green-700 text-center py-3">
            <p className="text-white text-xs tracking-wider">
              www.tathastuayurveda.in
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-5 right-5 z-50 flex gap-3 print:hidden">
          <button
            onClick={async () => {
              try {
                setSendingEmail(true);
                const token = localStorage.getItem("token");
                const res = await axiosInstance.post(
                  ProjectApiList.SEND_ID_CARD,
                  {},
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                if (res?.data?.success) {
                  toast.success(
                    res.data.message || "ID Card sent successfully to your email"
                  );
                } else {
                  toast.error(res.data.message || "Failed to send ID Card email");
                }
              } catch (err: any) {
                toast.error(
                  err?.response?.data?.message ||
                    "Failed to send ID Card email"
                );
              } finally {
                setSendingEmail(false);
              }
            }}
            disabled={sendingEmail}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
          >
            {sendingEmail ? "Sending..." : "📧 Send Email"}
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-green-600 text-white rounded-md shadow-lg hover:bg-green-700 transition-all cursor-pointer"
          >
            🖨️ Print ID Card
          </button>
        </div>
      </section>
    </>
  );
}

/* Reusable Detail Row */
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border pb-1">
      <span className="font-medium text-muted-foreground">{label}:</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
