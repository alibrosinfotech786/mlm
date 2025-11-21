"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

// --- Slide type definition ---
interface Slide {
  id: number;
  src: string;
  title: string;
  description: string;
}

// --- Data ---
const slides: Slide[] = [
  {
    id: 1,
    src: "/slider/slider3.jpeg",
    title: "Latest Updates & Exclusive Offers",
    description:
      "Stay tuned for our newest deals, seasonal discounts, and special offers designed to bring you the best in Ayurvedic wellness and care.",
  },
  {
    id: 2,
    src: "/slider/slider2.jpg",
    title: "Important Product Announcement",
    description:
      "Discover our newly launched Ayurvedic formulations — crafted with authentic ingredients and backed by years of traditional expertise.",
  },
];


const AUTO_PLAY_INTERVAL = 6000; // 6 seconds

export default function HorizontalParallaxSlider() {
  const [index, setIndex] = useState<number>(0);
  const oldIndexRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<HTMLImageElement[]>([]);
  const textRefs = useRef<HTMLDivElement[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear refs on re-render
  imageRefs.current = [];
  textRefs.current = [];

  const addToImageRefs = (el: HTMLImageElement | null) => {
    if (el && !imageRefs.current.includes(el)) imageRefs.current.push(el);
  };

  const addToTextRefs = (el: HTMLDivElement | null) => {
    if (el && !textRefs.current.includes(el)) textRefs.current.push(el);
  };

  // --- Slide animation ---
  useEffect(() => {
    const newIndex = index;
    const oldIndex = oldIndexRef.current;

    const newImage = imageRefs.current[newIndex];
    const newText = textRefs.current[newIndex];
    const oldImage = imageRefs.current[oldIndex];
    const oldText = textRefs.current[oldIndex];

    const tl = gsap.timeline({
      defaults: { duration: 1.2, ease: "power3.inOut" },
    });

    tl.to(containerRef.current, {
      xPercent: newIndex * -100,
    });

    if (oldText) {
      tl.to(oldText, { y: -30, autoAlpha: 0 }, "<");
    }

    if (newText) {
      tl.fromTo(
        newText,
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, delay: 0.1 },
        "<"
      );
    }

    if (oldImage) {
      tl.to(oldImage, { xPercent: 20 }, "<");
    }

    if (newImage) {
      tl.fromTo(newImage, { xPercent: -20 }, { xPercent: 0 }, "<");
    }

    oldIndexRef.current = newIndex;
  }, [index]);

  // --- Auto-play logic ---
  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const startAutoPlay = () => {
    stopAutoPlay();
    timeoutRef.current = setTimeout(() => handleNext(), AUTO_PLAY_INTERVAL);
  };

  const stopAutoPlay = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleNext = () => setIndex((prev) => (prev + 1) % slides.length);
  const handlePrev = () =>
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const goTo = (i: number) => setIndex(i);

  // --- Keyboard navigation ---
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        stopAutoPlay();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        stopAutoPlay();
        handlePrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="relative w-full h-[400px] md:h-[450px] overflow-hidden shadow-2xl group bg-black"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
      aria-roledescription="carousel"
    >
      {/* slides container */}
      <div ref={containerRef} className="flex h-full w-full">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className="h-full w-full shrink-0 relative"
            aria-hidden={i === index ? "false" : "true"}
          >
            {/* Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                ref={addToImageRefs}
                src={s.src}
                alt={s.title}
                className="w-full h-full object-cover"
                loading="lazy"
                draggable={false}
              />
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent z-10" />

            {/* Text block */}
            <div
              ref={addToTextRefs}
              className={`absolute left-6 md:left-16 bottom-36 md:bottom-32 z-20 text-white max-w-[90%] md:max-w-[60%] pointer-events-none pl-10 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <h2 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg mb-3">
                {s.title}
              </h2>
              <p className="text-base md:text-xl opacity-90">{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Left arrow */}
      <button
        aria-label="Previous slide"
        onClick={() => {
          stopAutoPlay();
          handlePrev();
        }}
        className="absolute top-1/2 left-3 md:left-5 transform -translate-y-1/2 z-40 bg-black/40 hover:bg-black/70 p-2 md:p-3 rounded-full text-white transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
      >
        <RiArrowLeftSLine className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      {/* Right arrow */}
      <button
        aria-label="Next slide"
        onClick={() => {
          stopAutoPlay();
          handleNext();
        }}
        className="absolute top-1/2 right-3 md:right-5 transform -translate-y-1/2 z-40 bg-black/40 hover:bg-black/70 p-2 md:p-3 rounded-full text-white transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
      >
        <RiArrowRightSLine className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      {/* Thumbnails */}
      <div className="hidden md:flex absolute bottom-13 left-1/2 -translate-x-1/2 z-5 space-x-3 bg-black/40 backdrop-blur-md px-3 py-2 rounded-xl">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => {
              stopAutoPlay();
              goTo(i);
            }}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-28 h-16 rounded-md overflow-hidden shrink-0 transition-transform duration-300 focus:outline-none ${
              i === index
                ? "ring-4 ring-white scale-110"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={s.src}
              alt={s.title}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
