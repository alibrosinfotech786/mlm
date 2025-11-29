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
      <HorizontalParallaxSlider />
      <Slider />
      <BusinessOpportunity />
      <ProductCategory />
      {/* <ProductCarousel /> */}
      <Banner />
      <SuccessStories />
      <EventCardsSection />
      <TrainingCourses />
      <Footer />

    </>
  );
}
