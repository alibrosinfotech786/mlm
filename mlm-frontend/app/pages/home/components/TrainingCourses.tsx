"use client";

import React from "react";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const TrainingCourses = () => {
    const courses = [
        {
            id: 1,
            title: "Leadership Development Program",
            image: "/slider/slider3.jpeg",
            description:
                "A complete course designed to build leadership qualities, communication skills, business understanding, and strong team management.",
        },
        {
            id: 2,
            title: "Financial Education & Wealth Building",
            image: "/slider/slider2.jpg",
            description:
                "Learn money management, financial planning, passive income building, and long-term wealth creation strategies.",
        },
        {
            id: 3,
            title: "Personality Development Training",
            image: "/slider/slider1.jpg",
            description:
                "Boost your confidence, public speaking skills, mindset, and professional behaviour through guided training.",
        },
        {
            id: 4,
            title: "Business Growth & Mentorship Sessions",
          image: "/slider/slider3.jpeg",
            description:
                "Learn business strategies, team building, prospecting, and duplication to grow a strong organization.",
        },
        {
            id: 5,
            title: "Wellness & Ayurveda Knowledge Sessions",
            image: "/slider/slider2.jpg",
            description:
                "Deep dive into Ayurveda-based wellness, product knowledge, health management, and lifestyle improvement.",
        },
        {
            id: 6,
            title: "Communication & Soft Skills Training",
           image: "/slider/slider3.jpeg",
            description:
                "Improve your communication, body language, presentation skills, and professional etiquette.",
        },
    ];

    return (
        <section className="py-16 bg-background font-sans">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-10 text-center tracking-wide">
                    Training & Education Courses
                </h2>

                <Carousel className="w-full max-w-7xl mx-auto">
                    <CarouselContent>
                        {courses.map((course) => (
                            <CarouselItem
                                key={course.id}
                                className="md:basis-1/2 lg:basis-1/4 p-3"
                            >
                                <div className="bg-card border border-border rounded-md shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                                    <div className="relative w-full h-72">
                                        <Image
                                            src={course.image}
                                            alt={course.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="bg-primary text-primary-foreground py-3 text-center text-sm font-semibold uppercase tracking-wider">
                                        {course.title}
                                    </div>
                                    <div className="flex flex-col grow p-4 text-left">
                                        <p className="text-sm text-muted-foreground grow">
                                            {course.description.slice(0, 80)}...
                                        </p>
                                        <a
                                            href="/pages/training"
                                            className="text-sm text-primary hover:text-gray-400 font-medium mt-2 transition"
                                        >
                                            Read More
                                        </a>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious className=" max-sm:ml-7 md:flex bg-primary text-primary-foreground hover:bg-primary/90" />
                    <CarouselNext className="max-sm:mr-7 md:flex bg-primary text-primary-foreground hover:bg-primary/90" />
                </Carousel>
            </div>
        </section>
    );
};

export default TrainingCourses;
