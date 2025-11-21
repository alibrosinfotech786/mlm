"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function EventListing() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const router = useRouter();

  // === Format date (API → "01 Dec 2025") ===
  function formatDate(apiDate: string) {
    if (!apiDate) return "-";
    const date = new Date(apiDate);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // === Fetch Events ===
  async function fetchEvents() {
    try {
      setLoading(true);
      const res = await axiosInstance.get(ProjectApiList.eventsList);
      setEvents(res.data.events || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Failed to load events");
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  // === Handle Join -> Redirect Only ===
  function handleJoinRedirect() {
    setOpenModal(false);
    router.push("/admin/events/joinEvents");
  }

  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-24 py-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Tathastu Event Schedule
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-primary/10 text-primary">
            <tr>
              <th className="px-4 py-3 border-b border-border">S.No</th>
              <th className="px-4 py-3 border-b border-border">Date</th>
              <th className="px-4 py-3 border-b border-border">Time</th>
              <th className="px-4 py-3 border-b border-border">Venue</th>
              <th className="px-4 py-3 border-b border-border">Address</th>
              <th className="px-4 py-3 border-b border-border">City</th>
              <th className="px-4 py-3 border-b border-border">State</th>
              <th className="px-4 py-3 border-b border-border">Leader</th>
              <th className="px-4 py-3 border-b border-border text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border bg-card text-foreground/90">
            {loading && (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-muted-foreground">
                  Loading events...
                </td>
              </tr>
            )}

            {!loading && events.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-muted-foreground">
                  No events available.
                </td>
              </tr>
            )}

            {!loading &&
              events.map((event: any, index: number) => (
                <tr
                  key={event.id}
                  className="hover:bg-muted/30 transition-colors duration-150"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{formatDate(event.date)}</td>
                  <td className="px-4 py-3">{event.time}</td>
                  <td className="px-4 py-3 font-medium">{event.venue}</td>
                  <td className="px-4 py-3">{event.address}</td>
                  <td className="px-4 py-3">{event.city}</td>
                  <td className="px-4 py-3">{event.state}</td>
                  <td className="px-4 py-3 text-primary font-semibold">
                    {event.leader}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      className="text-green-700 hover:text-green-900 underline font-medium"
                      onClick={() => {
                        setSelectedEvent(event);
                        setOpenModal(true);
                      }}
                    >
                      Join Event
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Event</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700 mt-2">
            Do you want to join:
            <span className="font-semibold"> {selectedEvent?.venue}</span>?
          </p>

          <DialogFooter className="mt-4">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleJoinRedirect}
            >
              Yes, Continue
            </Button>

            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
