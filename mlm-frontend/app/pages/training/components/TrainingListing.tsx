"use client";

import React, { useEffect, useState } from "react";
import JoinTrainingModal from "./JoinTrainingModal";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TrainingListing() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Join Modal State
  const [openJoinModal, setOpenJoinModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<any>(null);

  const router = useRouter();

  // === Fetch Trainings ===
  async function fetchTrainings() {
    try {
      setLoading(true);

      const res = await axiosInstance.get(ProjectApiList.training); // /api/trainings/list
      setTrainings(res.data.trainings || []);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Failed to load trainings");
    }
  }

  useEffect(() => {
    fetchTrainings();
  }, []);

  // Format date -> "01 Dec 2025"
  function formatDate(dateString: string) {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // === Redirect on Join ===
  function handleJoinRedirect() {
    if (!selectedTraining) return;

    router.push(`/admin/training/joinTraining?training_id=${selectedTraining.id}`);
  }

  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-24 py-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Upcoming Training Sessions
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
              <th className="px-4 py-3 border-b border-border">Topic</th>
              <th className="px-4 py-3 border-b border-border">Trainer</th>
              <th className="px-4 py-3 border-b border-border">Venue</th>
              <th className="px-4 py-3 border-b border-border">Duration</th>
              <th className="px-4 py-3 border-b border-border text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border bg-card text-foreground/90">
            {/* Loading State */}
            {loading && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                  Loading trainings...
                </td>
              </tr>
            )}

            {/* Empty */}
            {!loading && trainings.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                  No trainings available.
                </td>
              </tr>
            )}

            {/* Training Rows */}
            {!loading &&
              trainings.map((t: any, index: number) => (
                <tr key={t.id} className="hover:bg-muted/30 transition-colors duration-150">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{formatDate(t.date)}</td>
                  <td className="px-4 py-3">{t.time}</td>
                  <td className="px-4 py-3 font-medium">{t.topic}</td>
                  <td className="px-4 py-3">{t.trainer}</td>
                  <td className="px-4 py-3">{t.venue}</td>
                  <td className="px-4 py-3">{t.duration}</td>

                  <td className="px-4 py-3 text-center">
                    <button
                      className="text-green-600 hover:text-green-800 font-medium underline"
                      onClick={() => {
                        setSelectedTraining(t);
                        setOpenJoinModal(true);
                      }}
                    >
                      Join Training
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* JOIN CONFIRM MODAL */}
      <Dialog open={openJoinModal} onOpenChange={setOpenJoinModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Training</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700 mt-2">
            Are you sure you want to join:
            <span className="font-semibold"> {selectedTraining?.topic}</span>?
          </p>

          <DialogFooter className="mt-4">
            <Button className="bg-green-600 text-white" onClick={handleJoinRedirect}>
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
