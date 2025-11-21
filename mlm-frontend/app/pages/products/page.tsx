"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ProductFilters from "./components/ProductFilters";
import ProductGrid from "./components/ProductGrid";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  image: string | null;
  mrp: number | string;
  bv: number | string;
  stock: boolean;
  code: string;
  content: string;
  category: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockFilter, setStockFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

  function buildImageUrl(path?: string | null) {
    if (!path) return "/no-img.png";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/${path}`.replace(/([^:]\/)\/+/g, "$1");
  }

  // ============================
  // FETCH PRODUCTS
  // ============================
  async function fetchProducts() {
    try {
      setLoading(true);

      let url = ProjectApiList.productsList;
      const params: string[] = [];

      // Apply Stock Filter
      if (stockFilter === "In Stock") params.push("stock=1");
      if (stockFilter === "Out of Stock") params.push("stock=0");

      // Apply Category Filter
      if (categoryFilter !== "All") {
        params.push(`category=${encodeURIComponent(categoryFilter)}`);
      }

      if (params.length > 0) url += `?${params.join("&")}`;

      const res = await axiosInstance.get(url);

      const mapped = (res.data.products || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        image: buildImageUrl(p.image),
        mrp: p.mrp,
        bv: p.bv,
        stock: p.stock,
        code: p.code || "",
        content: p.content || "",
        category: p.category || "Products",
      }));

      setProducts(mapped);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [stockFilter, categoryFilter]);

  return (
    <>
      <Header />

      {/* Banner */}
      <section className="relative w-full flex justify-center items-center bg-background pt-8">
        <div className="relative w-[85%] h-40 md:h-52 lg:h-64 rounded-xl overflow-hidden shadow-lg">
          <Image
            src="/images/productbanner.png"
            alt="Products Banner"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </section>

      {/* Main Section */}
      <section className="bg-background text-foreground py-12 px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row gap-8">
          <ProductFilters
            stockFilter={stockFilter}
            setStockFilter={setStockFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />

          <ProductGrid products={products} loading={loading} />
        </div>
      </section>

      <Footer />
    </>
  );
}
