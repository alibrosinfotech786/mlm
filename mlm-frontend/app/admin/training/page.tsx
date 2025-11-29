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
import { Input } from "@/components/ui/input";

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);

  const [selectedTraining, setSelectedTraining] = useState<any>(null);

  // ⭐ Updated form with LEVEL
  const [form, setForm] = useState<any>({
    id: "",
    date: "",
    time: "",
    topic: "",
    trainer: "",
    venue: "",
    duration: "",
    description: "",
    course_fee: "",
    level: "",          // ⭐ added
    syllabus: [""],
  });

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  const today = new Date().toISOString().split("T")[0];
  const userData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const userId = userData?.user_id ?? null;

  async function fetchTrainings() {
    try {
      setLoading(true);
      const res = await axiosInstance.get(ProjectApiList.training);

      const enhanced = res.data.trainings.map((t: any) => {
        const participants = t.participants || [];
        const participantsCount = participants.length;

        return {
          ...t,
          participantsCount,
          isJoined: participants.some(
            (p: any) => String(p.user_id) === String(userId)
          ),
          syllabus: Array.isArray(t.syllabus)
            ? t.syllabus
            : t.syllabus
            ? [t.syllabus]
            : [],
        };
      });

      setTrainings(enhanced);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load trainings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrainings();
  }, []);

  function validateForm() {
    if (!form.date) return "Date is required";
    if (!form.time) return "Time is required";
    if (!form.topic) return "Topic is required";
    if (!form.trainer) return "Trainer is required";
    if (!form.venue) return "Venue is required";
    if (!form.duration) return "Duration is required";
    if (!form.description) return "Description is required";
    if (!form.level) return "Level is required";
    if (form.course_fee === "" || isNaN(Number(form.course_fee)))
      return "Course fee must be valid";
    return null;
  }

  async function handleCreateTraining(e: any) {
    e.preventDefault();
    const errMsg = validateForm();
    if (errMsg) return toast.error(errMsg);

    try {
      const payload = {
        date: form.date,
        time: form.time,
        topic: form.topic,
        trainer: form.trainer,
        venue: form.venue,
        duration: form.duration,
        description: form.description,
        level: form.level,                         // ⭐ added
        course_fee: Number(form.course_fee),
        syllabus: form.syllabus
          .map((s: string) => s.trim())
          .filter((s: string) => s.length),
      };

      await axiosInstance.post(ProjectApiList.createTraining, payload);

      toast.success("Training created!");
      setOpenCreateModal(false);
      resetForm();
      fetchTrainings();
    } catch {
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
      level: "",              // ⭐ reset
      course_fee: "",
      syllabus: [""],
    });
  }

  function openEdit(training: any) {
    setSelectedTraining(training);
    setForm({
      id: training.id,
      date: training.date?.split("T")[0] || "",
      time: training.time || "",
      topic: training.topic || "",
      trainer: training.trainer || "",
      venue: training.venue || "",
      duration: training.duration || "",
      description: training.description || "",
      level: training.level || "",        // ⭐ added
      course_fee: training.course_fee ?? "",
      syllabus: Array.isArray(training.syllabus)
        ? training.syllabus
        : [training.syllabus],
    });
    setOpenEditModal(true);
  }

  async function handleUpdateTraining(e: any) {
    e.preventDefault();
    const errMsg = validateForm();
    if (errMsg) return toast.error(errMsg);

    try {
      const payload = {
        id: form.id,
        date: form.date,
        time: form.time,
        topic: form.topic,
        trainer: form.trainer,
        venue: form.venue,
        duration: form.duration,
        description: form.description,
        level: form.level,                // ⭐ added
        course_fee: Number(form.course_fee),
        syllabus: form.syllabus.map((s: string) => s.trim()),
      };

      await axiosInstance.post(ProjectApiList.updateTraining, payload);
      toast.success("Training updated!");
      setOpenEditModal(false);
      fetchTrainings();
    } catch {
      toast.error("Failed to update training");
    }
  }

  function openDelete(training: any) {
    setSelectedTraining(training);
    setOpenDeleteModal(true);
  }

  async function handleDeleteTraining() {
    try {
      await axiosInstance.post(ProjectApiList.deleteTraining, {
        id: selectedTraining.id,
      });

      toast.success("Training deleted!");
      setOpenDeleteModal(false);
      fetchTrainings();
    } catch {
      toast.error("Delete failed");
    }
  }

  function openJoin(training: any) {
    setSelectedTraining(training);
    setOpenJoinModal(true);
  }

  async function handleJoinTraining() {
    try {
      await axiosInstance.post(ProjectApiList.joinTraining, {
        training_id: selectedTraining.id,
      });

      toast.success("Joined training!");
      setOpenJoinModal(false);
      fetchTrainings();
    } catch {
      toast.error("Joining failed");
    }
  }

  // ⭐ TABLE COLUMNS (includes LEVEL)
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
      render: (value: string) =>
        value ? value.split("T")[0].split("-").reverse().join("-") : "-",
    },
    { key: "time", label: "Time" },
    { key: "topic", label: "Topic" },

    // ⭐ NEW LEVEL COLUMN
    {
      key: "level",
      label: "Level",
      render: (v: any) => v || "-",
    },

    { key: "trainer", label: "Trainer" },
    { key: "venue", label: "Venue" },
    { key: "duration", label: "Duration" },

    {
      key: "course_fee",
      label: "Fee",
      render: (v: any) => `₹${Number(v).toLocaleString()}`,
    },
    {
      key: "participantsCount",
      label: "Participants",
      render: (v: number) => (
        <span className="font-semibold text-blue-600">{v}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <div className="flex gap-3">
          <button
            className="text-blue-600"
            onClick={() => openEdit(row)}
          >
            Edit
          </button>
          <button
            className="text-red-600"
            onClick={() => openDelete(row)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const filtered = trainings.filter(
    (t: any) =>
      (t.topic || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.trainer || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / entries));
  const paginatedData = filtered.slice(
    (page - 1) * entries,
    (page - 1) * entries + entries
  );

  function addModule() {
    setForm({
      ...form,
      syllabus: [...form.syllabus, ""],
    });
  }

  function updateModule(i: number, value: string) {
    const updated = [...form.syllabus];
    updated[i] = value;
    setForm({ ...form, syllabus: updated });
  }

  function removeModule(i: number) {
    const updated = [...form.syllabus];
    updated.splice(i, 1);
    setForm({ ...form, syllabus: updated.length ? updated : [""] });
  }

  return (
    <>
      <AdminHeader />

      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Trainings</h1>

            <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
              <DialogTrigger asChild>
                <Button>+ Create</Button>
              </DialogTrigger>

              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Training</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleCreateTraining} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <InputBox
                      label="Date"
                      type="date"
                      name="date"
                      form={form}
                      setForm={setForm}
                      min={today}
                    />
                    <InputBox
                      label="Time"
                      type="time"
                      name="time"
                      form={form}
                      setForm={setForm}
                    />
                    <InputBox
                      label="Topic"
                      type="text"
                      name="topic"
                      form={form}
                      setForm={setForm}
                    />
                    <InputBox
                      label="Trainer"
                      type="text"
                      name="trainer"
                      form={form}
                      setForm={setForm}
                    />
                    <InputBox
                      label="Venue"
                      type="text"
                      name="venue"
                      form={form}
                      setForm={setForm}
                    />
                    <InputBox
                      label="Duration"
                      type="text"
                      name="duration"
                      form={form}
                      setForm={setForm}
                    />

                    {/* ⭐ LEVEL FIELD */}
                    <InputBox
                      label="Level"
                      type="text"
                      name="level"
                      form={form}
                      setForm={setForm}
                      placeholder="Beginner / Intermediate / Advanced"
                    />

                    <InputBox
                      label="Course Fee (INR)"
                      type="number"
                      name="course_fee"
                      form={form}
                      setForm={setForm}
                    />
                  </div>

                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full border rounded-md p-2"
                    placeholder="Description"
                    required
                  />

                  {/* ⭐ DYNAMIC SYLLABUS */}
                  <div>
                    <div className="flex justify-between">
                      <label>Syllabus Modules</label>
                      <button
                        type="button"
                        className="text-green-700"
                        onClick={addModule}
                      >
                        + Add Module
                      </button>
                    </div>

                    {form.syllabus.map((m: string, idx: number) => (
                      <div key={idx} className="flex gap-2 my-2">
                        <input
                          value={m}
                          onChange={(e) => updateModule(idx, e.target.value)}
                          className="flex-1 border p-2 rounded-md"
                        />
                        <button
                          type="button"
                          className="text-red-600"
                          onClick={() => removeModule(idx)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
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
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            emptyMessage="No trainings"
          />
        </div>
      </section>

      {/* ⭐ EDIT MODAL */}
      <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Training</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdateTraining} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputBox label="Date" type="date" name="date" form={form} setForm={setForm} min={today} />
              <InputBox label="Time" type="time" name="time" form={form} setForm={setForm} />
              <InputBox label="Topic" type="text" name="topic" form={form} setForm={setForm} />
              <InputBox label="Trainer" type="text" name="trainer" form={form} setForm={setForm} />
              <InputBox label="Venue" type="text" name="venue" form={form} setForm={setForm} />
              <InputBox label="Duration" type="text" name="duration" form={form} setForm={setForm} />
              <InputBox label="Level" type="text" name="level" form={form} setForm={setForm} />
              <InputBox label="Course Fee (INR)" type="number" name="course_fee" form={form} setForm={setForm} />
            </div>

            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-md p-2"
              required
            />

            {/* syllabus */}
            <div>
              <div className="flex justify-between">
                <label>Syllabus Modules</label>
                <button type="button" className="text-green-700" onClick={addModule}>
                  + Add Module
                </button>
              </div>

              {form.syllabus.map((m: string, idx: number) => (
                <div key={idx} className="flex gap-2 my-2">
                  <input
                    value={m}
                    onChange={(e) => updateModule(idx, e.target.value)}
                    className="flex-1 border p-2 rounded-md"
                  />
                  <button type="button" className="text-red-600" onClick={() => removeModule(idx)}>
                    Remove
                  </button>
                </div>
              ))}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Training</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this?</p>
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

      {/* JOIN */}
      <Dialog open={openJoinModal} onOpenChange={setOpenJoinModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Training</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to join {selectedTraining?.topic}?</p>

          <DialogFooter>
            <Button onClick={handleJoinTraining} className="bg-green-600 text-white">
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

function InputBox({ label, type, name, placeholder = "", form, setForm, min }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        min={min}
        placeholder={placeholder}
        required
        className="border rounded-md p-2"
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      />
    </div>
  );
}
