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

// TOOL
interface Tool {
  id: number;
  tool_name: string;
  brand: string;
  rental_price_per_day: string | number;
  location: string;
  tool_image?: string;
}

// RENTER
interface Renter {
  renterId: number;
  name: string;
  email: string;
  phone?: string;
}

// ORDER
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

// OWNER ORDERS
export default function OwnerOrders({ ownerId }: { ownerId: number }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [hiddenOrders, setHiddenOrders] = useState<number[]>([]);
  const [showHidden, setShowHidden] = useState(false);

  // LOAD HIDDEN ORDERS
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

  // FETCH ORDERS
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

  // FETCH WHEN OWNER ID AVAILABLE
  useEffect(() => {
    if (ownerId) {
      fetchOrders();
    }
  }, [ownerId]);

  // HIDE ORDER
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

  // SHOW ORDER
  const handleShowOrder = (orderId: number) => {
    const updatedHiddenOrders = hiddenOrders.filter((id) => id !== orderId);

    setHiddenOrders(updatedHiddenOrders);

    localStorage.setItem(
      "owner_hidden_orders",
      JSON.stringify(updatedHiddenOrders),
    );

    toast.success("Order restored successfully");
  };

  // APPROVE
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

  // REJECT
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

  // VISIBLE ORDERS
  const visibleOrders = orders.filter(
    (order) => !hiddenOrders.includes(order.id),
  );

  // HIDDEN ORDERS
  const hiddenOrderList = orders.filter((order) =>
    hiddenOrders.includes(order.id),
  );

  // CURRENT ORDERS
  const currentOrders = showHidden ? hiddenOrderList : visibleOrders;

  // LOADING
  if (loading) {
    return (
      <div className="flex min-h-[260px] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-[#ead9d5] bg-[#fffaf8] px-5 py-3 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-[#6B1E1E]" />

          <span className="text-sm font-medium text-[#765c58]">
            Loading orders...
          </span>
        </div>
      </div>
    );
  }

  // MAIN
  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B3A3A]">
            Orders
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#321717]">
            Rental Orders
          </h2>

          <p className="mt-1 text-sm text-[#806b67]">
            Manage rental requests for your tools.
          </p>
        </div>

        {/* ================= TABS ================= */}

        <div className="flex w-full rounded-xl border border-[#e4d2ce] bg-[#f7efed] p-1 shadow-sm sm:w-fit">
          <button
            type="button"
            onClick={() => setShowHidden(false)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-all duration-200 sm:flex-none ${
              !showHidden
                ? "bg-[#6B1E1E] text-white shadow-[0_4px_12px_rgba(107,30,30,0.18)]"
                : "text-[#806965] hover:bg-[#fffaf8] hover:text-[#6B1E1E]"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Visible
            <span
              className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                !showHidden
                  ? "bg-white/15 text-white"
                  : "bg-[#eadbd7] text-[#704343]"
              }`}
            >
              {visibleOrders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowHidden(true)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-all duration-200 sm:flex-none ${
              showHidden
                ? "bg-[#6B1E1E] text-white shadow-[0_4px_12px_rgba(107,30,30,0.18)]"
                : "text-[#806965] hover:bg-[#fffaf8] hover:text-[#6B1E1E]"
            }`}
          >
            <EyeOff className="h-3.5 w-3.5" />
            Hidden
            <span
              className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                showHidden
                  ? "bg-white/15 text-white"
                  : "bg-[#eadbd7] text-[#704343]"
              }`}
            >
              {hiddenOrderList.length}
            </span>
          </button>
        </div>
      </div>

      {/* ================= SECTION INFO ================= */}

      <div className="flex items-center justify-between rounded-2xl border border-[#e7d8d4] bg-[#fffaf8] px-4 py-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ead9d5] bg-[#f7eeeb]">
            {showHidden ? (
              <EyeOff className="h-4 w-4 text-[#806965]" />
            ) : (
              <Eye className="h-4 w-4 text-[#6B1E1E]" />
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-[#3b1c1c]">
              {showHidden ? "Hidden Orders" : "Visible Orders"}
            </p>

            <p className="mt-0.5 text-[11px] text-[#806b67]">
              {showHidden
                ? "Orders hidden from the main list."
                : "Your current rental orders."}
            </p>
          </div>
        </div>

        <span className="hidden rounded-full border border-[#e7d8d4] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#705c58] shadow-sm sm:block">
          {currentOrders.length}{" "}
          {currentOrders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      {/* ================= EMPTY STATE ================= */}

      {currentOrders.length === 0 && (
        <div className="rounded-[24px] border border-[#e7d8d4] bg-[#fffaf8] px-5 py-16 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] border border-[#ead9d5] bg-[#f7eeeb]">
            {showHidden ? (
              <EyeOff className="h-6 w-6 text-[#6B1E1E]" />
            ) : (
              <Package className="h-6 w-6 text-[#6B1E1E]" />
            )}
          </div>

          <h3 className="text-sm font-bold text-[#321717]">
            {showHidden ? "No hidden orders" : "No visible orders"}
          </h3>

          <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-[#806b67]">
            {showHidden
              ? "Orders that you hide will appear here."
              : "You do not have any visible rental orders at the moment."}
          </p>
        </div>
      )}

      {/* ================= ORDER GRID ================= */}

      {currentOrders.length > 0 && (
        <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-2">
          {currentOrders.map((order) => (
            <div
              key={order.id}
              className="
                group
                flex h-full flex-col overflow-hidden
                rounded-[24px]
                border border-[#d9c4bf]
                bg-[#fffaf8]
                shadow-[0_8px_28px_rgba(72,27,27,0.08)]
                transition-all duration-300
                hover:-translate-y-1
                hover:border-[#b98c84]
                hover:bg-white
                hover:shadow-[0_18px_42px_rgba(72,27,27,0.14)]
              "
            >
              {/* ================= CARD HEADER ================= */}

              <div
                className="
                  border-b border-[#e6d4d0]
                  bg-gradient-to-br from-[#f8eeeb] to-[#fffaf8]
                  px-5 py-5
                  transition-all duration-300
                  group-hover:from-[#f5e7e3]
                  group-hover:to-[#fffaf8]
                "
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-[#321717]">
                        Order #{order.id}
                      </h3>

                      <StatusBadge status={order.status} />
                    </div>

                    <p className="mt-1 text-[10px] text-[#806b67]">
                      Ordered on{" "}
                      {new Date(order.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* TOTAL */}

                  <div
                    className="
                      shrink-0
                      rounded-xl
                      border border-[#dfc8c3]
                      bg-white
                      px-3.5 py-2.5
                      text-right
                      shadow-sm
                      transition-all duration-300
                      group-hover:border-[#c9a39b]
                      group-hover:shadow-md
                    "
                  >
                    <p className="text-sm font-bold text-[#6B1E1E]">
                      ৳{Number(order.total_amount).toLocaleString()}
                    </p>

                    <p className="text-[9px] text-[#8a7772]">Total</p>
                  </div>
                </div>
              </div>

              {/* ================= CARD BODY ================= */}

              <div className="flex flex-1 flex-col p-5">
                {/* ================= RENTER INFORMATION ================= */}

                <div
                  className="
                    rounded-[18px]
                    border border-[#e4d1cc]
                    bg-[#f8efec]
                    p-4
                    transition-all duration-300
                    group-hover:border-[#d7bbb5]
                    group-hover:bg-[#f7ece8]
                  "
                >
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e2cbc5] bg-white shadow-sm">
                      <User className="h-4 w-4 text-[#6B1E1E]" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#3b1c1c]">
                        Renter Information
                      </p>

                      <p className="text-[10px] text-[#806b67]">
                        Customer contact
                      </p>
                    </div>
                  </div>

                  {/* EMAIL + PHONE */}

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {/* EMAIL */}

                    <div className="min-w-0 rounded-xl border border-[#e6d5d0] bg-white px-3 py-2.5 shadow-sm">
                      <p className="text-[9px] font-medium uppercase tracking-wide text-[#9a8580]">
                        Email
                      </p>

                      <p className="mt-1 truncate text-xs font-semibold text-[#4b3030]">
                        {order.renter?.email || "-"}
                      </p>
                    </div>

                    {/* PHONE */}

                    <div className="rounded-xl border border-[#e6d5d0] bg-white px-3 py-2.5 shadow-sm">
                      <p className="text-[9px] font-medium uppercase tracking-wide text-[#9a8580]">
                        Phone
                      </p>

                      <p className="mt-1 text-xs font-semibold text-[#4b3030]">
                        {order.renter?.phone || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ================= RENTAL DETAILS ================= */}

                <div className="mt-5">
                  <div className="mb-2.5">
                    <p className="text-xs font-bold text-[#3b1c1c]">
                      Rental Details
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#806b67]">
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

                {/* ================= TOOLS ================= */}

                <div className="mt-5">
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#e2d0cb] bg-[#f7eeeb]">
                      <Package className="h-3.5 w-3.5 text-[#765b56]" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#3b1c1c]">
                        Ordered Tools
                      </p>

                      <p className="text-[10px] text-[#806b67]">
                        Tools in this order
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.tools?.map((tool) => (
                      <div
                        key={tool.id}
                        className="
                          flex items-center gap-2.5
                          rounded-[16px]
                          border border-[#e2d0cb]
                          bg-[#faf3f0]
                          p-2.5
                          transition-all duration-300
                          hover:border-[#cda9a0]
                          hover:bg-[#f6e9e5]
                          hover:shadow-sm
                        "
                      >
                        {/* IMAGE */}

                        {tool.tool_image ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${tool.tool_image}`}
                            alt={tool.tool_name}
                            className="h-12 w-12 shrink-0 rounded-xl border border-[#dfc9c4] object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#dfc9c4] bg-[#f1e2de]">
                            <Package className="h-4 w-4 text-[#92736d]" />
                          </div>
                        )}

                        {/* TOOL INFO */}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-[#3b1c1c]">
                            {tool.tool_name}
                          </p>

                          <p className="mt-0.5 truncate text-[10px] text-[#806b67]">
                            {tool.brand}
                          </p>

                          <div className="mt-1 flex items-center gap-1 text-[9px] text-[#907b76]">
                            <MapPin className="h-2.5 w-2.5 shrink-0" />

                            <span className="truncate">{tool.location}</span>
                          </div>
                        </div>

                        {/* PRICE */}

                        <div className="shrink-0 text-right">
                          <p className="text-xs font-bold text-[#6B1E1E]">
                            ৳
                            {Number(tool.rental_price_per_day).toLocaleString()}
                          </p>

                          <p className="text-[9px] text-[#927c77]">/day</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ================= MESSAGE ================= */}

                {order.message && (
                  <div className="mt-5 rounded-[16px] border border-[#e2ccc7] bg-[#f7ece9] px-4 py-3.5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#8B3A3A]">
                      Renter Message
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#6e5955]">
                      {order.message}
                    </p>
                  </div>
                )}

                {/* ================= BOTTOM ACTION AREA ================= */}

                <div className="mt-auto pt-5">
                  {/* APPROVE / REJECT */}

                  {order.status === "pending" && (
                    <div className="border-t border-[#e4d3cf] pt-4">
                      <div className="flex gap-2">
                        {/* REJECT */}

                        <button
                          type="button"
                          onClick={() => handleReject(order.id)}
                          disabled={actionLoading === order.id}
                          className="
                            inline-flex flex-1
                            items-center justify-center gap-1.5
                            rounded-xl
                            border border-[#e0bcb5]
                            bg-[#fff6f3]
                            px-3 py-2.5
                            text-xs font-semibold
                            text-[#9a4940]
                            transition-all duration-300
                            hover:border-[#b96b61]
                            hover:bg-[#fce9e5]
                            hover:text-[#7e3028]
                            hover:shadow-sm
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                          "
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
                          className="
                            inline-flex flex-1
                            items-center justify-center gap-1.5
                            rounded-xl
                            bg-[#6B1E1E]
                            px-3 py-2.5
                            text-xs font-semibold
                            text-white
                            shadow-[0_4px_12px_rgba(107,30,30,0.16)]
                            transition-all duration-300
                            hover:bg-[#541515]
                            hover:shadow-[0_7px_18px_rgba(107,30,30,0.24)]
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                          "
                        >
                          {actionLoading === order.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          Approve
                        </button>
                      </div>
                    </div>
                  )}

                  {/* APPROVED */}

                  {order.status === "approved" && (
                    <div className="border-t border-[#e4d3cf] pt-4">
                      <div className="flex items-center justify-center gap-1.5 rounded-xl border border-[#bdd3c0] bg-[#edf7ef] px-3 py-2.5 text-[11px] font-semibold text-[#356b3e]">
                        <Check className="h-3.5 w-3.5" />
                        Order has been approved
                      </div>
                    </div>
                  )}

                  {/* REJECTED */}

                  {order.status === "rejected" && (
                    <div className="border-t border-[#e4d3cf] pt-4">
                      <div className="flex items-center justify-center gap-1.5 rounded-xl border border-[#e1bdb7] bg-[#fff0ed] px-3 py-2.5 text-[11px] font-semibold text-[#a83f2e]">
                        <X className="h-3.5 w-3.5" />
                        Order has been rejected
                      </div>
                    </div>
                  )}

                  {/* ================= HIDE / SHOW ORDER ================= */}

                  <div
                    className={`${
                      order.status === "pending" ||
                      order.status === "approved" ||
                      order.status === "rejected"
                        ? "mt-3"
                        : ""
                    }`}
                  >
                    {showHidden ? (
                      <button
                        type="button"
                        onClick={() => handleShowOrder(order.id)}
                        className="
                          group/show
                          inline-flex
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-[#d8c1bc]
                          bg-[#fffaf8]
                          px-3
                          py-2.5
                          text-[11px]
                          font-semibold
                          text-[#765f5b]
                          transition-all
                          duration-300
                          hover:border-[#6B1E1E]
                          hover:bg-[#6B1E1E]
                          hover:text-white
                          hover:shadow-[0_7px_18px_rgba(107,30,30,0.18)]
                        "
                      >
                        <Eye
                          className="
                            h-3.5
                            w-3.5
                            transition-transform
                            duration-300
                            group-hover/show:scale-110
                          "
                        />
                        Show Order
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleHideOrder(order.id)}
                        className="
                              group/hide
                              inline-flex
                              w-full
                              items-center
                              justify-center
                              gap-2
                              rounded-xl
                              border
                              border-[#d8c1bc]
                              bg-[#fffaf8]
                              px-3
                              py-2.5
                              text-[11px]
                              font-semibold
                              text-[#765f5b]
                              transition-all
                              duration-300
                              hover:border-[#3D0B0B]
                              hover:bg-[#3D0B0B]
                              hover:text-white
                              hover:shadow-[0_8px_22px_rgba(61,11,11,0.28)]
                            "
                      >
                        <EyeOff
                          className="
                        h-3.5
                        w-3.5
                        transition-transform
                        duration-300
                        group-hover/hide:scale-110
                      "
                        />
                        Hide Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ================= INFO ITEM =================

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
    <div
      className="
        rounded-[15px]
        border border-[#e2d0cb]
        bg-[#faf3f0]
        px-2.5 py-2.5
        transition-all duration-300
        hover:border-[#cda9a0]
        hover:bg-[#f6e9e5]
      "
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#e1cdc8] bg-white text-[#806560] shadow-sm">
          {icon}
        </div>

        <span className="text-[9px] font-medium text-[#907b76]">{label}</span>
      </div>

      <p className="mt-1.5 text-center text-[10px] font-bold leading-4 text-[#4a2929]">
        {value}
      </p>
    </div>
  );
}

// ================= DATE FORMAT =================

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ================= STATUS BADGE =================

function StatusBadge({ status }: { status: Order["status"] }) {
  const styles: Record<Order["status"], string> = {
    pending: "border border-[#e5cda3] bg-[#fff6df] text-[#996b1f]",

    approved: "border border-[#bdd3c0] bg-[#edf7ef] text-[#356b3e]",

    rejected: "border border-[#e0bdb7] bg-[#fff0ed] text-[#a83f2e]",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[9px] font-bold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}
