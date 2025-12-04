"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useForm, SubmitHandler } from "react-hook-form";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

interface LoginForm {
  user_id: string;
  password: string;
}

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const [serverError, setServerError] = React.useState<string>("");

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setServerError("");

    try {
      const response = await axiosInstance.post(ProjectApiList.LOGIN, data);

      if (response.data?.token) {
        document.cookie = `token=${response.data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax;`;
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("permissions", JSON.stringify(response.data.permissions));
        window.location.href = "/admin/dashboard";
      }

    } catch (error: any) {
      setServerError(
        error?.response?.data?.message || "Invalid user_id or password!"
      );
    }
  };

  return (
    <>
      <Header />

      <section className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 lg:px-20 relative overflow-hidden">

        {/* ===== Left Section ===== */}
        <div className="w-full md:w-1/2 flex flex-col items-center text-center mb-12 md:mb-0">
          <Image
            src="/images/logo.png"
            alt="Tathastu Ayurveda Logo"
            width={420}
            height={420}
            priority
          />
          <h2 className="text-3xl font-bold text-green-800 mt-4">
            TATHASTU AYURVEDA
          </h2>
          <p className="text-green-700 text-sm mt-1 tracking-wide">
            Healing Roots, Cultivating Prosperity 🌿
          </p>
        </div>

        {/* ===== Right Section (Form) ===== */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative">

            {/* Floating Badge Logo */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                w-16 h-16 rounded-full border-4 border-white shadow-md bg-white 
                flex items-center justify-center overflow-hidden">
              <Image
                src="/images/logo.png"
                alt="Mini Logo"
                width={48}
                height={48}
              />
            </div>

            <h1 className="text-2xl font-bold text-green-800 text-center mt-6 mb-2">
              Welcome Back To <span className="underline decoration-green-600">Tathastu</span>
            </h1>

            <p className="text-center text-green-700 text-sm mb-8">
              Please sign in to continue your journey.
            </p>

            {/* ===== Form Start ===== */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {serverError && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md py-2 text-center">
                  {serverError}
                </p>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  placeholder="Enter your User ID"
                  {...register("user_id", { required: "Email is required" })}
                  className="w-full px-4 py-2 rounded-full bg-linear-to-r 
                    from-green-100 to-yellow-100 border border-green-200 
                    text-green-800 focus:ring-2 focus:ring-green-500 outline-none"
                />
                {errors.user_id && (
                  <p className="text-red-600 text-xs mt-1">{errors.user_id.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", { required: "Password is required" })}
                  className="w-full px-4 py-2 rounded-full bg-linear-to-r 
                    from-green-100 to-yellow-100 border border-green-200 
                    text-green-800 focus:ring-2 focus:ring-green-500 outline-none"
                />
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
                {/* <Link
                  href="#"
                  className="w-full sm:w-1/2 text-center py-2 rounded-full bg-blue-500 text-white font-semibold shadow hover:opacity-90 transition"
                >
                  Forgot Password
                </Link> */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 rounded-full bg-green-600 text-white font-semibold shadow 
             hover:opacity-90 transition flex items-center justify-center gap-2
             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </button>

              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center justify-center my-6 text-gray-500 text-sm">
              <span className="border-t border-gray-300 w-1/4"></span>
              <span className="px-3">or</span>
              <span className="border-t border-gray-300 w-1/4"></span>
            </div>

            {/* Sign Up */}
            <p className="text-center text-green-700 text-sm">
              Don’t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-green-600 font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
