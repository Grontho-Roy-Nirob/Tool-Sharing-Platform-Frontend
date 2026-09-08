import Link from "next/link";
import { ArrowRight, CalendarDays, Package } from "lucide-react";

export type OrderStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "completed";

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
  message: string | null;
  created_at: string;
  updated_at: string;
}

interface RecentOrdersProps {
  orders: RenterOrder[];
}

const statusStyles: Record<OrderStatus, string> = {
  pending: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  approved: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  rejected: "border-red-500/20 bg-red-500/10 text-red-400",
  active: "border-green-500/20 bg-green-500/10 text-green-400",
  completed: "border-purple-500/20 bg-purple-500/10 text-purple-400",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  const recentOrders = orders.slice(0, 5);

  return (
    <section className="mt-8">
      {/* Section heading */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Recent Orders</h2>

          <p className="mt-1 text-sm text-[#71717a]">
            Your latest rental requests
          </p>
        </div>

        <Link
          href="/renter/orders"
          className="flex items-center gap-2 text-sm font-medium text-[#a1a1aa] transition hover:text-white"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Orders */}
      {recentOrders.length === 0 ? (
        <div className="rounded-2xl border border-[#292b30] bg-[#0d0e10] px-6 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#17181b]">
            <Package className="h-6 w-6 text-[#71717a]" />
          </div>

          <h3 className="mt-4 text-base font-medium text-white">
            No orders yet
          </h3>

          <p className="mt-1 text-sm text-[#71717a]">
            Your rental orders will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#292b30] bg-[#0d0e10]">
          {recentOrders.map((order, index) => {
            const firstTool = order.tools[0];

            return (
              <div
                key={order.id}
                className={`p-5 transition hover:bg-[#111214] ${
                  index !== recentOrders.length - 1
                    ? "border-b border-[#292b30]"
                    : ""
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Tool information */}
                  <div className="flex min-w-0 items-center gap-4">
                    {/* Tool image */}
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#17181b]">
                      {firstTool?.tool_image ? (
                        <img
                          src={firstTool.tool_image}
                          alt={firstTool.tool_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-6 w-6 text-[#52525b]" />
                        </div>
                      )}
                    </div>

                    {/* Tool details */}
                    <div className="min-w-0">
                      <p className="text-xs text-[#71717a]">
                        Order #{order.id}
                      </p>

                      <h3 className="mt-1 truncate font-medium text-white">
                        {firstTool
                          ? firstTool.tool_name
                          : `${order.tools.length} Tools`}
                      </h3>

                      {order.tools.length > 1 && (
                        <p className="mt-1 text-xs text-[#71717a]">
                          +{order.tools.length - 1} more tool
                          {order.tools.length - 1 > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <span
                    className={`w-fit rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                      statusStyles[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Order details */}
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div className="flex items-center gap-2 text-[#a1a1aa]">
                    <CalendarDays className="h-4 w-4 text-[#71717a]" />

                    <span>
                      {formatDate(order.start_date)} —{" "}
                      {formatDate(order.end_date)}
                    </span>
                  </div>

                  <div className="text-[#a1a1aa]">
                    <span className="text-[#71717a]">Duration:</span>{" "}
                    {order.duration_days} days
                  </div>

                  <div className="font-medium text-white sm:text-right">
                    ৳{Number(order.total_amount).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
