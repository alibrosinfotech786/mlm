"use client";

import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProductCarousel = () => {
  const products = [
    {
      id: 1,
      category: "Personal Care",
      title: "Veg-Collagen",
      itemCode: "21056",
      image: "/products/p1.png",
    },
    {
      id: 2,
      category: "Health Care",
      title: "Spirulina Capsules",
      itemCode: "21057",
      image: "/products/p2.png",
    },
    {
      id: 3,
      category: "Home Care",
      title: "Air Freshener",
      itemCode: "21058",
      image: "/products/p3.png",
    },
    {
      id: 4,
      category: "Agri Product",
      title: "Agri-82",
      itemCode: "21059",
      image: "/products/p4.png",
    },
    {
      id: 5,
      category: "Natural Personal Care",
      title: "Mineral Drops",
      itemCode: "21060",
      image: "/products/p5.png",
    },
  ];

  return (
    <section className="py-16 bg-background font-sans">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-10 text-center tracking-wide">
          Our Product Categories
        </h2>

        <Carousel className="w-full max-w-7xl mx-auto">
          <CarouselContent>
            {products.map((item) => (
              <CarouselItem
                key={item.id}
                className="md:basis-1/2 lg:basis-1/4 p-3 ml-1"
              >
                <div className="flex flex-col h-full bg-card border border-border rounded-md shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">

                  {/* Reduced Image Size */}
                  <div className="relative w-full h-48 sm:h-52 md:h-56 lg:h-52 xl:h-56">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-4"
                      priority
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col grow px-4 py-5 text-left">
                    <p className="text-sm text-muted-foreground">
                      {item.category}
                    </p>
                    <h3 className="text-base font-semibold text-primary mt-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-foreground font-medium mt-2">
                      Item Code:{" "}
                      <span className="text-primary">{item.itemCode}</span>
                    </p>
                  </div>

                  {/* Button */}
                  <div className="mt-auto">
                    <button className="w-full bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90 transition cursor-pointer">
                      View Details
                    </button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className=" max-sm:ml-7 md:flex bg-primary text-primary-foreground  cursor-pointer" />
          <CarouselNext className="max-sm:mr-7 md:flex bg-primary text-primary-foreground  cursor-pointer" />
        </Carousel>
      </div>
    </section>
  );
};

export default ProductCarousel;
