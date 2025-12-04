"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import SectionTitle from "@/components/forms/SectionTitle";

const fileUrl = (path?: string | null): string | null => {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";
  return `${base}/${path}`;
};

export default function KycViewPage() {
  const [loading, setLoading] = useState(true);
  const [kyc, setKyc] = useState<any | null>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        const res = await axiosInstance.get(ProjectApiList.KYC_USER, {
          params: { user_id: user?.id },
        });

        setKyc(res?.data?.success ? res.data.kyc_detail : null);
      } catch {
        setKyc(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      {/* <AdminHeader /> */}

      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative bg-white p-2 rounded shadow max-w-[90%] max-h-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-3 -right-3 bg-white text-black rounded-full w-7 h-7 flex items-center justify-center shadow"
              onClick={() => setPreviewImage(null)}
            >
              ✕
            </button>

            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[80vh] object-contain rounded"
            />
          </div>
        </div>
      )}

      <section className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto bg-white border rounded-lg shadow p-6 text-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">KYC Overview</h2>
              <p className="text-xs text-gray-500">Personal & document details</p>
            </div>

            {!loading &&
              (kyc ? (
                <Link
                  href={{
                    pathname: "/admin/myAccount/updateKyc/form",
                    query: { mode: "edit", id: kyc.id },
                  }}
                  className="px-3 py-1.5 text-xs bg-yellow-500 text-white rounded"
                >
                  Edit KYC
                </Link>
              ) : (
                <Link
                  href="/admin/myAccount/updateKyc/form?mode=add"
                  className="px-3 py-1.5 text-xs bg-green-600 text-white rounded"
                >
                  Add KYC
                </Link>
              ))}
          </div>

          {loading && <div className="text-center py-4 text-xs">Loading...</div>}

          {!loading && !kyc && (
            <div className="text-center py-4 text-xs">
              No KYC found.{" "}
              <Link href="/admin/myAccount/updateKyc/form?mode=add" className="text-blue-600 underline">
                Add KYC
              </Link>
            </div>
          )}

          {!loading && kyc && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* LEFT SIDE */}
              <div className="space-y-6">
                <SectionTitle title="Personal Details" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <Field label="Full Name" value={kyc.full_name} />
                  <Field label="DOB" value={kyc.dob?.split("T")[0]} />

                  <Field label="Pan Number" value={kyc.pan_number} />
                  <Field label="Aadhar Number" value={kyc.aadhar_number} />

                  <Field label="Account Holder" value={kyc.account_holder_name} />
                  <Field label="Bank Name" value={kyc.bank_name} />

                  <Field label="Account No" value={kyc.account_number} />
                  <Field label="IFSC Code" value={kyc.ifsc_code} />

                  <Field label="Branch Name" value={kyc.branch_name} />

                  {/* NEW FIELDS */}
                  <Field label="Nominee Name" value={kyc.nominee_name} />
                  <Field label="Relation" value={kyc.relation} />
                  <Field
                    label="Disclaimer Accepted"
                    value={kyc.confirm_disclaimer ? "Yes" : "No"}
                  />

                  <div>
                    <p className="text-gray-500">Status</p>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        kyc.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : kyc.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {kyc.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div>
                <SectionTitle title="Documents" />

                <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                  <DocPreview
                    title="Aadhar Front"
                    url={fileUrl(kyc.aadhar_front_path)}
                    onClick={() => setPreviewImage(fileUrl(kyc.aadhar_front_path))}
                  />

                  <DocPreview
                    title="Aadhar Back"
                    url={fileUrl(kyc.aadhar_back_path)}
                    onClick={() => setPreviewImage(fileUrl(kyc.aadhar_back_path))}
                  />

                  <DocPreview
                    title="PAN Card"
                    url={fileUrl(kyc.pan_card_path)}
                    onClick={() => setPreviewImage(fileUrl(kyc.pan_card_path))}
                  />

                  <DocPreview
                    title="Cancelled Cheque"
                    url={fileUrl(kyc.cancelled_cheque_path)}
                    onClick={() => setPreviewImage(fileUrl(kyc.cancelled_cheque_path))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium text-gray-900">{value || "-"}</p>
  </div>
);

const DocPreview = ({
  title,
  url,
  onClick,
}: {
  title: string;
  url: string | null;
  onClick: () => void;
}) => {
  const isImg = url && url.match(/\.(jpg|jpeg|png)$/i);

  return (
    <div className="text-sm">
      <p className="text-gray-500">{title}</p>

      {!url ? (
        <p className="text-gray-400 text-xs mt-1">No File</p>
      ) : isImg ? (
        <img
          src={url}
          alt={title}
          onClick={onClick}
          className="mt-2 w-[130px] h-[130px] cursor-pointer rounded border shadow-sm object-cover hover:opacity-80 transition"
        />
      ) : (
        <a href={url} target="_blank" className="underline text-blue-600 text-xs mt-2 inline-block">
          View File
        </a>
      )}
    </div>
  );
};
