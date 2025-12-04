"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card text-foreground/80">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">

          {/* Logo */}
          <div className="flex flex-col items-start">
            <Image
              src="/images/logo.png"
              alt="Tathastu Ayurveda Logo"
              width={130}
              height={60}
              className="object-contain mb-3"
            />
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-base font-semibold text-primary mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pages/aboutUs" className="hover:text-primary transition-colors">
                  About Tathastu Ayurveda
                </Link>
              </li>

              <li>
                <Link href="/pages/contactUs" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>

              <li>
                <Link href="/pages/ourTeam" className="hover:text-primary transition-colors">
                  Our Team
                </Link>
              </li>

              <li>
                <Link href="/pages/event" className="hover:text-primary transition-colors">
                  Events
                </Link>
              </li>

              <li>
                <Link href="/pages/gallery" className="hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>

              <li>
                <Link href="/pages/training" className="hover:text-primary transition-colors">
                  Training
                </Link>
              </li>

              <li>
                <Link href="/pages/products" className="hover:text-primary transition-colors">
                  Our Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h3 className="text-base font-semibold text-primary mb-3">Policy</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/pages/refundPolicies"
                  className="hover:text-primary transition-colors"
                >
                  Cancellation & Refund Process
                </Link>
              </li>

            </ul>
          </div>

          {/* Office Info */}
          <div>
            <h3 className="text-base font-semibold text-primary mb-3">
              Our Corporate Office
            </h3>
            <p className="text-sm leading-relaxed">
              Ranchi, Jharkhand 834003 <br />
              Ramgarh, Jharkhand 829106 <br />
            </p>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-base font-semibold text-primary mb-3">Customer Care</h3>

            <p className="text-sm">
              Email:{" "}
              <a
                href="mailto:info@tathastuayurveda.world"
                className="text-primary font-medium hover:underline"
              >
                info@tathastuayurveda.world
              </a>
            </p>

            <p className="text-sm">
              Phone:{" "}
              <a
                href="tel:9199977007"
                className="text-primary font-medium hover:underline"
              >
                +91 99977007
              </a>
            </p>

            {/* Social */}
            <div className="flex space-x-4 text-primary text-lg mt-4">
              {[FaInstagram, FaFacebookF, FaXTwitter, FaYoutube].map(
                (Icon, i) => (
                  <a key={i} href="#" className="hover:text-secondary transition-colors">
                    <Icon />
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Tathastu Ayurveda Pvt. Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
