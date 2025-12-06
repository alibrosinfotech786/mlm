"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ReloadLink from "../ReloadLink";

export default function Sidebar({ isOpen, setIsOpen }: any) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userPermissions, setUserPermissions] = useState<any[]>([]);

  // Load permissions
  useEffect(() => {
    const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
    setUserPermissions(permissions || []);
  }, []);

  const hasReadPermission = (moduleName: string) => {
    const found = userPermissions?.find?.((p) => p.module === moduleName);
    return found?.read === true;
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleLogout = () => {
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    });

    localStorage.clear();
    window.location.href = "/auth/signin";
  };

  // Sidebar Menu List
  const navLinks = [
    { name: "Dashboard", module: "Dashboard", href: "/admin/dashboard" },

    { name: "Manage Role", module: "Manage Role", href: "/admin/roles" },

    { name: "Manage Users", module: "Manage Users", href: "/admin/users" },
    {
      name: "Masters",
      items: [
        { name: "State", module: "Add State", href: "/admin/masters/state" },
        { name: "District", module: "Add District", href: "/admin/masters/district" }
      ]
    },
    {
      name: "Masters",
      items: [
        { name: "State", module: "Add State", href: "/admin/masters/state" },
        { name: "District", module: "Add District", href: "/admin/masters/district" }
      ]
    },
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
        { name: "Matching Income", module: "Matching Income", href: "/admin/Income/matchingIncome" },
      ],
    },

    { name: "Grievance", module: "Grievance", href: "/admin/grievance" },
    { name: "Contact Us", module: "ContactUS", href: "/admin/contactUs" },
  ];

  // Filter navLinks based on permissions
  const filteredNavLinks = navLinks.filter((link) => {
    // For simple links, check if module exists and has read permission
    if (!link.items) {
      return hasReadPermission(link.module);
    }

    // For dropdowns, check if any sub-item has read permission
    // Also check if parent dropdown itself has a permission (optional)
    const visibleItems = link.items.filter((sub) => hasReadPermission(sub.module));
    return visibleItems.length > 0;
  });

  return (
    <>
      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-0 h-screen w-64 bg-green-700 text-white flex flex-col shadow-xl z-50 transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:inset-auto md:top-0 md:left-0" // desktop fixes
        )}
      >

        <div className="p-5 text-2xl font-bold text-center border-b border-green-600">
          Tathastu Panel
        </div>

        <nav className="flex-1 mt-4 overflow-y-auto scrollbar-hide">
          {filteredNavLinks.map((link) => {
            if (!link.items) {
              // Simple link - already filtered by hasReadPermission
              return (
                <ReloadLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-6 py-3 hover:bg-green-600 hover:text-white",
                    pathname === link.href && "bg-green-600"
                  )}
                >
                  {link.name}
                </ReloadLink>
              );
            }

            // Dropdown menu - items already filtered in filteredNavLinks
            const visibleItems = link.items.filter((sub) => hasReadPermission(sub.module));

            return (
              <div key={link.name}>
                <button
                  onClick={() => toggleDropdown(link.name)}
                  className="w-full flex justify-between px-6 py-3 hover:bg-green-600 hover:text-white"
                >
                  {link.name}
                  {openDropdown === link.name ? <ChevronUp /> : <ChevronDown />}
                </button>

                {openDropdown === link.name && (
                  <div className="ml-4 border-l border-green-500 pl-4">
                    {visibleItems.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setIsOpen(false)}
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
          className="m-4 py-2.5 bg-green-600 rounded-md hover:bg-green-500"
        >
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