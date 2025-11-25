"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, LogOut } from "lucide-react";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function Sidebar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userPermissions, setUserPermissions] = useState<any[]>([]);

  // 👉 Load User + Permissions from localStorage
  useEffect(() => {
    const permissions = JSON.parse(localStorage.getItem("permissions") || "{}");

    if (permissions) {
      setUserPermissions(permissions);
    }
  }, []);

  // ✔ Helper: check if module has READ permission
  const hasReadPermission = (moduleName: string) => {
    const found = userPermissions.find((p) => p.module === moduleName);
    return found?.read === true;
  };

  const toggleDropdown = (section: string) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  const handleLogout = () => {
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    });

    localStorage.clear();
    setShowConfirm(false);
    window.location.href = "/auth/signin";
  };

  // ============================================
  // 🔥 Sidebar Navigation Items WITH Module Names
  // ============================================
  const navLinks = [
    { name: "Dashboard", module: "Dashboard", href: "/admin/dashboard" },

    { name: "Manage Role", module: "Manage Role", href: "/admin/roles" },

    { name: "Manage Users", module: "Manage Users", href: "/admin/users" },

    {
      name: "Events",
      items: [
        { name: "Add Events", module: "Add Events", href: "/admin/events" },
        { name: "Join Events", module: "Join Events", href: "/admin/events/joinEvents" }
      ]
    },

    {
      name: "Training",
      items: [
        { name: "Add Training", module: "Add Training", href: "/admin/training" },
        { name: "Join Training", module: "Join Training", href: "/admin/training/joinTraining" }
      ]
    },

    {
      name: "My Account",
      items: [
        { name: "Profile", module: "Profile", href: "/admin/myAccount/profile" },
        { name: "Update KYC", module: "Update KYC", href: "/admin/myAccount/updateKyc" },
        { name: "Change Password", module: "Change Password", href: "/admin/myAccount/changePassword" },
        { name: "Welcome Letter", module: "Welcome Letter", href: "/admin/myAccount/welcomeLetter" },
        { name: "ID Card", module: "ID Card", href: "/admin/myAccount/IDCard" },
      ],
    },

    {
      name: "My Team",
      items: [
        { name: "All Team", module: "All Team", href: "/admin/myTeam/allTeam" },
        { name: "Direct Team", module: "Direct Team", href: "/admin/myTeam/directTeam" },
        { name: "Left Team", module: "Left Team", href: "/admin/myTeam/leftTeam" },
        { name: "Right Team", module: "Right Team", href: "/admin/myTeam/rightTeam" },
        { name: "Tree View", module: "Tree View", href: "/admin/myTeam/treeView" },
      ],
    },

    {
      name: "My Business",
      items: [
        { name: "Direct Business", module: "Direct Business", href: "/admin/myBusiness/directBusiness" },
        { name: "Team Business", module: "Team Business", href: "/admin/myBusiness/teamBusiness" },
        { name: "Business Summary", module: "Business Summary", href: "/admin/myBusiness/businessSummary" },
      ],
    },

    {
      name: "Wallet",
      items: [
        { name: "Wallet Request", module: "Wallet Request", href: "/admin/wallet/walletRequest" },
        { name: "All Wallet Request", module: "All Wallet Request", href: "/admin/wallet/allWalletRequests" },
        { name: "Wallet Status", module: "Wallet Status", href: "/admin/wallet/walletStatus" },
        { name: "Wallet Summary", module: "Wallet Summary", href: "/admin/wallet/walletSummary" },
        { name: "BV Summary", module: "BV Summary", href: "/admin/wallet/bvSummary" },
      ],
    },

    {
      name: "Orders",
      items: [
        { name: "Add Products", module: "Add Products", href: "/admin/products" },
        { name: "All Orders", module: "All Orders", href: "/admin/orders/allOrders" },
        { name: "Buy Products", module: "Buy Products", href: "/admin/orders/buyOrders" },
        { name: "Orders Status", module: "Orders Status", href: "/admin/orders/orderStatus" },
        { name: "Orders Summary", module: "Orders Summary", href: "/admin/orders/orderSummary" },
      ],
    },

    {
      name: "My Income",
      items: [
        { name: "Sponser Income", module: "Sponser Income", href: "/admin/Income/sponserIncome" },
        { name: "Matching Income", module: "Matching Income", href: "/admin/Income/matchingIncome" },
        { name: "Sponser Matching Income", module: "Sponser Matching Income", href: "/admin/Income/sponserMatchingIncome" },
        { name: "Repurchasing Income", module: "Repurchasing Income", href: "/admin/Income/repurchasingIncome" },
      ],
    },

    { name: "Grievance", module: "Grievance", href: "/admin/grievance" },
  ];

  return (
    <>
      <aside className="fixed top-0 left-0 h-screen w-64 bg-green-700 text-white flex flex-col shadow-xl">

        <div className="p-5 text-2xl font-bold text-center border-b border-green-600">
          Tathastu Panel
        </div>

        <nav className="flex-1 mt-4 overflow-y-auto scrollbar-hide">
          {navLinks.map((link) => {
            // ============ Parent Item WITHOUT submenu ============
            if (!link.items) {
              if (!hasReadPermission(link.module)) return null;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-6 py-3  hover:bg-green-600 hover:text-white",
                    pathname === link.href && "bg-green-600"
                  )}
                >
                  {link.name}
                </Link>
              );
            }

            // ============ Parent Item WITH Sub Items ============
            const visibleSubItems = link.items.filter((sub) =>
              hasReadPermission(sub.module)
            );

            if (visibleSubItems.length === 0) return null;

            return (
              <div key={link.name}>
                <button
                  onClick={() => toggleDropdown(link.name)}
                  className="w-full flex justify-between px-5 py-3 pl-6 hover:bg-green-600 hover:text-white"
                >
                  {link.name}
                  {openDropdown === link.name ? <ChevronUp /> : <ChevronDown />}
                </button>

                {openDropdown === link.name && (
                  <div className="ml-4 border-l border-green-500/40 pl-4">
                    {visibleSubItems.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          "block px-3 py-2 text-sm hover:bg-green-600 hover:text-white",
                          pathname === sub.href && "bg-green-600 font-semibold"
                        )}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <button
          onClick={() => setShowConfirm(true)}
          className="m-4 py-2.5 bg-green-600 rounded-md hover:bg-green-500 hover:text-white flex items-center justify-center gap-2"
        >
          {/* <LogOut size={16} />  */}
          Logout
        </button>
      </aside>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Confirm Logout"
        message="Are you sure?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
