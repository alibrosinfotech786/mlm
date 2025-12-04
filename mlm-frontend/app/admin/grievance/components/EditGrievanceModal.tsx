"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

interface Grievance {
  id: number;
  subject: string;
  description: string;
  attachment?: string | null;
  status: string;
}

interface Props {
  item: Grievance | null;
  onClose: () => void;
  onSubmit: (id: number, formData: FormData) => void;
}

type FormValues = {
  subject?: string;
  description?: string;
  attachment?: FileList;
};

export default function EditGrievanceModal({ item, onClose, onSubmit }: Props) {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      subject: item?.subject,
      description: item?.description,
    },
  });

  if (!item) return null;

  const submit = (values: FormValues) => {
    const fd = new FormData();
    fd.append("id", String(item.id));
    if (values.subject) fd.append("subject", values.subject);
    if (values.description) fd.append("description", values.description);
    if (values.attachment && values.attachment.length > 0) {
      fd.append("attachment", values.attachment[0]);
    }
    onSubmit(item.id, fd);
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-green-700"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-semibold text-green-800 mb-4">Edit Grievance</h3>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <label className="block text-sm text-green-800 mb-1">Subject</label>
            <input
              {...register("subject")}
              defaultValue={item.subject}
              className="w-full border border-green-300 rounded px-3 py-2"
              placeholder="Subject"
            />
          </div>

          <div>
            <label className="block text-sm text-green-800 mb-1">Description</label>
            <textarea
              {...register("description")}
              defaultValue={item.description}
              className="w-full border border-green-300 rounded px-3 py-2"
              rows={4}
              placeholder="Description"
            />
          </div>

     {/* Attachment */}
<div>
  <label className="block text-sm text-green-800 mb-1">
    Replace Attachment (optional)
  </label>

  {/* Hidden Input */}
  <input
    {...register("attachment")}
    type="file"
    id="edit-file-upload"
    accept=".jpg,.jpeg,.png,.pdf"
    className="hidden"
  />

  {/* Custom Button */}
  <label
    htmlFor="edit-file-upload"
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

  <p className="text-xs text-gray-500 mt-1">
    Uploading a file will replace the old attachment. (Max 2MB)
  </p>
</div>


          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { reset(); onClose(); }} className="px-4 py-2 border rounded text-green-700">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}
