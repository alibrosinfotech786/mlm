"use client";
import React from "react";
import TrainingListing from "./components/TrainingListing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";

export default function TrainingPage() {
  return (

    <>
      <Header />
      <PageHeader
        title="TRAINING & DEVELOPMENT"
      />
      <TrainingListing />
      <Footer />
    </>
  );
}
