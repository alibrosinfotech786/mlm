

"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const teamMembers = [
    {
        id: 1,
        name: "RAMESH PUNHANI",
        image: "/images/profile.jpg",
        shortDescription:
            "I always had big dreams for my life and Tathastu gave me a platform to realise my dreams. I am...",
        fullDescription:
            "I always had big dreams for my life and Tathastu Ayurveda gave me the perfect opportunity to achieve them. With consistent efforts and the right mentorship, I was able to transform my life and inspire many others to pursue wellness and success.",
    },
    {
        id: 2,
        name: "HARPREET KAUR & GURSHARAN SINGH",
        image: "/images/profile.jpg",
        shortDescription:
            "Before I became a Tathastu distributor, I was running my own business. The going was good but it was not...",
        fullDescription:
            "Before joining Tathastu Ayurveda, we were managing our own business but lacked the satisfaction and purpose we were looking for. With Tathastu, we not only achieved financial independence but also built meaningful relationships and a lifestyle of growth.",
    },
    {
        id: 3,
        name: "R S RAJAN (AASHIKHAA ENTERPRISES)",
        image: "/images/profile.jpg",
        shortDescription:
            "I had been working with other network marketing companies for the past 10 years. But despite my constant hard work...",
        fullDescription:
            "After years of struggle in other companies, I found Tathastu Ayurveda’s system transparent and growth-focused. The leadership support and training transformed my mindset and helped me build a thriving network of motivated partners.",
    },
    {
        id: 4,
        name: "ARPANAA & DEVDEEP DEB",
        image: "/images/profile.jpg",
        shortDescription:
            "We had 18 years of experience in direct selling and a strong desire to succeed. Tathastu is a great platform...",
        fullDescription:
            "With nearly two decades of experience in direct selling, Tathastu Ayurveda provided us the right environment to reach new milestones. We found the perfect blend of ethics, innovation, and community support to truly make an impact.",
    },
    {
        id: 5,
        name: "JYOTI & VICKY JAISWAL",
        image: "/images/profile.jpg",
        shortDescription:
            "Before joining Tathastu, we faced several challenges in our career and financial life. Our dreams seemed far away...",
        fullDescription:
            "Before joining Tathastu Ayurveda, we faced several challenges in our professional and personal lives. With the right mentorship and a strong vision, we were able to turn our hardships into opportunities and achieve true financial freedom.",
    },
    {
        id: 6,
        name: "SIDHARTH CHANCHAL ASSOCIATES",
        image: "/images/profile.jpg",
        shortDescription:
            "I took up direct selling at the age of 21 and became a distributor while I was still studying...",
        fullDescription:
            "At just 21 years old, I decided to join Tathastu Ayurveda while still in college. Today, I’m proud to lead a team of passionate individuals working together to create a better future through health and entrepreneurship.",
    },
    {
        id: 7,
        name: "ASHOK GHOSH",
        image: "/images/profile.jpg",
        shortDescription:
            "My business in earlier direct selling ventures used to fail due to unforeseen circumstances...",
        fullDescription:
            "My earlier ventures faced multiple challenges, but Tathastu Ayurveda helped me rebuild my confidence and success. The ethical business model, coupled with strong leadership, allowed me to rediscover my purpose and stability.",
    },
    {
        id: 8,
        name: "MADHUSMITA & JATINDRA NAYAK",
        image: "/images/profile.jpg",
        shortDescription:
            "I was looking for a business that could provide me a comfortable income. I had no idea it would change my life...",
        fullDescription:
            "We joined Tathastu Ayurveda seeking stability, but what we found was a community and a lifestyle. Today, we enjoy not just financial independence, but also the joy of empowering others to follow their dreams.",
    },

];


export default function TeamGrid() {
    const [selectedMember, setSelectedMember] = useState<any>(null);

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
                {teamMembers.map((member) => (
                    <div
                        key={member.id}
                        className="bg-card border border-border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                    >
                        <div className="relative w-full h-72 bg-muted">
                            <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="p-4 flex flex-col grow">
                            <h3 className="font-semibold text-primary text-sm md:text-base uppercase tracking-wide mb-2">
                                {member.name}
                            </h3>
                            <p className="text-sm text-muted-foreground grow">
                                {member.shortDescription}
                            </p>

                            {/* Dialog Trigger */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button
                                        onClick={() => setSelectedMember(member)}
                                        className="mt-3 text-sm text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                                    >
                                        Read More
                                    </button>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-md bg-card border border-border text-foreground">
                                    <DialogHeader>
                                        <DialogTitle className="text-lg font-bold text-primary uppercase tracking-wide">
                                            {member.name}
                                        </DialogTitle>
                                    </DialogHeader>

                                    <div className="mt-4 flex flex-col items-center">
                                        <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-md mb-4">
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <DialogDescription className="text-sm text-muted-foreground text-center leading-relaxed">
                                            {member.fullDescription}
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
                ))}
            </div>
        </section>
    );
}
