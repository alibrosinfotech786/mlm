"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/common/DataTable";
import axiosInstance from "@/app/api/axiosInstance";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProjectApiList from "@/app/api/ProjectApiList";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  mrp: string;
  total: string;
  bv: string;
  total_bv?: string;
}

interface Order {
  id: number;
  order_number: string;
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

  payment_mode: string;
  total_mrp: string;
  status: string;
  created_at: string;

  order_items: OrderItem[];
}

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [refundLoading, setRefundLoading] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState<number | null>(null);

  const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const [refundOrderId, setRefundOrderId] = useState<number | null>(null);

  // FETCH ORDERS
  async function getOrders() {
    try {
      const res = await axiosInstance.get(ProjectApiList.getAllOrder);
      setOrders(res.data.orders || []);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOrders();
  }, []);

  // UPDATE STATUS (WITH LOADING)
  async function updateStatus(orderId: number, newStatus: string) {
    try {
      setStatusLoadingId(orderId);

      await axiosInstance.post(ProjectApiList.orderStatusUpdated, {
        id: orderId,
        status: newStatus,
      });

      toast.success("Order status updated!");

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch {
      toast.error("Failed to update status");
    } finally {
      setStatusLoadingId(null);
    }
  }

  // OPEN DETAILS MODAL
  function openOrderDetails(order: Order) {
    setSelectedOrder(order);
    setShowModal(true);
  }

  // REFUND FUNCTION
  async function handleRefund(orderId: number) {
    try {
      setRefundLoading(true);

      await axiosInstance.post(ProjectApiList.orderRefund, {
        order_id: orderId,
      });

      toast.success("Refund processed successfully!");

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "refunded" } : o
        )
      );

      setShowModal(false);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.order_id?.[0] ||
          "Refund failed!"
      );
    } finally {
      setRefundLoading(false);
    }
  }

  // TABLE COLUMNS
  const columns: Column<Order>[] = [
    {
      key: "order_number",
      label: "Order No",
      render: (value, row) => (
        <button
          className="text-green-700 font-semibold hover:underline"
          onClick={() => openOrderDetails(row)}
        >
          {value}
        </button>
      ),
    },
    { key: "billing_full_name", label: "Customer" },
    {
      key: "created_at",
      label: "Date",
      render: (value) =>
        new Date(value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    { key: "order_items", label: "Items", render: (items) => items.length },
    { key: "payment_mode", label: "Payment", render: (v) => v.toUpperCase() },
    {
      key: "total_mrp",
      label: "Total (₹)",
      render: (value) => `₹ ${Number(value).toFixed(2)}`,
    },
    {
      key: "status",
      label: "Status",
      render: (value, row) => (
        <select
          value={value}
          disabled={statusLoadingId === row.id}
          onChange={(e) => updateStatus(row.id, e.target.value)}
          className={`px-2 py-1 text-xs rounded border ${
            value === "delivered"
              ? "bg-green-100 text-green-700"
              : value === "shipped"
              ? "bg-blue-100 text-blue-700"
              : value === "confirmed"
              ? "bg-purple-100 text-purple-700"
              : value === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {statusLoadingId === row.id ? (
            <option>Updating...</option>
          ) : (
            <>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </>
          )}
        </select>
      ),
    },
  ];

  // SEARCH + PAGINATION
  const filteredData = orders.filter(
    (order) =>
      order.order_number.toLowerCase().includes(search.toLowerCase()) ||
      order.billing_full_name.toLowerCase().includes(search.toLowerCase()) ||
      order.status.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / entries);
  const paginatedData = filteredData.slice(
    (page - 1) * entries,
    (page - 1) * entries + entries
  );

  return (
    <>
      <AdminHeader />

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-green-800">All Orders</h1>

          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
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
              emptyMessage="No orders yet"
            />
          </div>
        </div>
      </section>

      {/* =============================== */}
      {/* ORDER DETAILS MODAL */}
      {/* =============================== */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="!max-w-[75vw] !w-full overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-green-800 text-lg">
              Order Details – {selectedOrder?.order_number}
            </DialogTitle>
          </DialogHeader>

          {/* RESTORED FULL MODAL CONTENT */}
          {selectedOrder && (
            <div className="space-y-4">
              {/* ========== 3 COLUMNS ========== */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* ORDER INFO */}
                <div className="bg-green-50 p-4 rounded-xl border border-green-200 shadow-sm">
                  <h3 className="font-semibold text-green-800 mb-2 text-md">
                    Order Info
                  </h3>

                  <p className="text-sm">
                    <strong>Date:</strong>{" "}
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>

                  <p className="text-sm flex gap-2 items-center">
                    <strong>Status:</strong>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        selectedOrder.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : selectedOrder.status === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : selectedOrder.status === "confirmed"
                          ? "bg-purple-100 text-purple-700"
                          : selectedOrder.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
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
                </div>

                {/* BILLING */}
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                  <h3 className="font-semibold text-green-800 mb-2 text-md">
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
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                  <h3 className="font-semibold text-green-800 mb-2 text-md">
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

              {/* ========= ITEMS TABLE ========= */}
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <h3 className="font-semibold text-green-800 mb-2 text-md">
                  Items
                </h3>

                <table className="w-full text-sm border">
                  <thead>
                    <tr className="bg-green-100 text-left">
                      <th className="p-2">Product</th>
                      <th className="p-2">Qty</th>
                      <th className="p-2">MRP</th>
                      <th className="p-2">Total</th>
                      <th className="p-2">BV</th>
                      <th className="p-2">Total BV</th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedOrder.order_items.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="p-2">{item.product_name}</td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2">₹ {item.mrp}</td>
                        <td className="p-2">₹ {item.total}</td>
                        <td className="p-2">{item.bv}</td>
                        <td className="p-2">
                          {item.total_bv ||
                            Number(item.bv) * Number(item.quantity)}
                        </td>
                      </tr>
                    ))}

                    <tr className="bg-green-50 font-semibold border-t">
                      <td className="p-2" colSpan={3}>
                        Grand Total
                      </td>
                      <td className="p-2 text-green-800">
                        ₹ {selectedOrder.total_mrp}
                      </td>

                      <td className="p-2" colSpan={2}>
                        Total BV:{" "}
                        <span className="text-green-800 font-bold">
                          {selectedOrder.order_items.reduce(
                            (sum, item) =>
                              sum +
                              (Number(item.total_bv) ||
                                Number(item.bv) * Number(item.quantity)),
                            0
                          )}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FOOTER + REFUND BUTTON */}
          <DialogFooter className="flex justify-between">
            {selectedOrder &&
              (selectedOrder.payment_mode === "wallet" ||
                selectedOrder.payment_mode === "online") &&
              selectedOrder.status === "cancelled" && (
                <Button
                  className="bg-red-600 text-white hover:bg-red-700"
                  disabled={refundLoading}
                  onClick={() => {
                    setRefundOrderId(selectedOrder.id);
                    setShowRefundConfirm(true);
                  }}
                >
                  {refundLoading ? "Processing..." : "Refund"}
                </Button>
              )}

            <Button
              variant="outline"
              className="px-4 py-1 text-sm"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================= */}
      {/* REFUND CONFIRMATION MODAL */}
      {/* ============================= */}
      <Dialog open={showRefundConfirm} onOpenChange={setShowRefundConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-700">Confirm Refund</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-700 mb-4">
            Are you sure you want to <b>refund this order?</b>
            <br />
            This action cannot be undone.
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRefundConfirm(false)}
            >
              Cancel
            </Button>

            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={refundLoading}
              onClick={() => {
                if (refundOrderId) handleRefund(refundOrderId);
                setShowRefundConfirm(false);
              }}
            >
              {refundLoading ? "Processing..." : "Yes, Refund"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
