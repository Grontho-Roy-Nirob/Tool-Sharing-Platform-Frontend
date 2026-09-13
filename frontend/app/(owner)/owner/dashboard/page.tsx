"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

import OwnerProtected from "@/components/authForm/OwnerProtected";
import OwnerSidebar from "@/components/dashboard/owner/OwnerSidebar";
import OwnerHeader from "@/components/dashboard/owner/OwnerHeader";
import api from "@/lib/axios";

// ================= OWNER =================

interface Owner {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profile_image?: string;
}

// ================= JWT =================

interface OwnerToken {
  email?: string;
  password?: string;
  iat?: number;
  exp?: number;
}

// ================= TOOL =================

interface Tool {
  id: number;
  tool_name: string;
  description: string;
  brand: string;
  condition: string;
  rental_price_per_day: number;
  location: string;
  status: string;
  tool_image?: string;
}

// ================= COMPONENT =================

export default function OwnerDashboard() {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= LOAD DASHBOARD =================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // ================= LOGIN MESSAGE =================

        const loginSuccess = localStorage.getItem("login_success");

        if (loginSuccess === "true") {
          toast.success("Login successful! Welcome to ToolShare Platform 🎉");

          localStorage.removeItem("login_success");
        }

        // ================= GET TOKEN =================

        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("Please login first.");
          return;
        }

        // ================= DECODE JWT =================

        const decoded = jwtDecode<OwnerToken>(token);

        console.log("Decoded JWT:", decoded);

        const email = decoded.email;

        if (!email) {
          setError("Owner email not found. Please login again.");
          return;
        }

        console.log("Owner Email:", email);

        // ================= GET ALL OWNERS =================

        const ownerResponse = await api.get("/owner/listall");

        console.log("All owners:", ownerResponse.data);

        // ================= FIND LOGGED-IN OWNER =================

        const ownerData = ownerResponse.data.find(
          (item: Owner) => item.email === email,
        );

        if (!ownerData) {
          setError("Owner information not found.");
          return;
        }

        console.log("Logged in owner:", ownerData);

        setOwner(ownerData);

        // ================= GET OWNER TOOLS =================

        const toolsResponse = await api.get(`/owner/tools/${ownerData.id}`);

        console.log("Owner tools:", toolsResponse.data);

        setTools(toolsResponse.data || []);
      } catch (error) {
        console.error("Dashboard error:", error);

        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // ================= TOOL COUNTS =================

  const pendingTools = tools.filter((tool) => tool.status === "pending").length;

  const approvedTools = tools.filter(
    (tool) => tool.status === "approved",
  ).length;

  const rejectedTools = tools.filter(
    (tool) => tool.status === "rejected",
  ).length;

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("login_success");

    window.location.href = "/login";
  };

  return (
    <OwnerProtected>
      <div className="min-h-screen bg-[#08090b] text-white">
        {/* ================= SIDEBAR ================= */}

        <OwnerSidebar />

        {/* ================= MAIN AREA ================= */}

        <div className="lg:ml-[280px]">
          {/* ================= HEADER ================= */}

          <OwnerHeader owner={owner} />

          {/* ================= PAGE CONTENT ================= */}

          <main className="px-6 py-8 sm:px-8 lg:px-10">
            {/* ================= WELCOME ================= */}

            <section className="mb-9">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Welcome back
                {owner?.name ? `, ${owner.name}` : ""}
              </h2>

              <p className="mt-3 text-sm text-[#8c919b] sm:text-base">
                Manage your tools, check their status, and keep your rental
                items organized.
              </p>
            </section>

            {/* ================= LOADING ================= */}

            {loading && (
              <div className="space-y-6">
                {/* STAT SKELETONS */}

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-32 animate-pulse rounded-2xl border border-[#292b30] bg-[#0d0e10]"
                    />
                  ))}
                </div>

                {/* RECENT TOOLS SKELETON */}

                <div className="h-72 animate-pulse rounded-2xl border border-[#292b30] bg-[#0d0e10]" />
              </div>
            )}

            {/* ================= ERROR ================= */}

            {!loading && error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-5 text-red-400">
                {error}
              </div>
            )}

            {/* ================= DASHBOARD ================= */}

            {!loading && !error && (
              <>
                {/* ================= STATISTICS ================= */}

                <section>
                  <div className="mb-5">
                    <h2 className="text-xl font-semibold">Overview</h2>

                    <p className="mt-1 text-sm text-[#777d87]">
                      A quick overview of your tools.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {/* TOTAL TOOLS */}

                    <div className="rounded-2xl border border-[#292b30] bg-[#0d0e10] p-6 transition hover:border-[#3a3c42]">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-[#777d87]">Total Tools</p>

                          <h3 className="mt-4 text-3xl font-bold">
                            {tools.length}
                          </h3>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17191c] text-xl text-[#b7bbc2]">
                          ▣
                        </div>
                      </div>
                    </div>

                    {/* PENDING TOOLS */}

                    <div className="rounded-2xl border border-[#292b30] bg-[#0d0e10] p-6 transition hover:border-[#3a3c42]">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-[#777d87]">
                            Pending Tools
                          </p>

                          <h3 className="mt-4 text-3xl font-bold text-yellow-400">
                            {pendingTools}
                          </h3>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17191c] text-xl text-yellow-400">
                          ◷
                        </div>
                      </div>
                    </div>

                    {/* APPROVED TOOLS */}

                    <div className="rounded-2xl border border-[#292b30] bg-[#0d0e10] p-6 transition hover:border-[#3a3c42]">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-[#777d87]">
                            Approved Tools
                          </p>

                          <h3 className="mt-4 text-3xl font-bold text-green-400">
                            {approvedTools}
                          </h3>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17191c] text-xl text-green-400">
                          ✓
                        </div>
                      </div>
                    </div>

                    {/* REJECTED TOOLS */}

                    <div className="rounded-2xl border border-[#292b30] bg-[#0d0e10] p-6 transition hover:border-[#3a3c42]">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-[#777d87]">
                            Rejected Tools
                          </p>

                          <h3 className="mt-4 text-3xl font-bold text-red-400">
                            {rejectedTools}
                          </h3>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17191c] text-xl text-red-400">
                          ×
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ================= RECENT TOOLS ================= */}

                <section className="mt-10 rounded-2xl border border-[#292b30] bg-[#0d0e10]">
                  {/* HEADER */}

                  <div className="flex flex-col justify-between gap-3 border-b border-[#292b30] px-6 py-6 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="text-xl font-semibold">Recent Tools</h2>

                      <p className="mt-1 text-sm text-[#777d87]">
                        Your latest tools and their current status.
                      </p>
                    </div>

                    {/* IMPORTANT:
                        This must point to /owner/mytools
                    */}

                    <Link
                      href="/owner/mytools"
                      className="text-sm font-medium text-[#aeb4bd] transition hover:text-white"
                    >
                      View all →
                    </Link>
                  </div>

                  {/* TOOL LIST */}

                  <div className="p-6">
                    {tools.length === 0 ? (
                      /* EMPTY STATE */

                      <div className="rounded-xl border border-dashed border-[#292b30] px-6 py-14 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#17191c] text-2xl">
                          ▣
                        </div>

                        <h3 className="font-medium">No tools yet</h3>

                        <p className="mt-2 text-sm text-[#777d87]">
                          You have not added any tools yet.
                        </p>

                        <Link
                          href="/owner/create-tool"
                          className="mt-5 inline-flex rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                        >
                          Add Your First Tool
                        </Link>
                      </div>
                    ) : (
                      /* TOOL LIST */

                      <div className="space-y-3">
                        {tools.slice(0, 5).map((tool) => (
                          <div
                            key={tool.id}
                            className="flex flex-col gap-4 rounded-xl border border-[#292b30] bg-[#0b0c0e] p-5 transition hover:border-[#3a3c42] sm:flex-row sm:items-center sm:justify-between"
                          >
                            {/* TOOL INFO */}

                            <div className="flex items-center gap-4">
                              {/* TOOL IMAGE */}

                              {tool.tool_image ? (
                                <img
                                  src={tool.tool_image}
                                  alt={tool.tool_name}
                                  className="h-14 w-14 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#17191c] text-xl">
                                  🔧
                                </div>
                              )}

                              {/* TOOL DETAILS */}

                              <div>
                                <h3 className="font-semibold">
                                  {tool.tool_name}
                                </h3>

                                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#777d87]">
                                  <span>{tool.brand}</span>

                                  <span>{tool.condition}</span>

                                  <span>৳{tool.rental_price_per_day}/day</span>

                                  <span>{tool.location}</span>
                                </div>
                              </div>
                            </div>

                            {/* STATUS */}

                            <div
                              className={`flex w-fit items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold ${
                                tool.status === "approved"
                                  ? "border-green-500/20 bg-green-500/10 text-green-400"
                                  : tool.status === "rejected"
                                    ? "border-red-500/20 bg-red-500/10 text-red-400"
                                    : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                              }`}
                            >
                              {/* STATUS DOT */}

                              <span
                                className={`h-2 w-2 rounded-full ${
                                  tool.status === "approved"
                                    ? "bg-green-400"
                                    : tool.status === "rejected"
                                      ? "bg-red-400"
                                      : "bg-yellow-400"
                                }`}
                              />

                              {/* STATUS TEXT */}

                              <span>
                                {tool.status === "approved"
                                  ? "Approved"
                                  : tool.status === "rejected"
                                    ? "Rejected"
                                    : "Pending Review"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}
          </main>
        </div>
      </div>
    </OwnerProtected>
  );
}
