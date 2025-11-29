"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      name: "CHITRANJAN TIWARI",
      image: "/teams/CHITRANJAN_TIWARI.jpeg",
      designation: "Network Marketing Leader",
      location: "Jharkhand, India (Core Leader)",
      shortDescription:
        "A highly driven Network Marketing Leader with over 15 years of experience in direct selling...",
      fullDescription:
        "A highly driven Network Marketing Leader with over 15 years of experience in direct selling, team building, and leadership coaching. Proven ability to develop strong distributor networks, conduct impactful training sessions, and drive consistent business growth through strategic planning, duplication systems, and ethical business practices.",
    },
    {
      id: 2,
      name: "MINTU VISHWAKARMA",
      image: "/teams/Mintu_VISHWAKARMA.jpeg",
       designation: "Network Marketing Leader & Business Trainer",
    location: "Jharkhand, India (Founder Leader)",

      shortDescription:
        "A highly driven Network Marketing Leader with over 15 years of experience in direct selling, team building....",
      fullDescription:
        "A highly driven Network Marketing Leader with over 15 years of experience in direct selling, team building, and leadership coaching. Proven ability to develop strong distributor networks, conduct impactful training sessions, and drive consistent business growth through strategic planning, duplication systems, and ethical business practices.",
    },
    {
      id: 3,
      name: "RAM PRATAP YADAV",
      image: "/teams/RAM_PRATAP_YADAV.jpeg",
       designation: "Network Marketing Leader & Business Trainer",
    location: "Uttar Pradesh, India (Core Leader)",
      shortDescription:
        "A highly driven Network Marketing Leader with over 15 years of experience in direct selling, team building....",
      fullDescription:
        "A highly driven Network Marketing Leader with over 15 years of experience in direct selling, team building, and leadership coaching. Proven ability to develop strong distributor networks, conduct impactful training sessions, and drive consistent business growth through strategic planning, duplication systems, and ethical business practices.",
    },
    {
      id: 4,
      name: "SHYAMAL DAS",
      image: "/teams/SHYAMAL_DAS.jpeg",
       designation: "Network Marketing Leader & Business Trainer",
    location: "West Bengal, India (Founder Leader)",

      shortDescription:
        "A highly driven Network Marketing Leader with over 15 years of experience in direct selling, team building....",
      fullDescription:
        "A highly driven Network Marketing Leader with over 15 years of experience in direct selling, team building, and leadership coaching. Proven ability to develop strong distributor networks, conduct impactful training sessions, and drive consistent business growth through strategic planning, duplication systems, and ethical business practices.",
    },
    {
      id: 5,
      name: "JUTTAM GOSWAMI",
      image: "/teams/UTTAM_GOSWAMI.jpeg",
       designation: "Network Marketing Leader & Business Trainer",
    location: "Tripura, India (Core Leader)",
      shortDescription:
        "A highly driven Network Marketing Leader with over 15 years of experience in direct selling, team building....",
      fullDescription:
        "A highly driven Network Marketing Leader with over 15 years of experience in direct selling, team building, and leadership coaching. Proven ability to develop strong distributor networks, conduct impactful training sessions, and drive consistent business growth through strategic planning, duplication systems, and ethical business practices.",
    },

  ];

  return (
    <section className="py-16 bg-background font-sans">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-10 text-center tracking-wide">
          Our Teams
        </h2>

        <Carousel className="w-full max-w-7xl mx-auto">
          <CarouselContent>
            {stories.map((member) => (
              <CarouselItem
                key={member.id}
                className="md:basis-1/2 lg:basis-1/4 p-3"
              >
                <div className="bg-card border border-border rounded-md shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                  <div className="relative w-full h-72">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="bg-primary text-primary-foreground py-3 text-center text-sm font-semibold uppercase tracking-wider">
                    {member.name}
                  </div>
                  <p className="text-gray-400 text-xs italic p-2">
                    {member.designation} ,

                    {member.location}
                  </p>

                  <div className="flex flex-col grow px-4 text-left">
                    <p className="text-sm text-muted-foreground grow">
                      {member.shortDescription.slice(0, 80)}...
                    </p>

                    {/* ===== OPEN DETAILS PAGE HERE ===== */}
                    <Link
                      href={`/pages/ourTeam/details?id=${member.id}`}
                      className="mt-3 text-sm text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer mb-1"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="max-sm:ml-7 md:flex bg-primary text-primary-foreground hover:bg-primary/90" />
          <CarouselNext className="max-sm:mr-7 md:flex bg-primary text-primary-foreground hover:bg-primary/90" />
        </Carousel>
      </div>
    </section>
  );
};

export default SuccessStories;
