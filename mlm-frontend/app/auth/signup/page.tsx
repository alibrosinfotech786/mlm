"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useForm, SubmitHandler } from "react-hook-form";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

/* ---------------------- Interfaces ---------------------- */
interface StateType {
  id: number;
  name: string;
}

interface DistrictType {
  id: number;
  name: string;
}

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  sponsor_id: string;
  sponsor_name: string;
  position: string;
  state_id: string;
  district_id: string;
  password: string;
  password_confirmation: string;
}


export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<RegisterForm | null>(null);

  const [serverError, setServerError] = useState("");
  const [sponsorError, setSponsorError] = useState("");

  const [states, setStates] = useState<StateType[]>([]);
  const [districts, setDistricts] = useState<DistrictType[]>([]);

  const [isModalSubmitting, setIsModalSubmitting] = useState(false);

  const sponsorId = watch("sponsor_id");
  const stateId = watch("state_id");

  /* ---------------------- READ REFERRAL FROM URL ---------------------- */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const referral = urlParams.get("referral");

    if (referral) {
      setValue("sponsor_id", referral);
    }
  }, [setValue]);


  /* ---------------------- FETCH STATES ---------------------- */
  useEffect(() => {
    async function loadStates() {
      try {
        const res = await axiosInstance.get(ProjectApiList.getState);
        const list = res.data?.data?.data || res.data?.data || [];
        setStates(list);
      } catch {
        console.log("Failed to load states");
      }
    }
    loadStates();
  }, []);

  /* ---------------------- FETCH DISTRICTS ---------------------- */
  useEffect(() => {
    async function loadDistricts() {
      if (!stateId) return setDistricts([]);

      try {
        const res = await axiosInstance.get(
          `${ProjectApiList.getDistrictByState}?state_id=${stateId}`
        );

        const list = res.data?.data?.data || res.data?.data || [];
        setDistricts(list);
      } catch {
        console.log("Failed to load districts");
      }
    }

    loadDistricts();
  }, [stateId]);

  /* ---------------------- SPONSOR AUTO-FETCH ---------------------- */
  useEffect(() => {
    if (!sponsorId || sponsorId.length !== 12) {
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
      } catch {
        setSponsorError("Invalid Sponsor ID");
        setValue("sponsor_name", "");
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [sponsorId, setValue]);

  /* ---------------------- SUBMIT → OPEN CONFIRMATION MODAL ---------------------- */
  const onSubmit: SubmitHandler<RegisterForm> = (data) => {
    setFormData(data);
    setConfirmOpen(true);
  };

  /* ---------------------- CONFIRM SUBMIT ---------------------- */
  async function confirmSubmit() {
    if (!formData) return;

    setServerError("");
    setIsModalSubmitting(true);

    try {
      const payload = {
        ...formData,
        state_id: Number(formData.state_id),
        district_id: Number(formData.district_id),
      };

      const response = await axiosInstance.post(ProjectApiList.REGISTER, payload);

      if (response.data?.success) {
        window.location.href = "/auth/signin";
      }
    } catch (error: any) {
      const apiError = error?.response?.data;

      if (apiError?.errors) {
        // Convert Laravel-like error list into readable message
        const fullMessage = Object.entries(apiError.errors)
          .map(([field, messages]: any) => `${messages.join(", ")}`)
          .join(" | ");

setServerError(Object.values(apiError.errors).flat().join("\n"));
      } else {
        setServerError(apiError?.message || "Registration failed! Try again.");
      }
    }

    setIsModalSubmitting(false);
    setConfirmOpen(false);
  }

  return (
    <>
      <Header />

      <section className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 lg:px-20">

        {/* Left Panel */}
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

        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex justify-center my-10">
          <div className="relative w-full max-w-2xl rounded-2xl shadow-xl p-10 bg-white">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-green-700 font-semibold text-lg px-6 py-2 rounded-full shadow-md border border-green-200">
              User Registration
            </div>

            {serverError && (
              <div className="mt-10 mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm text-center">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">

              {/* Basic Fields */}
              {[
                { id: "name", label: "Name", type: "text" },
                { id: "email", label: "Email", type: "email" },
                { id: "phone", label: "Phone Number", type: "text" },
              ].map((field) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-4">
                  <label className="font-semibold text-green-800">{field.label}</label>

                  <input
                    type={field.type}
                    {...register(field.id as keyof RegisterForm, { required: true })}
                    className="w-full px-5 py-2.5 rounded-full bg-green-100 border border-green-200"
                  />

                  {errors[field.id as keyof RegisterForm] && (
                    <p className="text-red-600 text-xs">This field is required</p>
                  )}
                </div>
              ))}

              {/* State */}
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-4">
                <label className="font-semibold text-green-800">State</label>
                <select
                  {...register("state_id", { required: true })}
                  className="w-full px-5 py-2.5 rounded-full bg-green-100 border border-green-200"
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {errors.state_id && <p className="text-red-600 text-xs">State is required</p>}
              </div>

              {/* District */}
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-4">
                <label className="font-semibold text-green-800">District</label>
                <select
                  {...register("district_id", { required: true })}
                  className="w-full px-5 py-2.5 rounded-full bg-green-100 border border-green-200"
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                {errors.district_id && <p className="text-red-600 text-xs">District is required</p>}
              </div>

              {/* Sponsor ID */}
              {/* Sponsor ID */}
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-4">
                <label className="font-semibold text-green-800">Sponsor ID</label>

                <div className="w-full">
                  <input
                    type="text"
                    {...register("sponsor_id", {
                      validate: (value) => {
                        if (!value) return true; // ⭐ OPTIONAL
                        return (
                          value.length === 12 || "Sponsor ID must be exactly 12 characters"
                        );
                      },
                    })}
                    className="w-full px-5 py-2.5 rounded-full bg-green-100 border border-green-200"
                  />

                  {/* Length validation */}
                  {watch("sponsor_id") &&
                    watch("sponsor_id").length > 0 &&
                    watch("sponsor_id").length !== 12 && (
                      <p className="text-red-600 text-xs mt-1">
                        Sponsor ID must be exactly 12 characters
                      </p>
                    )}

                  {/* Server-based validation */}
                  {sponsorError && (
                    <p className="text-red-600 text-xs mt-1">{sponsorError}</p>
                  )}
                </div>
              </div>


              {/* Sponsor Name */}
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-4">
                <label className="font-semibold text-green-800">Sponsor Name</label>
                <input
                  disabled
                  {...register("sponsor_name")}
                  className="w-full px-5 py-2.5 rounded-full bg-gray-100 border border-green-200 text-gray-600"
                />
              </div>

              {/* Position */}
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-4">
                <label className="font-semibold text-green-800">Position</label>
                <select
                  {...register("position", { required: true })}
                  className="w-full px-5 py-2.5 rounded-full bg-green-100 border border-green-200"
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-4">
                <label className="font-semibold text-green-800">Password</label>

                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 8, message: "Must be at least 8 characters" },
                    })}
                    className="w-full px-5 py-2.5 rounded-full bg-green-100 border border-green-200"
                  />

                  {/* Toggle */}
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-green-700 text-sm"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-600 text-xs">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-4">
                <label className="font-semibold text-green-800">Confirm Password</label>

                <div className="relative w-full">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("password_confirmation", {
                      required: "Confirmation is required",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                    className="w-full px-5 py-2.5 rounded-full bg-green-100 border border-green-200"
                  />

                  {/* Toggle */}
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-green-700 text-sm"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {errors.password_confirmation && (
                  <p className="text-red-600 text-xs">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-full bg-green-600 text-white font-semibold shadow mt-8 flex items-center justify-center gap-2 disabled:opacity-60"
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

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold text-green-800 mb-3">
              Confirm Registration
            </h3>

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
                disabled={isModalSubmitting}
                onClick={confirmSubmit}
                className="px-5 py-2 bg-green-600 text-white rounded-full text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isModalSubmitting && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {isModalSubmitting ? "Processing..." : "Yes, Register"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
