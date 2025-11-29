"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Globe, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { ConfirmModal } from "./components/ConfirmModal";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";

interface ContactFormInputs {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempData, setTempData] = useState<ContactFormInputs | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>();

  // Called when clicking SUBMIT
  const handleFormSubmit = (data: ContactFormInputs) => {
    setTempData(data);
    setIsModalOpen(true); // open confirmation modal
  };

  // When user CONFIRMS
 const submitConfirmed = async () => {
  if (!tempData) return;

  try {
    const res = await axiosInstance.post(ProjectApiList.post_contact_us, tempData);

    toast.success("Message sent successfully!");
    reset();
  } catch (err: any) {
    console.error(err);
    toast.error(err?.response?.data?.message || "Failed to send message");
  }

  setIsModalOpen(false);
  setTempData(null);
};

  return (
    <>
      <Header />

      {/* === Confirmation Modal === */}
      <ConfirmModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={submitConfirmed}
      />

      {/* HERO SECTION */}
      <section className="w-full bg-gradient-to-br from-primary/20 to-primary/10 py-16 text-center px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Reach Us</h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
          Have questions or need assistance? We're here to help.
        </p>
      </section>

      {/* FORM SECTION */}
      <section className="py-16 px-6 md:px-12 lg:px-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* LEFT SIDE CONTACT INFO */}
          {/* ... this part remains same ... */}

          {/* RIGHT SIDE FORM */}
          <div className="bg-card border border-border shadow-md rounded-xl p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-primary mb-6">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* NAME */}
              <div className="flex flex-col">
                <label className="text-sm mb-1">Name</label>
                <Input
                  placeholder="Your Name"
                  className="bg-background"
                  {...register("name", {
                    required: "Name is required",
                    minLength: { value: 3, message: "Min 3 characters" },
                  })}
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>

              {/* EMAIL */}
              <div className="flex flex-col">
                <label className="text-sm mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="Your Email"
                  className="bg-background"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>

              {/* PHONE */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm mb-1">Phone</label>
                <Input
                  placeholder="Your Phone Number"
                  className="bg-background"
                  {...register("phone", {
                    required: "Phone is required",
                    pattern: { value: /^[0-9]+$/, message: "Only numbers allowed" },
                    minLength: { value: 10, message: "Min 10 digits" },
                    maxLength: { value: 15, message: "Max 15 digits" },
                  })}
                />
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
              </div>

              {/* SUBJECT */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm mb-1">Subject</label>
                <Input
                  placeholder="Subject"
                  className="bg-background"
                  {...register("subject", {
                    required: "Subject is required",
                    minLength: { value: 5, message: "Min 5 characters" },
                  })}
                />
                {errors.subject && <p className="text-red-500 text-xs">{errors.subject.message}</p>}
              </div>

              {/* MESSAGE */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm mb-1">Message</label>
                <textarea
                  rows={5}
                  placeholder="Your message..."
                  className="bg-background border border-border rounded-md p-3"
                  {...register("message", {
                    required: "Message is required",
                    minLength: { value: 10, message: "Min 10 characters" },
                  })}
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
              </div>

              <div className="md:col-span-2 mt-4">
                <Button
                  type="submit"
                  className="px-10 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Send Message
                </Button>
              </div>

            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ===================== */
/* Contact Detail Component */
function ContactDetail({ icon, title, value }: any) {
  return (
    <div className="flex gap-4 items-start">
      <div className="p-3 bg-primary/10 rounded-lg">{icon}</div>
      <div>
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{value}</p>
      </div>
    </div>
  );
}
