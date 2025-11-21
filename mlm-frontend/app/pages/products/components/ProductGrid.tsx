"use client";

import React from "react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: any[];
  loading: boolean;
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  return (
    <div className="w-full md:w-3/4">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm md:text-base text-muted-foreground">
          {loading
            ? "Loading products..."
            : `${products.length} Products found`}
        </p>

        {/* <select className="border border-border rounded-md text-sm p-2 bg-background text-foreground">
          <option>Sort by: Featured</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select> */}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
      </div>
    </div>
  );
}
