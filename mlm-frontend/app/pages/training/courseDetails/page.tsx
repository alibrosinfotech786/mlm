"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

function CourseDetailsContent() {
  const params = useSearchParams();
  const id = params.get("course_id");
  const router = useRouter();

  const [training, setTraining] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openJoinModal, setOpenJoinModal] = useState(false);

  // ======================================================
  // 🔵 Fetch Training Details
  // ======================================================
  async function fetchTraining() {
    try {
      const res = await axiosInstance.get(`${ProjectApiList.training}/${id}`);
      setTraining(res.data.training || null);
    } catch (err) {
      toast.error("Failed to load training details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) fetchTraining();
  }, [id]);

  function handleJoinRedirect() {
    router.push(`/admin/training/joinTraining?training_id=${training.id}`);
  }

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
          Loading training details...
        </div>
        <Footer />
      </>
    );
  }

  // Not found
  if (!training) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
          Training not found.
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="w-full bg-gradient-to-r from-primary/20 to-primary/40 py-20 px-6 text-center shadow-inner">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary uppercase tracking-wide drop-shadow-sm">
            {training.topic}
          </h1>

          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Enhance your skills with our structured professional training.
          </p>
        </div>
      </section>

      {/* ============================================= */}
      {/* 2-COLUMN MAIN SECTION */}
      {/* ============================================= */}
      <section className="pb-20 px-6 md:px-12 lg:px-36 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT COLUMN – Details */}
          <div className="space-y-5">
            <DetailCard label="Date" value={new Date(training.date).toLocaleDateString()} />
            <DetailCard label="Time" value={training.time} />
            <DetailCard label="Venue" value={training.venue} />
            <DetailCard label="Duration" value={training.duration} />
            <DetailCard label="Trainer" value={training.trainer} />
            <DetailCard label="Course Fee" value={`₹ ${training.course_fee}`} />
            <DetailCard label="Level" value={training.level} />
            {/* <DetailCard
              label="Total Participants"
              value={training.participants?.length || 0}
            /> */}
          </div>

          {/* RIGHT COLUMN – Overview + Syllabus */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl shadow-md p-10">

              {/* OVERVIEW */}
              <h2 className="text-2xl font-semibold text-primary mb-4">Overview</h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-10">
                {training.description}
              </p>

              {/* SYLLABUS */}
              <h2 className="text-2xl font-semibold text-primary mb-4">Course Syllabus</h2>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground text-base leading-relaxed mb-10">
                {training.syllabus?.map((item: string, idx: number) => (
                  <li key={idx}>
                    <strong>Module {idx + 1}:</strong> {item}
                  </li>
                ))}

              </ul>

              {/* JOIN BUTTON */}
              <div className="mt-8">
                <Button
                  className="bg-primary text-primary-foreground px-10 py-3 text-lg rounded-full shadow-md hover:bg-primary/90 transition"
                  onClick={() => setOpenJoinModal(true)}
                >
                  Join The Training
                </Button>
              </div>

            </div>
          </div>

        </div>
      </section>

      <Footer />

      {/* ============================================= */}
      {/* JOIN CONFIRMATION MODAL */}
      {/* ============================================= */}
      <Dialog open={openJoinModal} onOpenChange={setOpenJoinModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Training</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700 mt-2">
            Are you sure you want to join:
            <span className="font-semibold"> {training.topic}</span>?
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
    </>
  );
}

export default function CourseDetailsPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <div className="min-h-screen flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
          <Footer />
        </>
      }
    >
      <CourseDetailsContent />
    </Suspense>
  );
}

/* =================================================== */
/* DETAIL CARD COMPONENT */
/* =================================================== */
function DetailCard({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div
      className={`bg-card border border-border rounded-lg p-4 shadow-sm flex items-start justify-start gap-4 ${className}`}
    >
      <span className="font-medium text-foreground">{label}</span> :
      <span className="text-muted-foreground text-right">{value}</span>
    </div>
  );
}

