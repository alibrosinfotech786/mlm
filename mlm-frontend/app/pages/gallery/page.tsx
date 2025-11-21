import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GalleryGrid from "./components/GalleryGrid";
import PageHeader from "@/components/layout/PageHeader";

export default function GalleryPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="Tathastu Ayurveda Gallery"
      />
      <GalleryGrid />
      <Footer />
    </>
  );
}
