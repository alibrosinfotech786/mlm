"use client";

import React from "react";
import Image from "next/image";

export default function Slider() {
    const images = [
        "/partners/2.png",
        "/partners/3.png",
        "/partners/4.png",
        "/partners/5.png",
        "/partners/6.png",
        "/partners/7.png",
    ];

    const scrollingImages = [...images, ...images];

    return (
        <section className=" relative py-10 overflow-hidden">
            <div className="max-w-7xl mx-auto flex items-center  px-15">

                {/* ===== LEFT BOX ===== */}
                <div className="flex-shrink-0">
                    <div className="bg-white shadow-md border border-gray-200 rounded-xl px-8 py-6 text-center">
                        <h3 className="text-xl md:text-2xl font-semibold text-[#0A1D37]">
                            Our Partners
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Trusted by leading brands
                        </p>
                    </div>
                </div>

                {/* ===== RIGHT AUTO-SLIDING IMAGE ROW ===== */}
                <div className="flex-1 overflow-hidden relative">
                    <div className="flex animate-scroll gap-8 md:gap-12 items-center">
                        {scrollingImages.map((src, i) => (
                            <div
                                key={i}
                                className="relative flex-shrink-0 w-[80px] h-[60px] md:w-[120px] md:h-[80px]"
                            >
                                <Image
                                    src={src}
                                    alt={`Partner Logo ${i + 1}`}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* ===== SCROLL ANIMATION ===== */}
            <style jsx>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-scroll {
                    animation: scroll 5s linear infinite;
                }
            `}</style>
        </section>
    );
}
