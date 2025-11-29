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
import Image from "next/image";

// 🔥 BASE URL for images
const BASE = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

// 🔥 SAFELY RESOLVE IMAGE URL
function resolveImage(path: string | null) {
  if (!path) return "/images/no-image.png";

  return `${BASE}/storage/${path}`.replace(/([^:]\/)\/+/g, "$1");
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const [form, setForm] = useState<any>({
    id: "",
    date: "",
    time: "",
    venue: "",
    address: "",
    city: "",
    state: "",
    leader: "",
    image1: null,
    image2: null,
  });

  const [preview1, setPreview1] = useState<string | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  const today = new Date().toISOString().split("T")[0];

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

  // ====================
  // IMAGE UPLOAD HANDLER
  // ====================
  function handleImageChange(e: any, field: "image1" | "image2") {
    const file = e.target.files[0];

    if (file) {
      setForm({ ...form, [field]: file });

      const url = URL.createObjectURL(file);
      if (field === "image1") setPreview1(url);
      if (field === "image2") setPreview2(url);
    }
  }

  // ====================
  // CREATE EVENT
  // ====================
  async function handleCreateEvent(e: any) {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) fd.append(key, form[key]);
    });

    try {
      await axiosInstance.post(ProjectApiList.createEvent, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Event created!");

      setOpenCreateModal(false);
      resetForm();
      fetchEvents();
    } catch {
      toast.error("Failed to create event");
    }
  }

  // ====================
  // EDIT EVENT
  // ====================
  function openEdit(data: any) {
    setSelectedEvent(data);

    setForm({
      id: data.id,
      date: data?.date?.split("T")[0],
      time: data.time,
      venue: data.venue,
      address: data.address,
      city: data.city,
      state: data.state,
      leader: data.leader,
      image1: null,
      image2: null,
    });

    setPreview1(resolveImage(data.image1));
    setPreview2(resolveImage(data.image2));

    setOpenEditModal(true);
  }

  // ====================
  // UPDATE EVENT
  // ====================
  async function handleUpdateEvent(e: any) {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) fd.append(key, form[key]);
    });

    try {
      await axiosInstance.post(ProjectApiList.updateEvent, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Event updated!");

      setOpenEditModal(false);
      fetchEvents();
    } catch {
      toast.error("Failed to update event");
    }
  }

  // ====================
  // DELETE EVENT
  // ====================
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

  function resetForm() {
    setForm({
      id: "",
      date: "",
      time: "",
      venue: "",
      address: "",
      city: "",
      state: "",
      leader: "",
      image1: null,
      image2: null,
    });

    setPreview1(null);
    setPreview2(null);
  }

  // ====================
  // TABLE COLUMNS
  // ====================
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
        const [y, m, d] = value.split("T")[0].split("-");
        return `${d}-${m}-${y}`;
      },
    },
    { key: "time", label: "Time" },
    { key: "venue", label: "Venue" },
    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "leader", label: "Leader" },

    // 🔥 UPDATED: SAFE IMAGE RESOLVER
    {
      key: "image1",
      label: "Banner",
      render: (value: string) => (
        <img
          src={resolveImage(value)}
          className="w-14 h-14 rounded-md object-cover"
          alt="banner"
        />
      ),
    },
    {
      key: "image2",
      label: "Gallery",
      render: (value: string) => (
        <img
          src={resolveImage(value)}
          className="w-14 h-14 rounded-md object-cover"
          alt="gallery"
        />
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
      ev.leader.toLowerCase().includes(search.toLowerCase()) ||
      ev.venue.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / entries);
  const start = (page - 1) * entries;
  const paginatedData = filtered.slice(start, start + entries);

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-green-800">Events</h1>
              <p className="text-green-700 text-sm">Create and manage events</p>
            </div>

            {/* CREATE MODAL */}
            <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
              <DialogTrigger asChild>
                <Button className="bg-green-700 text-white hover:bg-green-800">
                  + Add Event
                </Button>
              </DialogTrigger>

              <DialogContent className="max-h-[90vh] overflow-y-auto custom-scroll">
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

                  {/* IMAGE UPLOAD */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ImageUpload
                      label="Banner Image (image1)"
                      onChange={(e: any) => handleImageChange(e, "image1")}
                      preview={preview1}
                    />
                    <ImageUpload
                      label="Gallery Image (image2)"
                      onChange={(e: any) => handleImageChange(e, "image2")}
                      preview={preview2}
                    />
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

          {/* EDIT MODAL */}
          <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
            <DialogContent className="max-h-[90vh] overflow-y-auto custom-scroll">
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

                {/* IMAGE UPLOAD */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ImageUpload
                    label="Banner Image (image1)"
                    onChange={(e: any) => handleImageChange(e, "image1")}
                    preview={preview1}
                  />
                  <ImageUpload
                    label="Gallery Image (image2)"
                    onChange={(e: any) => handleImageChange(e, "image2")}
                    preview={preview2}
                  />
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

          {/* DELETE MODAL */}
          <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Event</DialogTitle>
              </DialogHeader>

              <p>Are you sure you want to delete this event?</p>

              <DialogFooter>
                <Button className="bg-red-600 text-white" onClick={handleDeleteEvent}>
                  Delete
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* DATA TABLE */}
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
              onPrevious={() => setPage(Math.max(page - 1, 1))}
              onNext={() => setPage(Math.min(page + 1, totalPages))}
              emptyMessage="No events found"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function InputBox({ label, type, name, form, setForm, min }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        min={min}
        required
        value={form[name] ?? ""}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
      />
    </div>
  );
}

function ImageUpload({ label, preview, onChange }: any) {

  console.log(preview,"preview---------------->")
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="w-full text-sm border border-gray-300 rounded-md px-3 py-2"
      />

      {preview && (
        <Image
          src={preview}
          alt="preview"
          width={300}
          height={200}
          className="w-full h-32 object-cover rounded-md border mt-2"
          unoptimized
        />
      )}
    </div>
  );
}
