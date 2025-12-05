"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/common/DataTable";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";

// ShadCN Modal
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  mrp: string;
  total: string;
  bv: string;         // <--- ADD THIS
  total_bv?: string;  // <--- ADD THIS (optional)
}


interface FullOrder {
  id: number;
  order_number: string;
  payment_mode: string;
  total_mrp: string;
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

interface OrderStatus {
  orderId: string;
  date: string;
  totalAmount: number;
  paymentType: string;
  itemCount: number;
  status: string;
  fullData?: FullOrder; // store full order object
}

export default function OrderStatusPage() {
  const [orders, setOrders] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  const [selectedOrder, setSelectedOrder] = useState<FullOrder | null>(null);
  const [showModal, setShowModal] = useState(false);

  // ============================
  // FETCH ORDERS BY USER ID
  // ============================
  async function getOrders() {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = storedUser.user_id;

      if (!userId) {
        toast.error("User not logged in");
        setLoading(false);
        return;
      }

      const res = await axiosInstance.get(
        `${ProjectApiList.getAllOrder}?user_id=${userId}`
      );

      const mappedOrders = res.data.orders.map((o: FullOrder) => ({
        orderId: o.order_number,
        date: new Date(o.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        totalAmount: Number(o.total_mrp),
        paymentType: o.payment_mode.toUpperCase(),
        itemCount: o.order_items.length,
        status: o.status,
        fullData: o,
      }));

      setOrders(mappedOrders);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOrders();
  }, []);

  // Open modal
  function openOrderDetails(order: OrderStatus) {
    setSelectedOrder(order.fullData || null);
    setShowModal(true);
  }

  // ============================
  // TABLE COLUMNS
  // ============================
  const columns: Column<OrderStatus>[] = [
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
    { key: "date", label: "Order Date" },
    { key: "itemCount", label: "Items" },
    { key: "paymentType", label: "Payment Type" },
    {
      key: "totalAmount",
      label: "Total Amount (₹)",
      render: (value) => `₹ ${value.toFixed(2)}`,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${value === "delivered"
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
          {value.toUpperCase()}
        </span>
      ),
    },
  ];

  // ============================
  // FILTER + PAGINATION
  // ============================
  const filteredData = orders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(search.toLowerCase()) ||
      order.status.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / entries);
  const startIndex = (page - 1) * entries;
  const paginatedData = filteredData.slice(startIndex, startIndex + entries);

  return (
    <>
      {/* <AdminHeader /> */}

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-green-800">Order Status</h1>
            <p className="text-green-700 text-sm">Track your order progress.</p>
          </div>

          {/* <div className="bg-white rounded-xl shadow-md border overflow-hidden">
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
              emptyMessage="No orders found"
            />
          </div> */}

          {/* CUSTOM TABLE UI */}
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">

            {/* SEARCH + ENTRIES */}
            <div className="p-4 border-b flex justify-between items-center">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search order ID, status..."
                className="border px-3 py-2 rounded-md w-72 text-sm"
              />

              <div className="flex items-center gap-2 text-sm">
                <span>Show</span>
                <select
                  value={entries}
                  onChange={(e) => {
                    setEntries(Number(e.target.value));
                    setPage(1);
                  }}
                  className="border rounded px-2 py-1"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
                <span>entries</span>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-green-600 text-white uppercase text-xs tracking-wide">
                  <tr>
                    <th className="px-4 py-3 border-r">Order ID</th>
                    <th className="px-4 py-3 border-r">Order Date</th>
                    <th className="px-4 py-3 border-r">Items</th>
                    <th className="px-4 py-3 border-r">Payment Type</th>
                    <th className="px-4 py-3 border-r">Amount (₹)</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center">
                        Loading orders...
                      </td>
                    </tr>
                  ) : paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((order) => (
                      <tr key={order.orderId} className="border-b hover:bg-green-50">

                        <td className="px-4 py-3 border-r">
                          <button
                            onClick={() => openOrderDetails(order)}
                            className="text-green-700 font-semibold hover:underline"
                          >
                            {order.orderId}
                          </button>
                        </td>

                        <td className="px-4 py-3 border-r">{order.date}</td>

                        <td className="px-4 py-3 border-r">{order.itemCount}</td>

                        <td className="px-4 py-3 border-r">{order.paymentType}</td>

                        <td className="px-4 py-3 border-r">
                          ₹ {order.totalAmount.toFixed(2)}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === "delivered"
                                ? "bg-green-100 text-green-700"
                                : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-700"
                                  : order.status === "confirmed"
                                    ? "bg-purple-100 text-purple-700"
                                    : order.status === "pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                              }`}
                          >
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="p-4 border-t flex justify-between items-center">

              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className={`px-3 py-1 border rounded ${page === 1 ? "opacity-50" : "hover:bg-green-100"
                    }`}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-3 py-1 border rounded ${num === page
                        ? "bg-green-600 text-white"
                        : "hover:bg-green-100"
                      }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className={`px-3 py-1 border rounded ${page === totalPages ? "opacity-50" : "hover:bg-green-100"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================ */}
      {/* ORDER DETAILS MODAL */}
      {/* ============================ */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="!max-w-[75vw] !w-full  overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-green-800 text-lg">
              Order Details – {selectedOrder?.order_number}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* 3-column layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* ORDER INFO */}
                <div className="bg-green-50 p-4 rounded-xl border">
                  <h3 className="font-semibold text-green-800 mb-2">Order Info</h3>
                  <p className="text-sm"><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>

                  <p className="text-sm flex gap-2 items-center">
                    <strong>Status:</strong>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${selectedOrder.status === "delivered"
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

                  <p className="text-sm"><strong>Payment:</strong> {selectedOrder.payment_mode.toUpperCase()}</p>
                  <p className="text-sm"><strong>Total Amount:</strong> ₹{selectedOrder.total_mrp}</p>
                </div>

                {/* BILLING ADDRESS */}
                <div className="bg-white p-4 rounded-xl border">
                  <h3 className="font-semibold text-green-800 mb-2">Billing Address</h3>
                  <p className="text-sm">{selectedOrder.billing_full_name}</p>
                  <p className="text-sm">{selectedOrder.billing_email}</p>
                  <p className="text-sm">{selectedOrder.billing_contact}</p>
                  <p className="text-sm">
                    {selectedOrder.billing_city}, {selectedOrder.billing_state},{" "}
                    {selectedOrder.billing_country} - {selectedOrder.billing_pincode}
                  </p>
                </div>

                {/* SHIPPING */}
                <div className="bg-white p-4 rounded-xl border">
                  <h3 className="font-semibold text-green-800 mb-2">Shipping Address</h3>
                  <p className="text-sm">{selectedOrder.shipping_full_name}</p>
                  <p className="text-sm">{selectedOrder.shipping_email}</p>
                  <p className="text-sm">{selectedOrder.shipping_contact}</p>
                  <p className="text-sm">
                    {selectedOrder.shipping_city}, {selectedOrder.shipping_state},{" "}
                    {selectedOrder.shipping_country} - {selectedOrder.shipping_pincode}
                  </p>
                </div>
              </div>

              {/* ITEMS TABLE */}
              <div className="bg-white p-4 rounded-xl border">
                <h3 className="font-semibold text-green-800 mb-2">Items</h3>
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
                        <td className="p-2">{item.total_bv || (Number(item.bv) * item.quantity)}</td>
                      </tr>

                    ))}

                    {/* TOTAL ROW */}
                    <tr className="bg-green-50 font-semibold border-t">
                      <td className="p-2" colSpan={3}>Grand Total</td>
                      <td className="p-2 text-green-800">₹ {selectedOrder.total_mrp}</td>

                      {/* TOTAL BV */}
                      <td className="p-2" colSpan={2}>
                        Total BV:{" "}
                        <span className="text-green-800 font-bold">
                          {selectedOrder.order_items.reduce(
                            (sum, item) => sum + Number(item.bv) * Number(item.quantity),
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
