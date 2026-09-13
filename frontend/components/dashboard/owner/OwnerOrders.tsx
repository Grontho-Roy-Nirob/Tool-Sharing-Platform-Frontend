"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock,
  Loader2,
  MapPin,
  Package,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";

// ======================================================
// TOOL
// ======================================================

interface Tool {
  id: number;
  tool_name: string;
  brand: string;
  rental_price_per_day: string | number;
  location: string;
  tool_image?: string;
}

// ======================================================
// RENTER
// ======================================================

interface Renter {
  renterId: number;
  name: string;
  email: string;
  phone?: string;
}

// ======================================================
// ORDER
// ======================================================

interface Order {
  id: number;
  renter_id: number;
  renter: Renter;
  tools: Tool[];
  start_date: string;
  end_date: string;
  duration_days: number;
  total_amount: string | number;
  status: "pending" | "approved" | "rejected";
  message?: string | null;
  created_at: string;
}

// ======================================================
// COMPONENT
// ======================================================

export default function OwnerOrders({ ownerId }: { ownerId: number }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // ======================================================
  // GET OWNER ORDERS
  // ======================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // ================= GET OWNER ORDERS =================

      const response = await api.get<Order[]>(`/owner/orders/${ownerId}`);

      setOrders(response.data || []);
    } catch (error: any) {
      console.error("Failed to load owner orders:", error);

      const message = error?.response?.data?.message;

      if (Array.isArray(message)) {
        toast.error(message[0]);
      } else {
        toast.error(message || "Failed to load orders");
      }
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    if (ownerId) {
      fetchOrders();
    }
  }, [ownerId]);

  // ======================================================
  // APPROVE ORDER
  // ======================================================

  const handleApprove = async (orderId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this order?",
    );

    if (!confirmed) return;

    try {
      setActionLoading(orderId);

      const response = await api.put<Order>(`/owner/orders/${orderId}/approve`);

      // ================= UPDATE ORDER =================

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: response.data.status,
              }
            : order,
        ),
      );

      toast.success("Order approved successfully");
    } catch (error: any) {
      console.error("Approve order error:", error);

      const message = error?.response?.data?.message;

      if (Array.isArray(message)) {
        toast.error(message[0]);
      } else {
        toast.error(message || "Failed to approve order");
      }
    } finally {
      setActionLoading(null);
    }
  };

  // ======================================================
  // REJECT ORDER
  // ======================================================

  const handleReject = async (orderId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this order?",
    );

    if (!confirmed) return;

    try {
      setActionLoading(orderId);

      const response = await api.patch<Order>(
        `/owner/orders/${orderId}/reject`,
      );

      // ================= UPDATE ORDER =================

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: response.data.status,
              }
            : order,
        ),
      );

      toast.success("Order rejected successfully");
    } catch (error: any) {
      console.error("Reject order error:", error);

      const message = error?.response?.data?.message;

      if (Array.isArray(message)) {
        toast.error(message[0]);
      } else {
        toast.error(message || "Failed to reject order");
      }
    } finally {
      setActionLoading(null);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/50" />
      </div>
    );
  }

  // ======================================================
  // EMPTY
  // ======================================================

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06]">
          <Package className="h-5 w-5 text-white/30" />
        </div>

        <h3 className="text-base font-medium text-white">No orders yet</h3>

        <p className="mt-1 text-sm text-white/40">
          You do not have any tool rental orders yet.
        </p>
      </div>
    );
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}

      <div>
        <h2 className="text-lg font-semibold text-white">Rental Orders</h2>

        <p className="mt-1 text-sm text-white/40">
          {orders.length} {orders.length === 1 ? "order" : "orders"} for your
          tools
        </p>
      </div>

      {/* ================= ORDERS ================= */}

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
          >
            {/* ================= ORDER HEADER ================= */}

            <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-white">
                    Order #{order.id}
                  </h3>

                  <StatusBadge status={order.status} />
                </div>

                <p className="mt-1 text-xs text-white/30">
                  Ordered on {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-lg font-semibold text-white">
                  ৳{Number(order.total_amount).toLocaleString()}
                </p>

                <p className="text-xs text-white/30">Total amount</p>
              </div>
            </div>

            {/* ================= ORDER CONTENT ================= */}

            <div className="p-5">
              {/* ================= RENTER ================= */}

              <div className="mb-5 rounded-xl border border-white/[0.06] bg-black/20 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-white/40" />

                  <p className="text-sm font-medium text-white">
                    Renter Information
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {/* NAME */}

                  <div>
                    <p className="text-xs text-white/30">Name</p>

                    <p className="mt-1 text-sm text-white/70">
                      {order.renter?.name || "Unknown"}
                    </p>
                  </div>

                  {/* EMAIL */}

                  <div>
                    <p className="text-xs text-white/30">Email</p>

                    <p className="mt-1 break-all text-sm text-white/70">
                      {order.renter?.email || "-"}
                    </p>
                  </div>

                  {/* PHONE */}

                  <div>
                    <p className="text-xs text-white/30">Phone</p>

                    <p className="mt-1 text-sm text-white/70">
                      {order.renter?.phone || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ================= RENTAL INFO ================= */}

              <div className="mb-5 grid gap-3 sm:grid-cols-3">
                <InfoItem
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Start Date"
                  value={formatDate(order.start_date)}
                />

                <InfoItem
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="End Date"
                  value={formatDate(order.end_date)}
                />

                <InfoItem
                  icon={<Clock className="h-4 w-4" />}
                  label="Duration"
                  value={`${order.duration_days} ${
                    order.duration_days === 1 ? "day" : "days"
                  }`}
                />
              </div>

              {/* ================= TOOLS ================= */}

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-white/40" />

                  <p className="text-sm font-medium text-white">
                    Ordered Tools
                  </p>
                </div>

                <div className="space-y-3">
                  {order.tools?.map((tool) => (
                    <div
                      key={tool.id}
                      className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-black/20 p-4 sm:flex-row sm:items-center"
                    >
                      {/* ================= TOOL IMAGE ================= */}

                      {tool.tool_image ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${tool.tool_image}`}
                          alt={tool.tool_name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/[0.05]">
                          <Package className="h-5 w-5 text-white/20" />
                        </div>
                      )}

                      {/* ================= TOOL INFORMATION ================= */}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                          {tool.tool_name}
                        </p>

                        <p className="mt-1 text-xs text-white/40">
                          {tool.brand}
                        </p>

                        <div className="mt-2 flex items-center gap-1 text-xs text-white/30">
                          <MapPin className="h-3 w-3" />

                          {tool.location}
                        </div>
                      </div>

                      {/* ================= PRICE ================= */}

                      <div className="sm:text-right">
                        <p className="text-sm font-medium text-white">
                          ৳{Number(tool.rental_price_per_day).toLocaleString()}
                        </p>

                        <p className="text-xs text-white/30">per day</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ================= MESSAGE ================= */}

              {order.message && (
                <div className="mt-5 rounded-xl border border-white/[0.06] bg-black/20 p-4">
                  <p className="text-xs text-white/30">Renter Message</p>

                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {order.message}
                  </p>
                </div>
              )}

              {/* ================= ACTIONS ================= */}

              {order.status === "pending" && (
                <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
                  {/* ================= REJECT ================= */}

                  <button
                    type="button"
                    onClick={() => handleReject(order.id)}
                    disabled={actionLoading === order.id}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {actionLoading === order.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    Reject
                  </button>

                  {/* ================= APPROVE ================= */}

                  <button
                    type="button"
                    onClick={() => handleApprove(order.id)}
                    disabled={actionLoading === order.id}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {actionLoading === order.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ======================================================
// INFO ITEM
// ======================================================

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
      <div className="flex items-center gap-2 text-white/30">
        {icon}

        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-2 text-sm font-medium text-white/70">{value}</p>
    </div>
  );
}

// ======================================================
// DATE FORMAT
// ======================================================

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({ status }: { status: Order["status"] }) {
  const styles: Record<Order["status"], string> = {
    pending: "bg-yellow-500/10 text-yellow-400",
    approved: "bg-green-500/10 text-green-400",
    rejected: "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}
