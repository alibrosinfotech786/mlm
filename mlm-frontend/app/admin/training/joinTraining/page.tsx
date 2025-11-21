"use client";

import React, { useEffect, useState } from "react";
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

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openJoinModal, setOpenJoinModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<any>(null);

  // User From Localstorage
  const userData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const userId = userData?.user_id ?? null;

  // Search + Pagination
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  // =============================
  // FETCH TRAININGS
  // =============================
  async function fetchTrainings() {
    try {
      setLoading(true);

      const res = await axiosInstance.get(ProjectApiList.training);

      const trainingsWithFlags = res.data.trainings.map((t: any) => {
        const participants = t.participants || [];

        // check if user joined
        const isJoined = participants.some(
          (p: any) => String(p.user_id) === String(userId)
        );

        return {
          ...t,
          participantsCount: participants.length,
          isJoined,
        };
      });

      setTrainings(trainingsWithFlags);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load trainings");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrainings();
  }, []);

  // =============================
  // JOIN TRAINING
  // =============================
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
      toast.error(err?.response?.data?.message || "Failed to join");
    }
  }

  // =============================
  // TABLE COLUMNS
  // =============================
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
        <span className="font-semibold text-blue-600">{v}</span>
      ),
    },

    {
      key: "actions",
      label: "Action",
      render: (_: any, row: any) =>
        row.isJoined ? (
          <span className="text-green-600 font-semibold">✔ Joined</span>
        ) : (
          <button
            className="text-green-600 hover:text-green-800 underline"
            onClick={() => {
              setSelectedTraining(row);
              setOpenJoinModal(true);
            }}
          >
            Join Training
          </button>
        ),
    },
  ];

  // =============================
  // SEARCH + PAGINATION
  // =============================
  const filtered = trainings.filter(
    (t: any) =>
      t.topic.toLowerCase().includes(search.toLowerCase()) ||
      t.trainer.toLowerCase().includes(search.toLowerCase())
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
          <div>
            <h1 className="text-2xl font-bold text-green-800">Trainings</h1>
            <p className="text-green-700 text-sm">
              Join available trainings
            </p>
          </div>

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
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              emptyMessage="No trainings found"
            />
          </div>
        </div>
      </section>

      {/* JOIN TRAINING MODAL */}
      <Dialog open={openJoinModal} onOpenChange={setOpenJoinModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Training</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700">
            Are you sure you want to join training:{" "}
            <span className="font-semibold">{selectedTraining?.topic}</span>?
          </p>

          <DialogFooter className="mt-4">
            <Button
              className="bg-green-600 text-white"
              onClick={handleJoinTraining}
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
