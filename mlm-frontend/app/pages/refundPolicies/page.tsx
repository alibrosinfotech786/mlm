"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FaLeaf } from "react-icons/fa";

export default function CancellationRefund() {
  return (
    <>
      <Header />

      {/* 🌿 Soft Ayurvedic Hero */}
      <section className="relative w-full py-16 md:py-20 bg-[#f3f8f3] overflow-hidden">
        {/* Soft green blurred shapes */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-[#cfe7cf] rounded-full blur-2xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-[#d6ead4] rounded-full blur-2xl opacity-40"></div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#355E3B] flex items-center justify-center gap-2">
            <FaLeaf className="text-[#4F8A4C]" />
            Cancellation & Refund Policy
            <FaLeaf className="text-[#4F8A4C] rotate-180" />
          </h1>

          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm md:text-base">
            Our goal is to ensure a transparent and worry-free experience for every customer.
          </p>
        </div>
      </section>

      {/* 🌿 Main Content */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* === SECTIONS DATA === */}
          {[
            {
              title: "1. Order Cancellation Policy",
              items: [
                {
                  heading: "1.1 Cancellation Before Dispatch",
                  detail: "You may cancel your order before the product is shipped.",
                  points: [
                    "A full refund will be issued to the original payment method.",
                    "No cancellation charges will be applied.",
                  ],
                },
                {
                  heading: "1.2 Cancellation After Dispatch",
                  detail:
                    "Once an order has been shipped, it cannot be cancelled. You may request a return after delivery.",
                },
              ],
            },

            {
              title: "2. Return & Refund Policy",
              description: "Refunds and replacements are available under the following cases:",
              items: [
                {
                  heading: "2.1 Damaged Products",
                  points: [
                    "Report within 48 hours of delivery.",
                    "Share clear photos/videos of damage.",
                    "Full refund or replacement will be provided.",
                  ],
                },
                {
                  heading: "2.2 Defective Products",
                  points: [
                    "Report within 7 days of delivery.",
                    "Share photos/video and batch number.",
                    "Full refund or replacement will be provided.",
                  ],
                },
                {
                  heading: "2.3 Wrong Product Delivered",
                  points: [
                    "Report within 7 days.",
                    "Replacement will be arranged at no additional cost.",
                  ],
                },
                {
                  heading: "2.4 Expired Product Delivered",
                  points: [
                    "Report within 48 hours.",
                    "Full refund or replacement will be provided.",
                  ],
                },
              ],
            },

            {
              title: "3. Return Policy for Consumable Products",
              description:
                "We offer a 30-Day Satisfaction Guarantee for consumable products:",
              points: [
                "Return request must be made within 30 days of delivery.",
                "Product usage must not exceed 30%.",
                "Refund will be processed after product verification.",
              ],
            },

            {
              title: "4. Refund Processing Time",
              points: [
                "Approval & processing time: 3–5 working days.",
                "Refund to bank/wallet: 5–10 working days.",
              ],
              description: "Timelines may vary based on bank/payment gateway policies.",
            },

            {
              title: "5. Non-Refundable Situations",
              points: [
                "Product used more than 30%.",
                "Return request raised after allowed timelines.",
                "Product damaged due to customer misuse.",
                "Items returned without original packaging or accessories.",
              ],
            },

            {
              title: "6. Shipping Charges",
              description: "Shipping fees (original or return) are non-refundable except in cases of:",
              points: [
                "Damaged product received.",
                "Expired product delivered.",
                "Wrong product shipped.",
                "Manufacturing defects.",
              ],
            },

            {
              title: "7. How to Initiate a Cancellation or Refund",
              description:
                "To request a cancellation, return, or refund, please contact:",
              points: [
                "Email: info@tathastuayurveda.world",
                "Include order ID, reason, and required proof (photos/video).",
              ],
              footer: "Our support team will guide you through the complete process.",
            },
          ].map((section, index) => (
            <div
              key={index}
              className="bg-[#f7faf7] border border-[#e3f0e3] rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Title */}
              <h2 className="text-xl md:text-2xl font-semibold text-[#355E3B] mb-4">
                {section.title}
              </h2>

              {/* Description */}
              {section.description && (
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {section.description}
                </p>
              )}

              {/* Subsection Items */}
              {section.items &&
                section.items.map((item: any, i: number) => (
                  <div key={i} className="mb-6">
                    <h3 className="text-lg font-medium text-primary mb-2">
                      {item.heading}
                    </h3>

                    {item.detail && (
                      <p className="text-muted-foreground mb-2">
                        {item.detail}
                      </p>
                    )}

                    {item.points && (
                      <ul className="list-disc ml-6 text-muted-foreground space-y-1">
                        {item.points.map((p: string, idx: number) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

              {/* Simple Points */}
              {section.points && (
                <ul className="list-disc ml-6 text-muted-foreground space-y-1">
                  {section.points.map((p: string, idx: number) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              )}

              {/* Footer Note */}
              {section.footer && (
                <p className="mt-4 text-muted-foreground">{section.footer}</p>
              )}
            </div>
          ))}

        </div>
      </section>

      <Footer />
    </>
  );
}
