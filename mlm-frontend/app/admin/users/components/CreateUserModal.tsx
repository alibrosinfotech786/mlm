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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
};

type FormValues = {
  name: string;
  email: string;
  phone: string;
  address?: string;
  sponsor_id?: string;
  sponsor_name?: string;
  position?: string;
  nominee?: string;
  password: string;
  password_confirmation: string;
  profile_picture?: FileList;
  role?: string;
};

export default function CreateUserModal({ open, onOpenChange, onCreated }: Props) {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } =
    useForm<FormValues>();

  const [preview, setPreview] = useState<string | null>(null);
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    const file = watch("profile_picture")?.[0];
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
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
      fd.append("name", data.name);
      fd.append("email", data.email);
      fd.append("phone", data.phone);
      fd.append("address", data.address || "");
      fd.append("sponsor_id", data.sponsor_id || "");
      fd.append("sponsor_name", data.sponsor_name || "");
      fd.append("position", data.position || "");
      fd.append("nominee", data.nominee || "");

      fd.append("password", data.password);
      fd.append("password_confirmation", data.password_confirmation);

      if (data.role) {
        fd.append("role", data.role);
      }

      if (data.profile_picture?.[0]) {
        fd.append("profile_picture", data.profile_picture[0]);
      }

      await axiosInstance.post(ProjectApiList.REGISTER, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("User created");
      reset();
      setPreview(null);
      onOpenChange(false);
      onCreated();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create user");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl !w-[95vw]">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
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
                  <select {...register("role", { required: true })}
                    className="w-full border rounded px-3 py-2 text-sm">
                    <option value="">Select Role</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  {errors.role && <p className="text-xs text-red-500">Required</p>}
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

              <label htmlFor="profile_picture"
                className="cursor-pointer bg-green-600 text-white px-4 py-1 rounded-md text-sm hover:bg-green-700 transition">
                Choose File
              </label>

              <input type="file" id="profile_picture" accept="image/*" {...register("profile_picture")} className="hidden" />
            </div>

          </div>

          <DialogFooter>
            <Button type="submit" className="bg-green-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
