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

  const handleFormSubmit = (data: ContactFormInputs) => {
    setTempData(data);
    setIsModalOpen(true);
  };

  const submitConfirmed = async () => {
    if (!tempData) return;

    try {
      await axiosInstance.post(ProjectApiList.post_contact_us, tempData);
      toast.success("Message sent successfully!");
      reset();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send message");
    }

    setIsModalOpen(false);
    setTempData(null);
  };

  return (
    <>
      <Header />

      {/* CONFIRMATION MODAL */}
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

      {/* CONTACT GRID */}
      <section className="py-16 px-6 md:px-12 lg:px-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* LEFT SIDE CONTACT INFO */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-primary mb-4">
              Contact Information
            </h2>

            <div className="space-y-6">

              <ContactDetail
                icon={<Phone className="w-5 h-5 text-primary" />}
                title="Phone"
                value="+9199977007"
              />

              <ContactDetail
                icon={<Mail className="w-5 h-5 text-primary" />}
                title="Email"
                value="info@tathastuayurveda.world"
              />

              <ContactDetail
                icon={<MapPin className="w-5 h-5 text-primary" />}
                title="Address"
                value="Ranchi, Jharkhand 834003, Ramgarh, Jharkhand 829106"
              />

              <ContactDetail
                icon={<Globe className="w-5 h-5 text-primary" />}
                title="Website"
                value="www.athastuayurveda.world"
              />

              {/* <ContactDetail
                icon={<Clock className="w-5 h-5 text-primary" />}
                title="Working Hours"
                value="Mon – Sat: 9:00 AM – 7:00 PM"
              /> */}

            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="bg-card border border-border shadow-md rounded-xl p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-primary mb-6">
              Send Us a Message
            </h2>

            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <FormField label="Name" error={errors.name?.message}>
                <Input
                  placeholder="Your Name"
                  className="bg-background"
                  {...register("name", {
                    required: "Name is required",
                    minLength: { value: 3, message: "Min 3 characters" },
                  })}
                />
              </FormField>

              <FormField label="Email" error={errors.email?.message}>
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
              </FormField>

              <FormField label="Phone" full error={errors.phone?.message}>
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
              </FormField>

              <FormField label="Subject" full error={errors.subject?.message}>
                <Input
                  placeholder="Subject"
                  className="bg-background"
                  {...register("subject", {
                    required: "Subject is required",
                    minLength: { value: 5, message: "Min 5 characters" },
                  })}
                />
              </FormField>

              <FormField label="Message" full error={errors.message?.message}>
                <textarea
                  rows={5}
                  placeholder="Your message..."
                  className="bg-background border border-border rounded-md p-3"
                  {...register("message", {
                    required: "Message is required",
                    minLength: { value: 10, message: "Min 10 characters" },
                  })}
                ></textarea>
              </FormField>

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

      {/* MAP SECTION */}
      <section className="px-6 md:px-12 lg:px-32 pb-16 mt-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold text-primary mb-6">
            Find Us on Map
          </h2>

          <div className="w-full h-[350px] md:h-[450px] rounded-xl overflow-hidden border border-border shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58482.189545792586!2d85.47223670499231!3d23.63526974291886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4f3f4a5cf98fd%3A0xcf187bf27b7bc4e9!2sRamgarh%20Cantonment%2C%20Jharkhand!5e0!3m2!1sen!2sin!4v1764415197169!5m2!1sen!2sin"
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* <iframe  width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ------------------------------ */
/* FORM FIELD COMPONENT */
function FormField({
  label,
  children,
  error,
  full,
}: {
  label: string;
  children: any;
  error?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2 flex flex-col" : "flex flex-col"}>
      <label className="text-sm mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

/* ------------------------------ */
/* CONTACT DETAIL BOX COMPONENT */
function ContactDetail({ icon, title, value }: any) {
  return (
    <div
      className="
      flex gap-4 items-start p-4 
      bg-card border border-border shadow-sm rounded-xl
      hover:shadow-md transition-all
    "
    >
      <div className="p-3 bg-primary/10 rounded-lg">{icon}</div>

      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          {value}
        </p>
      </div>
    </div>
  );
}
