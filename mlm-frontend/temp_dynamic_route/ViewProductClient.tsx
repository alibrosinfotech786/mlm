"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";
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

export default function ViewProductClient({ id }: { id: string }) {
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirmAdd, setConfirmAdd] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

  function buildImageUrl(path?: string | null) {
    if (!path) return "/no-img.png";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/${path}`.replace(/\/+/g, "/");
  }

  async function fetchProduct() {
    try {
      const res = await axiosInstance.get(`${ProjectApiList.singleProduct}?id=${id}`);
      setProduct(res.data.product || null);
    } catch {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <>
        {/* <AdminHeader /> */}
        <div className="min-h-screen flex items-center justify-center text-gray-600">Loading product...</div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        {/* <AdminHeader /> */}
        <div className="min-h-screen flex items-center justify-center text-gray-600">Product not found.</div>
      </>
    );
  }

  function openConfirmAdd() {
    setConfirmAdd(true);
  }

  function confirmAddNow() {
    addToCart(
      {
        id: product.id,
        name: product.name,
        image: product.image,
        mrp: Number(product.mrp),
        bv: Number(product.bv),
      },
      1
    );

    toast.success("Item added to cart!");
    setConfirmAdd(false);
  }

  return (
    <>
      {/* <AdminHeader /> */}

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-800">Product Details</h1>
            <button
              onClick={() => router.back()}
              className="bg-green-700 text-white px-5 py-2 rounded-md font-medium hover:bg-green-800 transition"
            >
              ← Back
            </button>
          </div>

          <div className="bg-white border border-green-100 shadow-md rounded-xl p-6 flex flex-col lg:flex-row gap-8">
            <div className="flex justify-center items-center w-full lg:w-1/3">
              <div className="relative w-64 h-64 bg-green-50 border border-green-100 rounded-lg flex justify-center items-center">
                <Image
                  src={buildImageUrl(product.image)}
                  alt={product.name}
                  width={220}
                  height={220}
                  className="object-contain"
                  unoptimized
                />
                <span
                  className={`absolute top-2 right-2 text-xs px-2 py-1 font-semibold rounded ${
                    product.stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.stock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <h2 className="text-xl font-semibold text-green-900">{product.name}</h2>

              <div className="flex flex-wrap gap-6 text-sm text-green-800">
                <p>
                  <span className="font-semibold">MRP:</span> ₹{Number(product.mrp).toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">BV:</span> {product.bv}
                </p>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>

              <div>
                <h3 className="font-semibold text-green-900 mb-2">Ingredients</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{product.ingredients}</p>
              </div>

              <div>
                <h3 className="font-semibold text-green-900 mb-2">Benefits</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{product.benefits}</p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  disabled={!product.stock}
                  className={`px-10 py-1 rounded text-white text-sm font-medium ${
                      product.stock ? "bg-blue-900 hover:bg-blue-950" : "bg-gray-400 cursor-not-allowed"
                    }`}
                  onClick={openConfirmAdd}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={confirmAdd} onOpenChange={setConfirmAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Add to Cart</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700">
            Are you sure you want to add <span className="font-semibold">{product?.name}</span> to the cart?
          </p>

          <DialogFooter>
            <Button onClick={confirmAddNow} className="bg-green-700 text-white">
              Yes, Add
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}