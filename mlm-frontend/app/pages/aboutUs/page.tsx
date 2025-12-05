"use client";

import React from "react";
import {
    FaLeaf,
    FaSpa,
    FaStar,
    FaHandsHelping,
    FaSeedling,
    FaCheck,
} from "react-icons/fa";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";

export default function AboutUs() {

    // ✅ APPLY HERE — FORCE RELOAD ON FIRST VISIT
    const [reloaded, setReloaded] = React.useState(false);

    React.useEffect(() => {
        if (!sessionStorage.getItem("aboutUsPageReloaded")) {
            sessionStorage.setItem("aboutUsPageReloaded", "true");
            window.location.reload();   // 🔥 Reload once
        } else {
            setReloaded(true);
        }
    }, []);

    // Prevents showing page before reload completes
    if (!reloaded) return null;
    // ✅ STOP HERE
    return (
        <>
            <Header />

            <PageHeader
                title="About Us"
            />

            {/* 🌿 MAIN CONTENT */}
            <section className="py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-24 bg-[#FAFDF9]">
                <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20">

                    {/* WHO WE ARE */}
                    <div className="p-5 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-sm bg-white border border-[#E7EFE5]">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#2E522A] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                            <FaLeaf className="text-[#6B8E62] w-5 h-5 sm:w-6 sm:h-6" />
                            Who We Are
                        </h2>

                        <p className="text-[#526B52] leading-relaxed text-base sm:text-lg md:text-lg">
                            We are a modern Indian wellness & entrepreneurship company inspired
                            by the ancient science of Ayurveda. Our approach blends
                            <strong className="font-semibold"> natural healing, ethical business, and leadership education</strong>
                            to create a sustainable path for personal and financial growth.
                        </p>

                        <p className="text-[#526B52] leading-relaxed mt-3 sm:mt-4 text-sm sm:text-base">
                            Through our registered educational wing,
                            <strong className="font-semibold"> Raman's Way Foundation</strong>, we provide structured training in:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 mt-6 sm:mt-8">
                            {[
                                "Leadership & skill development",
                                "Ayurvedic product knowledge",
                                "Entrepreneurship training",
                                "Digital learning systems",
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-2 sm:gap-3 bg-[#F4F9F3] p-3 sm:p-4 rounded-lg sm:rounded-xl border border-[#E7EFE5]"
                                >
                                    <FaCheck className="text-[#6B8E62] mt-0.5 sm:mt-1 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                                    <p className="text-[#526B52] text-sm sm:text-base">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* WHY WE EXIST */}
                    <div className="p-5 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-sm bg-white border border-[#E7EFE5]">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#2E522A] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                            <FaHandsHelping className="text-[#6B8E62] w-5 h-5 sm:w-6 sm:h-6" />
                            Why We Exist
                        </h2>

                        <p className="text-[#526B52] leading-relaxed text-base sm:text-lg md:text-lg">
                            In a fast-changing world, people seek two things:
                        </p>

                        <ul className="mt-4 sm:mt-5 space-y-2 sm:space-y-3 text-[#526B52]">
                            {[
                                "Natural Ayurvedic wellness",
                                "An ethical, affordable business opportunity",
                                "Mentorship & leadership development",
                                "A path to financial & personal freedom",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base">
                                    <FaCheck className="text-[#6B8E62] mt-0.5 sm:mt-1 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <p className="text-[#2E522A] mt-5 sm:mt-6 text-base sm:text-lg font-medium italic">
                            We exist to educate, uplift, and empower people — not just to sell products.
                        </p>
                    </div>

                    {/* MISSION */}
                    <div className="p-5 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-sm bg-white border border-[#E7EFE5]">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#2E522A] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                            <FaStar className="text-[#6B8E62] w-5 h-5 sm:w-6 sm:h-6" />
                            Our Mission
                        </h2>

                        <p className="text-[#526B52] leading-relaxed text-base sm:text-lg md:text-lg">
                            To empower individuals through <strong className="font-semibold">Ayurvedic wellness, ethical
                                entrepreneurship, and transformational education.</strong>
                        </p>

                        <ul className="mt-4 sm:mt-5 space-y-2 sm:space-y-3 text-[#526B52]">
                            {[
                                "Promote natural, holistic Ayurvedic health",
                                "Provide ethical & transparent business opportunities",
                                "Develop strong leaders & confident entrepreneurs",
                                "Offer digital + offline support systems",
                                "Enable stable daily income & long-term wealth",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base">
                                    <FaCheck className="text-[#6B8E62] mt-0.5 sm:mt-1 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* VISION */}
                    <div className="p-5 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-sm bg-white border border-[#E7EFE5]">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#2E522A] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                            <FaSpa className="text-[#6B8E62] w-5 h-5 sm:w-6 sm:h-6" />
                            Our Vision
                        </h2>

                        <p className="text-[#526B52] leading-relaxed text-base sm:text-lg md:text-lg">
                            To become India's most trusted, ethical, and education-driven
                            Ayurvedic entrepreneurship platform — respected globally.
                        </p>

                        <ul className="mt-4 sm:mt-5 space-y-2 sm:space-y-3 text-[#526B52]">
                            {[
                                "Health accessible to every home",
                                "Entrepreneurship respected as a noble profession",
                                "Leadership nurtured at every level",
                                "Success through ethics, service, and integrity",
                            ].map((v, i) => (
                                <li key={i} className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base">
                                    <FaCheck className="text-[#6B8E62] mt-0.5 sm:mt-1 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                                    <span>{v}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* FOUNDATION */}
                    <div className="p-5 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-sm bg-white border border-[#E7EFE5]">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#2E522A] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                            <FaSeedling className="text-[#6B8E62] w-5 h-5 sm:w-6 sm:h-6" />
                            Raman's Way Foundation
                        </h2>

                        <p className="text-[#526B52] leading-relaxed text-base sm:text-lg md:text-lg">
                            Our registered educational division shaping the next generation of:
                        </p>

                        <ul className="mt-4 sm:mt-5 space-y-2 sm:space-y-3 text-[#526B52]">
                            {[
                                "Ayurvedic product specialists",
                                "Network marketing professionals",
                                "Business & leadership mentors",
                                "Digital entrepreneurs",
                                "Personal transformation leaders",
                            ].map((v, i) => (
                                <li key={i} className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base">
                                    <FaCheck className="text-[#6B8E62] mt-0.5 sm:mt-1 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                                    <span>{v}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* DIFFERENTIATION */}
                    <div className="p-5 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-sm bg-white border border-[#E7EFE5]">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#2E522A] mb-4 sm:mb-6">
                            What Makes Us Different
                        </h2>

                        <ul className="space-y-2 sm:space-y-3 text-[#526B52]">
                            {[
                                "Registered educational system (Raman's Way Foundation)",
                                "Ethical & legal business model",
                                "Daily payout system",
                                "No minimum withdrawal limit",
                                "Strong digital leadership academy",
                                "Premium Ayurvedic products",
                                "Low-cost entry + lifetime earning potential",
                                "Transparent policies & open product access",
                                "Roadmap for global expansion",
                            ].map((v, i) => (
                                <li key={i} className="flex gap-2 sm:gap-3 items-start text-sm sm:text-base">
                                    <FaCheck className="text-[#6B8E62] mt-0.5 sm:mt-1 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                                    <span>{v}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COMMITMENT */}
                    <div className="p-5 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-sm bg-white border border-[#E7EFE5]">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#2E522A] mb-4 sm:mb-6">
                            Our Commitment
                        </h2>

                        <p className="text-[#526B52] leading-relaxed text-base sm:text-lg md:text-lg">
                            We are dedicated to creating a people-first entrepreneurship
                            ecosystem grounded in trust, fairness, and integrity.
                        </p>

                        <ul className="mt-4 sm:mt-5 space-y-2 sm:space-y-3 text-[#526B52]">
                            {["Transparency", "Fairness", "Trust", "Growth", "Service"].map(
                                (v, i) => (
                                    <li key={i} className="flex gap-2 sm:gap-3 items-start text-sm sm:text-base">
                                        <FaCheck className="text-[#6B8E62] mt-0.5 sm:mt-1 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                                        <span>{v}</span>
                                    </li>
                                )
                            )}
                        </ul>

                        <p className="mt-5 sm:mt-6 text-[#2E522A] font-semibold italic text-base sm:text-lg">
                            Your wellness. Your growth. Your future.
                            That is our mission.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}