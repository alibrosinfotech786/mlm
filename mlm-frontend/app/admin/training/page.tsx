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

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);

  const [selectedTraining, setSelectedTraining] = useState<any>(null);

  // Controlled form used for create/update
  const [form, setForm] = useState<any>({
    id: "",
    date: "",
    time: "",
    topic: "",
    trainer: "",
    venue: "",
    duration: "",
    description: "",
  });

  // Read logged user id from localStorage.user.user_id (adjust if different)
  const userData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const userId = userData?.user_id ?? null;

  // Table state
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  const today = new Date().toISOString().split("T")[0];

  // -------------------------
  // Fetch trainings list
  // -------------------------
  async function fetchTrainings() {
    try {
      setLoading(true);
      const res = await axiosInstance.get(ProjectApiList.training);
      const list = res.data.trainings || [];

      // attach participantsCount and isJoined flag
      const enhanced = list.map((t: any) => {
        const participants = t.participants || [];
        const participantsCount = participants.length;
        const isJoined = participants.some(
          (p: any) => String(p.user_id) === String(userId)
        );
        return { ...t, participantsCount, isJoined };
      });

      setTrainings(enhanced);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.response?.data?.message || "Failed to load trainings");
    }
  }

  useEffect(() => {
    fetchTrainings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------
  // Create training
  // -------------------------
  async function handleCreateTraining(e: React.FormEvent) {
    e.preventDefault();
    try {
      // API expects payload like user provided example
      await axiosInstance.post(ProjectApiList.createTraining, {
        date: form.date,
        time: form.time,
        topic: form.topic,
        trainer: form.trainer,
        venue: form.venue,
        duration: form.duration,
        description: form.description,
      });

      toast.success("Training created successfully!");
      setOpenCreateModal(false);
      setForm({
        id: "",
        date: "",
        time: "",
        topic: "",
        trainer: "",
        venue: "",
        duration: "",
        description: "",
      });
      fetchTrainings();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create training");
    }
  }

  // -------------------------
  // Open edit modal and populate form
  // -------------------------
  function openEdit(training: any) {
    setSelectedTraining(training);
    setForm({
      id: training.id,
      date: (training.date || "").split("T")[0],
      time: training.time || "",
      topic: training.topic || "",
      trainer: training.trainer || "",
      venue: training.venue || "",
      duration: training.duration || "",
      description: training.description || "",
    });
    setOpenEditModal(true);
  }

  // -------------------------
  // Update training
  // -------------------------
  async function handleUpdateTraining(e: React.FormEvent) {
    e.preventDefault();
    try {
      // API expects same payload as create but with id
      await axiosInstance.post(ProjectApiList.updateTraining, {
        id: form.id,
        date: form.date,
        time: form.time,
        topic: form.topic,
        trainer: form.trainer,
        venue: form.venue,
        duration: form.duration,
        description: form.description,
      });

      toast.success("Training updated!");
      setOpenEditModal(false);
      fetchTrainings();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update training");
    }
  }

  // -------------------------
  // Open delete modal
  // -------------------------
  function openDelete(training: any) {
    setSelectedTraining(training);
    setOpenDeleteModal(true);
  }

  // -------------------------
  // Delete training
  // -------------------------
  async function handleDeleteTraining() {
    if (!selectedTraining) return;
    try {
      await axiosInstance.post(ProjectApiList.deleteTraining, {
        id: selectedTraining.id,
      });
      toast.success("Training deleted!");
      setOpenDeleteModal(false);
      fetchTrainings();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete training");
    }
  }

  // -------------------------
  // Open join modal
  // -------------------------
  function openJoin(training: any) {
    setSelectedTraining(training);
    setOpenJoinModal(true);
  }

  // -------------------------
  // Join training
  // -------------------------
  async function handleJoinTraining() {
    if (!selectedTraining) return;
    try {
      await axiosInstance.post(ProjectApiList.joinTraining, {
        training_id: selectedTraining.id,
      });
      toast.success("Joined training successfully!");
      setOpenJoinModal(false);
      fetchTrainings();
    } catch (err: any) {
      // show backend message if available (e.g. ALREADY_JOINED)
      const msg = err?.response?.data?.message || "Failed to join training";
      toast.error(msg);
    }
  }

  // -------------------------
  // Columns for DataTable
  // -------------------------
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
    { key: "topic", label: "Topic" },
    { key: "trainer", label: "Trainer" },
    { key: "venue", label: "Venue" },
    { key: "duration", label: "Duration" },
    {
      key: "participantsCount",
      label: "Participants",
      render: (v: number) => (
        <span className="font-semibold text-blue-600">{v ?? 0}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          {/* Edit */}
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            onClick={() => openEdit(row)}
          >
            Edit
          </button>

          {/* Delete */}
          <button
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            onClick={() => openDelete(row)}
          >
            Delete
          </button>

          {/* Join / Joined */}
          {/* {row.isJoined ? (
            <span className="text-green-600 font-semibold">✔ Joined</span>
          ) : (
            <button
              className="text-green-600 hover:text-green-800 text-sm font-medium underline"
              onClick={() => openJoin(row)}
            >
              Join
            </button>
          )} */}
        </div>
      ),
    },
  ];

  // -------------------------
  // Search + pagination
  // -------------------------
  const filtered = trainings.filter(
    (t: any) =>
      t.topic?.toLowerCase().includes(search.toLowerCase()) ||
      t.trainer?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / entries);
  const start = (page - 1) * entries;
  const paginatedData = filtered.slice(start, start + entries);

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-green-800">Trainings</h1>
              <p className="text-green-700 text-sm">
                Create, manage & join trainings
              </p>
            </div>

            {/* Create button + modal */}
            <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
              <DialogTrigger asChild>
                <Button className="bg-green-700 text-white">+ Create</Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Training</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleCreateTraining} className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputBox
                      label="Date"
                      type="date"
                      name="date"
                      form={form}
                      setForm={setForm}
                      min={today}
                    />
                    <InputBox label="Time" type="time" name="time" form={form} setForm={setForm} />
                    <InputBox label="Topic" type="text" name="topic" form={form} setForm={setForm} />
                    <InputBox label="Trainer" type="text" name="trainer" form={form} setForm={setForm} />
                    <InputBox label="Venue" type="text" name="venue" form={form} setForm={setForm} />
                    <InputBox label="Duration" type="text" name="duration" form={form} setForm={setForm} />
                    <InputBox label="Description" type="text" name="description" form={form} setForm={setForm} />
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

          {/* Table */}
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
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              emptyMessage="No trainings found"
            />
          </div>
        </div>
      </section>

      {/* EDIT Modal */}
      <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Training</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdateTraining} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputBox label="Date" type="date" name="date" form={form} setForm={setForm} min={today} />
              <InputBox label="Time" type="time" name="time" form={form} setForm={setForm} />
              <InputBox label="Topic" type="text" name="topic" form={form} setForm={setForm} />
              <InputBox label="Trainer" type="text" name="trainer" form={form} setForm={setForm} />
              <InputBox label="Venue" type="text" name="venue" form={form} setForm={setForm} />
              <InputBox label="Duration" type="text" name="duration" form={form} setForm={setForm} />
              <InputBox label="Description" type="text" name="description" form={form} setForm={setForm} />
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

      {/* DELETE Modal */}
      <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Training</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700 mt-2">Are you sure you want to delete this training?</p>

          <DialogFooter className="mt-4">
            <Button className="bg-red-600 text-white" onClick={handleDeleteTraining}>
              Delete
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* JOIN Modal */}
      <Dialog open={openJoinModal} onOpenChange={setOpenJoinModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Training</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700 mt-2">
            Are you sure you want to join: <span className="font-semibold">{selectedTraining?.topic}</span>?
          </p>

          <DialogFooter className="mt-4">
            <Button className="bg-green-600 text-white" onClick={handleJoinTraining}>
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

// Reusable InputBox component (controlled)
function InputBox({ label, type, name, placeholder = "", form, setForm, min }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        required
        min={min}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500 transition-all"
        value={form?.[name] ?? ""}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      />
    </div>
  );
}
