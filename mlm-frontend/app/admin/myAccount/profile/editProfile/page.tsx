"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState<any>({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  /* ==========================================================
      LOAD USER DETAILS
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
            id: u.id,
            name: u.name || "",
            email: u.email || "",
            phone: u.phone || "",
            address: u.address || "",
          });

          // profile picture
          if (u.profile_picture) {
            setPreviewImage(
              `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}/${u.profile_picture}`
            );
          } else {
            setPreviewImage(null); // forces default icon
          }
        }
      } catch (err) {
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /* ==========================================================
      ON INPUT CHANGE
  ========================================================== */
  const handleChange = (e: any) => {
    setUser((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ==========================================================
      PROFILE IMAGE CHANGE
  ========================================================== */
  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImageFile(file);
    setPreviewImage(URL.createObjectURL(file)); // show preview instantly
  };

  /* ==========================================================
      SUBMIT FORM
  ========================================================== */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const fd = new FormData();
      fd.append("id", user.id);
      fd.append("name", user.name);
      fd.append("email", user.email);
      fd.append("phone", user.phone);
      fd.append("address", user.address);

      if (profileImageFile) {
        fd.append("profile_picture", profileImageFile);
      }

      const res = await axiosInstance.post(ProjectApiList.UPDATE_USER, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.data?.success) {
        toast.success("Profile updated successfully!");
        router.push("/admin/myAccount/profile");
      } else {
        toast.error(res?.data?.message || "Update failed");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <>
        <AdminHeader />
        <div className="min-h-screen flex items-center justify-center text-green-700">
          Loading...
        </div>
      </>
    );

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-background py-12 px-6 lg:px-20">
        <div className="max-w-3xl mx-auto bg-white border rounded-lg shadow p-8">

          <h2 className="text-xl font-semibold text-green-700 mb-6">
            Update Profile Information
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

            {/* Profile Picture */}
            <div className="col-span-2 flex flex-col items-center mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border shadow bg-gray-100 flex items-center justify-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/images/default-user.png"
                    className="w-20 h-20 opacity-70"
                    alt="Default User"
                  />
                )}
              </div>

              {/* Custom File Upload Button */}
<label
  htmlFor="profile_picture"
  className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition mt-3"
>
  Choose File
</label>

<input
  id="profile_picture"
  type="file"
  accept="image/*"
  onChange={handleImageChange}
  className="hidden"
/>

{/* File Name Display */}
{profileImageFile && (
  <p className="text-xs text-gray-600 mt-2">
    Selected: <span className="font-medium">{profileImageFile.name}</span>
  </p>
)}

            </div>

            {/* Name */}
            <Input label="Name" name="name" value={user.name} onChange={handleChange} />

            {/* Email */}
            <Input label="Email" name="email" value={user.email} onChange={handleChange} />

            {/* Phone */}
            <Input label="Phone" name="phone" value={user.phone} onChange={handleChange} />

            {/* Address */}
            <Input label="Address" name="address" value={user.address} onChange={handleChange} />

            {/* Buttons */}
            <div className="col-span-2 flex gap-4 mt-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded"
              >
                {saving ? "Saving..." : "Update Profile"}
              </button>

              <button
                type="button"
                className="px-6 py-2 bg-gray-200 rounded"
                onClick={() => router.push("/admin/myAccount/profile")}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </section>
    </>
  );
}

/* ==========================================================
    REUSABLE INPUT COMPONENT
========================================================== */
function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
}: any) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-1 px-3 py-2 border rounded bg-white"
      />
    </div>
  );
}
