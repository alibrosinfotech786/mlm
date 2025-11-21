"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/common/DataTable";
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

import { Button } from "@/components/ui/button";

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    // Join Modal
    const [openJoinModal, setOpenJoinModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    // Search & Table state
    const [search, setSearch] = useState("");
    const [entries, setEntries] = useState(10);
    const [page, setPage] = useState(1);

    // ============================
    // GET LOGGED USER ID
    // ============================
    const userData =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "{}")
            : {};

    const userId = userData?.user_id ?? null; // <--- Important

    // =====================================================
    // GET EVENTS with participant details
    // =====================================================
    async function fetchEvents() {
        try {
            setLoading(true);
            const res = await axiosInstance.get(ProjectApiList.eventsList);

            const eventsWithFlags = res.data.events.map((ev: any) => {
                const participants = ev.participants || [];

                // Check if logged user has joined
                const isJoined = participants.some(
                    (p: any) => String(p.user_id) === String(userId)
                );

                return {
                    ...ev,
                    participantsCount: participants.length,
                    isJoined,
                };
            });

            setEvents(eventsWithFlags);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            toast.error("Failed to fetch events");
        }
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    // =====================================================
    // JOIN EVENT
    // =====================================================
    async function handleJoinEvent() {
        if (!selectedEvent) return;

        try {
            await axiosInstance.post("/events/join", {
                event_id: selectedEvent.id,
            });

            toast.success("Joined event successfully!");
            setOpenJoinModal(false);
            fetchEvents();
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to join event";
            toast.error(message);
        }
    }

    // =====================================================
    // TABLE COLUMNS
    // =====================================================
    const columns = [
        {
            key: "sno",
            label: "S.No",
            render: (_: any, __: any, index: number) =>
                (page - 1) * entries + index + 1,
        },

        {
            key: "date",
            label: "Date",
            render: (value: string) => {
                if (!value) return "-";
                const d = value.split("T")[0];
                const [y, m, d2] = d.split("-");
                return `${d2}-${m}-${y}`;
            },
        },

        { key: "time", label: "Time" },
        { key: "venue", label: "Venue" },
        { key: "address", label: "Address" },
        { key: "city", label: "City" },
        { key: "state", label: "State" },
        { key: "leader", label: "Leader" },

        {
            key: "participantsCount",
            label: "Participants",
            render: (value: number) => (
                <span className="font-semibold text-blue-600">{value}</span>
            ),
        },
        {
            key: "actions",
            label: "Action",
            render: (_: any, row: any) =>
                row.isJoined ? (
                    <span className="text-green-600 font-semibold">
                        ✔Joined
                    </span>
                ) : (
                    <button
                        className="text-green-600 hover:text-green-800 font-medium text-sm underline"
                        onClick={() => {
                            setSelectedEvent(row);
                            setOpenJoinModal(true);
                        }}
                    >
                        Join Event
                    </button>
                ),
        },
    ];

    // =====================================================
    // SEARCH + PAGINATION
    // =====================================================
    const filtered = events.filter(
        (ev: any) =>
            ev.city.toLowerCase().includes(search.toLowerCase()) ||
            ev.state.toLowerCase().includes(search.toLowerCase()) ||
            ev.leader.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / entries);
    const start = (page - 1) * entries;
    const paginatedData = filtered.slice(start, start + entries);

    const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
    const handleNext = () => setPage((p) => Math.min(p + 1, totalPages || 1));

    return (
        <>
            <AdminHeader />

            <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* HEADER */}
                    <div>
                        <h1 className="text-2xl font-bold text-green-800">All Events</h1>
                        <p className="text-green-700 text-sm">Join your upcoming events</p>
                    </div>

                    {/* EVENTS TABLE */}
                    <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={paginatedData}
                            loading={loading}
                            search={search}
                            onSearchChange={setSearch}
                            entries={entries}
                            onEntriesChange={setEntries}
                            page={page}
                            totalPages={totalPages}
                            onPrevious={handlePrev}
                            onNext={handleNext}
                            emptyMessage="No events found"
                        />
                    </div>
                </div>
            </section>

            {/* JOIN CONFIRMATION MODAL */}
            <Dialog open={openJoinModal} onOpenChange={setOpenJoinModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Join Event</DialogTitle>
                    </DialogHeader>

                    <p className="text-gray-700 mt-2">
                        Are you sure you want to join:
                        <span className="font-semibold"> {selectedEvent?.venue}</span>?
                    </p>

                    <DialogFooter className="mt-4">
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleJoinEvent}
                        >
                            Yes, Join
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
