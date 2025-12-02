"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import AdminHeader from "@/components/admin/AdminHeader";
import SectionTitle from "@/components/forms/SectionTitle";

import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

function KycFormContent() {
  const router = useRouter();
  const mode = useSearchParams()?.get("mode") || "add";
  const isAddMode = mode === "add";

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [kycDetail, setKycDetail] = useState<any | null>(null);
  const [preview, setPreview] = useState<Record<string, string | null>>({});

  const fileRequired = isAddMode
    ? yup.mixed().required("This file is required")
    : yup.mixed().notRequired();

  const fileValidation = fileRequired
    .test("fileType", "Only JPG, PNG, PDF allowed", (value: any) => {
      if (!value?.length) return !isAddMode;
      return ["image/jpeg", "image/png", "application/pdf"].includes(
        value[0]?.type
      );
    })
    .test("fileSize", "File must be under 5MB", (value: any) => {
      if (!value?.length) return !isAddMode;
      return value[0]?.size <= 5 * 1024 * 1024;
    });

  const schema = yup.object().shape({
    full_name: yup.string().required("Full name is required"),
    dob: yup.string().required("Date of birth is required"),

    pan_number: yup.string().notRequired(),

    aadhar_number: yup
      .string()
      .required("Aadhar number is required")
      .matches(/^[0-9]{12}$/, "Aadhar must be 12 digits"),

    account_holder_name: yup.string().required("Account holder name is required"),
    bank_name: yup.string().required("Bank name is required"),

    account_number: yup
      .string()
      .required("Account number is required")
      .matches(/^[0-9]{9,18}$/, "Account must be 9–18 digits"),

    confirm_account_number: yup
      .string()
      .required("Confirm account number")
      .oneOf([yup.ref("account_number")], "Account numbers do not match"),

    ifsc_code: yup
      .string()
      .required("IFSC is required")
      .max(11)
      .min(11)
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC format"),

    branch_name: yup.string().required("Branch name is required"),

    // status is not required on frontend; backend will receive 'approved'
    status: yup.string().notRequired(),

    // NEW FIELDS
    nominee_name: yup.string().required("Nominee name is required"),
    relation: yup.string().required("Relation is required"),
    confirm_disclaimer: yup
      .boolean()
      .oneOf([true], "You must accept the disclaimer"),

    aadhar_front: fileValidation,
    aadhar_back: fileValidation,
    pan_card: fileValidation,
    cancelled_cheque: fileValidation,
  });

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  // Helper to get error message
  const getError = (key: string) =>
    (errors as any)?.[key]?.message ? String((errors as any)[key].message) : "";

  // Load KYC when mode=edit
  useEffect(() => {
    const loadKyc = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user?.id;

        if (!userId) {
          setKycDetail(null);
          setLoading(false);
          return;
        }

        if (mode === "edit") {
          const res = await axiosInstance.get(ProjectApiList.KYC_USER, {
            params: { user_id: userId },
          });

          if (res?.data?.success) {
            const d = res.data.kyc_detail;
            setKycDetail(d);

            reset({
              ...d,
              dob: d.dob?.split("T")[0],
              confirm_account_number: d.account_number || "",

              // NEW FIELDS for reset
              nominee_name: d.nominee_name || "",
              relation: d.relation || "",
              confirm_disclaimer: d.confirm_disclaimer ? true : false,
            });

            setPreview({
              aadhar_front: d.aadhar_front_path
                ? `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}/${d.aadhar_front_path}`
                : null,
              aadhar_back: d.aadhar_back_path
                ? `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}/${d.aadhar_back_path}`
                : null,
              pan_card: d.pan_card_path
                ? `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}/${d.pan_card_path}`
                : null,
              cancelled_cheque: d.cancelled_cheque_path
                ? `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}/${d.cancelled_cheque_path}`
                : null,
            });
          } else {
            setKycDetail(null);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load KYC");
        setKycDetail(null);
      } finally {
        setLoading(false);
      }
    };

    loadKyc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, reset]);

  // Watch file inputs for preview
  const aadharFront = watch("aadhar_front");
  const aadharBack = watch("aadhar_back");
  const panCard = watch("pan_card");
  const cancelledCheque = watch("cancelled_cheque");

  const blobUrlsRef = useRef<Record<string, string>>({});

  useEffect(() => {
    const fileFields = [
      { key: "aadhar_front", file: aadharFront },
      { key: "aadhar_back", file: aadharBack },
      { key: "pan_card", file: panCard },
      { key: "cancelled_cheque", file: cancelledCheque },
    ];

    fileFields.forEach(({ key, file }) => {
      const fileList = file as FileList | null | undefined;
      if (fileList && fileList.length > 0) {
        if (blobUrlsRef.current[key]) {
          URL.revokeObjectURL(blobUrlsRef.current[key]);
        }
        const url = URL.createObjectURL(fileList[0]);
        blobUrlsRef.current[key] = url;
        setPreview((p) => ({ ...p, [key]: url }));
      }
    });

    return () => {
      Object.values(blobUrlsRef.current).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      blobUrlsRef.current = {};
    };
  }, [aadharFront, aadharBack, panCard, cancelledCheque]);

  // Actual submit function - expects validated 'data'
  const onSubmit = async (data: any) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?.id;
      const token = localStorage.getItem("token");

      const fd = new FormData();
      fd.append("user_id", String(userId));

      if (mode === "edit" && kycDetail?.id) {
        fd.append("id", String(kycDetail.id));
      }

      Object.entries(data).forEach(([key, value]: any) => {
        if (value?.[0] instanceof File) {
          fd.append(key, value[0]);
        } else {
          fd.append(key, value === true ? "1" : value === false ? "0" : value ?? "");
        }
      });

      // Force always approved
      fd.set("status", "approved");

      const endpoint =
        mode === "edit" ? ProjectApiList.KYC_UPDATE : ProjectApiList.KYC_STORE;

      const res = await axiosInstance.post(endpoint, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.data?.success) {
        toast.success(isAddMode ? "KYC Submitted" : "KYC Updated");
        router.push("/admin/myAccount/updateKyc");
      } else {
        // backend returned success:false
        toast.error(res?.data?.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const DocPreview = ({ src }: { src: string | null }) => {
    if (!src) return <p className="text-xs text-gray-400">No file selected</p>;

    return src.match(/\.(jpg|jpeg|png)$/i) ? (
      <img src={src} className="w-24 h-24 object-cover rounded border" />
    ) : (
      <a href={src} className="text-xs text-blue-600 underline" target="_blank" rel="noreferrer">
        View File
      </a>
    );
  };

  function FileInput({ label, name }: any) {
    return (
      <div>
        <label className="text-xs font-medium">{label}</label>

        <label
          htmlFor={name}
          className="cursor-pointer bg-green-600 text-white px-4 py-1.5 rounded-md text-xs font-medium hover:bg-green-700 transition block w-fit mt-1"
        >
          Choose File
        </label>

        <input id={name} type="file" {...register(name)} className="hidden" />

        <p className="text-red-500 text-xs">{getError(name)}</p>
      </div>
    );
  }

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white border rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{isAddMode ? "Submit KYC" : "Update KYC"}</h2>

            <button
              onClick={() => router.push("/admin/myAccount/updateKyc")}
              className="px-3 py-1 text-xs bg-gray-200 rounded"
            >
              Back
            </button>
          </div>

          {loading ? (
            <p className="text-center text-sm py-10">Loading...</p>
          ) : (
            <form
              onSubmit={handleSubmit((formData) => {
                setPendingData(formData);
                setShowConfirm(true);
              })}
              className="space-y-8"
            >
              <SectionTitle title="Personal Details" />

              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Full Name", "full_name"],
                  ["Date of Birth", "dob", "date"],
                  ["PAN Number", "pan_number"],
                  ["Aadhar Number", "aadhar_number"],
                  ["Account Holder", "account_holder_name"],
                  ["Bank Name", "bank_name"],
                  ["Account Number", "account_number"],
                  ["Confirm Account", "confirm_account_number"],
                  ["IFSC Code", "ifsc_code"],
                  ["Branch Name", "branch_name"],
                ].map(([label, key, type]: any) => (
                  <div key={key}>
                    <label className="text-xs">{label}</label>
                    <input
                      type={type || "text"}
                      {...register(key)}
                      className="mt-1 w-full px-3 py-1.5 border rounded text-sm"
                    />
                    <p className="text-red-500 text-xs">{getError(key)}</p>
                  </div>
                ))}

                {/* NEW FIELDS */}
                <div>
                  <label className="text-xs">Nominee Name</label>
                  <input
                    type="text"
                    {...register("nominee_name")}
                    className="mt-1 w-full px-3 py-1.5 border rounded text-sm"
                  />
                  <p className="text-red-500 text-xs">{getError("nominee_name")}</p>
                </div>

                <div>
                  <label className="text-xs">Relation</label>
                  <input
                    type="text"
                    {...register("relation")}
                    className="mt-1 w-full px-3 py-1.5 border rounded text-sm"
                  />
                  <p className="text-red-500 text-xs">{getError("relation")}</p>
                </div>

                <div className="col-span-2 flex items-start gap-2 mt-2">
                  <input type="checkbox" {...register("confirm_disclaimer")} className="w-4 h-4 mt-1" />
                  <label className="text-xs text-gray-700">
                    I hereby confirm that all the information and documents provided by me for KYC
                    verification are true, accurate, and complete to the best of my knowledge. I am
                    self-approving my KYC and take full responsibility for the authenticity of all
                    documents submitted.
                  </label>
                </div>
                <p className="text-red-500 text-xs">{getError("confirm_disclaimer")}</p>
              </div>

              <SectionTitle title="Documents" />

              <div className="grid grid-cols-2 gap-6">
                {[
                  ["Aadhar Front", "aadhar_front"],
                  ["Aadhar Back", "aadhar_back"],
                  ["PAN Card", "pan_card"],
                  ["Cancelled Cheque", "cancelled_cheque"],
                ].map(([label, key]: any) => (
                  <div key={key}>
                    <FileInput label={label} name={key} />
                    <div className="mt-2">
                      <DocPreview src={preview[key]} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || submitting}
                  className="px-6 py-2 bg-blue-600 text-white text-sm rounded disabled:opacity-60"
                >
                  {isSubmitting || submitting
                    ? isAddMode
                      ? "Submitting..."
                      : "Updating..."
                    : isAddMode
                    ? "Submit KYC"
                    : "Update KYC"}
                </button>

                <button
                  type="button"
                  className="px-6 py-2 bg-gray-200 text-sm rounded"
                  onClick={() => router.push("/admin/myAccount/updateKyc")}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Confirm KYC Submission</h3>

            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to submit your KYC? Once submitted, your details will be reviewed
              and processed.
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-full text-sm"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  setShowConfirm(false);
                  setSubmitting(true);
                  try {
                    await onSubmit(pendingData);
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="px-5 py-2 bg-green-600 text-white rounded-full text-sm flex items-center justify-center gap-2"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen submitting overlay */}
      {submitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white px-6 py-4 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-sm text-gray-700">Processing KYC...</p>
          </div>
        </div>
      )}
    </>
  );
}

export default function KycFormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KycFormContent />
    </Suspense>
  );
}
