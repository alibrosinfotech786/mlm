"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TeamGrid from "./components/TeamGrid";
import Image from "next/image";

export default function OurTeamPage() {
  return (
    <>
      <Header />

      {/* ===== Hero Banner ===== */}
      <section className="relative w-full flex justify-center items-center bg-background pt-8">
        <div className="relative w-[85%] h-40 md:h-52 lg:h-64 rounded-xl overflow-hidden shadow-lg">
          <Image
            src="/images/teambanner.png"
            alt="Team Banner"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </section>

      <TeamGrid />
      <Footer />
    </>
  );
}
