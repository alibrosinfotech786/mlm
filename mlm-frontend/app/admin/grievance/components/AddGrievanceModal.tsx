"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void; // pass FormData to parent
}

type FormValues = {
  subject: string;
  description: string;
  attachment?: FileList;
};

export default function AddGrievanceModal({ isOpen, onClose, onSubmit }: Props) {
  const { register, handleSubmit, reset } = useForm<FormValues>();

  if (!isOpen) return null;

  const submit = (values: FormValues) => {
    const fd = new FormData();
    fd.append("subject", values.subject);
    fd.append("description", values.description);
    if (values.attachment && values.attachment.length > 0) {
      fd.append("attachment", values.attachment[0]);
    }
    onSubmit(fd);
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-green-700"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-semibold text-green-800 mb-4">
          Add Grievance
        </h3>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <label className="block text-sm text-green-800 mb-1">Subject</label>
            <input
              {...register("subject", { required: true })}
              className="w-full border border-green-300 rounded px-3 py-2"
              placeholder="Subject"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-green-800 mb-1">Description</label>
            <textarea
              {...register("description", { required: true })}
              className="w-full border border-green-300 rounded px-3 py-2"
              rows={4}
              placeholder="Describe your issue"
              required
            />
          </div>

          {/* Attachment */}
<div>
  <label className="block text-sm text-green-800 mb-1">Attachment (optional)</label>

  <div className="relative w-full">
    <input
      {...register("attachment")}
      type="file"
      id="fileUpload"
      accept=".jpg,.jpeg,.png,.pdf"
      className="hidden"
    />

    <label
      htmlFor="fileUpload"
      className="
        flex items-center justify-center 
        w-full border border-green-300 
        rounded-lg px-4 py-2 cursor-pointer
        bg-green-600 text-white font-medium 
        hover:bg-green-700 transition
      "
    >
      📁 Choose File
    </label>
  </div>

  <p className="text-xs text-gray-500 mt-1">Max 2MB • jpg, jpeg, png, pdf</p>
</div>


          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 border rounded text-green-700"
            >
              Cancel
            </button>

            <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
