"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const BASE = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

// Resolve full image URL
function resolveImage(path?: string) {
  if (!path) return "/images/no-image.png";
  return `${BASE}/${path}`.replace(/([^:]\/)\/+/g, "$1");
}

const TrainingCourses = () => {
  const [trainings, setTrainings] = useState<any[]>([]);

  async function fetchTrainings() {
    try {
      const res = await axiosInstance.get(ProjectApiList.training);
      const list = res.data.trainings || [];

      setTrainings(
        list.map((t: any) => ({
          id: t.id,
          title: t.topic,
          description: t.description,
          image: resolveImage(t.image),
        }))
      );
    } catch {
      console.log("Failed to load trainings");
    }
  }

  useEffect(() => {
    fetchTrainings();
  }, []);

  return (
    <section className="py-16 bg-background font-sans">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-10 text-center tracking-wide">
          Training & Certification
        </h2>

        <Carousel className="w-full max-w-7xl mx-auto">
          <CarouselContent>
            {trainings.map((course) => (
              <CarouselItem
                key={course.id}
                className="md:basis-1/2 lg:basis-1/4 p-4"
              >
                {/* CARD */}
                <div
                  className="
                    rounded-2xl overflow-hidden shadow-sm border border-border 
                    bg-gradient-to-br from-white/90 to-green-50/40 
                    hover:shadow-lg hover:-translate-y-1 transition-all duration-300 
                    flex flex-col h-full
                  "
                >
                  {/* IMAGE */}
                  <div className="relative w-full h-44 bg-gray-100">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* TITLE BAR */}
                  <div className="
                    bg-primary text-primary-foreground 
                    py-2.5 text-center text-sm font-semibold uppercase tracking-wider
                    shadow-sm
                  ">
                    {course.title}
                  </div>

                  {/* DESCRIPTION AREA */}
                  <div className="flex flex-col grow p-5 text-left">
                    <p className="text-sm text-muted-foreground leading-relaxed grow">
                      {course.description?.slice(0, 100)}...
                    </p>

                    {/* READ MORE LINK */}
                    <a
                      href={`/pages/training/courseDetails?course_id=${course.id}`}
                      className="
                        text-sm font-semibold text-primary hover:text-primary/80 
                        flex items-center gap-1 transition
                      "
                    >
                      Read More →
                    </a>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="max-sm:ml-7 md:flex bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" />
          <CarouselNext className="max-sm:mr-7 md:flex bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" />
        </Carousel>
      </div>
    </section>
  );
};

export default TrainingCourses;
