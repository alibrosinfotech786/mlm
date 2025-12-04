"use client";

import Header from "@/components/layout/Header";
import HorizontalParallaxSlider from "./components/HorizontalParallaxSlider";
import BusinessOpportunity from "./components/BusinessOpportunity";
import ProductCategory from "./components/ProductCategory";
import ProductCarousel from "./components/ProductCarousel";
import Banner from "./components/Banner";
import SuccessStories from "./components/SuccessStories";
import Footer from "@/components/layout/Footer";
import Slider from "./components/Slider";
import TrainingCourses from "./components/TrainingCourses";
import EventCardsSection from "./components/EventCardsSection";

export default function HomePage() {
  return (
    <>
      <Header />

      {/* WRAPPER TO OVERLAY SLIDER */}
      <div className="relative w-full">
        <HorizontalParallaxSlider />

        {/* OVERFLOWING SLIDER */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-25 w-full max-w-7xl z-30">
          <Slider />
        </div>
      </div>

      {/* SPACING BELOW AFTER OVERLAP */}
      <div className="mt-20" />

      <BusinessOpportunity />
      <ProductCategory />
      {/* <ProductCarousel /> */}
      <Banner />
      <EventCardsSection />
      <TrainingCourses />
      <SuccessStories />
      <Footer />
    </>
  );
}
