"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

interface Slide {
  id: number;
  src: string;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    id: 1,
    src: "/slider/slider11.png",
    title: "Latest Updates & Exclusive Offers",
    description:
      "Stay tuned for our newest deals, seasonal discounts, and special offers designed to bring you the best in Ayurvedic wellness and care.",
  },
  {
    id: 2,
    src: "/slider/slider22.png",
    title: "Important Product Announcement",
    description:
      "Discover our newly launched Ayurvedic formulations — crafted with authentic ingredients and backed by years of traditional expertise.",
  },
  {
    id: 3,
    src: "/slider/slider33.png",
    title: "Important Product Announcement",
    description:
      "Discover our newly launched Ayurvedic formulations — crafted with authentic ingredients and backed by years of traditional expertise.",
  },
];

const AUTO_PLAY_INTERVAL = 6000;

export default function HorizontalParallaxSlider() {
  const [index, setIndex] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);
  const oldIndexRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<HTMLImageElement[]>([]);
  const textRefs = useRef<HTMLDivElement[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => setIsClient(true), []);

  imageRefs.current = [];
  textRefs.current = [];

  const addToImageRefs = (el: HTMLImageElement | null) => {
    if (el && !imageRefs.current.includes(el)) imageRefs.current.push(el);
  };

  const addToTextRefs = (el: HTMLDivElement | null) => {
    if (el && !textRefs.current.includes(el)) textRefs.current.push(el);
  };

  // 🔥 GSAP Animation
  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { duration: 1.2, ease: "power3.inOut" },
    });

    tl.to(containerRef.current, {
      xPercent: index * -100,
    });

    oldIndexRef.current = index;
  }, [index]);

  // AUTO PLAY
  useEffect(() => {
    if (!isClient) return;
    startAutoPlay();
    return stopAutoPlay;
  }, [index, isClient]);

  const startAutoPlay = () => {
    stopAutoPlay();
    timeoutRef.current = setTimeout(() => handleNext(), AUTO_PLAY_INTERVAL);
  };

  const stopAutoPlay = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleNext = () => setIndex((prev) => (prev + 1) % slides.length);
  const handlePrev = () =>
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  if (!isClient) {
    return (
      <div className="w-full h-[40vh] md:h-[50vh] bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[70vh] overflow-hidden bg-black"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      {/* SLIDES CONTAINER */}
      <div ref={containerRef} className="flex h-full w-full">
        {slides.map((s, i) => (
          <div key={s.id} className="w-full h-full shrink-0 relative">
            <img
              ref={addToImageRefs}
              src={s.src}
              alt={s.title}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* LEFT ARROW */}
      <button
        aria-label="Previous slide"
        onClick={() => {
          stopAutoPlay();
          handlePrev();
        }}
        className="absolute top-1/2 left-3 transform -translate-y-1/2 z-40 bg-black/40 hover:bg-black/70 p-2 rounded-full text-white"
      >
        <RiArrowLeftSLine className="w-6 h-6" />
      </button>

      {/* RIGHT ARROW */}
      <button
        aria-label="Next slide"
        onClick={() => {
          stopAutoPlay();
          handleNext();
        }}
        className="absolute top-1/2 right-3 transform -translate-y-1/2 z-40 bg-black/40 hover:bg-black/70 p-2 rounded-full text-white"
      >
        <RiArrowRightSLine className="w-6 h-6" />
      </button>
    </div>
  );
}
