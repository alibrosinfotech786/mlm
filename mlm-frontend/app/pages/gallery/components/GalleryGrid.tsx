"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const galleryImages = [
  { id: 1, src: "/gallery/pp1.jpeg", category: "Events", title: "CNT Conference 2025" },
  { id: 2, src: "/gallery/pp2.jpeg", category: "Training", title: "Leadership Training Session" },
  { id: 3, src: "/gallery/pp3.jpeg", category: "Products", title: "New Product Launch" },
  { id: 4, src: "/gallery/pp4.jpeg", category: "Events", title: "Wellness Meet" },
  { id: 5, src: "/gallery/pp1.jpeg", category: "Our Team", title: "Team Celebration" },
  { id: 6, src: "/gallery/pp3.jpeg", category: "Training", title: "Skill Development Workshop" },
  { id: 7, src: "/gallery/pp4.jpeg", category: "Products", title: "Ayurveda Fair Stall" },
  { id: 8, src: "/gallery/pp2.jpeg", category: "Our Team", title: "Success Party" },
];

const categories = ["All", "Events", "Training", "Products", "Our Team"];

export default function GalleryGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredImages =
    selectedCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <section className="bg-background text-foreground py-16 px-6 md:px-12 lg:px-24">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
          Gallery
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore moments from our events, training sessions, and success stories.
        </p>
      </div>

      {/* Filters */}
      <div className="flex justify-center flex-wrap gap-3 mb-10">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <Dialog key={image.id}>
            <DialogTrigger asChild>
              <div className="relative group cursor-pointer overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <Image
                  src={image.src}
                  alt={image.title}
                  width={500}
                  height={500}
                  className="object-cover w-full h-48 sm:h-56 md:h-60 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm md:text-base">
                    {image.title}
                  </span>
                </div>
              </div>
            </DialogTrigger>

            {/* Fullscreen Dialog */}
            <DialogContent
              className="p-0 m-0 w-screen h-screen max-w-none border-none bg-black/90 flex items-center justify-center"
            >
              {/* ✅ Hidden Accessible Title */}
              <DialogTitle className="sr-only">{image.title}</DialogTitle>

              {/* Fullscreen Image */}
              <div className="relative w-full h-full">
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Overlay Text */}
              <div className="absolute bottom-8 left-0 right-0 text-center text-white px-4">
                <h3 className="text-xl md:text-2xl font-semibold">{image.title}</h3>
                <p className="text-sm md:text-base text-gray-300">{image.category}</p>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  );
}
