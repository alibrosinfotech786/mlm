"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";

export default function WelcomeLetter() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

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

        // ✔ FIX: user is not array, it's an object
        if (res?.data?.success && res.data.user) {
          const u = res.data.user;

          setUser({
            associateName: u.name || "-",
            userId: u.user_id || "-",
            sponsorId: u.sponsor_id || "N/A",
            sponsorName: u.sponsor_name || "N/A",
            joinDate: u.created_at
              ? new Date(u.created_at).toDateString()
              : "-",
            activationDate:
              u.activationDate ||
              u.activation_date ||
              "Not Activated",
            status: u.status || "Not Active",
          });
        } else {
          toast.error("User not found");
        }
      } catch (err) {
        toast.error("Failed to load user details");
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
        <section className="min-h-screen flex items-center justify-center text-gray-600">
          Loading welcome letter...
        </section>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <AdminHeader />
        <section className="min-h-screen flex items-center justify-center text-red-500">
          Failed to load user details
        </section>
      </>
    );
  }

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-background flex flex-col items-center justify-center py-10 px-6 relative">

        {/* ===== Letter Card ===== */}
        <div className="relative w-full max-w-xl bg-white border border-border shadow-lg rounded-lg overflow-hidden p-8 leading-relaxed z-10">

          {/* Decorative Top */}
          <div className="absolute top-0 left-0 w-full h-20 overflow-hidden opacity-70 print:hidden">
            <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-full">
              <path
                d="M0.00,49.98 C150.00,150.00 349.39,-49.98 500.00,49.98 L500.00,0.00 L0.00,0.00 Z"
                className="fill-green-200"
              ></path>
            </svg>
          </div>

          {/* Decorative Bottom */}
          <div className="absolute bottom-0 left-0 w-full h-20 overflow-hidden rotate-180 opacity-70 print:hidden">
            <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-full">
              <path
                d="M0.00,49.98 C150.00,150.00 349.39,-49.98 500.00,49.98 L500.00,0.00 L0.00,0.00 Z"
                className="fill-green-200"
              ></path>
            </svg>
          </div>

          {/* ===== Header ===== */}
          <div className="relative z-10 flex justify-between items-start mb-6 pt-5">
            <div>
              <h1 className="text-2xl font-bold text-green-700 mb-1">Welcome Letter</h1>
              <p className="text-sm text-muted-foreground">
                Welcome to our ever shine family of{" "}
                <span className="text-green-600 font-medium">Tathastu Ayurveda Pvt Ltd</span>
              </p>
            </div>

            <Image
              src="/images/logo.png"
              alt="Tathastu Ayurveda Logo"
              width={90}
              height={90}
              className="object-contain"
            />
          </div>

          {/* ===== Message ===== */}
          <div className="relative z-10">
            <p className="text-sm text-foreground mb-4">
              It gives us immense pleasure to welcome you as a{" "}
              <span className="font-semibold text-green-700">Global Business Associate</span> of{" "}
              <span className="font-semibold text-green-700">Tathastu Ayurveda Pvt Ltd</span>.
            </p>

            {/* ===== Details ===== */}
            <div className="space-y-2 text-sm text-foreground mb-6">
              <Detail label="Associate Name" value={user.associateName} />
              <Detail label="User ID" value={user.userId} />
              <Detail label="Sponsor ID" value={user.sponsorId} />
              <Detail label="Sponsor Name" value={user.sponsorName} />
              <Detail label="Joining Date" value={user.joinDate} />
              <Detail label="Date of Activation" value={user.activationDate} />
              <Detail label="Status" value={user.status} highlight />
            </div>

            <p className="text-sm text-foreground pb-5">
              <span className="font-semibold">With Best Regards,</span>
              <br />
              <span className="text-green-700 font-medium">Tathastu Ayurveda Pvt Ltd</span>
            </p>
          </div>
        </div>

        {/* Print Button */}
        <button
          onClick={() => window.print()}
          className="fixed bottom-5 right-5 z-50 px-5 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition print:hidden"
        >
          🖨️ Print Letter
        </button>
      </section>
    </>
  );
}

/* ===== Reusable Detail Row ===== */
function Detail({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-semibold">{label}:</span>
      <span className={`${highlight ? "text-green-700 font-semibold" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}
