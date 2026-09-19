"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  CreditCard,
  Eye,
  EyeOff,
  Loader2,
  MapPin,
  Package,
} from "lucide-react";
import { toast } from "sonner";

export type OrderStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "completed";

export type PaymentStatus = "unpaid" | "paid" | "cancelled";

export interface OrderTool {
  id: number;
  tool_name: string;
  description: string;
  brand: string;
  condition: string;
  rental_price_per_day: number;
  location: string;
  is_available: boolean;
  status: string;
  tool_image: string;
  category_id: number;
}

export interface RenterOrder {
  id: number;
  renter_id: number;
  tools: OrderTool[];
  start_date: string;
  end_date: string;
  duration_days: number;
  total_amount: number;
  status: OrderStatus;

  // ================= PAYMENT STATUS =================

  payment_status: PaymentStatus;

  message: string | null;
  created_at: string;
  updated_at: string;
}

interface RecentOrdersProps {
  orders: RenterOrder[];

  onPaymentStatusChange?: (
    orderId: number,
    paymentStatus: PaymentStatus,
  ) => void;
}

interface PaymentStatusResponse {
  payment_status: PaymentStatus;
}

// ======================================================
// ORDER STATUS STYLE
// ======================================================

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-[#fff1d6] text-[#8a5a00]",
  approved: "bg-[#e4f3e7] text-[#2f6b3a]",
  rejected: "bg-[#f8dddd] text-[#A82020]",
  active: "bg-[#e4f3e7] text-[#2f6b3a]",
  completed: "bg-[#eee5f5] text-[#68477f]",
};

// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ======================================================
// ORDER STATUS BADGE
// ======================================================

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[status]}`}
    >
      {status}
    </span>
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
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-[#A82020]">{icon}</div>

      <div>
        <p className="text-xs text-[#8b4a4a]">{label}</p>

        <p className="mt-1 text-sm font-semibold text-[#351818]">{value}</p>
      </div>
    </div>
  );
}

// ======================================================
// TOOL IMAGE
// ======================================================

function getToolImage(image: string) {
  if (!image) {
    return "";
  }

  if (image.startsWith("http")) {
    return image;
  }

  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${image}`;
}

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function RecentOrders({
  orders,
  onPaymentStatusChange,
}: RecentOrdersProps) {
  // ======================================================
  // HIDDEN ORDERS
  // ======================================================

  const [hiddenOrderIds, setHiddenOrderIds] = useState<number[]>([]);

  const [activeTab, setActiveTab] = useState<"visible" | "hidden">("visible");

  // ======================================================
  // PAYMENT LOADING
  // ======================================================

  const [paymentLoadingId, setPaymentLoadingId] = useState<number | null>(null);

  // ======================================================
  // LOCAL PAYMENT STATUS
  //
  // IMPORTANT:
  // Each order has its own payment status.
  //
  // Example:
  // {
  //   1: "paid",
  //   2: "paid",
  //   3: "unpaid"
  // }
  // ======================================================

  const [paymentStatuses, setPaymentStatuses] = useState<
    Record<number, PaymentStatus>
  >({});

  // ======================================================
  // LOAD HIDDEN ORDERS
  // ======================================================

  useEffect(() => {
    const savedHiddenOrders = localStorage.getItem("renter_hidden_orders");

    if (savedHiddenOrders) {
      try {
        const parsed = JSON.parse(savedHiddenOrders);

        if (Array.isArray(parsed)) {
          setHiddenOrderIds(parsed);
        }
      } catch {
        setHiddenOrderIds([]);
      }
    }
  }, []);

  // ======================================================
  // INITIALIZE PAYMENT STATUS
  //
  // IMPORTANT FIX:
  //
  // Do NOT recreate the whole paymentStatuses object
  // every time orders change.
  //
  // Otherwise:
  //
  // Order #1 = PAID
  // Order #2 = PAID
  //
  // refresh হলে Order #1 আবার UNPAID হয়ে যেতে পারে.
  //
  // এখানে আগের PAID/CANCELLED status preserve করা হচ্ছে.
  // ======================================================

  useEffect(() => {
    setPaymentStatuses((currentStatuses) => {
      const updatedStatuses: Record<number, PaymentStatus> = {
        ...currentStatuses,
      };

      orders.forEach((order) => {
        const existingStatus = currentStatuses[order.id];

        // ================================================
        // NEVER CHANGE PAID
        // ================================================

        if (existingStatus === "paid") {
          updatedStatuses[order.id] = "paid";
          return;
        }

        // ================================================
        // NEVER CHANGE CANCELLED
        // ================================================

        if (existingStatus === "cancelled") {
          updatedStatuses[order.id] = "cancelled";
          return;
        }

        // ================================================
        // NEW ORDER
        // ================================================

        updatedStatuses[order.id] = order.payment_status || "unpaid";
      });

      return updatedStatuses;
    });
  }, [orders]);

  // ======================================================
  // CHECK PAYMENT STATUS
  // ======================================================

  const checkPaymentStatus = async (orderId: number) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/status/${orderId}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",

            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        },
      );

      if (!response.ok) {
        return;
      }

      const data: PaymentStatusResponse = await response.json();

      if (
        data?.payment_status === "paid" ||
        data?.payment_status === "cancelled" ||
        data?.payment_status === "unpaid"
      ) {
        setPaymentStatuses((currentStatuses) => {
          const existingStatus = currentStatuses[orderId];

          // ==============================================
          // IMPORTANT:
          //
          // If this specific order is already PAID,
          // don't allow it to become UNPAID.
          // ==============================================

          if (existingStatus === "paid" && data.payment_status !== "paid") {
            return currentStatuses;
          }

          // ==============================================
          // If this specific order is CANCELLED,
          // don't allow it to become UNPAID.
          // ==============================================

          if (
            existingStatus === "cancelled" &&
            data.payment_status === "unpaid"
          ) {
            return currentStatuses;
          }

          return {
            ...currentStatuses,
            [orderId]: data.payment_status,
          };
        });

        onPaymentStatusChange?.(orderId, data.payment_status);
      }
    } catch (error) {
      console.error(
        `Failed to check payment status for order ${orderId}:`,
        error,
      );
    }
  };

  // ======================================================
  // CHECK PAYMENT STATUS AFTER RETURNING FROM STRIPE
  // ======================================================

  useEffect(() => {
    const paymentOrderId = localStorage.getItem("payment_order_id");

    if (!paymentOrderId) {
      return;
    }

    const orderId = Number(paymentOrderId);

    if (!orderId) {
      return;
    }

    let attempts = 0;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const checkStatus = async () => {
      attempts++;

      await checkPaymentStatus(orderId);

      // Stripe webhook may take some time
      if (attempts < 15) {
        timeoutId = setTimeout(checkStatus, 2000);
      }
    };

    checkStatus();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // ======================================================
  // CHECK UNPAID APPROVED ORDERS PERIODICALLY
  // ======================================================

  useEffect(() => {
    const approvedUnpaidOrders = orders.filter((order) => {
      const currentStatus =
        paymentStatuses[order.id] || order.payment_status || "unpaid";

      return order.status === "approved" && currentStatus === "unpaid";
    });

    if (approvedUnpaidOrders.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      approvedUnpaidOrders.forEach((order) => {
        checkPaymentStatus(order.id);
      });
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [orders, paymentStatuses]);

  // ======================================================
  // HIDE ORDER
  // ======================================================

  const hideOrder = (orderId: number) => {
    const updatedIds = hiddenOrderIds.includes(orderId)
      ? hiddenOrderIds
      : [...hiddenOrderIds, orderId];

    setHiddenOrderIds(updatedIds);

    localStorage.setItem("renter_hidden_orders", JSON.stringify(updatedIds));

    toast.success("Order hidden successfully");
  };

  // ======================================================
  // SHOW ORDER
  // ======================================================

  const showOrder = (orderId: number) => {
    const updatedIds = hiddenOrderIds.filter((id) => id !== orderId);

    setHiddenOrderIds(updatedIds);

    localStorage.setItem("renter_hidden_orders", JSON.stringify(updatedIds));

    toast.success("Order is visible again");
  };

  // ======================================================
  // STRIPE PAYMENT
  // ======================================================

  const handlePayment = async (orderId: number) => {
    try {
      setPaymentLoadingId(orderId);

      const token = localStorage.getItem("access_token");

      // Save CURRENT order ID only
      localStorage.setItem("payment_order_id", String(orderId));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/create`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },

          body: JSON.stringify({
            order_id: orderId,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Payment creation failed");
      }

      // ==================================================
      // STRIPE CHECKOUT URL
      // ==================================================

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      // ==================================================
      // ALTERNATIVE CHECKOUT URL
      // ==================================================

      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }

      throw new Error("Stripe checkout URL not found");
    } catch (error) {
      console.error("Payment error:", error);

      setPaymentLoadingId(null);

      toast.error(
        error instanceof Error ? error.message : "Unable to start payment",
      );
    }
  };

  // ======================================================
  // VISIBLE ORDERS
  // ======================================================

  const visibleOrders = orders.filter(
    (order) => !hiddenOrderIds.includes(order.id),
  );

  // ======================================================
  // HIDDEN ORDERS
  // ======================================================

  const hiddenOrders = orders.filter((order) =>
    hiddenOrderIds.includes(order.id),
  );

  // ======================================================
  // CURRENT ORDERS
  // ======================================================

  const currentOrders = activeTab === "visible" ? visibleOrders : hiddenOrders;

  const recentOrders = currentOrders.slice(0, 5);

  // ======================================================
  // MAIN
  // ======================================================

  return (
    <section className="mt-8 space-y-6">
      {/* ================= TABS ================= */}

      <div className="flex items-center gap-2 rounded-xl border border-[#e4bcbc] bg-[#fff7f7] p-1">
        <button
          type="button"
          onClick={() => setActiveTab("visible")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
            activeTab === "visible"
              ? "bg-[#A82020] text-white shadow-sm"
              : "text-[#7d6262] hover:text-[#351818]"
          }`}
        >
          <Eye className="h-4 w-4" />
          Visible
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              activeTab === "visible"
                ? "bg-white/20 text-white"
                : "bg-[#f3dddd] text-[#8a3030]"
            }`}
          >
            {visibleOrders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("hidden")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
            activeTab === "hidden"
              ? "bg-[#A82020] text-white shadow-sm"
              : "text-[#7d6262] hover:text-[#351818]"
          }`}
        >
          <EyeOff className="h-4 w-4" />
          Hidden
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              activeTab === "hidden"
                ? "bg-white/20 text-white"
                : "bg-[#f3dddd] text-[#8a3030]"
            }`}
          >
            {hiddenOrders.length}
          </span>
        </button>
      </div>

      {/* ================= EMPTY STATE ================= */}

      {recentOrders.length === 0 ? (
        <div className="rounded-[22px] border border-[#e4bcbc] bg-[#fff7f7] px-6 py-14 text-center shadow-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fbe8e8] shadow-sm">
            {activeTab === "visible" ? (
              <Package className="h-7 w-7 text-[#A82020]" />
            ) : (
              <EyeOff className="h-7 w-7 text-[#7d6262]" />
            )}
          </div>

          <h3 className="mt-4 text-base font-semibold text-[#351818]">
            {activeTab === "visible" ? "No visible orders" : "No hidden orders"}
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm text-[#7d6262]">
            {activeTab === "visible"
              ? "Your rental orders will appear here."
              : "Orders that you hide will appear here."}
          </p>
        </div>
      ) : (
        /* ================= ORDER CARDS ================= */

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {recentOrders.map((order) => {
            // ==================================================
            // CURRENT PAYMENT STATUS
            //
            // VERY IMPORTANT:
            //
            // order.id is used as the key.
            //
            // So:
            //
            // Order #1 → paymentStatuses[1]
            // Order #2 → paymentStatuses[2]
            // Order #3 → paymentStatuses[3]
            // ==================================================

            const currentPaymentStatus =
              paymentStatuses[order.id] || order.payment_status || "unpaid";

            const isPaymentLoading = paymentLoadingId === order.id;

            return (
              <article
                key={order.id}
                className="
                  flex h-full flex-col overflow-hidden
                  rounded-[22px]
                  border border-[#e1b7b7]
                  bg-white
                  shadow-[0_8px_24px_rgba(168,32,32,0.10)]
                  transition duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_12px_30px_rgba(168,32,32,0.16)]
                "
              >
                {/* ================= CARD HEADER ================= */}

                <div className="border-b border-[#e6c2c2] bg-[#fff6f6] px-5 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-[#351818]">
                          Order #{order.id}
                        </h3>

                        <StatusBadge status={order.status} />
                      </div>

                      <p className="mt-1 text-xs text-[#8b6666]">
                        Ordered on {formatDate(order.created_at)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-[#8b6666]">Total Amount</p>

                      <p className="mt-1 text-lg font-bold text-[#A82020]">
                        ৳{Number(order.total_amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ================= CARD BODY ================= */}

                <div className="flex flex-1 flex-col p-5">
                  {/* ================= RENTAL DETAILS ================= */}

                  <div>
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-[#351818]">
                        Rental Details
                      </h4>

                      <p className="mt-1 text-xs text-[#7d6262]">
                        Your rental period and duration
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#e8caca] bg-[#fffafa] p-4 sm:grid-cols-3">
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
                  </div>

                  {/* ================= DIVIDER ================= */}

                  <div className="my-5 h-px bg-[#ead0d0]" />

                  {/* ================= ORDERED TOOLS ================= */}

                  <div>
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-[#351818]">
                        Ordered Tools
                      </h4>

                      <p className="mt-1 text-xs text-[#7d6262]">
                        Tools included in this rental order
                      </p>
                    </div>

                    <div className="space-y-3">
                      {order.tools.map((tool) => (
                        <div
                          key={tool.id}
                          className="
                            flex items-center gap-3
                            rounded-xl
                            border border-[#e8caca]
                            bg-[#fffafa]
                            p-3
                            shadow-sm
                            transition-all duration-300
                            hover:border-[#dba8a8]
                            hover:bg-[#fff5f5]
                          "
                        >
                          {/* TOOL IMAGE */}

                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f7e5e5]">
                            {tool.tool_image ? (
                              <img
                                src={getToolImage(tool.tool_image)}
                                alt={tool.tool_name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Package className="h-6 w-6 text-[#9b7373]" />
                              </div>
                            )}
                          </div>

                          {/* TOOL INFORMATION */}

                          <div className="min-w-0 flex-1">
                            <h5 className="truncate text-sm font-semibold text-[#351818]">
                              {tool.tool_name}
                            </h5>

                            <p className="mt-1 text-xs text-[#7d6262]">
                              Brand: {tool.brand || "N/A"}
                            </p>

                            <div className="mt-1 flex items-center gap-1 text-xs text-[#7d6262]">
                              <MapPin className="h-3 w-3" />

                              <span className="truncate">
                                {tool.location || "N/A"}
                              </span>
                            </div>
                          </div>

                          {/* PRICE */}

                          <div className="shrink-0 text-right">
                            <p className="text-xs text-[#7d6262]">Per day</p>

                            <p className="mt-1 text-sm font-bold text-[#A82020]">
                              ৳
                              {Number(
                                tool.rental_price_per_day,
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ================= MESSAGE ================= */}

                  {order.message && (
                    <>
                      <div className="my-5 h-px bg-[#ead0d0]" />

                      <div className="rounded-xl border border-[#e8caca] bg-[#fffafa] p-4">
                        <p className="text-xs font-semibold text-[#351818]">
                          Message
                        </p>

                        <p className="mt-1 text-sm leading-6 text-[#7d6262]">
                          {order.message}
                        </p>
                      </div>
                    </>
                  )}

                  {/* ================= ACTION ================= */}

                  <div className="mt-auto space-y-3 pt-5">
                    {/* ==================================================
                        STRIPE PAYMENT BUTTON
                        ================================================== */}

                    {activeTab === "visible" && order.status === "approved" && (
                      <>
                        {/* ================= UNPAID ================= */}

                        {currentPaymentStatus === "unpaid" && (
                          <button
                            type="button"
                            onClick={() => handlePayment(order.id)}
                            disabled={isPaymentLoading}
                            className="
                                group flex w-full items-center justify-center gap-2
                                rounded-xl
                                bg-[#635BFF]
                                px-4 py-3
                                text-sm font-semibold
                                text-white
                                transition-all duration-300
                                hover:bg-[#5149d8]
                                hover:shadow-[0_6px_18px_rgba(99,91,255,0.28)]
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                              "
                          >
                            {isPaymentLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Redirecting to Stripe...
                              </>
                            ) : (
                              <>
                                <CreditCard
                                  className="
                                      h-4 w-4
                                      transition-transform duration-300
                                      group-hover:scale-110
                                    "
                                />
                                Pay with Stripe
                                <ArrowRight
                                  className="
                                      h-4 w-4
                                      transition-transform duration-300
                                      group-hover:translate-x-1
                                    "
                                />
                              </>
                            )}
                          </button>
                        )}

                        {/* ================= PAID ================= */}

                        {currentPaymentStatus === "paid" && (
                          <button
                            type="button"
                            disabled
                            className="
                                flex w-full cursor-not-allowed
                                items-center justify-center gap-2
                                rounded-xl
                                border border-[#b9d8bf]
                                bg-[#e4f3e7]
                                px-4 py-3
                                text-sm font-semibold
                                text-[#2f6b3a]
                                opacity-90
                              "
                          >
                            <CreditCard className="h-4 w-4" />
                            PAID
                          </button>
                        )}

                        {/* ================= CANCELLED ================= */}

                        {currentPaymentStatus === "cancelled" && (
                          <button
                            type="button"
                            disabled
                            className="
                                flex w-full cursor-not-allowed
                                items-center justify-center gap-2
                                rounded-xl
                                border border-[#e4baba]
                                bg-[#f8dddd]
                                px-4 py-3
                                text-sm font-semibold
                                text-[#A82020]
                                opacity-90
                              "
                          >
                            <EyeOff className="h-4 w-4" />
                            CANCELLED
                          </button>
                        )}
                      </>
                    )}

                    {/* ================= EXISTING ACTION ================= */}

                    {activeTab === "visible" ? (
                      <button
                        type="button"
                        onClick={() => hideOrder(order.id)}
                        className="
                          group flex w-full items-center justify-center gap-2
                          rounded-xl
                          border border-[#dfbaba]
                          bg-[#fff8f8]
                          px-4 py-3
                          text-sm font-medium
                          text-[#7e3535]
                          transition-all duration-300
                          hover:border-[#A82020]
                          hover:bg-[#A82020]
                          hover:text-white
                          hover:shadow-[0_6px_18px_rgba(168,32,32,0.22)]
                        "
                      >
                        <EyeOff
                          className="
                            h-4 w-4
                            transition-transform duration-300
                            group-hover:scale-110
                          "
                        />
                        Hide Order
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => showOrder(order.id)}
                        className="
                          flex w-full items-center justify-center gap-2
                          rounded-xl
                          bg-[#A82020]
                          px-4 py-3
                          text-sm font-medium
                          text-white
                          transition-all duration-300
                          hover:bg-[#8f1b1b]
                          hover:shadow-[0_6px_18px_rgba(168,32,32,0.22)]
                        "
                      >
                        <Eye className="h-4 w-4" />
                        Show Order
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
