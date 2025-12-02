"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";

import bgImage from "@/public/letter/welcomeletter.jpg";

export default function WelcomeLetter() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);

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
            associateName: u.name || "-",
            userId: u.user_id || "-",
            sponsorId: u.sponsor_id || "N/A",
            sponsorName: u.sponsor_name || "N/A",
            joinDate: u.created_at
              ? new Date(u.created_at).toDateString()
              : "-",
            activationDate:
              u.activationDate || u.activation_date || "Not Activated",
            status: "Active",
          });
        } else {
          toast.error("User not found");
        }
      } catch {
        toast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleSendEmail = async () => {
    try {
      setSendingEmail(true);
      const token = localStorage.getItem("token");

      const res = await axiosInstance.post(
        ProjectApiList.SEND_WELCOME_LETTER,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res?.data?.success) {
        toast.success("Welcome letter sent successfully!");
      } else {
        toast.error("Failed to send welcome letter");
      }
    } catch {
      toast.error("Error sending welcome letter");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <>
      <AdminHeader />
      <section className="relative min-h-screen py-10 px-4 flex justify-center print:py-0">

        {/* IMAGE CONTAINER */}
        <div className="relative max-w-[820px] w-full print:max-w-full text-justify">

          {/* ⭐ MOVE LOGO HERE — ABOVE TEXT BLOCK ⭐ */}
          <div className="absolute top-[2%] right-[8%] z-30">
            <Image
              src="/images/logo.png"
              alt="Tathastu Ayurveda Logo"
              width={160}
              height={160}
              className="object-contain"
            />
          </div>

          {/* Background Image */}
          <Image
            src={bgImage}
            alt="Welcome Letter Background"
            className="w-full h-auto object-contain"
            priority
          />

          {/* TEXT BLOCK */}
          <div
            className="
        absolute 
        top-[8%]
        left-[8%]
        right-[8%]
        bottom-[8%]
        overflow-hidden
        flex flex-col
        text-gray-800
        leading-relaxed
        z-20
      "
          >

            <h1 className="text-3xl font-bold text-orange-700 mb-3 pt-20 text-center">
              Welcome Letter
            </h1>

            <h2 className="text-xl font-semibold text-orange-700 mb-4 text-center">
              Welcome to the Tathastu Ayurveda Family
            </h2>

            <p className="text-sm mb-4 text-justify">
              It gives us immense pleasure to welcome you as a valued Distributor of
              <span className="font-semibold text-orange-700"> Tathastu Ayurveda</span>.
              You are now part of a transparent, ethical, and fast-growing wellness organization
              dedicated to transforming lives through authentic Ayurvedic products and
              digital entrepreneurship.
            </p>

            <p className="text-sm mb-4 text-justify">
              As you begin this exciting journey, we extend our best wishes for your growth and
              success. Your Distributor ID and other details mentioned below will be required for
              all future communication with the company. Kindly ensure that your contact and mailing
              details are accurate for seamless correspondence.
            </p>

            <p className="text-sm mb-6 text-justify">
              If you need any assistance or clarification at any point, our Business Support Team
              is always available to guide you.
            </p>

            <h3 className="text-lg font-semibold text-orange-700 mb-3">
              Your Registration Details
            </h3>

            <div className="space-y-2 text-sm">
              <Detail label="Distributor Name" value={user?.associateName} />
              <Detail label="Distributor ID" value={user?.userId} />
              <Detail label="Sponsor ID" value={user?.sponsorId} />
              <Detail label="Sponsor Name" value={user?.sponsorName} />
              <Detail label="Joining Date" value={user?.joinDate} />
              <Detail label="Activation Date" value={user?.activationDate} />
              <Detail label="Status" value="Active" highlight />
            </div>

            <p className="text-sm mt-8 text-justify">
              Tathastu Ayurveda congratulates you on taking your first step towards a
              prosperous and rewarding future. We look forward to seeing you grow, lead,
              and achieve great success within our system.
            </p>

            <div className="mt-10">
              <p className="text-sm">
                <span className="font-semibold">With Warm Regards,</span> <br />
                <span className="font-semibold text-orange-700">Tathastu Ayurveda</span> <br />
                <span className="text-xs italic">Empowering Wellness, Wealth & Wisdom</span>
              </p>
            </div>

          </div>
        </div>

        {/* BUTTONS */}
        <div className="fixed bottom-5 right-5 flex gap-3 print:hidden">
          <button
            onClick={handleSendEmail}
            disabled={sendingEmail}
            className="px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:bg-gray-400"
          >
            {sendingEmail ? "Sending..." : "📧 Send Email"}
          </button>

          <button
            onClick={() => window.print()}
            className="px-5 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
          >
            🖨️ Print
          </button>
        </div>

      </section>

    </>
  );
}

/* REUSABLE DETAIL COMPONENT */
function Detail({ label, value, highlight }: any) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="font-semibold">{label}:</span>
      <span className={highlight ? "text-orange-700 font-semibold" : ""}>
        {value}
      </span>
    </div>
  );
}
