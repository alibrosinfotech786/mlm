"use client";
import React from "react";
import Image from "next/image";

const Banner = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row items-center bg-linear-to-r from-background to-card rounded-xl overflow-hidden shadow-md">
          <div className="relative w-full md:w-1/2 h-80 md:h-[450px]">
            <Image src="/images/banner.jpg" alt="Empower" fill className="object-cover" priority />
          </div>
          <div className="w-full md:w-1/2 p-8 md:p-14 text-left">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-6 uppercase">
              Empower Your Wellness <br /> & Financial Growth
            </h2>
            <p className="text-muted-foreground text-base md:text-sm mb-8">
              Join our mission to promote health, confidence, and prosperity through world-class
              Ayurvedic products and business opportunities.
            </p>
            <button className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 transition cursor-pointer">
              JOIN NOW
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
