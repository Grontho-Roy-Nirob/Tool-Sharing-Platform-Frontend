"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Package,
  Sparkles,
  Activity,
  Eye,
  EyeOff,
} from "lucide-react";

import RenterProtected from "../../../../components/authForm/RenterProtected";
import RenterSidebar from "../../../../components/dashboard/renter/RenterSidebar";
import RenterHeader from "../../../../components/dashboard/renter/RenterHeader";
import RecentOrders, {
  type RenterOrder,
} from "../../../../components/dashboard/renter/RecentOrders";
import QuickActions from "../../../../components/dashboard/renter/QuickActions";

import api from "../../../../lib/axios";

// RENTER

interface Renter {
  renterId: number;
  fullName: string;
  email: string;
  profileImage?: string;
}

// JWT

interface RenterToken {
  sub: number;
  email: string;
  role: number;
  iat: number;
  exp: number;
}

// COMPONENT

export default function RenterDashboard() {
  const [renter, setRenter] = useState<Renter | null>(null);
  const [orders, setOrders] = useState<RenterOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // RECENT ORDERS VISIBILITY

  const [showRecentOrders, setShowRecentOrders] = useState(true);

  // LOAD DASHBOARD DATA

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("access_token");

        if (!token) {
          return;
        }

        const decoded = jwtDecode<RenterToken>(token);

        const renterId = decoded.sub;

        // Get renter profile
        const renterResponse = await api.get(`/renter/${renterId}`);

        // Get renter orders
        const ordersResponse = await api.get("/renter/orders");

        setRenter(renterResponse.data);
        setOrders(ordersResponse.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);

        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ORDER COUNTS

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const activeOrders = orders.filter(
    (order) => order.status === "active",
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "completed",
  ).length;

  // LATEST 5 ORDERS

  const latestOrders = orders.slice(0, 5);

  // RETURN

  return (
    <RenterProtected>
      <div className="min-h-screen bg-[#f5f3ef] text-[#25231f]">
        {/* SIDEBAR */}

        <RenterSidebar />

        {/* MAIN AREA */}

        <div className="pt-[72px] lg:ml-[280px] lg:pt-0">
          {/* HEADER */}

          <RenterHeader renter={renter} />

          {/* PAGE CONTENT */}

          <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
            <div className="mx-auto max-w-[1280px]">
              {/* HERO */}

              <section className="relative mb-6 overflow-hidden rounded-[24px] bg-[#292722] shadow-[0_12px_32px_rgba(41,39,34,0.12)]">
                {/* Decorative Shapes */}

                <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#c1502e]/15" />

                <div className="pointer-events-none absolute -bottom-20 right-28 h-40 w-40 rounded-full bg-[#e4a15b]/8" />

                <div className="pointer-events-none absolute left-[55%] top-8 h-20 w-20 rounded-full bg-white/[0.025]" />

                <div className="pointer-events-none absolute bottom-6 left-[62%] hidden h-12 w-12 rounded-full border border-white/[0.05] sm:block" />

                {/* HERO CONTENT */}

                <div className="relative px-5 py-6 sm:px-7 sm:py-7 lg:px-8">
                  {/* LABEL */}

                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#c1502e]">
                      <Sparkles className="h-2.5 w-2.5 text-white" />
                    </span>

                    <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/65">
                      Renter Workspace
                    </span>
                  </div>

                  {/* HEADING */}

                  <h1 className="max-w-3xl text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-[36px]">
                    Welcome back
                    {renter?.fullName ? `, ${renter.fullName}` : ""}
                  </h1>

                  {/* DESCRIPTION */}

                  <p className="mt-2 max-w-xl text-xs leading-5 text-white/50 sm:text-sm">
                    Find the tools you need, manage your rentals and keep track
                    of your orders from one place.
                  </p>
                </div>
              </section>

              {/* LOADING */}

              {loading && (
                <div className="space-y-5">
                  {/* STATISTICS SKELETON */}

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-[120px] animate-pulse rounded-[18px] bg-white"
                      />
                    ))}
                  </div>

                  {/* RECENT ORDERS SKELETON */}

                  <div className="h-[350px] animate-pulse rounded-[22px] bg-white" />
                </div>
              )}

              {/* ERROR */}

              {!loading && error && (
                <div className="rounded-[18px] border border-[#f2c6c2] bg-[#fff5f3] px-4 py-3 text-sm font-medium text-[#c1502e]">
                  {error}
                </div>
              )}

              {/* DASHBOARD */}

              {!loading && !error && (
                <>
                  {/* STATISTICS */}

                  <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {/* TOTAL ORDERS */}

                    <div className="group relative overflow-hidden rounded-[18px] bg-white p-4 shadow-[0_6px_22px_rgba(55,45,30,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(55,45,30,0.08)]">
                      <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-[#e8a33d]/10 transition-transform duration-500 group-hover:scale-125" />

                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#aaa39a]">
                            Total Orders
                          </p>

                          <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#211f1c]">
                            {orders.length}
                          </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#fff3dd] text-[#c17a28]">
                          <Package className="h-4 w-4" />
                        </div>
                      </div>

                      <p className="relative mt-3 text-[11px] font-medium text-[#8c837a]">
                        All your rental orders
                      </p>
                    </div>

                    {/* PENDING */}

                    <div className="group relative overflow-hidden rounded-[18px] bg-white p-4 shadow-[0_6px_22px_rgba(55,45,30,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(55,45,30,0.08)]">
                      <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-[#f59e0b]/8 transition-transform duration-500 group-hover:scale-125" />

                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#aaa39a]">
                            Pending
                          </p>

                          <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#b7791f]">
                            {pendingOrders}
                          </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#fff8e8] text-[#c48625]">
                          <Clock3 className="h-4 w-4" />
                        </div>
                      </div>

                      <p className="relative mt-3 text-[11px] font-medium text-[#8c837a]">
                        Waiting for approval
                      </p>
                    </div>

                    {/* ACTIVE */}

                    <div className="group relative overflow-hidden rounded-[18px] bg-white p-4 shadow-[0_6px_22px_rgba(55,45,30,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(55,45,30,0.08)]">
                      <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-[#22c55e]/8 transition-transform duration-500 group-hover:scale-125" />

                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#aaa39a]">
                            Active
                          </p>

                          <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#16803c]">
                            {activeOrders}
                          </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#edf9f0] text-[#16803c]">
                          <Activity className="h-4 w-4" />
                        </div>
                      </div>

                      <p className="relative mt-3 text-[11px] font-medium text-[#8c837a]">
                        Currently rented
                      </p>
                    </div>

                    {/* COMPLETED */}

                    <div className="group relative overflow-hidden rounded-[18px] bg-white p-4 shadow-[0_6px_22px_rgba(55,45,30,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(55,45,30,0.08)]">
                      <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-[#c1502e]/7 transition-transform duration-500 group-hover:scale-125" />

                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#aaa39a]">
                            Completed
                          </p>

                          <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#c1502e]">
                            {completedOrders}
                          </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#fff1ef] text-[#c1502e]">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      </div>

                      <p className="relative mt-3 text-[11px] font-medium text-[#8c837a]">
                        Successfully completed
                      </p>
                    </div>
                  </section>

                  {/* RECENT ORDERS */}

                  <section className="mt-5 overflow-hidden rounded-[22px] bg-white shadow-[0_8px_28px_rgba(55,45,30,0.055)]">
                    {/* HEADER */}

                    <div className="flex flex-col gap-3 border-b border-[#eee8e1] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#fff3dd] text-[#c17a28]">
                            <Package className="h-3.5 w-3.5" />
                          </div>

                          <h2 className="text-base font-bold text-[#211f1c]">
                            Recent Orders
                          </h2>
                        </div>

                        <p className="mt-1.5 text-xs text-[#8c837a]">
                          Your latest 5 rental orders and their current status.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* VISIBILITY TOGGLE */}

                        <button
                          type="button"
                          onClick={() =>
                            setShowRecentOrders((previous) => !previous)
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#eee8e1] bg-[#faf8f5] px-2.5 py-1.5 text-xs font-bold text-[#716b63] transition-all duration-200 hover:border-[#ddd5cc] hover:bg-[#f5f1eb]"
                        >
                          {showRecentOrders ? (
                            <>
                              <EyeOff className="h-3.5 w-3.5" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="h-3.5 w-3.5" />
                              Show
                            </>
                          )}
                        </button>

                        {/* VIEW ALL */}

                        <a
                          href="/renter/orders"
                          className="group inline-flex w-fit items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#a96618] transition-all duration-200 hover:bg-[#fff5e6]"
                        >
                          View all
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                      </div>
                    </div>

                    {/* RECENT ORDERS CONTENT */}

                    {showRecentOrders && (
                      <div className="p-3.5 sm:p-4">
                        <RecentOrders orders={latestOrders} />
                      </div>
                    )}

                    {/* HIDDEN MESSAGE */}

                    {!showRecentOrders && (
                      <div className="flex items-center justify-center px-4 py-8">
                        <div className="text-center">
                          <EyeOff className="mx-auto h-5 w-5 text-[#aaa39a]" />

                          <p className="mt-2 text-xs font-medium text-[#8c837a]">
                            Recent orders are hidden.
                          </p>
                        </div>
                      </div>
                    )}
                  </section>

                  {/* QUICK ACTIONS */}

                  <section className="mt-5">
                    <QuickActions />
                  </section>

                  {/* BOTTOM NOTE */}

                  <div className="mt-5 flex items-center justify-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-[#c1502e]" />

                    <p className="text-center text-[10px] text-[#9a948b]">
                      Your dashboard shows your rental orders and account
                      activity.
                    </p>

                    <div className="h-1 w-1 rounded-full bg-[#c1502e]" />
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </RenterProtected>
  );
}
