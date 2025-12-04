"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";
import Image from "next/image";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export default function FileManagerListing() {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // modal states
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState<"upload" | "delete" | null>(null);
    const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
    const [uploadFormData, setUploadFormData] = useState<any>(null);

    // ========== FETCH FILES ==========
    const loadFiles = async () => {
        try {
            const res = await axiosInstance.get(ProjectApiList.UPLOADS);
            if (res.data.success) setFiles(res.data.uploads.data);
        } catch {
            toast.error("Failed to load files");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFiles();
    }, []);

    // ========== OPEN MODAL ==========
    function openConfirmation(type: "upload" | "delete", data?: any) {
        setModalType(type);

        if (type === "upload") setUploadFormData(data);
        if (type === "delete") setSelectedFileId(data);

        setOpenModal(true);
    }

    // ========== HANDLE CONFIRM ==========
    async function handleConfirm() {
        setOpenModal(false);

        if (modalType === "upload") {
            await uploadFile(uploadFormData);
        }

        if (modalType === "delete" && selectedFileId) {
            await deleteFile(selectedFileId);
        }
    }

    // ========== UPLOAD FILE ==========
    async function uploadFile(form: any) {
        const file = form.file.files[0];
        if (!file) return toast.error("Please select a file");

        if (file.size > 10 * 1024 * 1024)
            return toast.error("Max size 10MB allowed");

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
                form.reset();
                loadFiles();
            }
        } catch {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    }

    // ========== DELETE FILE ==========
    async function deleteFile(id: number) {
        try {
            const res = await axiosInstance.delete(ProjectApiList.UPLOADS, {
                data: { id },
            });

            if (res.data.success) {
                toast.success("File deleted");
                loadFiles();
            }
        } catch {
            toast.error("Delete failed");
        }
    }

    return (
        <div className="container mx-auto px-6 md:px-12 lg:px-24 py-16">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    File Manager
                </h2>

                {/* Upload Button */}
                {/* <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => openConfirmation("upload")}
                >
                    Upload File
                </Button> */}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
                <table className="min-w-full text-sm text-left border-collapse">
                    <thead className="bg-primary/10 text-primary">
                        <tr>
                            <th className="px-4 py-3 border-b border-border">S.No</th>
                            <th className="px-4 py-3 border-b border-border">Preview</th>
                            <th className="px-4 py-3 border-b border-border">Name</th>
                            <th className="px-4 py-3 border-b border-border">Description</th>
                            <th className="px-4 py-3 border-b border-border">Type</th>
                            <th className="px-4 py-3 border-b border-border">Size</th>
                            <th className="px-4 py-3 border-b border-border">Uploaded</th>
                            <th className="px-4 py-3 border-b border-border text-center">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border bg-card text-foreground/90">
                        {loading && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-6 text-center text-muted-foreground"
                                >
                                    Loading files...
                                </td>
                            </tr>
                        )}

                        {!loading && files.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-6 text-center text-muted-foreground"
                                >
                                    No files uploaded yet.
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            files.map((file: any, index: number) => {
                                const url = `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}/${file.file_path}`;

                                return (
                                    <tr key={file.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-3">{index + 1}</td>

                                        {/* Preview */}
                                        <td className="px-4 py-3">
                                            {file.file_type === "pdf" ? (
                                                <span className="flex items-center gap-1 text-green-600">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="45"
                                                        height="45"
                                                        viewBox="0 0 28 28"
                                                        fill="currentColor"
                                                        className="text-green-600"
                                                    >
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 
    2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm1 
    7H9V7h6zm-3 5H9v-2h3zm4 0h-2v-2h2zm0-4H9V8h7z"/>
                                                    </svg>
                                                </span>


                                            ) : (
                                                <div className="relative w-16 h-16">
                                                    <Image
                                                        src={url}
                                                        alt={file.original_name}
                                                        fill
                                                        className="object-cover rounded"
                                                        unoptimized
                                                    />
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 py-3 font-medium">{file.name || "-"}</td>
                                        <td className="px-4 py-3 font-medium">{file.description || "-"}</td>

                                        <td className="px-4 py-3 uppercase">{file.file_type}</td>

                                        <td className="px-4 py-3">
                                            {(file.file_size / 1024 / 1024).toFixed(2)} MB
                                        </td>

                                        <td className="px-4 py-3">
                                            {new Date(file.created_at).toLocaleDateString("en-GB")}
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-5">
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    className="text-blue-600 hover:text-blue-800 underline"
                                                >
                                                    View
                                                </a>

                                                {/* <button
                                                    className="text-red-600 hover:text-red-800 underline"
                                                    onClick={() => openConfirmation("delete", file.id)}
                                                >
                                                    Delete
                                                </button> */}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>

            {/* =============== DIALOG MODAL =============== */}
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {modalType === "upload" ? "Upload File" : "Delete File"}
                        </DialogTitle>
                    </DialogHeader>

                    {modalType === "upload" ? (
                        <>
                            <form
                                id="uploadForm"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    openConfirmation("upload", e.target);
                                }}
                                className="space-y-4 mt-4"
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

                                <DialogFooter className="mt-4">
                                    <Button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        Upload
                                    </Button>

                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </form>
                        </>
                    ) : (
                        <div className="mt-4">
                            <p>Are you sure you want to delete this file?</p>

                            <DialogFooter className="mt-4">
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={handleConfirm}
                                >
                                    Yes, Delete
                                </Button>

                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
