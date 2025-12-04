"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";
import Image from "next/image";

export default function FileManager() {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // confirm modal states
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [actionType, setActionType] = useState<"upload" | "delete" | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [uploadFormData, setUploadFormData] = useState<any>(null);

    // ===============================
    // FETCH FILES
    // ===============================
    const loadFiles = async () => {
        try {
            const res = await axiosInstance.get(ProjectApiList.UPLOADS);
            if (res.data.success) {
                setFiles(res.data.uploads.data);
            }
        } catch {
            toast.error("Failed to fetch files");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFiles();
    }, []);

    // ===============================
    // OPEN CONFIRMATION MODAL
    // ===============================
    const openConfirm = (type: "upload" | "delete", data?: any) => {
        setActionType(type);

        if (type === "upload") setUploadFormData(data);
        if (type === "delete") setSelectedId(data);

        setConfirmOpen(true);
    };

    // ===============================
    // CONFIRM ACTION HANDLER
    // ===============================
    const handleConfirm = async () => {
        setConfirmOpen(false);

        if (actionType === "upload") {
            await uploadFile(uploadFormData);
        }

        if (actionType === "delete" && selectedId) {
            await deleteFile(selectedId);
        }
    };

    // ===============================
    // UPLOAD FILE
    // ===============================
    const uploadFile = async (form: any) => {
        const file = form.file.files[0];
        if (!file) return toast.error("Please select a file");

        if (file.size > 10 * 1024 * 1024)
            return toast.error("Max size is 10MB");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", form.name.value);
        formData.append("description", form.description.value);

        setUploading(true);

        try {
            const res = await axiosInstance.post(ProjectApiList.UPLOADS, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.success) {
                toast.success("File uploaded!");
                loadFiles();
                form.reset();
            }
        } catch {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    // ===============================
    // DELETE FILE
    // ===============================
    const deleteFile = async (id: number) => {
        try {
            const res = await axiosInstance.delete(ProjectApiList.UPLOADS, {
                data: { id },
            });

            if (res.data.success) {
                toast.success("Deleted successfully");
                loadFiles();
            }
        } catch {
            toast.error("Delete failed");
        }
    };

    return (
        <section className="min-h-screen p-6 bg-gray-100">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Upload Form */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Upload File</h2>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            openConfirm("upload", e.target);
                        }}
                        className="space-y-4"
                    >
                        <input
                            type="file"
                            name="file"
                            accept=".pdf,.jpg,.jpeg,.png,.gif"
                            className="block w-full border rounded p-2"
                            required
                        />

                        <input
                            type="text"
                            name="name"
                            placeholder="Document Title (optional)"
                            className="w-full border rounded p-2"
                        />

                        <textarea
                            name="description"
                            placeholder="Description (optional)"
                            className="w-full border rounded p-2"
                        />

                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </form>
                </div>

                {/* File List */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>

                    {loading ? (
                        <p>Loading files...</p>
                    ) : files.length === 0 ? (
                        <p>No files uploaded yet.</p>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {files.map((f) => {
                                const fileUrl = `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}/${f.file_path}`;
                                const createdDate = new Date(f.created_at).toLocaleString("en-IN");

                                return (
                                    <div
                                        key={f.id}
                                        className="border rounded-lg p-4 bg-gray-50 shadow-sm"
                                    >
                                        {/* Preview */}
                                        {f.file_type === "pdf" ? (
                                            <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-600 text-lg font-semibold">
                                                PDF
                                            </div>
                                        ) : (
                                            <div className="relative w-full h-40">
                                                <Image
                                                    src={fileUrl}
                                                    alt={f.original_name}
                                                    fill
                                                    className="object-cover rounded"
                                                    unoptimized
                                                />
                                            </div>
                                        )}

                                        {/* FILE INFO */}
                                        <h3 className="font-bold text-gray-800 mt-3">{f.name || "No Title"}</h3>

                                        <p className="text-xs text-gray-500 mb-1">
                                            <span className="font-semibold">Original:</span> {f.original_name}
                                        </p>

                                        <p className="text-sm text-gray-600">{f.description || "No Description"}</p>

                                        <div className="text-xs text-gray-500 mt-2 space-y-1">
                                            <p><span className="font-semibold">Type:</span> {f.file_type.toUpperCase()}</p>
                                            <p><span className="font-semibold">Size:</span> {(f.file_size / 1024 / 1024).toFixed(2)} MB</p>
                                            <p><span className="font-semibold">Uploaded:</span> {createdDate}</p>
                                        </div>

                                        {/* ACTIONS */}
                                        <div className="flex justify-between mt-4">
                                            <a
                                                href={fileUrl}
                                                target="_blank"
                                                className="text-blue-600 text-sm hover:underline"
                                            >
                                                View
                                            </a>

                                            <button
                                                onClick={() => openConfirm("delete", f.id)}
                                                className="text-red-600 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    )}
                </div>
            </div>

            {/* =================== BUILT-IN CONFIRM MODAL =================== */}
            {confirmOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {actionType === "upload" ? "Confirm Upload" : "Confirm Delete"}
                        </h3>

                        <p className="text-gray-600 mt-2">
                            {actionType === "upload"
                                ? "Are you sure you want to upload this file?"
                                : "Are you sure you want to delete this file?"}
                        </p>

                        <div className="flex justify-end gap-3 mt-5">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
