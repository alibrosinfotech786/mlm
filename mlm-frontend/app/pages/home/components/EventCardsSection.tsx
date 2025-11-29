"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

const BASE = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

// Resolve Image Path
function resolveImage(path?: string) {
  if (!path) return "/images/no-image.png";
  return `${BASE}/storage/${path}`.replace(/([^:]\/)\/+/g, "$1");
}

export default function EventCardsSection() {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("past");

  function formatDate(dateString: string) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  async function fetchEvents() {
    try {
      const res = await axiosInstance.get(ProjectApiList.eventsList);
      setEvents(res.data.events || []);
    } catch {
      toast.error("Unable to load events");
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
    <div className="w-full py-10">
      <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-10 text-center tracking-wide">
        Our Events
      </h2>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">

        {/* TAB SWITCHER */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-8 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === "upcoming"
                ? "bg-green-700 text-white shadow-md"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            Upcoming Events
          </button>

          <button
            onClick={() => setActiveTab("past")}
            className={`px-8 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === "past"
                ? "bg-green-700 text-white shadow-md"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            Past Events
          </button>
        </div>

        {/* SCROLL CARDS */}
        <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-200">
          <div className="flex gap-8 w-max">

            {visibleEvents.length === 0 && (
              <p className="text-muted-foreground text-center w-full">
                No events to show.
              </p>
            )}

            {visibleEvents.map((event: any) => (
              <div
                key={event.id}
                className="
                w-80 min-w-[300px] bg-white rounded-3xl shadow-md
                hover:shadow-xl transition-all p-4 border border-green-200/40
                hover:-translate-y-1 hover:border-green-400/60
                relative backdrop-blur-sm
              "
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(243,249,244,0.9))",
                }}
              >
                {/* STATUS BADGE */}
                <span
                  className={`absolute top-3 right-3 text-[11px] px-3 py-1 rounded-full 
                  shadow-sm font-semibold tracking-wide
                  ${
                    activeTab === "upcoming"
                      ? "bg-green-600 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {activeTab === "upcoming" ? "UPCOMING" : "PAST"}
                </span>

                {/* IMAGE */}
                <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-md bg-gray-100">
                  <Image
                    src={resolveImage(event.image1)}
                    alt="Event Banner"
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* INFORMATION */}
                <div className="mt-5">
                  <h3 className="text-lg font-bold text-primary">
                    {event.venue}
                  </h3>

                  <p className="text-sm text-gray-700 mt-1 flex items-center gap-1">
                    📍 {event.city}, {event.state}
                  </p>

                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                    📅 {formatDate(event.date)}
                  </p>

                  {/* LINK */}
                  <Link
                    href={`/pages/event/eventDetails?event_id=${event.id}`}
                    className="text-green-700 text-sm font-semibold underline mt-4 block hover:text-green-900"
                  >
                    View full details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
