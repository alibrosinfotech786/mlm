"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

const SuccessStories = () => {
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const stories = [
    {
      id: 1,
      name: "RAJESH & SUNITA MEHTA",
      image: "/images/profile.jpg",
      description:
        "We started our journey with just belief and determination...",
      fullDescription:
        "We started our journey with just belief and determination. Through hard work and teamwork, Tathastu Ayurveda has given us financial independence and a life full of meaning and stability.",
    },
    {
      id: 2,
      name: "AMANDEEP SINGH & PRIYA KAUR",
      image: "/images/profile.jpg",
      description:
        "Coming from a middle-class background, we dreamt of a better life...",
      fullDescription:
        "Coming from a middle-class background, we dreamt of a better life. Tathastu Ayurveda helped us achieve stability, respect, and the confidence to build and lead our own successful team.",
    },
    {
      id: 3,
      name: "VIKAS SHARMA",
      image: "/images/profile.jpg",
      description:
        "Before joining Tathastu Ayurveda, I was struggling...",
      fullDescription:
        "Before joining Tathastu Ayurveda, I was struggling to balance my career and personal goals. The mentorship, mindset training, and team support helped me transform my life entirely.",
    },
    {
      id: 4,
      name: "VIKAS SHARMA",
      image: "/images/profile.jpg",
      description:
        "Before joining Tathastu Ayurveda, I was struggling...",
      fullDescription:
        "Before joining Tathastu Ayurveda, I was struggling to balance my career and personal goals. The mentorship, mindset training, and team support helped me transform my life entirely.",
    },
    {
      id: 5,
      name: "VIKAS SHARMA",
      image: "/images/profile.jpg",
      description:
        "Before joining Tathastu Ayurveda, I was struggling...",
      fullDescription:
        "Before joining Tathastu Ayurveda, I was struggling to balance my career and personal goals. The mentorship, mindset training, and team support helped me transform my life entirely.",
    },
  ];

  return (
    <section className="py-16 bg-background font-sans">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-10 text-center tracking-wide">
          Team Members
        </h2>

        {/* Carousel */}
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

                  <div className="flex flex-col grow p-4 text-left">
                    <p className="text-sm text-muted-foreground grow">
                      {member.description.slice(0, 80)}...
                    </p>

                    {/* ===== TRIGGER MODAL HERE ===== */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => setSelectedMember(member)}
                          className="mt-3 text-sm text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                        >
                          Read More
                        </button>
                      </DialogTrigger>

                      {/* ===== MODAL CONTENT ===== */}
                      <DialogContent className="sm:max-w-md bg-card border border-border text-foreground">
                        <DialogHeader>
                          <DialogTitle className="text-lg font-bold text-primary uppercase tracking-wide">
                            {selectedMember?.name}
                          </DialogTitle>
                        </DialogHeader>

                        <div className="mt-4 flex flex-col items-center">
                          <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-md mb-4">
                            <Image
                              src={selectedMember?.image || ""}
                              alt={selectedMember?.name || ""}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <DialogDescription className="text-sm text-muted-foreground text-center leading-relaxed">
                            {selectedMember?.fullDescription}
                          </DialogDescription>
                        </div>

                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            className="mt-6 mx-auto flex justify-center cursor-pointer"
                          >
                            Close
                          </Button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
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

export default SuccessStories;
