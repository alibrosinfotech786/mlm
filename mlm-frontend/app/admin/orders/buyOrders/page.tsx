"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import Image from "next/image";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";

interface Product {
  id: number;
  name: string;
  image: string | null;
  mrp: number | string;
  bv: number | string;
  stock: boolean;
  category?: string;
}

export default function BuyProductsPage() {
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);

  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  // 🔥 Filters
  const [filterStock, setFilterStock] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");

  const [confirmAdd, setConfirmAdd] = useState(false);
  const [selectedProductForAdd, setSelectedProductForAdd] = useState<Product | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

  // Build image URL safely
  function buildImageUrl(path?: string | null) {
    if (!path) return "/no-img.png";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/${path}`.replace(/([^:]\/)\/+/g, "$1");
  }

  // 🔥 Fetch Products With Filters
  async function fetchProducts(stock: string, category: string) {
    try {
      setLoading(true);

      let url = ProjectApiList.productsList + "?";

      if (stock === "In Stock") url += "stock=1&";
      if (stock === "Out of Stock") url += "stock=0&";

      if (category !== "All") url += `category=${encodeURIComponent(category)}&`;

      const res = await axiosInstance.get(url);
      setProducts(res.data.products || []);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    fetchProducts(filterStock, filterCategory);
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    fetchProducts(filterStock, filterCategory);
  }, [filterStock, filterCategory]);

  const handleQuantityChange = (id: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, value) }));
  };

  // Open confirmation modal
  function handleBuyClick(product: Product) {
    const qty = quantities[product.id] || 1;
    if (qty <= 0) return toast.error("Select at least 1 quantity");

    setSelectedProductForAdd(product);
    setConfirmAdd(true);
  }

  // 🔥 FINAL Add To Cart With Loading
  async function confirmAddToCart() {
    if (!selectedProductForAdd) return;

    try {
      setLoadingAdd(true);

      const qty = quantities[selectedProductForAdd.id] || 1;

      addToCart(
        {
          id: selectedProductForAdd.id,
          name: selectedProductForAdd.name,
          image: selectedProductForAdd.image,
          mrp: Number(selectedProductForAdd.mrp),
          bv: Number(selectedProductForAdd.bv),
        },
        qty
      );

      toast.success("Product added to cart!");
      setConfirmAdd(false);
    } finally {
      setLoadingAdd(false);
    }
  }

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-green-50/40 py-10 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-green-800">Buy Product</h1>

            <div className="flex flex-wrap items-center gap-4">

              {/* STOCK FILTER */}
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="border border-green-300 rounded-md px-3 py-2 text-sm text-green-800"
              >
                <option value="All">All Stock</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>

              {/* CATEGORY FILTER */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-green-300 rounded-md px-3 py-2 text-sm text-green-800"
              >
                <option value="All">All Categories</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Health Care">Health Care</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <p className="text-center text-green-700 py-10">Loading Products...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white border border-green-100 rounded-lg shadow-sm p-4 relative">

                  {/* Stock Badge */}
                  <span
                    className={`absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded ${
                      product.stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {product.stock ? "In Stock" : "Out of Stock"}
                  </span>

                  {/* Image */}
                  <div
                    className="flex justify-center items-center h-40 mb-4 cursor-pointer"
                    onClick={() => router.push(`/admin/orders/buyOrders/${product.id}`)}
                  >
                    <Image
                      src={buildImageUrl(product.image)}
                      alt={product.name}
                      width={120}
                      height={120}
                      className="object-contain"
                      unoptimized
                    />
                  </div>

                  {/* Name */}
                  <h2 className="text-sm font-semibold text-gray-800 text-center truncate">
                    {product.name}
                  </h2>

                  {/* Price */}
                  <div className="text-sm text-gray-600 text-center mt-1">
                    MRP ₹ {Number(product.mrp).toFixed(2)}
                  </div>

                  {/* BV */}
                  <div className="text-xs text-gray-500 text-center mb-3">
                    BV {product.bv}
                  </div>

                  {/* Quantity */}
                  <div className="flex justify-center items-center gap-2 mt-2">
                    <button
                      className="w-6 h-6 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                      onClick={() =>
                        handleQuantityChange(product.id, (quantities[product.id] || 0) - 1)
                      }
                      disabled={!product.stock}
                    >
                      -
                    </button>

                    <span className="text-sm font-semibold w-5 text-center">
                      {quantities[product.id] || 0}
                    </span>

                    <button
                      className="w-6 h-6 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                      onClick={() =>
                        handleQuantityChange(product.id, (quantities[product.id] || 0) + 1)
                      }
                      disabled={!product.stock}
                    >
                      +
                    </button>
                  </div>

                  {/* Buy Button */}
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                      disabled={!product.stock}
                      className={`px-10 py-1 rounded text-white text-sm font-medium ${
                        product.stock
                          ? "bg-blue-900 hover:bg-blue-950"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      onClick={() => handleBuyClick(product)}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Confirm Add Modal */}
      <Dialog open={confirmAdd} onOpenChange={setConfirmAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Add to Cart</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700">
            Are you sure you want to add{" "}
            <span className="font-semibold">{selectedProductForAdd?.name}</span> to the cart?
          </p>

          <DialogFooter>

            {/* Add Button with Loading */}
            <Button
              onClick={confirmAddToCart}
              className="bg-green-700 text-white flex items-center gap-2"
              disabled={loadingAdd}
            >
              {loadingAdd && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loadingAdd ? "Adding..." : "Yes, Add"}
            </Button>

            <DialogClose asChild>
              <Button variant="outline" disabled={loadingAdd}>
                Cancel
              </Button>
            </DialogClose>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
