"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useForm, SubmitHandler } from "react-hook-form";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  sponsor_id: string;
  sponsor_name: string;
  position: string;
  nominee: string;
  password: string;
  password_confirmation: string;
}

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterForm>({
    mode: "onChange",   // 🚀 LIVE VALIDATION WHILE TYPING
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<RegisterForm | null>(null);

  const [serverError, setServerError] = useState("");
  const [sponsorError, setSponsorError] = useState("");
  const sponsorId = watch("sponsor_id");

  /* ==========================================================
     AUTO-FETCH SPONSOR NAME
  ========================================================== */
  useEffect(() => {
    if (!sponsorId || sponsorId.length !== 19) {
      setSponsorError("");
      setValue("sponsor_name", "");
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await axiosInstance.get(
          `${ProjectApiList.USER_SHOW}?user_id=${sponsorId}`
        );

        if (res?.data?.success && res.data.user) {
          setValue("sponsor_name", res.data.user.name);
          setSponsorError("");
        } else {
          setSponsorError("Invalid Sponsor ID");
          setValue("sponsor_name", "");
        }
      } catch (err) {
        setSponsorError("Invalid Sponsor ID");
        setValue("sponsor_name", "");
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [sponsorId, setValue]);

  /* ==========================================================
     FORM SUBMIT
  ========================================================== */
  const onSubmit: SubmitHandler<RegisterForm> = (data) => {
    setFormData(data);
    setConfirmOpen(true);
  };

  async function confirmSubmit() {
    if (!formData) return;

    setServerError("");

    try {
      const response = await axiosInstance.post(ProjectApiList.REGISTER, formData);

      if (response.data?.success) {
        window.location.href = "/auth/signin";
      }
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message || "Registration failed! Try again."
      );
    }

    setConfirmOpen(false);
  }

  return (
    <>
      <Header />

      <section className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 lg:px-20">

        {/* ================= Left Section ================= */}
        <div className="w-full md:w-1/2 flex flex-col items-center text-center mb-10">
          <Image
            src="/images/logo.png"
            alt="Tathastu Ayurveda Logo"
            width={420}
            height={420}
            className="object-contain drop-shadow-md"
          />
          <h2 className="text-3xl font-bold text-green-800 mt-2">TATHASTU AYURVEDA</h2>
          <p className="text-green-700 text-sm mt-1">Healing Roots, Cultivating Prosperity 🌿</p>
        </div>

        {/* ================= Right Section ================= */}
        <div className="w-full md:w-1/2 flex justify-center my-10">
          <div className="relative w-full max-w-2xl rounded-2xl shadow-xl p-10 bg-white">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white 
            text-green-700 font-semibold text-lg px-6 py-2 rounded-full shadow-md 
            border border-green-200">
              User Registration
            </div>

            {serverError && (
              <div className="mt-10 mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm text-center">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">

              {/* ------- Simple Fields ------- */}
              {[
                { id: "name", label: "Name", type: "text" },
                { id: "email", label: "Email", type: "email" },
                { id: "phone", label: "Phone Number", type: "text" },
                { id: "address", label: "Address", type: "text" },
                { id: "nominee", label: "Nominee", type: "text" },
              ].map((field) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-4"
                >
                  <label className="font-semibold text-green-800">{field.label}</label>
                  <input
                    {...register(field.id as keyof RegisterForm, { required: true })}
                    type={field.type}
                    className="w-full px-5 py-2.5 rounded-full bg-linear-to-r 
                    from-green-100 to-yellow-100 border border-green-200"
                  />
                  {errors[field.id as keyof RegisterForm] && (
                    <p className="text-red-600 text-xs">This field is required</p>
                  )}
                </div>
              ))}

              {/* ================= Sponsor ID ================= */}
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-4">
                <label className="font-semibold text-green-800">Sponsor ID</label>

                <div className="w-full">
                  <input
                    {...register("sponsor_id", {
                      // ❌ REMOVED REQUIRED VALIDATION
                      pattern: {
                        value: /^THT\d{16}$/,
                        message: "Sponsor ID must start with THT followed by 16 digits",
                      },
                      minLength: {
                        value: 19,
                        message: "Sponsor ID must be exactly 19 characters",
                      },
                    })}
                    type="text"
                    className="w-full px-5 py-2.5 rounded-full bg-linear-to-r 
      from-green-100 to-yellow-100 border border-green-200"
                  />

                  {/* LIVE VALIDATION WHILE TYPING */}
                  {watch("sponsor_id")?.length > 0 &&
                    watch("sponsor_id")?.length !== 19 && (
                      <p className="text-red-600 text-xs mt-1">
                        Sponsor ID must be exactly 19 characters
                      </p>
                    )}

                  {/* FIELD ERRORS */}
                  {errors.sponsor_id && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.sponsor_id.message}
                    </p>
                  )}

                  {/* API BASED ERROR */}
                  {sponsorError && (
                    <p className="text-red-600 text-xs mt-1">{sponsorError}</p>
                  )}
                </div>
              </div>


              {/* ================= Sponsor Name ================= */}
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-4">
                <label className="font-semibold text-green-800">Sponsor Name</label>
                <input
                  {...register("sponsor_name")}
                  type="text"
                  disabled
                  className="w-full px-5 py-2.5 rounded-full bg-gray-100 border 
                  border-green-200 text-gray-600"
                />
              </div>

              {/* ================= Position ================= */}
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-4">
                <label className="font-semibold text-green-800">Position</label>
                <select
                  {...register("position", { required: true })}
                  className="w-full px-5 py-2.5 rounded-full bg-linear-to-r 
                  from-green-100 to-yellow-100 border border-green-200"
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>

              {/* ================= Password ================= */}
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-4">
                <label className="font-semibold text-green-800">Password</label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                  })}
                  className="w-full px-5 py-2.5 rounded-full bg-linear-to-r 
                  from-green-100 to-yellow-100 border border-green-200"
                />
                {errors.password && (
                  <p className="text-red-600 text-xs">{errors.password.message}</p>
                )}
              </div>

              {/* ================= Confirm Password ================= */}
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-4">
                <label className="font-semibold text-green-800">Confirm Password</label>
                <input
                  type="password"
                  {...register("password_confirmation", {
                    required: "Confirmation is required",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  className="w-full px-5 py-2.5 rounded-full bg-linear-to-r 
                  from-green-100 to-yellow-100 border border-green-200"
                />
                {errors.password_confirmation && (
                  <p className="text-red-600 text-xs">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-full bg-green-600 text-white 
  font-semibold shadow mt-8 flex items-center justify-center gap-2
  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting && (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}

                {isSubmitting ? "Registering..." : "Submit"}
              </button>


              <p className="text-center text-green-700 text-sm mt-4">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-green-600 font-semibold">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* CONFIRMATION MODAL */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Confirm Registration</h3>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to register with these details?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-full text-sm"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>

              <button
                disabled={isSubmitting}
                onClick={confirmSubmit}
                className="px-5 py-2 bg-green-600 text-white rounded-full text-sm
  flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {isSubmitting ? "Processing..." : "Yes, Register"}
              </button>

            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
