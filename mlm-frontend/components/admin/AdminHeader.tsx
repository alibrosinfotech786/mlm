"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { UserCircle2, ShoppingCart, LogOut } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function AdminHeader() {
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const [userName, setUserName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🟢 Load user data
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user?.name) setUserName(user.name);
    } catch {
      console.log("User parse error");
    }
  }, []);

  // 🟢 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🟢 Logout Handler
  const handleLogout = () => {
    // Clear ALL cookies
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name =
        eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    });

    // Clear localStorage
    localStorage.clear();

    // Redirect
    window.location.href = "/auth/signin";
  };

  return (
    <>
      <header className="sticky top-0 left-0 z-40 bg-white border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

          {/* ===== Left: Brand ===== */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Tathastu Ayurveda Logo"
              width={40}
              height={40}
              className="object-contain rounded-full"
            />
            <h1 className="text-lg md:text-xl font-semibold text-green-800 tracking-wide">
              Tathastu Ayurveda Panel
            </h1>
          </div>

          {/* ===== Right ===== */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <Link href="/admin/cart">
              <button
                className="relative flex items-center gap-2 px-3 py-1.5 rounded-md border border-green-200 bg-green-50 hover:bg-green-100 text-green-800 transition"
                aria-label="Cart"
              >
                <ShoppingCart size={22} />
                <span className="text-sm font-medium hidden sm:block">
                  Cart
                </span>

                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-700 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-green-200 bg-green-50 text-green-800 transition"
                aria-label="Profile"
              >
                <UserCircle2 size={22} />
                <span className="text-sm font-medium hidden sm:block">
                  {userName || "User"}
                </span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border border-green-100 rounded-md py-2 z-50">
                  <Link
                    href="/admin/myAccount/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                  >
                    My Profile
                  </Link>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setShowConfirm(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
