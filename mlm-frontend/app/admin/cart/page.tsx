"use client";

import React, { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/useCartStore";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

// React Hook Form + Validation
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// =======================
// YUP SCHEMA
// =======================
const addressSchema = yup.object().shape({
  full_name: yup.string().required("Full name is required"),
  email: yup.string().email().required("Email is required"),
  contact: yup.string().required("Contact number is required"),
  country: yup.string().required(),
  state: yup.string().required("State required"),
  city: yup.string().required("City required"),
  pincode: yup
    .string()
    .matches(/^[0-9]{6}$/, "Pincode must be a 6-digit number")
    .required("Pincode required"),
});

const formSchema = yup.object().shape({
  payment_mode: yup.string().required("Please select a payment mode"),
  billing: addressSchema,
  shipping: addressSchema,
});

// =======================
// TYPES
// =======================
type AddressFields =
  | "full_name"
  | "email"
  | "contact"
  | "country"
  | "state"
  | "city"
  | "pincode";

const addressFields: AddressFields[] = [
  "full_name",
  "email",
  "contact",
  "country",
  "state",
  "city",
  "pincode",
];

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const increaseQty = useCartStore((s) => s.increaseQty);
  const decreaseQty = useCartStore((s) => s.decreaseQty);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);

  const [confirmRemove, setConfirmRemove] = useState(false);
  const [confirmOrder, setConfirmOrder] = useState(false);
  const [selectedIdToRemove, setSelectedIdToRemove] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [transactionPassword, setTransactionPassword] = useState("");
  const [transactionPasswordError, setTransactionPasswordError] =
    useState<string | null>(null);

  // -------------------------
  // React Hook Form Setup
  // -------------------------
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      payment_mode: "",
      billing: {
        full_name: "",
        email: "",
        contact: "",
        country: "India",
        state: "",
        city: "",
        pincode: "",
      },
      shipping: {
        full_name: "",
        email: "",
        contact: "",
        country: "India",
        state: "",
        city: "",
        pincode: "",
      },
    },
  });

  const paymentMode = watch("payment_mode");

  const totalAmount = items.reduce(
    (sum, item) => sum + item.mrp * item.quantity,
    0
  );

  // COPY BILLING → SHIPPING
  function syncBillingToShipping() {
    const billingData = watch("billing");
    setValue("shipping", billingData);
  }

  // REMOVE ITEM POPUP
  function promptRemove(id: number) {
    setSelectedIdToRemove(id);
    setConfirmRemove(true);
  }

  // ======================
  // LOAD LOGGED-IN USER (for wallet balance)
  // ======================
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUserLoading(false);
          return;
        }

        const res = await axiosInstance.get(ProjectApiList.USER, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res?.data?.success && res.data.user) {
          setWalletBalance(Number(res.data.user.wallet_balance ?? 0));
        } else {
          toast.error("Failed to load wallet balance");
        }
      } catch {
        toast.error("Failed to load wallet balance");
      } finally {
        setUserLoading(false);
      }
    };

    loadUser();
  }, []);

  // ======================
  // ORDER FINAL SUBMIT
  // ======================
 async function placeOrderFinal(data: any) {
  if (items.length === 0) {
    toast.error("Your cart is empty");
    return;
  }

  if (data.payment_mode === "wallet") {
    if (walletBalance == null) {
      toast.error("Unable to read wallet balance. Please refresh the page.");
      return;
    }

    if (walletBalance < totalAmount) {
      toast.error("Insufficient wallet balance for this order.");
      return;
    }

    if (!transactionPassword.trim()) {
      setTransactionPasswordError("Transaction password is required");
      toast.error("Please enter your transaction password");
      return;
    }
  }

  setLoading(true);

  const payload = {
    payment_mode: data.payment_mode,

    billing_full_name: data.billing.full_name,
    billing_email: data.billing.email,
    billing_contact: data.billing.contact,
    billing_country: data.billing.country,
    billing_state: data.billing.state,
    billing_city: data.billing.city,
    billing_pincode: data.billing.pincode,

    shipping_full_name: data.shipping.full_name,
    shipping_email: data.shipping.email,
    shipping_contact: data.shipping.contact,
    shipping_country: data.shipping.country,
    shipping_state: data.shipping.state,
    shipping_city: data.shipping.city,
    shipping_pincode: data.shipping.pincode,

    items: items.map((it) => ({
      product_id: it.id,
      quantity: it.quantity,
    })),

    ...(data.payment_mode === "wallet" && {
      transaction_password: transactionPassword,
    }),
  };

  try {
    const token = localStorage.getItem("token");

    await axiosInstance.post(ProjectApiList.createOrder, payload, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    toast.success("Order placed successfully!");

    clearCart();
    reset();
    setTransactionPassword("");
    setTransactionPasswordError(null);

    setConfirmOrder(false);
  } catch (err: any) {
    const apiError = err?.response?.data;

    // 🔥 SHOW EXACT BACKEND VALIDATION MESSAGE
    if (apiError?.errors?.transaction_password) {
      toast.error(apiError.errors.transaction_password[0]);
    } else if (apiError?.message) {
      toast.error(apiError.message);
    } else {
      toast.error("Failed to place order");
    }
  } finally {
    setLoading(false);
  }
}


  return (
    <>
      {/* <AdminHeader /> */}

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* HEADER */}
          <div>
            <h1 className="text-2xl font-bold text-green-800">Shopping Cart</h1>
            <p className="text-green-700 text-sm">
              Review your selected items and complete your order below.
            </p>
          </div>

          {/* CART DETAILS */}
          <div className="bg-white shadow-md rounded-xl border border-green-100 overflow-hidden">
            <div className="bg-green-700 text-white font-semibold text-lg px-4 py-3">
              Cart Details
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-green-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left">Remove</th>
                    <th className="px-4 py-2 text-left">Product Name</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">BV</th>
                    <th className="px-4 py-2 text-left">MRP</th>
                    <th className="px-4 py-2 text-left">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        Your cart is empty
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <button onClick={() => promptRemove(item.id)}>
                            <Trash2 size={18} className="text-red-500" />
                          </button>
                        </td>

                        <td className="px-4 py-3 font-medium">{item.name}</td>

                        <td className="px-4 py-3 flex items-center gap-2">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="p-1 border rounded"
                          >
                            <Minus size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => increaseQty(item.id)}
                            className="p-1 border rounded"
                          >
                            <Plus size={14} />
                          </button>
                        </td>

                        <td className="px-4 py-3">{item.bv}</td>
                        <td className="px-4 py-3">₹{item.mrp}</td>
                        <td className="px-4 py-3 font-semibold text-green-700">
                          ₹{item.mrp * item.quantity}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* SUMMARY */}
            <div className="bg-green-50 px-4 py-3 border-t flex flex-wrap justify-end gap-8 text-sm font-medium text-green-900">
              <p>
                Total Qty:{" "}
                <span className="font-bold">
                  {items.reduce((s, it) => s + it.quantity, 0)}
                </span>
              </p>
              <p>
                Total BV:{" "}
                <span className="font-bold">
                  {items.reduce((s, it) => s + it.bv * it.quantity, 0)}
                </span>
              </p>
              <p>
                Total MRP: <span className="font-bold">₹{totalAmount}</span>
              </p>
            </div>
          </div>

          {/* BILLING */}
          <div className="bg-white shadow-md rounded-xl border border-green-100 p-6">
            <h2 className="text-lg font-semibold text-green-800 mb-4">
              Billing Address
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {addressFields.map((field) => (
                <FormInput
                  key={field}
                  label={field.replace(/_/g, " ").toUpperCase()}
                  error={errors.billing?.[field]?.message}
                  {...register(`billing.${field}`)}
                />
              ))}
            </div>
          </div>

          {/* SHIPPING */}
          <div className="bg-white shadow-md rounded-xl border border-green-100 p-6">
            <h2 className="text-lg font-semibold text-green-800 mb-4">
              Shipping Address
            </h2>

            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                className="w-4 h-4 accent-green-600"
                onChange={syncBillingToShipping}
              />
              <span className="text-sm">Same as Billing</span>
            </label>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {addressFields.map((field) => (
                <FormInput
                  key={field}
                  label={field.replace(/_/g, " ").toUpperCase()}
                  error={errors.shipping?.[field]?.message}
                  {...register(`shipping.${field}`)}
                />
              ))}
            </div>
          </div>

          {/* PAYMENT MODE */}
          <div className="bg-white shadow-md rounded-xl border border-green-100 p-6">
            <h2 className="text-lg font-semibold text-green-800 mb-4">
              Payment Mode
            </h2>

            <div className="space-y-3">
              {["cod", "online", "wallet"].map((mode) => (
                <label
                  key={mode}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    value={mode}
                    {...register("payment_mode")}
                    className="w-4 h-4 accent-green-600"
                  />
                  <span className="text-sm capitalize">{mode}</span>
                </label>
              ))}
            </div>

            {/* Wallet balance info */}
            {paymentMode === "wallet" && (
              <div className="mt-3 text-sm">
                <p className="text-green-800 font-medium">
                  Wallet Balance:{" "}
                  <span className="font-bold">
                    ₹
                    {userLoading
                      ? "Loading..."
                      : walletBalance !== null
                      ? walletBalance.toFixed(2)
                      : "0.00"}
                  </span>
                </p>
                {walletBalance !== null && walletBalance < totalAmount && (
                  <p className="text-red-600 mt-1">
                    Your wallet balance is not sufficient for this order.
                  </p>
                )}
              </div>
            )}

            {errors.payment_mode && (
              <p className="text-red-600 text-sm mt-1">
                {errors.payment_mode.message}
              </p>
            )}

            <div className="mt-6 border border-green-200 rounded-lg p-4">
              <FormInput
                label="Bill Amount (MRP)"
                disabled
                value={String(totalAmount)}
              />

              <div className="flex gap-3 mt-4">
                <Button
                  className="bg-green-700 text-white"
                  onClick={handleSubmit((data) => {
                    if (data.payment_mode === "wallet") {
                      if (walletBalance == null) {
                        toast.error(
                          "Unable to read wallet balance. Please refresh the page."
                        );
                        return;
                      }

                      if (walletBalance < totalAmount) {
                        toast.error(
                          "Insufficient wallet balance for this order."
                        );
                        return;
                      }
                    }

                    setConfirmOrder(true);
                  })}
                >
                  Place Order
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    clearCart();
                    toast("Cart cleared");
                  }}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REMOVE CONFIRMATION */}
      <Dialog open={confirmRemove} onOpenChange={setConfirmRemove}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Item</DialogTitle>
          </DialogHeader>

          <p>Are you sure you want to remove this item?</p>

          <DialogFooter>
            <Button
              className="bg-red-600 text-white"
              onClick={() => {
                if (selectedIdToRemove) removeFromCart(selectedIdToRemove);
                setConfirmRemove(false);
              }}
            >
              Remove
            </Button>

            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ORDER CONFIRMATION */}
      <Dialog open={confirmOrder} onOpenChange={setConfirmOrder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Order</DialogTitle>
          </DialogHeader>

          <p>
            Are you sure you want to place this order of{" "}
            <strong>₹{totalAmount}</strong>?
          </p>

          {paymentMode === "wallet" && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-700">
                Please enter your transaction password to pay via wallet.
              </p>
              <input
                type="password"
                value={transactionPassword}
                onChange={(e) => {
                  setTransactionPassword(e.target.value);
                  setTransactionPasswordError(null);
                }}
                className="w-full border border-green-300 rounded-md px-3 py-1.5 text-sm"
                placeholder="Transaction Password"
              />
              {transactionPasswordError && (
                <p className="text-red-600 text-xs">
                  {transactionPasswordError}
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              className="bg-green-700 text-white"
              disabled={loading}
              onClick={handleSubmit(placeOrderFinal)}
            >
              {loading ? "Placing..." : "Yes, Place Order"}
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

// =======================
// REUSABLE INPUT FIELD
// =======================
function FormInput({ label, error, ...rest }: any) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-green-800 mb-1">
        {label}
      </label>
      <input
        {...rest}
        className={`border border-green-300 rounded-md px-3 py-1.5 text-sm ${
          rest.disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
        }`}
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}
