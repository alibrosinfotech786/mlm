"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

/* =======================================
    REUSABLE PASSWORD INPUT COMPONENT
======================================= */
interface PasswordInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

function PasswordField({ label, name, value, onChange, required }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-muted-foreground mb-1">
        {label}
      </label>

      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2.5 border border-border rounded-md bg-background text-foreground 
        focus:ring-2 focus:ring-green-500 outline-none transition"
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-10 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

/* =======================================
      MAIN PAGE
======================================= */
export default function ChangePasswordPage() {
  const [loginLoading, setLoginLoading] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);

  const [loginPassword, setLoginPassword] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [transactionPassword, setTransactionPassword] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [transactionExists, setTransactionExists] = useState(false);


  console.log(transactionExists, "transactionExists-------------------------->")

  /* =======================================
        GET USER TO CHECK IF TRANSACTION EXISTS
  ======================================= */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get(ProjectApiList.USER, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(res?.data?.success, "res-------------------------->")

        if (res?.data?.success) {
          const user = res.data.user;
          console.log(user, "user-------------------------->")
          setTransactionExists(!!user.transaction_password);
        }
      } catch {
        toast.error("Failed to load user details");
      }
    };

    loadUser();
  }, []);

  /* =======================================
        INPUT HANDLER
  ======================================= */
  const handleChange =
    (setState: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setState((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
    };

  /* =======================================
        SUBMIT HANDLER
  ======================================= */
  const handleSubmit =
    (type: "login" | "transaction") => async (e: React.FormEvent) => {
      e.preventDefault();

      const data = type === "login" ? loginPassword : transactionPassword;

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?.id;

      if (!userId) {
        toast.error("User ID missing — please login again.");
        return;
      }

      if (data.new_password !== data.confirm_password) {
        toast.error("New password and confirm password do not match.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized. Please login again.");
        return;
      }

      try {
        /* ===================================
            UPDATE LOGIN PASSWORD
        =================================== */
        if (type === "login") {
          setLoginLoading(true);

          const res = await axiosInstance.post(
            ProjectApiList.UPDATE_USER,
            {
              id: userId,
              current_password: data.current_password,
              password: data.new_password,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (res?.data?.error || res?.data?.message?.toLowerCase().includes("incorrect")) {
            toast.error("Current login password is incorrect.");
            setLoginLoading(false);
            return;
          }

          if (res?.data?.success) {
            toast.success("Login password updated successfully!");
            setLoginPassword({
              current_password: "",
              new_password: "",
              confirm_password: "",
            });
          }

          setLoginLoading(false);
          return;
        }

        /* ===================================
            UPDATE TRANSACTION PASSWORD
        =================================== */
        setTransactionLoading(true);

        const payload: any = {
          user_id: userId,
          transaction_password: data.new_password,
        };

        if (transactionExists) {
          payload.current_transaction_password = data.current_password;
        }

        const res = await axiosInstance.post(
          ProjectApiList.SET_TRANSACTION_PASSWORD,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (
          res?.data?.error ||
          (res?.data?.message && res.data.message.toLowerCase().includes("incorrect"))
        ) {
          toast.error(
            transactionExists
              ? "Current transaction password is incorrect."
              : "Unable to set transaction password."
          );
          setTransactionLoading(false);
          return;
        }

        if (res?.data?.success) {
          toast.success("Transaction password updated successfully!");
          setTransactionPassword({
            current_password: "",
            new_password: "",
            confirm_password: "",
          });
          setTransactionExists(true);
        }

        setTransactionLoading(false);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Something went wrong");
        if (type === "login") setLoginLoading(false);
        else setTransactionLoading(false);
      }
    };

  /* =======================================
        UI
  ======================================= */
  return (
    <>
      <section className="min-h-screen bg-background py-12 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

          {/* LEFT — LOGIN PASSWORD */}
          <div className="bg-white border border-border rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-8">
            <h2 className="text-xl font-semibold text-foreground border-b border-border pb-3 mb-6">
              Change Login Password
            </h2>

            <form onSubmit={handleSubmit("login")} className="space-y-5">
              {[
                { id: "current_password", label: "Current Password" },
                { id: "new_password", label: "New Password" },
                { id: "confirm_password", label: "Confirm New Password" },
              ].map((field) => (
                <PasswordField
                  key={field.id}
                  label={field.label}
                  name={field.id}
                  value={loginPassword[field.id as keyof typeof loginPassword]}
                  onChange={handleChange(setLoginPassword)}
                  required
                />
              ))}

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="px-6 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition disabled:opacity-70"
                >
                  {loginLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT — TRANSACTION PASSWORD */}
          <div className="bg-white border border-border rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-8">
            <h2 className="text-xl font-semibold text-foreground border-b border-border pb-3 mb-6">
              Change Transaction Password
            </h2>

            <form onSubmit={handleSubmit("transaction")} className="space-y-5">
              {transactionExists && (
                <PasswordField
                  label="Current Transaction Password"
                  name="current_password"
                  value={transactionPassword.current_password}
                  onChange={handleChange(setTransactionPassword)}
                  required
                />
              )}

              <PasswordField
                label="New Transaction Password"
                name="new_password"
                value={transactionPassword.new_password}
                onChange={handleChange(setTransactionPassword)}
                required
              />

              <PasswordField
                label="Confirm Transaction Password"
                name="confirm_password"
                value={transactionPassword.confirm_password}
                onChange={handleChange(setTransactionPassword)}
                required
              />

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={transactionLoading}
                  className="px-6 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition disabled:opacity-70"
                >
                  {transactionLoading ? "Updating..." : "Update Transaction Password"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>
    </>
  );
}
