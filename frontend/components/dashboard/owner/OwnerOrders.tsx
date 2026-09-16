"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock,
  Eye,
  EyeOff,
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
// OWNER ORDERS
// ======================================================

export default function OwnerOrders({ ownerId }: { ownerId: number }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [hiddenOrders, setHiddenOrders] = useState<number[]>([]);

  const [showHidden, setShowHidden] = useState(false);

  // ======================================================
  // LOAD HIDDEN ORDERS
  // ======================================================

  useEffect(() => {
    const savedHiddenOrders = localStorage.getItem("owner_hidden_orders");

    if (!savedHiddenOrders) return;

    try {
      const parsed = JSON.parse(savedHiddenOrders);

      if (Array.isArray(parsed)) {
        setHiddenOrders(parsed);
      }
    } catch (error) {
      console.error("Failed to load hidden orders:", error);

      setHiddenOrders([]);
    }
  }, []);

  // ======================================================
  // FETCH ORDERS
  // ======================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);

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
  // FETCH WHEN OWNER ID AVAILABLE
  // ======================================================

  useEffect(() => {
    if (ownerId) {
      fetchOrders();
    }
  }, [ownerId]);

  // ======================================================
  // HIDE ORDER
  // ======================================================

  const handleHideOrder = (orderId: number) => {
    const updatedHiddenOrders = hiddenOrders.includes(orderId)
      ? hiddenOrders
      : [...hiddenOrders, orderId];

    setHiddenOrders(updatedHiddenOrders);

    localStorage.setItem(
      "owner_hidden_orders",
      JSON.stringify(updatedHiddenOrders),
    );

    toast.success("Order hidden successfully");
  };

  // ======================================================
  // SHOW ORDER
  // ======================================================

  const handleShowOrder = (orderId: number) => {
    const updatedHiddenOrders = hiddenOrders.filter((id) => id !== orderId);

    setHiddenOrders(updatedHiddenOrders);

    localStorage.setItem(
      "owner_hidden_orders",
      JSON.stringify(updatedHiddenOrders),
    );

    toast.success("Order restored successfully");
  };

  // ======================================================
  // APPROVE
  // ======================================================

  const handleApprove = async (orderId: number) => {
    try {
      setActionLoading(orderId);

      const response = await api.put<Order>(`/owner/orders/${orderId}/approve`);

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
  // REJECT
  // ======================================================

  const handleReject = async (orderId: number) => {
    try {
      setActionLoading(orderId);

      const response = await api.patch<Order>(
        `/owner/orders/${orderId}/reject`,
      );

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
  // VISIBLE ORDERS
  // ======================================================

  const visibleOrders = orders.filter(
    (order) => !hiddenOrders.includes(order.id),
  );

  // ======================================================
  // HIDDEN ORDERS
  // ======================================================

  const hiddenOrderList = orders.filter((order) =>
    hiddenOrders.includes(order.id),
  );

  // ======================================================
  // CURRENT ORDERS
  // ======================================================

  const currentOrders = showHidden ? hiddenOrderList : visibleOrders;

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-[260px] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl bg-[#faf7f3] px-5 py-3">
          <Loader2 className="h-5 w-5 animate-spin text-[#c1502e]" />

          <span className="text-sm font-medium text-[#746d64]">
            Loading orders...
          </span>
        </div>
      </div>
    );
  }

  // ======================================================
  // MAIN
  // ======================================================

  return (
    <div className="space-y-6">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c1502e]">
            Orders
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#302e29]">
            Rental Orders
          </h2>

          <p className="mt-1 text-sm text-[#938c83]">
            Manage rental requests for your tools.
          </p>
        </div>

        {/* ==================================================
            TABS
        ================================================== */}

        <div className="flex w-full rounded-xl bg-[#f5f1ec] p-1 sm:w-fit">
          <button
            type="button"
            onClick={() => setShowHidden(false)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition sm:flex-none ${
              !showHidden
                ? "bg-white text-[#302e29] shadow-sm"
                : "text-[#918a81] hover:text-[#504a43]"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Visible
            <span
              className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                !showHidden
                  ? "bg-[#f8e9df] text-[#c1502e]"
                  : "bg-white/60 text-[#918a81]"
              }`}
            >
              {visibleOrders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowHidden(true)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition sm:flex-none ${
              showHidden
                ? "bg-white text-[#302e29] shadow-sm"
                : "text-[#918a81] hover:text-[#504a43]"
            }`}
          >
            <EyeOff className="h-3.5 w-3.5" />
            Hidden
            <span
              className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                showHidden
                  ? "bg-[#f8e9df] text-[#c1502e]"
                  : "bg-white/60 text-[#918a81]"
              }`}
            >
              {hiddenOrderList.length}
            </span>
          </button>
        </div>
      </div>

      {/* ==================================================
          SECTION INFO
      ================================================== */}

      <div className="flex items-center justify-between rounded-xl bg-[#faf8f5] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            {showHidden ? (
              <EyeOff className="h-3.5 w-3.5 text-[#8b847b]" />
            ) : (
              <Eye className="h-3.5 w-3.5 text-[#c1502e]" />
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-[#403b35]">
              {showHidden ? "Hidden Orders" : "Visible Orders"}
            </p>

            <p className="text-[11px] text-[#9b948b]">
              {showHidden
                ? "Orders hidden from the main list."
                : "Your current rental orders."}
            </p>
          </div>
        </div>

        <span className="hidden rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#655f57] sm:block">
          {currentOrders.length}{" "}
          {currentOrders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      {/* ==================================================
          EMPTY STATE
      ================================================== */}

      {currentOrders.length === 0 && (
        <div className="rounded-[22px] bg-[#faf8f5] px-5 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#f3ebe4]">
            {showHidden ? (
              <EyeOff className="h-6 w-6 text-[#c1502e]" />
            ) : (
              <Package className="h-6 w-6 text-[#c1502e]" />
            )}
          </div>

          <h3 className="text-sm font-bold text-[#302e29]">
            {showHidden ? "No hidden orders" : "No visible orders"}
          </h3>

          <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-[#8c857c]">
            {showHidden
              ? "Orders that you hide will appear here."
              : "You do not have any visible rental orders at the moment."}
          </p>
        </div>
      )}

      {/* ==================================================
          2 COLUMN ORDER GRID
      ================================================== */}

      {currentOrders.length > 0 && (
        <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-2">
          {currentOrders.map((order) => (
            <div
              key={order.id}
              className="flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_8px_28px_rgba(55,45,30,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(55,45,30,0.09)]"
            >
              {/* ==================================================
                  CARD HEADER
              ================================================== */}

              <div className="bg-[#faf8f5] px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-[#302e29]">
                        Order #{order.id}
                      </h3>

                      <StatusBadge status={order.status} />
                    </div>

                    <p className="mt-1 text-[10px] text-[#9b948b]">
                      Ordered on{" "}
                      {new Date(order.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* TOTAL */}

                  <div className="shrink-0 rounded-lg bg-white px-3 py-2 text-right shadow-sm">
                    <p className="text-sm font-bold text-[#302e29]">
                      ৳{Number(order.total_amount).toLocaleString()}
                    </p>

                    <p className="text-[9px] text-[#9b948b]">Total</p>
                  </div>
                </div>

                {/* HIDE / SHOW */}

                <div className="mt-3">
                  {showHidden ? (
                    <button
                      type="button"
                      onClick={() => handleShowOrder(order.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[11px] font-semibold text-[#655f57] shadow-sm transition hover:bg-[#edf7ee] hover:text-[#4f8a58]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Show Order
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleHideOrder(order.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[11px] font-semibold text-[#8b847b] shadow-sm transition hover:bg-[#fff0ea] hover:text-[#c1502e]"
                    >
                      <EyeOff className="h-3.5 w-3.5" />
                      Hide Order
                    </button>
                  )}
                </div>
              </div>

              {/* ==================================================
                  CARD BODY
              ================================================== */}

              <div className="flex flex-1 flex-col p-4">
                {/* ==================================================
                    RENTER INFORMATION
                ================================================== */}

                <div className="rounded-[17px] bg-[#faf8f5] p-3.5">
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f8e9df]">
                      <User className="h-3.5 w-3.5 text-[#c1502e]" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#302e29]">
                        Renter Information
                      </p>

                      <p className="text-[10px] text-[#9b948b]">
                        Customer contact
                      </p>
                    </div>
                  </div>

                  {/* EMAIL + PHONE ONLY */}

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {/* EMAIL */}

                    <div className="min-w-0 rounded-lg bg-white px-3 py-2.5">
                      <p className="text-[9px] font-medium uppercase tracking-wide text-[#aaa39a]">
                        Email
                      </p>

                      <p className="mt-1 truncate text-xs font-semibold text-[#4a443d]">
                        {order.renter?.email || "-"}
                      </p>
                    </div>

                    {/* PHONE */}

                    <div className="rounded-lg bg-white px-3 py-2.5">
                      <p className="text-[9px] font-medium uppercase tracking-wide text-[#aaa39a]">
                        Phone
                      </p>

                      <p className="mt-1 text-xs font-semibold text-[#4a443d]">
                        {order.renter?.phone || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ==================================================
                    RENTAL DETAILS
                ================================================== */}

                <div className="mt-4">
                  <div className="mb-2.5">
                    <p className="text-xs font-semibold text-[#302e29]">
                      Rental Details
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#9b948b]">
                      Rental period
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <InfoItem
                      icon={<CalendarDays className="h-3.5 w-3.5" />}
                      label="Start"
                      value={formatDate(order.start_date)}
                    />

                    <InfoItem
                      icon={<CalendarDays className="h-3.5 w-3.5" />}
                      label="End"
                      value={formatDate(order.end_date)}
                    />

                    <InfoItem
                      icon={<Clock className="h-3.5 w-3.5" />}
                      label="Duration"
                      value={`${order.duration_days} ${
                        order.duration_days === 1 ? "day" : "days"
                      }`}
                    />
                  </div>
                </div>

                {/* ==================================================
                    TOOLS
                ================================================== */}

                <div className="mt-4">
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f3f0eb]">
                      <Package className="h-3.5 w-3.5 text-[#756f66]" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#302e29]">
                        Ordered Tools
                      </p>

                      <p className="text-[10px] text-[#9b948b]">
                        Tools in this order
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.tools?.map((tool) => (
                      <div
                        key={tool.id}
                        className="flex items-center gap-2.5 rounded-[15px] bg-[#faf8f5] p-2.5"
                      >
                        {/* IMAGE */}

                        {tool.tool_image ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${tool.tool_image}`}
                            alt={tool.tool_name}
                            className="h-12 w-12 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#eee9e2]">
                            <Package className="h-4 w-4 text-[#a49d94]" />
                          </div>
                        )}

                        {/* TOOL INFO */}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-[#302e29]">
                            {tool.tool_name}
                          </p>

                          <p className="mt-0.5 truncate text-[10px] text-[#756f66]">
                            {tool.brand}
                          </p>

                          <div className="mt-1 flex items-center gap-1 text-[9px] text-[#9b948b]">
                            <MapPin className="h-2.5 w-2.5 shrink-0" />

                            <span className="truncate">{tool.location}</span>
                          </div>
                        </div>

                        {/* PRICE */}

                        <div className="shrink-0 text-right">
                          <p className="text-xs font-bold text-[#302e29]">
                            ৳
                            {Number(tool.rental_price_per_day).toLocaleString()}
                          </p>

                          <p className="text-[9px] text-[#9b948b]">/day</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ==================================================
                    MESSAGE
                ================================================== */}

                {order.message && (
                  <div className="mt-4 rounded-[15px] bg-[#f8f2ed] px-3.5 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#c1502e]">
                      Renter Message
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#665f56]">
                      {order.message}
                    </p>
                  </div>
                )}

                {/* ==================================================
                    ACTIONS
                ================================================== */}

                <div className="mt-auto pt-4">
                  {/* PENDING */}

                  {order.status === "pending" && (
                    <div className="flex gap-2 border-t border-[#f0ece7] pt-4">
                      {/* REJECT */}

                      <button
                        type="button"
                        onClick={() => handleReject(order.id)}
                        disabled={actionLoading === order.id}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#fff2ef] px-3 py-2.5 text-xs font-semibold text-[#c5533b] transition hover:bg-[#ffe7e1] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {actionLoading === order.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <X className="h-3.5 w-3.5" />
                        )}
                        Reject
                      </button>

                      {/* APPROVE */}

                      <button
                        type="button"
                        onClick={() => handleApprove(order.id)}
                        disabled={actionLoading === order.id}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#292722] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#3a3731] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {actionLoading === order.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        Approve
                      </button>
                    </div>
                  )}

                  {/* APPROVED */}

                  {order.status === "approved" && (
                    <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[#d9eadb] px-3 py-2.5 text-[11px] font-semibold text-[#356b3e]">
                      <Check className="h-3.5 w-3.5" />
                      Order has been approved
                    </div>
                  )}

                  {/* REJECTED */}

                  {order.status === "rejected" && (
                    <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[#f8dcd7] px-3 py-2.5 text-[11px] font-semibold text-[#a83f2e]">
                      <X className="h-3.5 w-3.5" />
                      Order has been rejected
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
    <div className="rounded-[14px] bg-[#faf8f5] px-2.5 py-2.5">
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#9b948b]">
          {icon}
        </div>

        <span className="text-[9px] font-medium text-[#9b948b]">{label}</span>
      </div>

      <p className="mt-1.5 text-center text-[10px] font-semibold leading-4 text-[#3d3933]">
        {value}
      </p>
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
    pending: "bg-[#fff5df] text-[#a36a12]",

    approved: "bg-[#d9eadb] text-[#356b3e]",

    rejected: "bg-[#f8dcd7] text-[#a83f2e]",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[9px] font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}
