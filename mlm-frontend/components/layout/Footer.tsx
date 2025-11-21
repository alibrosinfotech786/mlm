"use client";

import React from "react";
import Image from "next/image";
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
              {[
                "About Tathastu Ayurveda",
                "Career",
                "Grievance Redressal",
                "Contact Us",
                "Notification History",
                "Our Branches",
                "Heart to Heart",
              ].map((text) => (
                <li key={text}>
                  <a href="#" className="hover:text-primary transition-colors">
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h3 className="text-base font-semibold text-primary mb-3">Policy</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Cancellation & Refund Process",
                "Delivery Area",
                "Disclaimer",
                "Privacy & Security Policy",
                "Shipping Policy",
                "Terms & Conditions",
              ].map((text) => (
                <li key={text}>
                  <a href="#" className="hover:text-primary transition-colors">
                    {text}
                  </a>
                </li>
              ))}
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
              <a href="mail:tathastuayurveda@zohomail.in" className="text-primary font-medium hover:underline">
               tathastuayurveda@zohomail.in
              </a>
            </p>
            <p className="text-sm">
              Phone:{" "}
              <a href="tel:01143101234" className="text-primary font-medium hover:underline">
                011-43101234
              </a>
            </p>
            <p className="text-sm mb-4">
              Toll Free:{" "}
              <a href="tel:18001023424" className="text-primary font-medium hover:underline">
                1800-102-3424
              </a>
            </p>

            {/* Social */}
            <div className="flex space-x-4 text-primary text-lg">
              {[FaInstagram, FaFacebookF, FaXTwitter, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="hover:text-secondary transition-colors">
                  <Icon />
                </a>
              ))}
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
