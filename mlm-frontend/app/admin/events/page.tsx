"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/common/DataTable";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogTrigger,
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

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // SAME STRUCTURE AS TRAININGS PAGE
  const [form, setForm] = useState<any>({
    id: "",
    date: "",
    time: "",
    venue: "",
    address: "",
    city: "",
    state: "",
    leader: "",
  });

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  const today = new Date().toISOString().split("T")[0];

  // FETCH EVENTS
  async function fetchEvents() {
    try {
      setLoading(true);
      const res = await axiosInstance.get(ProjectApiList.eventsList);
      setEvents(res.data.events || []);
    } catch {
      toast.error("Failed to fetch events");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  // CREATE EVENT
  async function handleCreateEvent(e: any) {
    e.preventDefault();
    try {
      await axiosInstance.post(ProjectApiList.createEvent, form);

      toast.success("Event created!");

      // Reset
      setForm({
        id: "",
        date: "",
        time: "",
        venue: "",
        address: "",
        city: "",
        state: "",
        leader: "",
      });

      setOpenCreateModal(false);
      fetchEvents();
    } catch {
      toast.error("Failed to create event");
    }
  }

  // OPEN EDIT
  function openEdit(data: any) {
    setSelectedEvent(data);

    setForm({
      id: data.id,
      date: data?.date?.includes("T") ? data.date.split("T")[0] : data.date,
      time: data.time || "",
      venue: data.venue || "",
      address: data.address || "",
      city: data.city || "",
      state: data.state || "",
      leader: data.leader || "",
    });

    setOpenEditModal(true);
  }

  // UPDATE EVENT
  async function handleUpdateEvent(e: any) {
    e.preventDefault();
    try {
      await axiosInstance.post(ProjectApiList.updateEvent, form);
      toast.success("Event updated!");

      setOpenEditModal(false);
      fetchEvents();
    } catch {
      toast.error("Failed to update event");
    }
  }

  // DELETE EVENT
  async function handleDeleteEvent() {
    try {
      await axiosInstance.post(ProjectApiList.deleteEvent, {
        id: selectedEvent.id,
      });

      toast.success("Event deleted!");
      setOpenDeleteModal(false);
      fetchEvents();
    } catch {
      toast.error("Failed to delete event");
    }
  }

  // COLUMNS
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
      key: "participants",
      label: "Participants",
      render: (_: any, row: any) => (
        <span className="font-semibold text-blue-600">
          {row.participants?.length || 0}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          <button
            className="text-blue-600 hover:text-blue-800 text-sm"
            onClick={() => openEdit(row)}
          >
            Edit
          </button>

          <button
            className="text-red-600 hover:text-red-800 text-sm"
            onClick={() => {
              setSelectedEvent(row);
              setOpenDeleteModal(true);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

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
  const handleNext = () =>
    setPage((p) => Math.min(p + 1, totalPages || 1));

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-green-800">Events</h1>
              <p className="text-green-700 text-sm">
                Create and manage events
              </p>
            </div>

            {/* CREATE */}
            <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
              <DialogTrigger asChild>
                <Button className="bg-green-700 text-white hover:bg-green-800">
                  + Create Event
                </Button>
              </DialogTrigger>

              <DialogContent forceMount>
                <DialogHeader>
                  <DialogTitle>Create Event</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleCreateEvent} className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputBox label="Date" type="date" name="date" form={form} setForm={setForm} min={today} />
                    <InputBox label="Time" type="time" name="time" form={form} setForm={setForm} />
                    <InputBox label="Venue" type="text" name="venue" form={form} setForm={setForm} />
                    <InputBox label="Address" type="text" name="address" form={form} setForm={setForm} />
                    <InputBox label="City" type="text" name="city" form={form} setForm={setForm} />
                    <InputBox label="State" type="text" name="state" form={form} setForm={setForm} />
                    <InputBox label="Leader" type="text" name="leader" form={form} setForm={setForm} />
                  </div>

                  <DialogFooter>
                    <Button type="submit">Create</Button>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* EDIT */}
          <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
            <DialogContent forceMount>
              <DialogHeader>
                <DialogTitle>Edit Event</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleUpdateEvent} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputBox label="Date" type="date" name="date" form={form} setForm={setForm} />
                  <InputBox label="Time" type="time" name="time" form={form} setForm={setForm} />
                  <InputBox label="Venue" type="text" name="venue" form={form} setForm={setForm} />
                  <InputBox label="Address" type="text" name="address" form={form} setForm={setForm} />
                  <InputBox label="City" type="text" name="city" form={form} setForm={setForm} />
                  <InputBox label="State" type="text" name="state" form={form} setForm={setForm} />
                  <InputBox label="Leader" type="text" name="leader" form={form} setForm={setForm} />
                </div>

                <DialogFooter>
                  <Button type="submit">Update</Button>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* DELETE */}
          <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
            <DialogContent forceMount>
              <DialogHeader>
                <DialogTitle>Delete Event</DialogTitle>
              </DialogHeader>

              <p className="text-gray-700">
                Are you sure want to delete this event?
              </p>

              <DialogFooter className="mt-4">
                <Button
                  className="bg-red-600 text-white"
                  onClick={handleDeleteEvent}
                >
                  Delete
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* TABLE */}
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
    </>
  );
}

// SAME InputBox used in TrainingsPage
function InputBox({ label, type, name, form, setForm, min }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        required
        min={min}
        value={form[name] ?? ""}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-800 focus:ring-2 focus:ring-gray-400"
      />
    </div>
  );
}
