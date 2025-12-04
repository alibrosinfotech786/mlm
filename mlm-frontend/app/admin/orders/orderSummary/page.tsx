"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/common/DataTable";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";

// Modal
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Interfaces
interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  mrp: string;
  total: string;
  bv: string;
}

interface FullOrder {
  id: number;
  order_number: string;
  total_mrp: string;
  total_bv: string;
  payment_mode: string;
  status: string;
  created_at: string;

  billing_full_name: string;
  billing_email: string;
  billing_contact: string;
  billing_city: string;
  billing_state: string;
  billing_country: string;
  billing_pincode: string;

  shipping_full_name: string;
  shipping_email: string;
  shipping_contact: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  shipping_pincode: string;

  order_items: OrderItem[];
}

interface OrderSummary {
  orderId: string;
  date: string;
  totalItems: number;
  bvTotal: number;
  totalAmount: number;
  paymentType: string;
  fullData: FullOrder;
}

export default function OrderSummaryPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  // Modal
  const [selectedOrder, setSelectedOrder] = useState<FullOrder | null>(null);
  const [showModal, setShowModal] = useState(false);

  // =============================
  // FETCH ALL ORDERS
  // =============================
  async function getOrders() {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = storedUser.user_id; // IMPORTANT: use numeric id

      if (!userId) {
        toast.error("User not logged in");
        setLoading(false);
        return;
      }

      const res = await axiosInstance.get(
        `${ProjectApiList.getAllOrder}?user_id=${userId}`
      );

      const mapped = res.data.orders.map((o: FullOrder) => ({
        orderId: o.order_number,
        date: new Date(o.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        totalItems: o.order_items.length,
        bvTotal: Number(o.total_bv),
        totalAmount: Number(o.total_mrp),
        paymentType: o.payment_mode.toUpperCase(),
        fullData: o,
      }));

      setOrders(mapped);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOrders();
  }, []);

  // Open modal
  function openOrderDetails(order: OrderSummary) {
    setSelectedOrder(order.fullData);
    setShowModal(true);
  }

  // =============================
  // TABLE COLUMNS
  // =============================
  const columns: Column<OrderSummary>[] = [
    {
      key: "orderId",
      label: "Order ID",
      render: (value, row) => (
        <button
          onClick={() => openOrderDetails(row)}
          className="text-green-700 font-semibold hover:underline"
        >
          {value}
        </button>
      ),
    },
    { key: "date", label: "Date" },
    { key: "totalItems", label: "Total Items" },
    // { key: "bvTotal", label: "Total BV" },
    {
      key: "bvTotal",
      label: "Total BV",
      render: (value) => `${value} BV`,
    },
    {
      key: "totalAmount",
      label: "Total Amount (₹)",
      render: (value) => `₹ ${value.toFixed(2)}`,
    },
    { key: "paymentType", label: "Payment Type" },
  ];

  // Filtering
  const filteredData = orders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / entries);
  const startIndex = (page - 1) * entries;
  const paginatedData = filteredData.slice(startIndex, startIndex + entries);

  return (
    <>
      {/* <AdminHeader /> */}

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-green-800">Order Summary</h1>
            <p className="text-green-700 text-sm">
              View detailed summaries of all your orders and PV totals.
            </p>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow-md border overflow-hidden">
            <DataTable
              columns={columns}
              data={paginatedData}
              page={page}
              totalPages={totalPages}
              entries={entries}
              search={search}
              loading={loading}
              onSearchChange={setSearch}
              onEntriesChange={setEntries}
              onPrevious={() => setPage((p) => Math.max(p - 1, 1))}
              onNext={() => setPage((p) => Math.min(p + 1, totalPages || 1))}
              emptyMessage="No order summary found"
            />
          </div>
        </div>
      </section>

      {/* ========================== */}
      {/* ORDER DETAILS MODAL       */}
      {/* ========================== */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="!max-w-[75vw] !w-full overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-green-800 text-lg">
              Order Details – {selectedOrder?.order_number}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* ORDER INFO */}
                <div className="bg-green-50 p-4 rounded-xl border">
                  <h3 className="font-semibold text-green-800 mb-2">Order Info</h3>

                  <p className="text-sm">
                    <strong>Date:</strong>{" "}
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>

                  <p className="text-sm">
                    <strong>Status:</strong>{" "}
                    <span className="px-2 py-1 rounded bg-gray-100">
                      {selectedOrder.status.toUpperCase()}
                    </span>
                  </p>

                  <p className="text-sm">
                    <strong>Payment:</strong>{" "}
                    {selectedOrder.payment_mode.toUpperCase()}
                  </p>

                  <p className="text-sm">
                    <strong>Total Amount:</strong> ₹{selectedOrder.total_mrp}
                  </p>

                  <p className="text-sm">
                    <strong>Total PV:</strong> {selectedOrder.total_bv}
                  </p>
                </div>

                {/* BILLING */}
                <div className="bg-white p-4 rounded-xl border">
                  <h3 className="font-semibold text-green-800 mb-2">
                    Billing Address
                  </h3>
                  <p className="text-sm">{selectedOrder.billing_full_name}</p>
                  <p className="text-sm">{selectedOrder.billing_email}</p>
                  <p className="text-sm">{selectedOrder.billing_contact}</p>
                  <p className="text-sm">
                    {selectedOrder.billing_city}, {selectedOrder.billing_state},{" "}
                    {selectedOrder.billing_country} -{" "}
                    {selectedOrder.billing_pincode}
                  </p>
                </div>

                {/* SHIPPING */}
                <div className="bg-white p-4 rounded-xl border">
                  <h3 className="font-semibold text-green-800 mb-2">
                    Shipping Address
                  </h3>
                  <p className="text-sm">{selectedOrder.shipping_full_name}</p>
                  <p className="text-sm">{selectedOrder.shipping_email}</p>
                  <p className="text-sm">{selectedOrder.shipping_contact}</p>
                  <p className="text-sm">
                    {selectedOrder.shipping_city},{" "}
                    {selectedOrder.shipping_state},{" "}
                    {selectedOrder.shipping_country} -{" "}
                    {selectedOrder.shipping_pincode}
                  </p>
                </div>

              </div>

              {/* ITEMS TABLE */}
              <div className="bg-white p-4 rounded-xl border">
                <h3 className="font-semibold text-green-800 mb-2">
                  Order Items
                </h3>
                <table className="w-full text-sm border">
                  <thead>
                    <tr className="bg-green-100 text-left">
                      <th className="p-2">Product</th>
                      <th className="p-2">Qty</th>
                      <th className="p-2">MRP</th>
                      <th className="p-2">BV</th>
                      <th className="p-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.order_items.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="p-2">{item.product_name}</td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2">₹ {item.mrp}</td>
                        <td className="p-2">{item.bv}</td>
                        <td className="p-2">₹ {item.total}</td>
                      </tr>
                    ))}

                    <tr className="bg-green-50 font-semibold border-t">
                      <td className="p-2" colSpan={4}>
                        Grand Total
                      </td>
                      <td className="p-2 text-green-800">
                        ₹ {selectedOrder.total_mrp}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
