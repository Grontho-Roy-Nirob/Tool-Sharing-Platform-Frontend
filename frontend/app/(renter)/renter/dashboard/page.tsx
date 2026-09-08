"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import RenterProtected from "../../../../components/authForm/RenterProtected";
import RenterSidebar from "../../../../components/dashboard/renter/RenterSidebar";
import RenterHeader from "../../../../components/dashboard/renter/RenterHeader";
import DashboardStats from "../../../../components/dashboard/renter/DashboardStats";
import RecentOrders, {
  type RenterOrder,
} from "../../../../components/dashboard/renter/RecentOrders";
import QuickActions from "../../../../components/dashboard/renter/QuickActions";

import api from "../../../../lib/axios";

interface Renter {
  renterId: number;
  fullName: string;
  email: string;
  profileImage?: string;
}

interface RenterToken {
  sub: number;
  email: string;
  role: number;
  iat: number;
  exp: number;
}

export default function RenterDashboard() {
  const [renter, setRenter] = useState<Renter | null>(null);
  const [orders, setOrders] = useState<RenterOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const activeOrders = orders.filter(
    (order) => order.status === "active",
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "completed",
  ).length;

  return (
    <RenterProtected>
      <div className="min-h-screen bg-[#090a0c] text-white">
        {/* Sidebar */}
        <RenterSidebar />

        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Header */}
          <RenterHeader renter={renter} />

          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {/* Welcome */}
            <section className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back{renter?.fullName ? `, ${renter.fullName}` : ""}
              </h1>

              <p className="mt-2 text-sm text-[#9ca3af] sm:text-base">
                Find the tools you need and manage your rentals.
              </p>
            </section>

            {/* Loading */}
            {loading && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-32 animate-pulse rounded-2xl border border-[#292b30] bg-[#0d0e10]"
                    />
                  ))}
                </div>

                <div className="h-72 animate-pulse rounded-2xl border border-[#292b30] bg-[#0d0e10]" />
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Dashboard */}
            {!loading && !error && (
              <>
                {/* Statistics */}
                <DashboardStats
                  totalOrders={orders.length}
                  pendingOrders={pendingOrders}
                  activeOrders={activeOrders}
                  completedOrders={completedOrders}
                />

                {/* Recent Orders */}
                <RecentOrders orders={orders} />

                {/* Quick Actions */}
                <QuickActions />
              </>
            )}
          </main>
        </div>
      </div>
    </RenterProtected>
  );
}