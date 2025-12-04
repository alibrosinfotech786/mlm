"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Menu, UserCircle2, ShoppingCart, LogOut } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function AdminHeader({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const [userName, setUserName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user?.name) setUserName(user.name);
    } catch { }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    });

    localStorage.clear();
    window.location.href = "/auth/signin";
  };

  return (
    <>
      <header className="sticky top-0 left-0 z-40 bg-white border-b border-green-100 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="flex justify-between items-center px-4 py-3">

          {/* Hamburger */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded hover:bg-green-100"
          >
            <Menu size={26} className="text-green-800" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <h1 className="text-lg md:text-xl font-semibold text-green-800 max-sm:hidden">
              Tathastu Ayurveda Panel
            </h1>
          </div>

          {/* Right side */}
          {/* Right side */}
          <div className="flex items-center gap-4">

            {/* Cart */}
            <Link href="/admin/cart">
              <button className="relative flex items-center gap-2 px-3 py-1.5 rounded-md border border-green-200 bg-green-50 hover:bg-green-100 text-green-800 transition">
                <ShoppingCart size={22} />
                <span className="hidden sm:block text-sm">Cart</span>

                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-700 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Profile + Logout (SIDE BY SIDE) */}
            <div className="flex items-center gap-3">
              <Link href="/admin/myAccount/profile">
                <button
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-green-200 bg-green-50 text-green-800 cursor-pointer"
                >
                  <UserCircle2 size={22} />
                  <span className="hidden sm:block text-sm">
                    {userName || "User"}
                  </span>
                </button>
              </Link>

              <button
                onClick={() => setShowConfirm(true)}
                className="px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm flex items-center gap-1 cursor-pointer"
              >
                <LogOut size={18} />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>

          </div>

        </div>
      </header>

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
