"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function ProductCard({
  id,
  image,
  name,
  category,
  code,
  content,
  mrp,
  bv,
  stock,        // ⬅️ stock comes from API
}: any) {

  const addToCart = useCartStore((s) => s.addToCart);
  const router = useRouter();
  const [openConfirm, setOpenConfirm] = useState(false);

  function handleAddClick() {
    if (!stock) return toast.error("Product is out of stock");
    setOpenConfirm(true);
  }

  function confirmAddToCart() {
    setOpenConfirm(false);
    router.push("/admin/orders/buyOrders");
  }

  return (
    <>
      <div className="relative bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 flex flex-col">

        {/* 🔥 STOCK BADGE */}
        <span
          className={`absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded ${stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
            }`}
        >
          {stock ? "In Stock" : "Out of Stock"}
        </span>

        {/* Product Image */}
        <div className="relative w-full h-48 mb-4">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain p-4"
            priority
            unoptimized
          />
        </div>

        {/* Title + Details */}
        <p className="text-sm text-muted-foreground">{category}</p>
        <h3 className="text-base font-semibold text-primary leading-snug mt-1 mb-2">
          {name}
        </h3>

        {code && (
          <p className="text-sm text-foreground mb-1">
            <strong>Item Code:</strong> {code}
          </p>
        )}

        {content && (
          <p className="text-sm text-foreground mb-1">
            <strong>Net Content:</strong> {content}
          </p>
        )}

        <p className="text-sm text-foreground mb-3">
          <strong>MRP:</strong> ₹{mrp}
        </p>

        {/* Add to Cart */}
        <Button
          onClick={handleAddClick}
          disabled={!stock}
          className={`mt-auto flex items-center justify-center gap-2 
            ${stock ? "bg-primary text-primary-foreground" : "bg-gray-400 cursor-not-allowed"}
          `}
        >
          <ShoppingCart className="w-4 h-4" />
          {stock ? "Add to Cart" : "Unavailable"}
        </Button>
      </div>

      {/* Confirm Modal */}
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Add to Cart</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700">
            Are you sure you want to add{" "}
            <span className="font-semibold">{name}</span> to the cart?
          </p>

          <DialogFooter>
            <Button
              className="bg-green-700 text-white"
              onClick={confirmAddToCart}
            >
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
