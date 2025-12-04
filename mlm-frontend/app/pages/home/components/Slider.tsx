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
        <section className="relative py-3 sm:py-4 md:py-6 lg:py-8 overflow-hidden bg-white/30 backdrop-blur-sm rounded-xl">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center px-4 sm:px-6 md:px-8 lg:px-10 gap-4 sm:gap-5 md:gap-6 lg:gap-8">

                {/* LEFT CARD */}
                <div className="flex-shrink-0 w-full sm:w-auto">
                    <div className="bg-white/70 backdrop-blur-md shadow-md border border-green-200 rounded-xl sm:rounded-2xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-center">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-green-800">
                            Our Services
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Trusted by thousands across India
                        </p>
                    </div>
                </div>

                {/* SCROLLING ITEMS */}
                <div className="flex-1 w-full overflow-hidden">
                    <div className="flex animate-slider gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-center">
                        {scrollingItems.map((item, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center text-center flex-shrink-0 w-[100px] xs:w-[110px] sm:w-[130px] md:w-[150px] lg:w-[170px] xl:w-[180px]"
                            >
                                {/* IMAGE */}
                                <div className="relative w-[40px] h-[30px] xs:w-[45px] xs:h-[35px] sm:w-[50px] sm:h-[40px] md:w-[65px] md:h-[50px] lg:w-[75px] lg:h-[60px] xl:w-[85px] xl:h-[65px] mb-2 sm:mb-3">
                                    <Image
                                        src={item.image}
                                        alt={`Slider item ${i + 1}`}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 640px) 40px, (max-width: 768px) 50px, (max-width: 1024px) 65px, 85px"
                                    />
                                </div>

                                {/* TEXT */}
                                <h4 className="text-[10px] xs:text-xs sm:text-sm md:text-base font-semibold text-green-800 px-1">
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
                    animation: slider 30s linear infinite;
                }
                
                /* Pause animation on hover */
                .animate-slider:hover {
                    animation-play-state: paused;
                }
                
                /* Responsive animation speed */
                @media (max-width: 640px) {
                    .animate-slider {
                        animation-duration: 20s;
                    }
                }
                
                @media (min-width: 641px) and (max-width: 1024px) {
                    .animate-slider {
                        animation-duration: 25s;
                    }
                }
                
                @media (min-width: 1025px) {
                    .animate-slider {
                        animation-duration: 30s;
                    }
                }
            `}</style>
        </section>
    );
}