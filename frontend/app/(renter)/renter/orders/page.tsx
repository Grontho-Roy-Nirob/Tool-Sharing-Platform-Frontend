"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Package,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import RenterProtected from "../../../../components/authForm/RenterProtected";
import RenterSidebar from "../../../../components/dashboard/renter/RenterSidebar";
import RenterHeader from "../../../../components/dashboard/renter/RenterHeader";
import api from "../../../../lib/axios";

interface RenterToken {
  sub: number;
  email: string;
  role: number;
  iat: number;
  exp: number;
}

interface Renter {
  renterId: number;
  fullName: string;
  email: string;
  phone?: string;
  profileImage?: string;
}

interface Tool {
  id: number;
  name?: string;
  title?: string;
  tool_name?: string;
  image?: string;
  image_url?: string;
  rental_price_per_day?: number | string;
}

interface RenterOrder {
  order_id: number;
  renter_id: number;

  tools: Tool[];

  start_date: string;
  end_date: string;

  duration_days: number;
  total_amount: number | string;

  status: string;
  message?: string | null;

  created_at: string;
  updated_at?: string;
}

const statusConfig: Record<
  string,
  {
    label: string;
    className: string;
    icon: typeof Clock3;
  }
> = {
  pending: {
    label: "Pending",
    className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    icon: Clock3,
  },

  approved: {
    label: "Approved",
    className: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    icon: CheckCircle2,
  },

  active: {
    label: "Active",
    className: "border-green-500/20 bg-green-500/10 text-green-400",
    icon: CheckCircle2,
  },

  completed: {
    label: "Completed",
    className: "border-white/10 bg-white/5 text-[#d4d4d8]",
    icon: CheckCircle2,
  },

  rejected: {
    label: "Rejected",
    className: "border-red-500/20 bg-red-500/10 text-red-400",
    icon: XCircle,
  },
};

function formatDate(date?: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusConfig(status?: string) {
  const normalizedStatus = status?.toLowerCase() ?? "pending";

  return (
    statusConfig[normalizedStatus] ?? {
      label: status || "Unknown",
      className: "border-white/10 bg-white/5 text-[#d4d4d8]",
      icon: Clock3,
    }
  );
}

function getToolName(tool: Tool) {
  return tool.name || tool.title || tool.tool_name || `Tool #${tool.id}`;
}

export default function RenterOrdersPage() {
  const [orders, setOrders] = useState<RenterOrder[]>([]);
  const [renter, setRenter] = useState<Renter | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(false);

        const token = localStorage.getItem("access_token");

        if (!token) {
          return;
        }

        const decoded = jwtDecode<RenterToken>(token);
        const renterId = decoded.sub;
        const profileResponse = await api.get<Renter>(`/renter/${renterId}`);
        setRenter(profileResponse.data);
        const ordersResponse = await api.get<RenterOrder[]>("/renter/orders");
        setOrders(ordersResponse.data ?? []);
      } catch (error) {
        console.error("Failed to load orders:", error);
        setError(true);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <RenterProtected>
      <div className="min-h-screen bg-[#090a0c] text-white">
        <RenterSidebar />

        <div className="lg:pl-64">
          <RenterHeader renter={renter} />

          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                My Orders
              </h1>

              <p className="mt-2 text-sm text-[#9ca3af]">
                View and track all your rental orders.
              </p>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex min-h-80 items-center justify-center rounded-2xl border border-[#292b30] bg-[#0d0e10]">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-7 w-7 animate-spin text-[#9ca3af]" />

                  <p className="text-sm text-[#71717a]">
                    Loading your orders...
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-[#292b30] bg-[#0d0e10] px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
                  <XCircle className="h-7 w-7 text-red-400" />
                </div>

                <h2 className="mt-4 text-lg font-semibold">
                  Unable to load orders
                </h2>

                <p className="mt-2 max-w-md text-sm text-[#71717a]">
                  Something went wrong while loading your rental orders.
                </p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#e4e4e7]"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && orders.length === 0 && (
              <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-[#292b30] bg-[#0d0e10] px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                  <Package className="h-8 w-8 text-[#71717a]" />
                </div>

                <h2 className="mt-5 text-lg font-semibold">
                  No rental orders yet
                </h2>

                <p className="mt-2 max-w-md text-sm text-[#71717a]">
                  You haven't requested any tools yet. Explore available tools
                  and place your first rental order.
                </p>

                <a
                  href="/tools"
                  className="mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#e4e4e7]"
                >
                  Explore Tools
                </a>
              </div>
            )}

            {/* Orders */}
            {!loading && !error && orders.length > 0 && (
              <div className="space-y-5">
                {orders.map((order) => {
                  const status = getStatusConfig(order.status);
                  const StatusIcon = status.icon;

                  return (
                    <article
                      key={order.order_id}
                      className="rounded-2xl border border-[#292b30] bg-[#0d0e10] p-5 sm:p-6"
                    >
                      {/* Order top */}
                      <div className="flex flex-col gap-4 border-b border-[#292b30] pb-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs text-[#52525b]">Order ID</p>

                          <h2 className="mt-1 text-lg font-semibold">
                            #{order.order_id}
                          </h2>
                        </div>

                        <span
                          className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${status.className}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </span>
                      </div>

                      {/* Tools */}
                      <div className="mt-5">
                        <p className="mb-3 text-sm font-medium text-[#d4d4d8]">
                          Requested Tools
                        </p>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {order.tools?.map((tool) => (
                            <div
                              key={tool.id}
                              className="flex items-center gap-3 rounded-xl border border-[#292b30] bg-[#090a0c] p-3"
                            >
                              {tool.image || tool.image_url ? (
                                <img
                                  src={tool.image || tool.image_url}
                                  alt={getToolName(tool)}
                                  className="h-12 w-12 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/5">
                                  <Package className="h-5 w-5 text-[#71717a]" />
                                </div>
                              )}

                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-white">
                                  {getToolName(tool)}
                                </p>

                                <p className="mt-0.5 text-xs text-[#52525b]">
                                  Tool #{tool.id}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order details */}
                      <div className="mt-5 grid gap-4 border-t border-[#292b30] pt-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                            <CalendarDays className="h-4 w-4 text-[#9ca3af]" />
                          </div>

                          <div>
                            <p className="text-xs text-[#52525b]">Start Date</p>

                            <p className="mt-0.5 text-sm text-[#d4d4d8]">
                              {formatDate(order.start_date)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                            <CalendarDays className="h-4 w-4 text-[#9ca3af]" />
                          </div>

                          <div>
                            <p className="text-xs text-[#52525b]">End Date</p>

                            <p className="mt-0.5 text-sm text-[#d4d4d8]">
                              {formatDate(order.end_date)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                            <Clock3 className="h-4 w-4 text-[#9ca3af]" />
                          </div>

                          <div>
                            <p className="text-xs text-[#52525b]">Duration</p>

                            <p className="mt-0.5 text-sm text-[#d4d4d8]">
                              {order.duration_days}{" "}
                              {order.duration_days === 1 ? "day" : "days"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-[#52525b]">Total Amount</p>

                          <p className="mt-0.5 text-lg font-semibold text-white">
                            ৳
                            {Number(order.total_amount).toLocaleString("en-BD")}
                          </p>
                        </div>
                      </div>

                      {/* Message */}
                      {order.message && (
                        <div className="mt-5 rounded-xl border border-[#292b30] bg-[#090a0c] p-4">
                          <p className="text-xs font-medium text-[#71717a]">
                            Message
                          </p>

                          <p className="mt-1 text-sm leading-6 text-[#d4d4d8]">
                            {order.message}
                          </p>
                        </div>
                      )}

                      {/* Created date */}
                      <p className="mt-5 text-xs text-[#52525b]">
                        Ordered on {formatDate(order.created_at)}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </RenterProtected>
  );
}
