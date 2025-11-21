"use client";
import React from "react";
import Image from "next/image";

const ProductCategory = () => {
  return (
    <section className="py-16 bg-background font-sans">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-10 text-center tracking-wide">
          Product Categories
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <Image
              src="/images/prod1.jpg"
              alt="Natural Personal Care"
              width={600}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 w-full bg-primary/90 text-primary-foreground p-3">
              <h3 className="font-semibold text-lg uppercase">Natural Personal Care</h3>
              <p className="text-sm mt-1 opacity-90">
                Revitalize your skin and body with nature’s finest ingredients.
              </p>
            </div>
          </div>
          <div className="grid gap-8">
            {[
              {
                src: "/images/prod2.jpg",
                title: "Personal Care",
                desc: "Unlock radiant confidence with our personal care range.",
              },
              {
                src: "/images/prod3.jpg",
                title: "Agri Product",
                desc: "Strengthen your yield with our natural agri-care solutions.",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <Image src={p.src} alt={p.title} width={600} height={200} className="object-cover w-full h-[220px]" />
                <div className="absolute bottom-0 w-full bg-primary/90 text-primary-foreground p-2">
                  <h3 className="font-semibold text-lg uppercase">{p.title}</h3>
                  <p className="text-sm mt-1 opacity-90">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCategory;
