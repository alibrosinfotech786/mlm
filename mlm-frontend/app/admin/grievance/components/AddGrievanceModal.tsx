"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

interface GrievanceFormData {
  subject: string;
  description: string;
  attachment?: FileList;
}

interface AddGrievanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GrievanceFormData) => void;
}

export default function AddGrievanceModal({
  isOpen,
  onClose,
  onSubmit,
}: AddGrievanceModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GrievanceFormData>();

  const handleFormSubmit = (data: GrievanceFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-green-700 transition"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-green-800 mb-4">
          Add New Grievance
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              {...register("subject", { required: "Subject is required" })}
              type="text"
              placeholder="Enter grievance subject"
              className="w-full border border-green-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            {errors.subject && (
              <p className="text-red-600 text-xs mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description", { required: "Description is required" })}
              rows={4}
              placeholder="Write your grievance details..."
              className="w-full border border-green-300 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-green-500 focus:outline-none"
            ></textarea>
            {errors.description && (
              <p className="text-red-600 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Attachment */}
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">
              Attachment (optional)
            </label>
            <input
              {...register("attachment")}
              type="file"
              className="w-full border border-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded-md file:bg-green-700 file:text-white hover:file:bg-green-600 transition"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md border border-green-300 text-green-800 hover:bg-green-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm rounded-md bg-green-700 text-white font-medium hover:bg-green-600 transition"
            >
              Submit Grievance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
