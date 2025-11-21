"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { UserCircle2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";

export default function AdminHeader() {
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const [userName, setUserName] = useState("");

  // 🟢 Load user from localStorage
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user?.name) {
        setUserName(user.name);
      }
    } catch (err) {
      console.log("User parse error:", err);
    }
  }, []);

  return (
    <header className="sticky top-0 left-0 z-40 bg-white border-b border-green-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

        {/* ===== Left: Brand / Page Title ===== */}
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

        {/* ===== Right: Icons ===== */}
        <div className="flex items-center gap-4">

          {/* Cart Button */}
          <Link href="/admin/cart">
            <button
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-md border border-green-200 bg-green-50 hover:bg-green-100 text-green-800 transition cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingCart size={22} />
              <span className="text-sm font-medium hidden sm:block">Cart</span>

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-700 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>

          {/* Profile Button */}
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-green-200 bg-green-50  text-green-800 transition "
            aria-label="Profile"
          >
            <UserCircle2 size={22} />
            <span className="text-sm font-medium hidden sm:block">
              {userName || "User"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
