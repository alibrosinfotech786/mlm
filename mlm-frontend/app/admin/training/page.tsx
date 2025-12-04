"use client";

import React, { useEffect, useState } from "react";
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

const BASE = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

// resolve path
function resolveImage(path?: string) {
  if (!path) return "/images/no-image.png";
  return `${BASE}/${path}`.replace(/([^:]\/)\/+/g, "$1");
}

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [selectedTraining, setSelectedTraining] = useState<any>(null);

  const [form, setForm] = useState<any>({
    id: "",
    date: "",
    time: "",
    topic: "",
    trainer: "",
    venue: "",
    duration: "",
    description: "",
    level: "",
    course_fee: "",
    image: null,
    syllabus: [], // ⬅ NEW
  });

  const [moduleInput, setModuleInput] = useState(""); // ⬅ for adding modules
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  const today = new Date().toISOString().split("T")[0];

  /*============ FETCH TRAININGS ============*/
  async function fetchTrainings() {
    try {
      setLoading(true);
      const res = await axiosInstance.get(ProjectApiList.training);

      const enhanced = res.data.trainings.map((t: any) => ({
        ...t,
        participantsCount: t?.participants?.length || 0,
      }));

      setTrainings(enhanced);
    } catch {
      toast.error("Failed to load trainings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrainings();
  }, []);

  /*============ ADD MODULE ============*/
  function addModule() {
    if (!moduleInput.trim()) return;

    setForm((prev: any) => ({
      ...prev,
      syllabus: [...prev.syllabus, moduleInput.trim()],
    }));

    setModuleInput("");
  }

  /*============ REMOVE MODULE ============*/
  function removeModule(index: number) {
    setForm((prev: any) => ({
      ...prev,
      syllabus: prev.syllabus.filter((_: any, i: number) => i !== index),
    }));
  }

  /*============ IMAGE HANDLER ============*/
  function handleImageChange(e: any) {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  }

  /*============ CREATE TRAINING ============*/
  async function handleCreateTraining(e: any) {
    e.preventDefault();

    const fd = new FormData();
    fd.append("date", form.date);
    fd.append("time", form.time);
    fd.append("topic", form.topic);
    fd.append("trainer", form.trainer);
    fd.append("venue", form.venue);
    fd.append("duration", form.duration);
    fd.append("description", form.description);
    fd.append("level", form.level);
    fd.append("course_fee", form.course_fee);

    // send syllabus array
    form.syllabus.forEach((mod: string, index: number) => {
      fd.append(`syllabus[${index}]`, mod);
    });

    if (form.image) fd.append("image", form.image);

    try {
      await axiosInstance.post(ProjectApiList.createTraining, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Training created!");
      setOpenCreateModal(false);
      resetForm();
      fetchTrainings();
    } catch (err) {
      toast.error("Failed to create training");
    }
  }

  function resetForm() {
    setForm({
      id: "",
      date: "",
      time: "",
      topic: "",
      trainer: "",
      venue: "",
      duration: "",
      description: "",
      level: "",
      course_fee: "",
      image: null,
      syllabus: [],
    });
    setPreviewImage(null);
  }

  /*============ OPEN EDIT MODAL ============*/
  function openEdit(training: any) {
    setSelectedTraining(training);

    setForm({
      id: training.id,
      date: training.date?.split("T")[0],
      time: training.time,
      topic: training.topic,
      trainer: training.trainer,
      venue: training.venue,
      duration: training.duration,
      description: training.description,
      level: training.level,
      course_fee: training.course_fee,
      image: null,
      syllabus: training.syllabus || [],
    });

    setPreviewImage(resolveImage(training.image));
    setOpenEditModal(true);
  }

  /*============ UPDATE TRAINING ============*/
  async function handleUpdateTraining(e: any) {
    e.preventDefault();

    const fd = new FormData();
    fd.append("id", form.id);
    fd.append("date", form.date);
    fd.append("time", form.time);
    fd.append("topic", form.topic);
    fd.append("trainer", form.trainer);
    fd.append("venue", form.venue);
    fd.append("duration", form.duration);
    fd.append("description", form.description);
    fd.append("level", form.level);
    fd.append("course_fee", form.course_fee);

    // send syllabus array
    form.syllabus.forEach((mod: string, index: number) => {
      fd.append(`syllabus[${index}]`, mod);
    });

    if (form.image) fd.append("image", form.image);

    try {
      await axiosInstance.post(ProjectApiList.updateTraining, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Training updated!");
      setOpenEditModal(false);
      fetchTrainings();
    } catch {
      toast.error("Failed to update training");
    }
  }

  /*============ DELETE TRAINING ============*/
  async function handleDeleteTraining() {
    try {
      await axiosInstance.post(ProjectApiList.deleteTraining, {
        id: selectedTraining.id,
      });

      toast.success("Training deleted!");
      setOpenDeleteModal(false);
      fetchTrainings();
    } catch {
      toast.error("Failed to delete");
    }
  }

  /*============ TABLE ============*/
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
      render: (value: string) => value.split("T")[0],
    },
    { key: "time", label: "Time" },
    { key: "topic", label: "Topic" },
    { key: "trainer", label: "Trainer" },
    { key: "venue", label: "Venue" },
    { key: "duration", label: "Duration" },
    { key: "level", label: "Level" },
    {
      key: "course_fee",
      label: "Fee",
      render: (v: any) => `₹${v}`,
    },
    {
      key: "image",
      label: "Image",
      render: (v: any) => (
        <img
          src={resolveImage(v)}
          className="w-12 h-12 rounded object-cover"
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          <button className="text-blue-600" onClick={() => openEdit(row)}>
            Edit
          </button>
          <button
            className="text-red-600"
            onClick={() => {
              setSelectedTraining(row);
              setOpenDeleteModal(true);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const filtered = trainings.filter((t: any) =>
    t.topic.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / entries);

  const paginatedData = filtered.slice(
    (page - 1) * entries,
    (page - 1) * entries + entries
  );

  return (
    <>
      <AdminHeader />

      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Trainings</h1>

            <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 text-white">+ Add Training</Button>
              </DialogTrigger>

              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Training</DialogTitle>
                </DialogHeader>

                {/* CREATE FORM */}
                <form onSubmit={handleCreateTraining} className="space-y-4">

                  {/* BASIC INPUTS */}
                  <div className="grid grid-cols-2 gap-4">
                    <InputBox label="Date" type="date" name="date" form={form} setForm={setForm} min={today} />
                    <InputBox label="Time" type="time" name="time" form={form} setForm={setForm} />
                    <InputBox label="Topic" name="topic" form={form} setForm={setForm} />
                    <InputBox label="Trainer" name="trainer" form={form} setForm={setForm} />
                    <InputBox label="Venue" name="venue" form={form} setForm={setForm} />
                    <InputBox label="Duration" name="duration" form={form} setForm={setForm} />
                    <InputBox label="Level" name="level" form={form} setForm={setForm} />
                    <InputBox label="Course Fee (INR)" type="number" name="course_fee" form={form} setForm={setForm} />
                  </div>

                  {/* DESCRIPTION */}
                  <textarea
                    rows={3}
                    className="w-full border rounded-md p-2"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Description"
                  />

                  {/* ===========================
                        SYLLABUS MODULE INPUT
                  ============================ */}
                  <div>
                    <label className="font-medium">Syllabus Modules</label>

                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        className="border p-2 rounded w-full"
                        placeholder="Enter module name"
                        value={moduleInput}
                        onChange={(e) => setModuleInput(e.target.value)}
                      />
                      <Button type="button" onClick={addModule}>
                        Add
                      </Button>
                    </div>

                    {/* LIST OF MODULES */}
                    <div className="mt-3 space-y-2">
                      {form.syllabus.map((mod: string, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-green-50 p-2 rounded"
                        >
                          <span>{mod}</span>
                          <button
                            type="button"
                            className="text-red-600"
                            onClick={() => removeModule(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* IMAGE */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Training Banner</label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="border p-2 rounded"
                    />

                    {previewImage && (
                      <Image
                        src={previewImage}
                        alt="preview"
                        width={200}
                        height={150}
                        className="rounded mt-2 border"
                      />
                    )}
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

          {/* TABLE */}
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
            onPrevious={() => setPage(Math.max(1, page - 1))}
            onNext={() => setPage(Math.min(totalPages, page + 1))}
            emptyMessage="No trainings found"
          />
        </div>
      </section>

      {/* ============================================
            EDIT TRAINING
      ============================================ */}
      <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Training</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdateTraining} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <InputBox label="Date" type="date" name="date" form={form} setForm={setForm} />
              <InputBox label="Time" type="time" name="time" form={form} setForm={setForm} />
              <InputBox label="Topic" name="topic" form={form} setForm={setForm} />
              <InputBox label="Trainer" name="trainer" form={form} setForm={setForm} />
              <InputBox label="Venue" name="venue" form={form} setForm={setForm} />
              <InputBox label="Duration" name="duration" form={form} setForm={setForm} />
              <InputBox label="Level" name="level" form={form} setForm={setForm} />
              <InputBox label="Course Fee" type="number" name="course_fee" form={form} setForm={setForm} />
            </div>

            <textarea
              rows={3}
              className="w-full border rounded-md p-2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            {/* SYLLABUS EDIT */}
            <div>
              <label className="font-medium">Syllabus Modules</label>

              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  placeholder="Enter module name"
                  value={moduleInput}
                  onChange={(e) => setModuleInput(e.target.value)}
                />
                <Button type="button" onClick={addModule}>Add</Button>
              </div>

              <div className="mt-3 space-y-2">
                {form.syllabus.map((mod: string, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-green-50 p-2 rounded"
                  >
                    <span>{mod}</span>
                    <button
                      type="button"
                      className="text-red-600"
                      onClick={() => removeModule(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div>
              <label>Training Image</label>
              <input type="file" onChange={handleImageChange} className="border p-2 rounded-md w-full" />

              {previewImage && (
                <Image
                  src={previewImage}
                  alt="preview"
                  width={200}
                  height={150}
                  className="rounded mt-2 border"
                />
              )}
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
            <DialogTitle>Delete Training</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this training?</p>

          <DialogFooter>
            <Button className="bg-red-600 text-white" onClick={handleDeleteTraining}>
              Delete
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

/*============ INPUT COMPONENT ============*/
function InputBox({ label, type = "text", name, form, setForm, placeholder = "", min }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        min={min}
        placeholder={placeholder}
        required
        className="border p-2 rounded-md"
        value={form[name] ?? ""}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      />
    </div>
  );
}
