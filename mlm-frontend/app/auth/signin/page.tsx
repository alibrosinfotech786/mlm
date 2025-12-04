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

      <section className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-6 sm:py-8 md:py-12 relative overflow-hidden">

        {/* ===== Left Section ===== */}
        <div className="w-full lg:w-1/2 flex flex-col items-center text-center mb-8 sm:mb-10 lg:mb-0 order-2 lg:order-1">
          <Image
            src="/images/logo.png"
            alt="Tathastu Ayurveda Logo"
            width={320}
            height={320}
            className="w-[180px] h-[180px] xs:w-[220px] xs:h-[220px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px] lg:w-[350px] lg:h-[350px] xl:w-[420px] xl:h-[420px] object-contain"
            priority
          />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-800 mt-3 sm:mt-4">
            TATHASTU AYURVEDA
          </h2>
          <p className="text-green-700 text-xs sm:text-sm mt-1 tracking-wide">
            Healing Roots, Cultivating Prosperity 🌿
          </p>
        </div>

        {/* ===== Right Section (Form) ===== */}
        <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2">
          <div className="w-full max-w-sm sm:max-w-md bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-5 sm:p-6 md:p-8 relative">

            {/* Floating Badge Logo */}
            <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 
                w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-3 sm:border-4 border-white shadow-md bg-white 
                flex items-center justify-center overflow-hidden">
              <Image
                src="/images/logo.png"
                alt="Mini Logo"
                width={28}
                height={28}
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
              />
            </div>

            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-green-800 text-center mt-8 sm:mt-10 mb-2">
              Welcome Back To <span className="underline decoration-green-600">Tathastu</span>
            </h1>

            <p className="text-center text-green-700 text-xs sm:text-sm mb-6 sm:mb-8">
              Please sign in to continue your journey.
            </p>

            {/* ===== Form Start ===== */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">

              {serverError && (
                <p className="text-red-600 text-xs sm:text-sm bg-red-50 border border-red-200 rounded-md py-2 px-3 text-center">
                  {serverError}
                </p>
              )}

              {/* User ID */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-green-800 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  placeholder="Enter your User ID"
                  {...register("user_id", { required: "User ID is required" })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-green-50 border border-green-200 
                    text-green-800 focus:ring-2 focus:ring-green-500 outline-none text-sm sm:text-base"
                />
                {errors.user_id && (
                  <p className="text-red-600 text-xs mt-1">{errors.user_id.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-green-800 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", { required: "Password is required" })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-green-50 border border-green-200 
                    text-green-800 focus:ring-2 focus:ring-green-500 outline-none text-sm sm:text-base"
                />
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 sm:mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 sm:py-3 rounded-full bg-green-600 text-white font-semibold shadow 
                    hover:opacity-90 transition flex items-center justify-center gap-2
                    disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isSubmitting && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center justify-center my-4 sm:my-6 text-gray-500 text-xs sm:text-sm">
              <span className="border-t border-gray-300 w-1/4"></span>
              <span className="px-2 sm:px-3">or</span>
              <span className="border-t border-gray-300 w-1/4"></span>
            </div>

            {/* Sign Up */}
            <p className="text-center text-green-700 text-xs sm:text-sm">
              Don't have an account?{" "}
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