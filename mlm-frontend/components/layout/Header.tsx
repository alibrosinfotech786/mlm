"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, User } from "lucide-react";
import ReloadLink from "../ReloadLink";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/pages/aboutUs" },
  { name: "Events", href: "/pages/event" },
  { name: "Training", href: "/pages/training" },
  { name: "Products", href: "/pages/products" },
  { name: "Our Team", href: "/pages/ourTeam" },
  { name: "Gallery", href: "/pages/gallery" },
  { name: "File", href: "/pages/fileManager" },
  { name: "Contact Us", href: "/pages/contactUs" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between px-4 sm:px-8 lg:px-20 py-3 relative">

        {/* ===== Logo + Title (Medium) ===== */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/images/logo.png"
            alt="Tathastu Ayurveda Logo"
            width={75}
            height={75}
            className="rounded-full transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            Tathastu Ayurveda
          </span>
        </Link>

        {/* ===== Desktop Navigation ===== */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center space-x-8">
            {navItems.map((item) => (
              <ReloadLink
                key={item.href}
                href={item.href}
                className={cn(
                  "font-medium text-foreground/80 hover:text-primary transition-colors duration-300 text-sm lg:text-base",
                  pathname === item.href && "text-primary font-semibold"
                )}
              >
                {item.name}
              </ReloadLink>
            ))}
          </nav>

          {/* ===== Account Dropdown (Medium Size) ===== */}
          <div className="relative">
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-primary/10 transition-colors duration-300"
            >
              <User className="w-5 h-5 text-primary" />
              <span className="font-medium text-sm text-foreground">
                Account
              </span>
            </button>

            {accountOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-md shadow-lg py-2">
                <Link
                  href="/auth/signin"
                  onClick={() => setAccountOpen(false)}
                  className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setAccountOpen(false)}
                  className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ===== Mobile Menu Button ===== */}
        <button
          className="md:hidden text-foreground hover:text-primary transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* ===== Mobile Dropdown Menu ===== */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border shadow-md animate-in slide-in-from-top-2">
          <nav className="flex flex-col px-6 py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "font-medium text-foreground hover:text-primary transition-colors text-sm",
                  pathname === item.href && "text-primary font-semibold"
                )}
              >
                {item.name}
              </Link>
            ))}

            {/* ===== Account Section Mobile ===== */}
            <div className="border-t border-border pt-4 mt-2 flex gap-3">
              <Link
                href="/auth/signin"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center border border-primary text-primary py-2 rounded-md font-medium hover:bg-primary hover:text-primary-foreground"
              >
                Sign In
              </Link>

              <Link
                href="/auth/signup"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-secondary"
              >
                Sign Up
              </Link>
            </div>

          </nav>
        </div>
      )}
    </header>
  );
}
