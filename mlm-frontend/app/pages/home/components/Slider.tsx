"use client";

import React from "react";
import Image from "next/image";

export default function Slider() {
    const items = [
        {
            image: "/partners/1.jpeg",
            title: "Business & Entrepreneurship",
        },
        {
            image: "/partners/2.jpeg",
            title: "Tathastu Leadership Academy (TLA)",
        },
        {
            image: "/partners/3.jpeg",
            title: "Ethical Direct Selling",
        },
        {
            image: "/partners/4.jpeg",
            title: "Customer Support",
        },
        {
            image: "/partners/5.jpeg",
            title: "Community Building",
        },
        {
            image: "/partners/6.jpeg",
            title: "Registered Education & Training",
        },
    ];

    // Duplicate for infinite scroll
    const scrollingItems = [...items, ...items];

    return (
        <section className="relative py-10 overflow-hidden bg-[#F5F9F4]">
            <div className="max-w-7xl mx-auto flex items-center px-6 md:px-10 gap-5">

                {/* === LEFT CARD === */}
                <div className="flex-shrink-0">
                    <div className="bg-white shadow-md border border-green-200 rounded-2xl px-8 py-6 text-center">
                        <h3 className="text-xl md:text-2xl font-bold text-green-800">
                            Our Services
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Trusted by thousands across India
                        </p>
                    </div>
                </div>

                {/* === SCROLLING CONTENT === */}
                <div className="flex-1 overflow-hidden">
                    <div className="flex animate-slider gap-10 md:gap-16 items-center">
                        {scrollingItems.map((item, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center text-center flex-shrink-0 w-[140px] md:w-[180px]"
                            >
                                {/* IMAGE */}
                                <div className="relative w-[80px] h-[60px] md:w-[110px] md:h-[80px] mb-3">
                                    <Image
                                        src={item.image}
                                        alt={`Slider item ${i + 1}`}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                {/* TEXT */}
                                <h4 className="text-sm md:text-base font-semibold text-green-800">
                                    {item.title}
                                </h4>

                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* === SCROLL ANIMATION === */}
            <style jsx>{`
        @keyframes slider {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-slider {
          animation: slider 12s linear infinite;
        }
      `}</style>
        </section>
    );
}
