"use client";

import React from "react";
import Image from "next/image";

const images = [
  "/images/pp1.jpg",
  "/images/pp2.jpg",
  "/images/pp3.jpg",
  "/images/pp4.jpg",
  "/images/pp4.jpg",
];

export default function BusinessOpportunity() {
  return (
    <section className="py-12 md:py-16 bg-background overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-20 flex flex-col md:flex-row items-center gap-10 md:gap-16">

        {/* ===== Left: Responsive Image Collage ===== */}
        <div className="relative flex-1 w-full h-[300px] sm:h-[350px] md:h-[430px] lg:h-[500px]">

          {images.map((src, i) => {
            const positions = [
              { top: "0%", left: "8%", rotate: "-4deg" },
              { top: "20%", left: "60%", rotate: "3deg" },
              { top: "55%", left: "5%", rotate: "-5deg" },
              { top: "40%", left: "70%", rotate: "4deg" },
              { top: "25%", left: "32%", rotate: "-2deg" },
            ];

            const baseSize = i === 4 ? 38 : i % 2 === 0 ? 28 : 32;

            return (
              <div
                key={i}
                className="absolute rounded-xl overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105"
                style={{
                  top: positions[i].top,
                  left: positions[i].left,
                  transform: `rotate(${positions[i].rotate})`,
                  width: `${baseSize}%`,
                  height: `${baseSize}%`,
                }}
              >
                <Image
                  src={src}
                  alt={`Person ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            );
          })}

          {/* Center Overlay Title */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-primary text-center drop-shadow-lg stroke-text leading-tight">
              CONNECTING <br className="hidden sm:block" /> PEOPLE...
            </h2>
          </div>
        </div>

        {/* ===== Right: Text Section ===== */}
        <div className="flex-1 w-full text-center md:text-left">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary mb-4">
            Who We Are
          </h3>

          <p className="text-muted-foreground mb-6 text-sm sm:text-base leading-relaxed max-w-xl mx-auto md:mx-0 text-justify">
            We are a purpose-driven Indian wellness and entrepreneurship organization
            dedicated to transforming lives through
            <span className="text-primary font-semibold"> authentic Ayurvedic products</span>,
            <span className="text-primary font-semibold"> ethical network marketing</span>,
            and a
            <span className="text-primary font-semibold"> structured professional education system</span>.
            <br />
            Built on a foundation of <strong>trust, transparency, and traditional Ayurvedic values</strong>,
            our model integrates a powerful combination of:
          </p>

          <ul className="list-disc pl-5 space-y-2 text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl mx-auto md:mx-0 text-justify">
            <li>Premium Ayurvedic wellness solutions</li>
            <li>A fair & future-ready direct-selling business model</li>
            <li>Registered educational system — <strong>Raman’s Way Foundation</strong></li>
            <li>Leadership development & digital entrepreneurship training</li>
          </ul>

          <p className="text-muted-foreground mt-6 text-sm sm:text-base leading-relaxed max-w-xl mx-auto md:mx-0 text-justify">
            Our philosophy:
            <span className="text-primary font-semibold"> Health First. Growth Always. Ethics Forever.</span>
          </p>
        </div>
      </div>

      {/* ===== Bottom Paragraph ===== */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-20 mt-10 text-center md:text-left text-justify">
        <p className="pb-2 text-muted-foreground text-sm sm:text-base">
          We provide individuals across India with a low-cost, high-impact business opportunity supported by
          world-class training, strong mentorship, and a transparent compensation system.
        </p>

        <p className="pb-2 text-muted-foreground text-sm sm:text-base">
          We are not just a product company.
          <strong className="text-primary">
            {" "}We are a movement — a community built on wellness, leadership, and empowerment.
          </strong>
        </p>

        <p className="text-muted-foreground text-sm sm:text-base">
          Our vision unites
          <strong className="text-primary"> ancient wellness</strong>,
          <strong className="text-primary"> modern entrepreneurship</strong>, and
          <strong className="text-primary"> lifelong personal transformation</strong>.
        </p>
      </div>
    </section>
  );
}
