"use client";

import React from "react";
import Image from "next/image";

export default function Slider() {
    const items = [
        { image: "/partners/1.png", title: "Business & Entrepreneurship" },
        { image: "/partners/2.png", title: "Tathastu Leadership Academy(TLA)" },
        { image: "/partners/3.png", title: "Ethical Direct Selling" },
        { image: "/partners/4.png", title: "Customer Support" },
        { image: "/partners/5.png", title: "Community Building" },
        { image: "/partners/6.png", title: "Registered Education & Training" },
    ];

    const scrollingItems = [...items, ...items];

    return (
        <section className="relative py-2 overflow-hidden bg-white/30 backdrop-blur-sm rounded-xl">
            <div className="max-w-7xl mx-auto flex items-center px-6 md:px-10 gap-5">

                {/* LEFT CARD */}
                <div className="flex-shrink-0">
                    <div className="bg-white/70 backdrop-blur-md shadow-md border border-green-200 rounded-2xl px-8 py-6 text-center">
                        <h3 className="text-xl md:text-2xl font-bold text-green-800">
                            Our Services
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Trusted by thousands across India
                        </p>
                    </div>
                </div>

                {/* SCROLLING ITEMS */}
                <div className="flex-1 overflow-hidden">
                    <div className="flex animate-slider gap-10 md:gap-16 items-center">
                        {scrollingItems.map((item, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center text-center flex-shrink-0 w-[140px] md:w-[180px]"
                            >
                                {/* IMAGE */}
                                <div className="relative w-[60px] h-[45px] md:w-[85px] md:h-[65px] mb-3">
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

            {/* ANIMATION */}
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
