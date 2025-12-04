"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa"; // ⭐ fallback icon from react-icons
import { teamMembers } from "./data";

export default function TeamGrid() {
  return (
    <section className="bg-background text-foreground py-16 px-6 md:px-12 lg:px-24">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
          Our Team
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Meet the inspiring leaders and achievers who drive Tathastu Ayurveda’s
          mission of wellness, empowerment, and success.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member) => {
          const hasImage =
            member.image && member.image.trim() !== "" && member.image !== null;

          return (
            <div
              key={member.id}
              className="bg-card border border-border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div className="relative w-full h-72 bg-muted flex items-center justify-center overflow-hidden">

                {/* If image exists → show it */}
                {hasImage ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none"; // hide broken image
                      target.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-muted text-primary">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="80" width="80" viewBox="0 0 512 512">
                            <path d="M256 256A128 128 0 1 0 256 0a128 128 0 1 0 0 256zm0 32c-87.1 0-256 43.8-256 131v61h512v-61C512 331.8 343.1 288 256 288z"/>
                          </svg>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  // If no image → show icon
                 <FaUserCircle size={80} className="text-primary opacity-80" />
                )}
              </div>

              <div className="p-4 flex flex-col grow">
                <h3 className="font-semibold text-primary text-sm md:text-base uppercase tracking-wide mb-2">
                  {member.name}
                </h3>

                <p className="text-gray-400 text-xs mb-2 italic">
                  {member.designation}, {member.location}
                </p>

                <p className="text-sm text-muted-foreground grow">
                  {member.shortDescription}
                </p>

                <Link
                  href={`/pages/ourTeam/details?id=${member.id}`}
                  className="mt-3 text-sm text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                >
                  Read More →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
