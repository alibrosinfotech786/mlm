"use client";

import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

// Resolve Image Path
function resolveImage(path?: string) {
  if (!path) return "/images/no-image.png";
  return `${BASE}/${path}`.replace(/([^:]\/)\/+/g, "$1");
}

export default function EventCardsSection() {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const slideLeft = () =>
    scrollRef.current?.scrollBy({ left: -350, behavior: "smooth" });

  const slideRight = () =>
    scrollRef.current?.scrollBy({ left: 350, behavior: "smooth" });

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  async function fetchEvents() {
    try {
      setLoading(true);
      const res = await axiosInstance.get(ProjectApiList.eventsList);
      setEvents(res.data.events?.data || []);
    } catch {
      toast.error("Unable to load events");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  const today = new Date();
  const upcomingEvents = events.filter((ev: any) => new Date(ev.date) >= today);
  const pastEvents = events.filter((ev: any) => new Date(ev.date) < today);
  const visibleEvents =
    activeTab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <div className="w-full py-10 flex justify-center">
      <div className="w-full max-w-[1600px] px-4 md:px-10">

        {/* TITLE */}
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-10 text-center tracking-wide">
          Our Events
        </h2>

        {/* TAB SWITCHER */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-6 md:px-8 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === "upcoming"
                ? "bg-green-700 text-white shadow-md"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            Upcoming Events
          </button>

          <button
            onClick={() => setActiveTab("past")}
            className={`px-6 md:px-8 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === "past"
                ? "bg-green-700 text-white shadow-md"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            Past Events
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-10 text-gray-500 text-lg">
            Loading events...
          </div>
        )}

        {/* NO EVENTS */}
        {!loading && visibleEvents.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-lg">
            No {activeTab === "upcoming" ? "upcoming" : "past"} events found.
          </div>
        )}

        {/* EVENTS SLIDER */}
        {!loading && visibleEvents.length > 0 && (
          <div className="relative w-full flex justify-center">

            {/* LEFT BUTTON (always visible on mobile too) */}
            <button
              onClick={slideLeft}
              className="
                absolute left-2 top-1/2 -translate-y-1/2 
                bg-green-600 text-white p-2 rounded-full shadow-md 
                hover:bg-green-700 z-20
                md:left-4
              "
            >
              <ArrowLeft size={20} />
            </button>

            {/* RIGHT BUTTON */}
            <button
              onClick={slideRight}
              className="
                absolute right-2 top-1/2 -translate-y-1/2 
                bg-green-600 text-white p-2 rounded-full shadow-md 
                hover:bg-green-700 z-20
                md:right-4
              "
            >
              <ArrowRight size={20} />
            </button>

            {/* SCROLL WRAPPER */}
            <div
              ref={scrollRef}
              className="
                overflow-x-auto scroll-smooth scrollbar-hide 
                w-full py-4
              "
            >
              <div
                className="
                  flex gap-6 md:gap-8 justify-center 
                  w-max mx-auto
                "
              >
                {visibleEvents.map((event: any) => (
                  <div
                    key={event.id}
                    className="
                      w-72 md:w-80 bg-white rounded-3xl shadow-md
                      hover:shadow-xl transition-all p-4 border border-green-200/40
                      hover:-translate-y-1 hover:border-green-400/60
                      relative backdrop-blur-sm
                    "
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(243,249,244,0.95))",
                    }}
                  >
                    {/* IMAGE */}
                    <div className="relative w-full h-44 md:h-48 rounded-2xl overflow-hidden shadow-md bg-gray-100">
                      <Image
                        src={resolveImage(event.image1)}
                        alt="Event Banner"
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="mt-5">
                      <h3 className="text-lg font-bold text-primary text-center">{event.venue}</h3>

                      <p className="text-sm text-gray-700 mt-1 text-center">
                        📍 {event.city}, {event.state}
                      </p>

                      <p className="text-sm text-gray-600 mt-1 text-center">
                        📅 {formatDate(event.date)}
                      </p>

                      <Link
                        href={`/pages/event/eventDetails?event_id=${event.id}`}
                        className="text-green-700 text-sm font-semibold underline mt-4 block text-center hover:text-green-900"
                      >
                        View full details →
                      </Link>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
