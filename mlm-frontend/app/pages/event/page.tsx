"use client";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import React from "react";
import PageHeader from "../../../components/layout/PageHeader";
import EventListing from "./components/EventListing";

export default function EventsPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="MARK YOUR CALENDAR"
      />
      <EventListing />
      <Footer />

    </>
  );
}
