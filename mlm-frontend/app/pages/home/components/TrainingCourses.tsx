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
  const [loading, setLoading] = useState(true); // ✅ loading state

  async function fetchTrainings() {
    try {
      setLoading(true);
      const res = await axiosInstance.get(ProjectApiList.training);
      const list = res.data.trainings || [];

      setTrainings(
        list.data.map((t: any) => ({
          id: t.id,
          title: t.topic,
          description: t.description,
          image: resolveImage(t.image),
        }))
      );
    } catch {
      console.log("Failed to load trainings");
    } finally {
      setLoading(false);
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

        {/* =======================
            LOADING SKELETON
        ======================== */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border shadow-sm overflow-hidden"
              >
                <div className="w-full h-44 bg-gray-200" />
                <div className="h-10 bg-gray-300 mt-2" />
                <div className="p-5">
                  <div className="h-4 w-3/4 bg-gray-200 mb-3" />
                  <div className="h-4 w-1/2 bg-gray-200 mb-3" />
                  <div className="h-4 w-24 bg-gray-300" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =======================
            NO DATA MESSAGE
        ======================== */}
        {!loading && trainings.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-lg">
            No training courses available at the moment.
          </div>
        )}

        {/* =======================
            CAROUSEL (ONLY IF DATA)
        ======================== */}
        {!loading && trainings.length > 0 && (
          <Carousel className="w-full max-w-7xl mx-auto">
            <CarouselContent>
              {trainings.map((course) => (
                <CarouselItem
                  key={course.id}
                  className="md:basis-1/2 lg:basis-1/4 p-4"
                >
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
                    <div
                      className="
                        bg-primary text-primary-foreground 
                        py-2.5 text-center text-sm font-semibold uppercase tracking-wider
                        shadow-sm
                      "
                    >
                      {course.title}
                    </div>

                    {/* DESCRIPTION */}
                    <div className="flex flex-col grow p-5 text-left">
                      <p className="text-sm text-muted-foreground leading-relaxed grow">
                        {course.description?.slice(0, 100)}...
                      </p>

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

            {/* CAROUSEL ARROWS */}
            <CarouselPrevious className="max-sm:ml-7 md:flex bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" />
            <CarouselNext className="max-sm:mr-7 md:flex bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" />
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default TrainingCourses;
