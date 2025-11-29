import React from "react";
import Image from "next/image";

const images = [
  "/images/pp1.jpg",
  "/images/pp2.jpg",
  "/images/pp3.jpg",
  "/images/pp4.jpg",
  "/images/pp4.jpg", // ⭐ NEW IMAGE
];

export default function BusinessOpportunity() {
  return (
    <section className="py-12 md:py-16 bg-background overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-20 flex flex-col md:flex-row items-center gap-10 md:gap-16">

        {/* ===== Left: Overlapping Collage ===== */}
        <div className="relative flex-1 w-full h-80 sm:h-96 md:h-[430px] lg:h-[500px]">

          {images.map((src, i) => {
            // Positions for 5 images
            const positions = [
              { top: "0%", left: "10%", rotate: "-4deg" },
              { top: "15%", left: "55%", rotate: "3deg" },
              { top: "48%", left: "5%", rotate: "-5deg" },
              { top: "40%", left: "65%", rotate: "4deg" },
              { top: "20%", left: "30%", rotate: "-2deg" }, // ⭐ Center image
            ];

            return (
              <div
                key={i}
                className="absolute rounded-xl overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105"
                style={{
                  top: positions[i].top,
                  left: positions[i].left,
                  transform: `rotate(${positions[i].rotate})`,
                  width: i === 4 ? "38%" : i % 2 === 0 ? "28%" : "32%", // center image slightly bigger
                  height: i === 4 ? "38%" : i % 2 === 0 ? "28%" : "32%",
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

          {/* Center Overlay Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary text-center drop-shadow-lg stroke-text"
            >
              CONNECTING <br className="hidden sm:block" /> PEOPLE...
            </h2>
          </div>

        </div>

        {/* ===== Right: Updated Ayurvedic Content ===== */}
        <div className="flex-1 w-full text-center md:text-left">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary mb-4">
            Who We Are
          </h3>

          <p className="text-muted-foreground mb-6 text-sm sm:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
            We are a purpose-driven Indian wellness and entrepreneurship organization dedicated to transforming lives through
            <span className="text-primary font-semibold"> authentic Ayurvedic products</span>,
            <span className="text-primary font-semibold"> ethical network marketing</span>, and a
            <span className="text-primary font-semibold"> structured professional education system</span>.
            <br />

            Built on a strong foundation of <strong>trust, transparency, and traditional Ayurvedic values</strong>,
            our model integrates a powerful combination of:
          </p>

          <ul className="list-disc pl-5 space-y-2 text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
            <li>Premium Ayurvedic wellness solutions</li>
            <li>A fair & future-ready direct-selling business model</li>
            <li>A registered educational system — <strong>Raman’s Way Foundation</strong></li>
            <li>Leadership development & digital entrepreneurship training</li>
          </ul>

          <p className="text-muted-foreground mt-6 text-sm sm:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
            Our philosophy is simple:
            <span className="text-primary font-semibold"> Health First. Growth Always. Ethics Forever.</span>
            <br /><br />

          </p>
        </div>

      </div>
      <div className="mx-30">
        <p className="pb-2"> We provide individuals across India with a low-cost, high-impact business opportunity supported by world-class training, strong mentorship, and a transparent compensation system.</p>
        <p className="pb-2">
          We are not just a product company.
          <strong className="text-primary"> We are a movement — a community built on wellness, leadership, and financial empowerment.</strong></p>

        With a vision to create India’s most ethical and successful network marketing ecosystem, we stand as a bridge between
        <strong className="text-primary"> ancient wellness</strong>,
        <strong className="text-primary"> modern entrepreneurship</strong>, and
        <strong className="text-primary"> lifelong personal transformation</strong>.
      </div>
    </section>
  );
}
