"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const ProductCategory = () => {
  const categories = [
    {
      src: "/images/prod1.jpg",
      title: "Health Care",
      desc: "Boost your wellness with our premium health care essentials.",
    },
    {
      src: "/images/prod2.jpg",
      title: "Personal Care",
      desc: "Unlock radiant confidence with our personal care range.",
    },
  ];

  return (
    <section className="py-16 bg-background font-sans">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-10 text-center tracking-wide">
          Product Categories
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((c) => (
            <Link
              key={c.title}
              href={`/pages/products?category=${encodeURIComponent(c.title)}`}
              className="block"
            >
              <div className="relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                <Image
                  src={c.src}
                  alt={c.title}
                  width={600}
                  height={400}
                  className="w-full h-[260px] md:h-[300px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 w-full bg-primary/90 text-primary-foreground p-3">
                  <h3 className="font-semibold text-lg uppercase">{c.title}</h3>
                  <p className="text-sm mt-1 opacity-90">{c.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategory;
