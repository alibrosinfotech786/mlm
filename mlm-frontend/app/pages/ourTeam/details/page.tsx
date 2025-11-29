"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FaUserCircle } from "react-icons/fa"; // ⭐ fallback icon
import { teamMembers } from "../components/data";

function TeamMemberDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const member = teamMembers.find((m) => m.id === Number(id));

  const [imgError, setImgError] = useState(false);

  if (!member) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
          Team member not found.
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      {/* ⭐ HERO SECTION */}
      <section className="w-full bg-gradient-to-r from-primary/10 to-primary/30 py-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-wide uppercase">
            {member.name}
          </h1>

          <p className="text-muted-foreground text-sm md:text-base mt-3 max-w-xl mx-auto">
            {member.designation} — {member.location}
          </p>
        </div>
      </section>

      {/* ⭐ MAIN PROFILE SECTION */}
      <section className="py-14 px-6 md:px-12 lg:px-24 bg-background">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

          {/* LEFT: PROFILE CARD */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 shadow-md text-center">
              <div className="relative w-full h-96 mx-auto rounded-lg overflow-hidden shadow-md mb-4 flex items-center justify-center bg-muted">

                {/* ⭐ IMAGE WITH FALLBACK ICON */}
                {!imgError && member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <FaUserCircle size={120} className="text-primary opacity-80" />
                )}
              </div>

              <h2 className="text-xl font-semibold text-primary uppercase tracking-wide">
                {member.name}
              </h2>

              <p className="text-muted-foreground text-sm mt-1">
                {member.designation}
              </p>

              <p className="text-muted-foreground text-xs">{member.location}</p>

              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs text-muted-foreground italic">
                  {member.shortDescription}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl shadow-sm p-8">

              {/* ⭐ THEIR JOURNEY */}
              <h3 className="text-2xl font-semibold text-primary mb-4">
                Their Journey
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                {member.theirJourney}
              </p>

              <div className="my-8 h-px w-full bg-border" />

              {/* ⭐ LEADERSHIP & IMPACT */}
              <h3 className="text-xl font-semibold text-primary mb-3">
                Leadership & Impact
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                {member.leadershipImpact}
              </p>

              <div className="my-8 h-px w-full bg-border" />

              {/* ⭐ VISION */}
              <h3 className="text-xl font-semibold text-primary mb-3">
                Vision
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                {member.vision}
              </p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}

export default function TeamMemberDetails() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
          <Footer />
        </>
      }
    >
      <TeamMemberDetailsContent />
    </Suspense>
  );
}
