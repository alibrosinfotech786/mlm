import React from "react";
import Image from "next/image";

const images = ["/images/pp1.jpg", "/images/pp2.jpg", "/images/pp3.jpg", "/images/pp4.jpg"];

export default function BusinessOpportunity() {
  return (
    <section className="py-12 md:py-16 bg-background overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-20 flex flex-col md:flex-row items-center gap-10 md:gap-16">
        {/* ===== Left: Overlapping Collage ===== */}
        <div className="relative flex-1 w-full h-72 sm:h-80 md:h-[400px] lg:h-[480px]">
          {images.map((src, i) => {
            const positions = [
              { top: "0%", left: "5%", rotate: "-3deg" },
              { top: "20%", left: "50%", rotate: "5deg" },
              { top: "55%", left: "10%", rotate: "-5deg" },
              { top: "35%", left: "65%", rotate: "3deg" },
            ];
            return (
              <div
                key={i}
                className="absolute rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
                style={{
                  top: positions[i].top,
                  left: positions[i].left,
                  transform: `rotate(${positions[i].rotate})`,
                  width: i % 2 === 0 ? "30%" : "35%",
                  height: i % 2 === 0 ? "30%" : "35%",
                }}
              >
                <Image
                  src={src}
                  alt={`Person ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
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

        {/* ===== Right: Text + CTA ===== */}
        <div className="flex-1 w-full text-center md:text-left">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary mb-4">
            Who We Are
          </h3>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
            The starting point for every journey is knowledge. When you
            understand the path you walk, the journey becomes easier and more
            successful. At <span className="text-primary font-semibold">Tathastu Ayurveda</span>,
            we ensure our distributors know the plan and the opportunities that await them.
          </p>
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-secondary transition font-semibold">
            Start Your Business →
          </button>

        </div>
      </div>
    </section>
  );
}
