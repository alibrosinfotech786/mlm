"use client";

import React, { useEffect, useState } from "react";
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

          if (u.profile_picture) {
            setPreviewImage(
              `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}/${u.profile_picture}`
            );
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
    setPreviewImage(URL.createObjectURL(file));
  };

  /* ==========================================================
      VALIDATION
  ========================================================== */
  const validateForm = () => {
    if (!user.name.trim()) return toast.error("Name is required");
    if (!user.email.trim()) return toast.error("Email is required");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))
      return toast.error("Enter a valid email");

    if (!user.phone.trim()) return toast.error("Phone number is required");
    if (!user.address.trim()) return toast.error("Address is required");

    return true;
  };

  /* ==========================================================
      SUBMIT FORM
  ========================================================== */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-700 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-20">
      <div className="max-w-3xl mx-auto bg-white border rounded-xl shadow p-6 sm:p-8">

        {/* TITLE */}
        <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-6 text-center sm:text-left">
          Update Profile Information
        </h2>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >

          {/* PROFILE PHOTO */}
          <div className="col-span-1 sm:col-span-2 flex flex-col items-center">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border shadow bg-gray-100 flex items-center justify-center">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/images/default-user.png"
                  className="w-16 h-16 sm:w-20 sm:h-20 opacity-80"
                  alt="Default User"
                />
              )}
            </div>

            {/* Choose file button */}
            <label
              htmlFor="profile_picture"
              className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition mt-3"
            >
              Choose Image
            </label>

            <input
              id="profile_picture"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* File name */}
            {profileImageFile && (
              <p className="text-xs text-gray-600 mt-2 text-center">
                Selected file:{" "}
                <span className="font-medium">{profileImageFile.name}</span>
              </p>
            )}
          </div>

          {/* FORM INPUTS */}
          <Input label="Full Name" name="name" value={user.name} onChange={handleChange} />
          <Input label="Email Address" name="email" value={user.email} onChange={handleChange} />
          <Input label="Phone Number" name="phone" value={user.phone} onChange={handleChange} />
          <Input label="Address" name="address" value={user.address} onChange={handleChange} />

          {/* BUTTONS */}
          <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row gap-4 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              {saving ? "Saving..." : "Update Profile"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/myAccount/profile")}
              className="w-full sm:w-auto px-6 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ==========================================================
    REUSABLE INPUT COMPONENT
========================================================== */

function Input({ label, name, value, onChange, type = "text" }: any) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 px-3 py-2 border rounded bg-white text-sm focus:ring-2 focus:ring-green-500 outline-none"
      />
    </div>
  );
}
