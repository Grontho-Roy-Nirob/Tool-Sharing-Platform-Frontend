"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Eye,
  MapPin,
  Package,
  XCircle,
} from "lucide-react";

export type OrderStatus =
  | "pending"
  | "approved"
  | "active"
  | "completed"
  | "rejected";

export interface RenterOrder {
  id: number;
  order_id?: number;
  tools?: any[];
  tool_name?: string;
  start_date?: string;
  end_date?: string;
  duration_days?: number;
  total_amount?: number | string;
  total?: number | string;
  status: OrderStatus | string;
  message?: string;
  location?: string;
  payment_status?: "unpaid" | "paid" | "cancelled";
}

interface RecentOrdersProps {
  orders: RenterOrder[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return {
          label: "Approved",
          icon: CheckCircle2,
          className: "bg-[#fff3df] text-[#b87516]",
        };

      case "active":
        return {
          label: "Active",
          icon: CheckCircle2,
          className: "bg-[#eaf4ec] text-[#356b3e]",
        };

      case "completed":
        return {
          label: "Completed",
          icon: CheckCircle2,
          className: "bg-[#eaf4ec] text-[#356b3e]",
        };

      case "rejected":
        return {
          label: "Rejected",
          icon: XCircle,
          className: "bg-[#fdf0eb] text-[#C1502E]",
        };

      default:
        return {
          label: "Pending",
          icon: Clock,
          className: "bg-[#f5f3ef] text-[#6b6258]",
        };
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";

    try {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-[0_10px_35px_rgba(41,39,34,0.06)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f5f3ef]">
          <Package className="h-7 w-7 text-[#E8A33D]" />
        </div>

        <h3 className="mt-4 text-lg font-bold text-[#292722]">
          No Recent Orders
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          You have not placed any rental orders yet.
        </p>

        <Link
          href="/tools"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#E8A33D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d9952f]"
        >
          Browse Tools
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const statusConfig = getStatusConfig(order.status);
        const StatusIcon = statusConfig.icon;

        const orderId = order.order_id ?? order.id;

        const toolName =
          order.tool_name || order.tools?.[0]?.tool_name || "Tool Rental";

        const total = order.total_amount ?? order.total ?? 0;

        const isPaid = order.payment_status === "paid";

        return (
          <div
            key={order.id}
            className="rounded-2xl border border-[#eee9e1] bg-white p-5 shadow-[0_8px_25px_rgba(41,39,34,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(41,39,34,0.08)]"
          >
            {/* TOP */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f5f3ef]">
                  <Package className="h-5 w-5 text-[#E8A33D]" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Order #{orderId}
                  </p>

                  <h3 className="mt-1 text-base font-bold text-[#292722]">
                    {toolName}
                  </h3>
                </div>
              </div>

              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${statusConfig.className}`}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {statusConfig.label}
              </div>
            </div>

            {/* DETAILS */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-[#faf9f7] p-3">
                <div className="flex items-center gap-2 text-gray-500">
                  <CalendarDays className="h-4 w-4" />

                  <span className="text-xs font-medium">Start Date</span>
                </div>

                <p className="mt-1 text-sm font-semibold text-[#292722]">
                  {formatDate(order.start_date)}
                </p>
              </div>

              <div className="rounded-xl bg-[#faf9f7] p-3">
                <div className="flex items-center gap-2 text-gray-500">
                  <CalendarDays className="h-4 w-4" />

                  <span className="text-xs font-medium">End Date</span>
                </div>

                <p className="mt-1 text-sm font-semibold text-[#292722]">
                  {formatDate(order.end_date)}
                </p>
              </div>

              <div className="rounded-xl bg-[#faf9f7] p-3">
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="h-4 w-4" />

                  <span className="text-xs font-medium">Duration</span>
                </div>

                <p className="mt-1 text-sm font-semibold text-[#292722]">
                  {order.duration_days
                    ? `${order.duration_days} day${
                        order.duration_days > 1 ? "s" : ""
                      }`
                    : "N/A"}
                </p>
              </div>

              <div className="rounded-xl bg-[#faf9f7] p-3">
                <div className="flex items-center gap-2 text-gray-500">
                  <CreditCard className="h-4 w-4" />

                  <span className="text-xs font-medium">Total</span>
                </div>

                <p className="mt-1 text-sm font-bold text-[#292722]">
                  ৳{Number(total).toFixed(2)}
                </p>
              </div>
            </div>

            {/* LOCATION */}
            {order.location && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4 text-[#C1502E]" />
                <span>{order.location}</span>
              </div>
            )}

            {/* PAYMENT STATUS */}
            {order.payment_status && (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f5f3ef] px-4 py-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[#E8A33D]" />

                  <span className="text-sm font-medium text-gray-600">
                    Payment
                  </span>
                </div>

                {isPaid ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#356b3e]">
                    <CheckCircle2 className="h-4 w-4" />
                    PAID
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-[#C1502E]">
                    {order.payment_status.toUpperCase()}
                  </span>
                )}
              </div>
            )}

            {/* ACTIONS */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/renter/orders/${orderId}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#ddd7ce] bg-white px-4 py-3 text-sm font-semibold text-[#292722] transition-all duration-300 hover:bg-[#f8f6f2]"
              >
                <Eye className="h-4 w-4" />
                View Details
              </Link>

              {/* PAID */}
              {isPaid && (
                <button
                  type="button"
                  disabled
                  className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#9fc4a5] px-4 py-3 text-sm font-semibold text-white opacity-90"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  PAID
                </button>
              )}

              {/* PAYMENT SHOULD BE STARTED FROM /renter/orders */}
              {!isPaid && order.status?.toLowerCase() === "approved" && (
                <Link
                  href="/renter/orders"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#E8A33D] px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#d9952f]"
                >
                  <CreditCard className="h-4 w-4" />
                  Pay with Stripe
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
