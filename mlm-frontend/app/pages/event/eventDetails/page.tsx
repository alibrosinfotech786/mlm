"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// Resolve Image Based on BASE_URL
const BASE = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

function resolveImage(path?: string) {
  if (!path) return "/images/default.jpg";
  return `${BASE}/${path}`.replace(/([^:]\/)\/+/g, "$1");
}

function EventDetailsContent() {
  const params = useSearchParams();
  const id = params.get("event_id");
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openJoinModal, setOpenJoinModal] = useState(false);

  // Fetch event details
  async function fetchEvent() {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`${ProjectApiList.eventsList}/${id}`);
      setEvent(res.data.event || null);
    } catch {
      toast.error("Failed to load event details");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  function handleJoinConfirm() {
    router.push(`/admin/events/joinEvents?event_id=${event.id}`);
  }

  // Format Date
  function formatDate(iso?: string) {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-red-600">Event not found.</p>
        </main>
        <Footer />
      </>
    );
  }

  // 🔥 Check event is future or past
  const today = new Date();
  const eventDate = new Date(event.date);
  const isFutureEvent = eventDate >= today;

  return (
    <>
      <Header />

      {/* HEADER / HERO */}
      <section className="w-full py-12 px-6 bg-gradient-to-br from-green-100 to-green-50 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-green-800">
            {event.venue}
          </h1>
          <p className="mt-3 text-sm md:text-base text-gray-600">
            Event schedule, venue details, leadership & gallery – all in one place.
          </p>
        </div>
      </section>

      <section className="py-12 px-6 md:px-14 lg:px-40">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* 🌿 IMAGE GALLERY (SIDE BY SIDE) */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Event Images</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Banner */}
              <div>
                <img
                  src={resolveImage(event.image1)}
                  alt="Event Banner"
                  className="w-full h-72 md:h-80 object-cover rounded-xl border shadow-sm"
                />
              </div>

              {/* Gallery */}
              <div>
                <img
                  src={resolveImage(event.image2)}
                  alt="Event Gallery"
                  className="w-full h-72 md:h-80 object-cover rounded-xl border shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Two-column event details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* LEFT: Schedule */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
              <h2 className="text-lg font-semibold text-green-800 mb-4">
                Event Schedule
              </h2>
              <InfoRow label="Date" value={formatDate(event.date)} />
              <InfoRow label="Time" value={event.time} />
            </div>

            {/* RIGHT: Location */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
              <h2 className="text-lg font-semibold text-green-800 mb-4">
                Location Details
              </h2>
              <InfoRow label="Venue" value={event.venue} />
              <InfoRow label="Address" value={event.address} />
              <InfoRow label="City" value={event.city} />
              <InfoRow label="State" value={event.state} />
            </div>
          </div>

          {/* Leader & Participants */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
              <h3 className="text-sm text-green-800 font-semibold mb-2">
                Event Leader
              </h3>
              <p className="text-gray-700">{event.leader}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
              <h3 className="text-sm text-green-800 font-semibold mb-2">
                Participants Joined
              </h3>
              <p className="text-gray-700">
                <span className="text-green-700 font-bold">
                  {event.participants?.length || 0}
                </span>{" "}
                participant(s)
              </p>
            </div>
          </div>

          {/* Overview */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
            <h3 className="text-lg font-semibold text-green-800 mb-3">
              Event Overview
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {event.description || "No description available."}
            </p>
          </div>

          {/* JOIN CTA */}
          <div className="text-center">

            {isFutureEvent ? (
              <Button
                className="px-8 py-3 rounded-full bg-green-700 text-white hover:bg-green-800"
                onClick={() => setOpenJoinModal(true)}
              >
                Join Event
              </Button>
            ) : (
              <span className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full text-sm font-semibold">
                Event Completed
              </span>
            )}

          </div>

        </div>
      </section>

      <Footer />

      {/* JOIN CONFIRM MODAL */}
      <Dialog open={openJoinModal} onOpenChange={setOpenJoinModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-800">Join Event</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-700">
            Do you want to join the event at{" "}
            <span className="font-semibold">{event.venue}</span> on{" "}
            <span className="font-semibold">{formatDate(event.date)}</span>?
          </p>

          <DialogFooter className="mt-4">
            <Button className="bg-green-700 text-white" onClick={handleJoinConfirm}>
              Yes, Continue
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function EventDetailsPage() {
  return (
    <Suspense>
      <EventDetailsContent />
    </Suspense>
  );
}

/* ------------ Small Components ------------ */

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between py-2 border-b last:border-b-0 text-sm">
      <span className="font-medium text-green-700">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
