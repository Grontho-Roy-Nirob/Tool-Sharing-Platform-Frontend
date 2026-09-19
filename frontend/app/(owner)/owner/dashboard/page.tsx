"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Hammer,
  MapPin,
  Package,
  Plus,
  Sparkles,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import OwnerProtected from "@/components/authForm/OwnerProtected";
import OwnerSidebar from "@/components/dashboard/owner/OwnerSidebar";
import OwnerHeader from "@/components/dashboard/owner/OwnerHeader";
import api from "@/lib/axios";

// OWNER 

interface Owner {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profile_image?: string;
}

// JWT 

interface OwnerToken {
  email?: string;
  password?: string;
  iat?: number;
  exp?: number;
}

// TOOL 

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

// COMPONENT

export default function OwnerDashboard() {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD DASHBOARD 

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // LOGIN MESSAGE 

        const loginSuccess = localStorage.getItem("login_success");

        if (loginSuccess === "true") {
          toast.success("Login successful! Welcome to ToolShare Platform 🎉");

          localStorage.removeItem("login_success");
        }

        // GET TOKEN

        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("Please login first.");
          return;
        }

        // DECODE TOKEN 
        const decoded = jwtDecode<OwnerToken>(token);

        const email = decoded.email;

        if (!email) {
          setError("Owner email not found. Please login again.");
          return;
        }

        // GET ALL OWNERS 
        const ownerResponse = await api.get<Owner[]>("/owner/listall");

        // FIND LOGGED-IN OWNER 

        const ownerData = ownerResponse.data.find(
          (item) =>
            item.email?.trim().toLowerCase() === email.trim().toLowerCase(),
        );

        if (!ownerData) {
          setError("Owner information not found.");
          return;
        }

        //SET OWNER 

        setOwner(ownerData);

        // SAVE OWNER FOR HEADER

        localStorage.setItem("owner_data", JSON.stringify(ownerData));

        // GET OWNER TOOLS 

        const toolsResponse = await api.get<Tool[]>(
          `/owner/tools/${ownerData.id}`,
        );

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

  // TOOL COUNTS 

  const pendingTools = tools.filter((tool) => tool.status === "pending").length;

  const approvedTools = tools.filter(
    (tool) => tool.status === "approved",
  ).length;

  const rejectedTools = tools.filter(
    (tool) => tool.status === "rejected",
  ).length;

  // STATUS TEXT

  const getStatusText = (status: string) => {
    if (status === "approved") {
      return "Approved";
    }

    if (status === "rejected") {
      return "Rejected";
    }

    return "Pending";
  };

  // STATUS STYLE 

  const getStatusStyle = (status: string) => {
    if (status === "approved") {
      return "border-[#b7e4c7] bg-[#effaf2] text-[#16803c]";
    }

    if (status === "rejected") {
      return "border-[#f5c2c7] bg-[#fff3f4] text-[#c63c4a]";
    }

    return "border-[#f1d39b] bg-[#fff8e8] text-[#b7791f]";
  };

  // STATUS ICON

  const getStatusIcon = (status: string) => {
    if (status === "approved") {
      return <CheckCircle2 className="h-3.5 w-3.5" />;
    }

    if (status === "rejected") {
      return <XCircle className="h-3.5 w-3.5" />;
    }

    return <Clock3 className="h-3.5 w-3.5" />;
  };

  // RETURN 

  return (
    <OwnerProtected>
      <div className="min-h-screen bg-[#f5f3ef] text-[#25231f]">
        {/* SIDEBAR */}
        <OwnerSidebar />

        {/* MAIN AREA */}
        <div className="pt-[72px] lg:ml-[280px] lg:pt-0">
          {/* HEADER */}
          <OwnerHeader owner={owner} />
          
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
                      Owner Workspace
                    </span>
                  </div>

                  {/* HEADING */}
                  <h1 className="max-w-3xl text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-[36px]">
                    Welcome back
                    {owner?.name ? `, ${owner.name}` : ""}
                  </h1>

                  {/* DESCRIPTION */}
                  <p className="mt-2 max-w-xl text-xs leading-5 text-white/50 sm:text-sm">
                    Manage your tools, track approval status and keep your
                    ToolShare rentals organized from one place.
                  </p>
                </div>
              </section>


              {/* LOADING */}
              {loading && (
                <div className="space-y-5">
                  {/* Statistics Skeleton */}

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-[120px] animate-pulse rounded-[18px] bg-white"
                      />
                    ))}
                  </div>

                  {/* Tools Skeleton */}
                  <div className="h-[350px] animate-pulse rounded-[22px] bg-white" />
                </div>
              )}

              {/* ERROR */}
              {!loading && error && (
                <div className="rounded-[18px] border border-[#f2c6c2] bg-[#fff5f3] px-4 py-3 text-sm font-medium text-[#c1502e]">
                  {error}
                </div>
              )}

              {/* DASHBOARD CONTENT */}
              {!loading && !error && (
                <>

                  {/* STATISTICS */}
                  <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {/* TOTAL */}

                    <div className="group relative overflow-hidden rounded-[18px] bg-white p-4 shadow-[0_6px_22px_rgba(55,45,30,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(55,45,30,0.08)]">
                      <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-[#e8a33d]/10 transition-transform duration-500 group-hover:scale-125" />

                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#aaa39a]">
                            Total Tools
                          </p>

                          <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#211f1c]">
                            {tools.length}
                          </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#fff3dd] text-[#c17a28]">
                          <Hammer className="h-4 w-4" />
                        </div>
                      </div>

                      <p className="relative mt-3 text-[11px] font-medium text-[#8c837a]">
                        All listed tools
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
                            {pendingTools}
                          </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#fff8e8] text-[#c48625]">
                          <Clock3 className="h-4 w-4" />
                        </div>
                      </div>

                      <p className="relative mt-3 text-[11px] font-medium text-[#8c837a]">
                        Waiting for review
                      </p>
                    </div>

                    {/* APPROVED */}

                    <div className="group relative overflow-hidden rounded-[18px] bg-white p-4 shadow-[0_6px_22px_rgba(55,45,30,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(55,45,30,0.08)]">
                      <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-[#22c55e]/8 transition-transform duration-500 group-hover:scale-125" />

                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#aaa39a]">
                            Approved
                          </p>

                          <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#16803c]">
                            {approvedTools}
                          </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#edf9f0] text-[#16803c]">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      </div>

                      <p className="relative mt-3 text-[11px] font-medium text-[#8c837a]">
                        Available for rental
                      </p>
                    </div>

                    {/* REJECTED */}

                    <div className="group relative overflow-hidden rounded-[18px] bg-white p-4 shadow-[0_6px_22px_rgba(55,45,30,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(55,45,30,0.08)]">
                      <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-[#c1502e]/7 transition-transform duration-500 group-hover:scale-125" />

                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#aaa39a]">
                            Rejected
                          </p>

                          <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#c1502e]">
                            {rejectedTools}
                          </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#fff1ef] text-[#c1502e]">
                          <XCircle className="h-4 w-4" />
                        </div>
                      </div>

                      <p className="relative mt-3 text-[11px] font-medium text-[#8c837a]">
                        Requires attention
                      </p>
                    </div>
                  </section>


                  {/* RECENT TOOLS */}
                  <section className="mt-5 overflow-hidden rounded-[22px] bg-white shadow-[0_8px_28px_rgba(55,45,30,0.055)]">
                    {/* HEADER */}

                    <div className="flex flex-col gap-3 border-b border-[#eee8e1] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#fff3dd] text-[#c17a28]">
                            <Hammer className="h-3.5 w-3.5" />
                          </div>

                          <h2 className="text-base font-bold text-[#211f1c]">
                            Recent Tools
                          </h2>
                        </div>

                        <p className="mt-1.5 text-xs text-[#8c837a]">
                          Your latest tools and their current status.
                        </p>
                      </div>

                      <Link
                        href="/owner/mytools"
                        className="group inline-flex w-fit items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#a96618] transition-all duration-200 hover:bg-[#fff5e6]"
                      >
                        View all
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    </div>

                    {/* TOOL CONTENT */}

                    <div className="p-3.5 sm:p-4">
                      {tools.length === 0 ? (
                        /* EMPTY */

                        <div className="flex flex-col items-center justify-center rounded-[18px] border border-dashed border-[#dfd5ca] bg-[#fcfaf7] px-5 py-12 text-center">
                          <div className="flex h-13 w-13 items-center justify-center rounded-[16px] bg-[#fff0d7] text-[#c17a28]">
                            <Hammer className="h-6 w-6" />
                          </div>

                          <h3 className="mt-4 text-sm font-bold text-[#211f1c]">
                            No tools yet
                          </h3>

                          <p className="mt-1.5 max-w-sm text-xs leading-5 text-[#8c837a]">
                            You haven&apos;t added any tools. Add your first
                            tool to start renting through ToolShare.
                          </p>

                          <Link
                            href="/owner/mytools"
                            className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#e8a33d] px-4 py-2.5 text-xs font-bold text-[#211f1c] shadow-[2px_2px_0_#211f1c] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#211f1c]"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Tool
                          </Link>
                        </div>
                      ) : (
                        /* TOOL LIST */

                        <div className="space-y-2.5">
                          {tools.slice(0, 5).map((tool) => (
                            <div
                              key={tool.id}
                              className="group flex flex-col gap-3 rounded-[16px] border border-[#eee8e1] bg-[#fffdfb] p-3 transition-all duration-200 hover:border-[#e8cda5] hover:bg-[#fffaf3] hover:shadow-[0_4px_14px_rgba(33,31,28,0.04)] sm:flex-row sm:items-center sm:justify-between"
                            >
                              {/* TOOL INFORMATION */}

                              <div className="flex min-w-0 items-center gap-3">
                                {/* IMAGE */}

                                <div className="h-[62px] w-[82px] shrink-0 overflow-hidden rounded-[13px] bg-[#f5f1eb]">
                                  {tool.tool_image ? (
                                    <img
                                      src={
                                        tool.tool_image.startsWith("http")
                                          ? tool.tool_image
                                          : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${tool.tool_image}`
                                      }
                                      alt={tool.tool_name}
                                      className="block h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-[#fff3dd] text-[#c17a28]">
                                      <Hammer className="h-5 w-5" />
                                    </div>
                                  )}
                                </div>

                                {/* DETAILS */}

                                <div className="min-w-0">
                                  <h3 className="truncate text-sm font-bold text-[#211f1c]">
                                    {tool.tool_name}
                                  </h3>

                                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-[#8c837a] sm:text-[11px]">
                                    <span className="font-medium">
                                      {tool.brand}
                                    </span>

                                    <span className="hidden h-1 w-1 rounded-full bg-[#d1c8bf] sm:block" />

                                    <span>{tool.condition}</span>

                                    <span className="hidden h-1 w-1 rounded-full bg-[#d1c8bf] sm:block" />

                                    <span className="font-bold text-[#a96618]">
                                      ৳{tool.rental_price_per_day}/day
                                    </span>

                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-2.5 w-2.5" />
                                      {tool.location}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* STATUS */}

                              <div
                                className={`flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-bold ${getStatusStyle(
                                  tool.status,
                                )}`}
                              >
                                {getStatusIcon(tool.status)}
                                {getStatusText(tool.status)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>


                  {/* QUICK ACTIONS */}
                  <section className="mt-5 grid gap-3 md:grid-cols-2">
                    {/* MANAGE TOOLS */}

                    <Link
                      href="/owner/mytools"
                      className="group relative overflow-hidden rounded-[20px] bg-white p-4 shadow-[0_6px_22px_rgba(55,45,30,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(55,45,30,0.08)]"
                    >
                      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#e8a33d]/8 transition-transform duration-500 group-hover:scale-125" />

                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#fff3dd] text-[#c17a28]">
                            <Hammer className="h-4.5 w-4.5" />
                          </div>

                          <div>
                            <h3 className="text-sm font-bold text-[#211f1c]">
                              Manage My Tools
                            </h3>

                            <p className="mt-1 text-[11px] text-[#8c837a]">
                              Add, update and manage your tools.
                            </p>
                          </div>
                        </div>

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f7f4ef] text-[#8c837a] transition-all duration-300 group-hover:bg-[#e8a33d] group-hover:text-[#211f1c]">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </Link>

                    {/* MANAGE ORDERS */}

                    <Link
                      href="/owner/orders"
                      className="group relative overflow-hidden rounded-[20px] bg-white p-4 shadow-[0_6px_22px_rgba(55,45,30,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(55,45,30,0.08)]"
                    >
                      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#c1502e]/5 transition-transform duration-500 group-hover:scale-125" />

                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#fff0ed] text-[#c1502e]">
                            <Package className="h-4.5 w-4.5" />
                          </div>

                          <div>
                            <h3 className="text-sm font-bold text-[#211f1c]">
                              Manage Orders
                            </h3>

                            <p className="mt-1 text-[11px] text-[#8c837a]">
                              Review and manage rental requests.
                            </p>
                          </div>
                        </div>

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f7f4ef] text-[#8c837a] transition-all duration-300 group-hover:bg-[#c1502e] group-hover:text-white">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </Link>
                  </section>


                  {/* BOTTOM NOTE */}
                  <div className="mt-5 flex items-center justify-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-[#c1502e]" />

                    <p className="text-center text-[10px] text-[#9a948b]">
                      Your dashboard shows only tools belonging to your owner
                      account.
                    </p>

                    <div className="h-1 w-1 rounded-full bg-[#c1502e]" />
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </OwnerProtected>
  );
}
