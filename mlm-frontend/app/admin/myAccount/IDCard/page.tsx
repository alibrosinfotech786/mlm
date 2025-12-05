"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";
import { Phone, Mail, User, Globe } from "lucide-react";

export default function IDCard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          toast.error("User not found in localStorage");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser?.user_id;

        if (!userId) {
          toast.error("User ID missing");
          return;
        }

        const res = await axiosInstance.get(
          `${ProjectApiList.USER_SHOW}?user_id=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res?.data?.success) {
          const u = res.data.user;

          setUser({
            name: u.name || "-",
            phone: u.phone || "N/A",
            email: u.email || "N/A",
            sponsorName: u.sponsor_name || "N/A",
            userId: u.user_id,
            website: "tathastuayurveda.world",
            photo: u.profile_picture
              ? `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}/${u.profile_picture}`
              : "/images/default-user.png",
          });
        }
      } catch (error) {
        toast.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Loading ID Card...
      </div>
    );
  }

  return (
    <>
      {/* <AdminHeader /> */}

      <section className="min-h-screen bg-gray-300 flex flex-col items-center justify-center py-10 space-y-6">

        {/* CARD FRONT - TOP CARD */}
        <div className="w-full max-w-lg bg-[#1a1a1a] rounded-3xl shadow-2xl p-0 overflow-hidden relative print:shadow-none">

          <div className="relative flex">

            {/* LEFT SIDE */}
            <div className="w-[55%] px-6 py-8 text-white z-10">
              <h1 className="text-3xl ">
                <span className="text-[#FF9800]">{user.name?.split(" ")[0]}</span>{" "}
                <span>{user.name?.split(" ").slice(1).join(" ")}</span>
              </h1>

              <p className="text-gray-400 mt-1 text-sm">{user.userId}</p>

              <div className="mt-6 space-y-1 text-sm">
                <Detail type="phone" label="Phone" value={user.phone} />
                <Detail type="email" label="Email" value={user.email} />
                <Detail type="sponsor" label="Sponsor" value={user.sponsorName} />
                <Detail type="website" label="Website" value={user.website} />
              </div>
            </div>

            {/* RIGHT SIDE PROFILE IMAGE */}
            <div className="w-[45%] relative flex items-center justify-center">
              <div className="absolute right-[-80px] w-[250px] h-[250px] rounded-full bg-[#FF9800] mr-25 mt-30"></div>

              <div className="absolute right-[-60px] w-[200px] h-[200px] rounded-full bg-white shadow-xl flex items-center justify-center mr-26 mt-30">
                <div className="relative w-45 h-45 rounded-full overflow-hidden">
                  <Image
                    src={user.photo}
                    alt="Profile Picture"
                    fill
                    className=""
                    priority
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="w-full bg-[#FF9800] h-10 rounded-b-3xl"></div>
        </div>

        {/* CARD BACK - BOTTOM CARD */}
        <div className="w-full max-w-lg bg-[#1a1a1a] rounded-3xl shadow-2xl overflow-hidden relative print:shadow-none flex flex-col items-center justify-center h-80">

          <div className="relative flex items-center justify-center w-full py-10">

            <div className="absolute w-[250px] h-[250px] rounded-full bg-[#FF9800] ml-50 mt-30"></div>

            <div className="absolute w-[200px] h-[200px] rounded-full bg-white shadow-xl flex items-center justify-center ml-50 mt-30">
              {/* PROFILE IMAGE ON BACK */}
              <div className="relative w-36 h-36 rounded-full overflow-hidden">
                  <Image
                  src="/images/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="w-full mb-20 bg-[#FF9800] h-10 flex pl-8 pt-2">
            <p className="text-white font-semibold tracking-wide text-sm">
              www.tathastuayurveda.world
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="
            fixed bottom-6 right-6
            bg-green-600 text-white 
            px-5 py-2 rounded shadow 
            hover:bg-green-700 transition 
            font-medium print:hidden cursor-pointer
          "
        >
          🖨️ Print
        </button>
      </section>
    </>
  );
}

/* DETAIL COMPONENT */
function Detail({
  type,
  label,
  value,
}: {
  type: "phone" | "email" | "sponsor" | "website";
  label: string;
  value: string;
}) {
  const orange = "#FF9800";

  const icons: any = {
    phone: <Phone size={18} color={orange} />,
    email: <Mail size={18} color={orange} />,
    sponsor: <User size={18} color={orange} />,
    website: <Globe size={18} color={orange} />,
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-start gap-3 ">
        <span className="mt-2">{icons[type]}</span>

        <div>
          <p className="text-gray-500 text-xs">{label}</p>
          <p className="text-white text-xs">{value}</p>
        </div>
      </div>
    </div>
  );
}