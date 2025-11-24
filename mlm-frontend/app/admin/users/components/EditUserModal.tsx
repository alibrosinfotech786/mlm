"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";
import Image from "next/image";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role?: string;
  profile_picture?: string | null;
};

type Props = {
  user: User;
  open: boolean;
  onOpenChange: () => void;
  onUpdated: () => void;
};

type FormValues = {
  name: string;
  email: string;
  phone: string;
  address?: string;
  password?: string;
  password_confirmation?: string;
  role?: string;
  profile_picture?: FileList;
};

export default function EditUserModal({ user, open, onOpenChange, onUpdated }: Props) {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } =
    useForm<FormValues>();

  const [preview, setPreview] = useState<string | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

  useEffect(() => {
    reset({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address || "",
      role: user.role || "",
    });

    setPreview(
      user.profile_picture
        ? user.profile_picture.startsWith("http")
          ? user.profile_picture
          : `${BASE_URL}/${user.profile_picture}`
        : null
    );
  }, [user, reset]);

  useEffect(() => {
    const f = watch("profile_picture")?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  }, [watch("profile_picture")]);

  async function fetchRoles() {
    try {
      const res = await axiosInstance.get(ProjectApiList.api_getRoles);
      setRoles(res.data.roles || []);
    } catch {
      toast.error("Failed to load roles");
    }
  }

  useEffect(() => {
    fetchRoles();
  }, []);

  async function onSubmit(data: FormValues) {
    try {
      const fd = new FormData();
      fd.append("id", String(user.id));
      fd.append("name", data.name);
      fd.append("email", data.email);
      fd.append("phone", data.phone);
      fd.append("address", data.address || "");

      if (data.password) {
        fd.append("password", data.password);
        fd.append("password_confirmation", data.password_confirmation || "");
      }

      if (data.role) {
        fd.append("role", data.role);
      }

      if (data.profile_picture?.[0]) {
        fd.append("profile_picture", data.profile_picture[0]);
      }

      await axiosInstance.post(ProjectApiList.UPDATE_USER, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("User updated");
      onOpenChange();
      onUpdated();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update user");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl !w-[95vw]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="md:col-span-2 space-y-3">

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <input {...register("name", { required: true })} className="w-full border rounded px-3 py-2 text-sm" />
                  {errors.name && <p className="text-xs text-red-500">Required</p>}
                </div>

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input {...register("email", { required: true })} className="w-full border rounded px-3 py-2 text-sm" />
                </div>

                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <input {...register("phone", { required: true })} className="w-full border rounded px-3 py-2 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <select
                    {...register("role", { required: true })}
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="">Select Role</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="text-sm font-medium">Profile Picture</div>

              <div className="w-[120px] h-[120px] rounded overflow-hidden border bg-gray-50 flex items-center justify-center">
                {preview ? (
                  <Image src={preview} alt="preview" width={120} height={120} className="object-cover" unoptimized />
                ) : (
                  <div className="text-xs text-gray-500">No Image</div>
                )}
              </div>

              <label htmlFor="edit_profile_picture"
                className="cursor-pointer bg-green-600 text-white px-4 py-1 rounded-md text-sm hover:bg-green-700 transition">
                Choose File
              </label>

              <input type="file" id="edit_profile_picture" accept="image/*" {...register("profile_picture")} className="hidden" />
            </div>

          </div>

          <DialogFooter>
            <Button type="submit" className="bg-green-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>

            <Button variant="outline" onClick={onOpenChange}>Cancel</Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
