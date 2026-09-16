
"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Loader2,
  ClipboardList,
  ArrowUpRight,
  ShieldCheck,
  UserRound,
  Mail,
  CircleCheck,
} from "lucide-react";
import { toast } from "sonner";

import OwnerProtected from "@/components/authForm/OwnerProtected";
import OwnerSidebar from "@/components/dashboard/owner/OwnerSidebar";
import OwnerHeader from "@/components/dashboard/owner/OwnerHeader";
import OwnerOrders from "@/components/dashboard/owner/OwnerOrders";

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
  iat?: number;
  exp?: number;
}

// ================= PAGE =================

export default function OwnerOrdersPage() {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);

  // ================= GET OWNER =================

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        setLoading(true);

        // ================= TOKEN =================

        const token = localStorage.getItem("access_token");

        if (!token) {
          toast.error("Please login first");
          return;
        }

        // ================= DECODE TOKEN =================

        const decoded = jwtDecode<OwnerToken>(token);

        const email = decoded.email;

        if (!email) {
          toast.error("Owner email not found");
          return;
        }

        // ================= GET OWNERS =================

        const response = await api.get<Owner[]>("/owner/listall");

        // ================= FIND CURRENT OWNER =================

        const ownerData = response.data.find(
          (item) =>
            item.email?.trim().toLowerCase() === email.trim().toLowerCase(),
        );

        if (!ownerData) {
          toast.error("Owner information not found");
          return;
        }

        // ================= SET OWNER =================

        setOwner({
          id: ownerData.id,
          name: ownerData.name,
          email: ownerData.email,
          phone: ownerData.phone,
          profile_image: ownerData.profile_image,
        });
      } catch (error) {
        console.error("Failed to load owner:", error);

        toast.error("Failed to load owner information");
      } finally {
        setLoading(false);
      }
    };

    fetchOwner();
  }, []);

  // ================= UI =================

  return (
    <OwnerProtected>
      <div className="min-h-screen bg-[#f5f3ef] text-[#25231f]">
        {/* ================================================= */}
        {/* SIDEBAR */}
        {/* ================================================= */}

        <OwnerSidebar />

        {/* ================================================= */}
        {/* MAIN CONTENT */}
        {/* ================================================= */}

        <div className="lg:ml-[280px]">
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <OwnerHeader owner={owner} />

          {/* ================================================= */}
          {/* PAGE CONTENT */}
          {/* ================================================= */}

          <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
            <div className="mx-auto max-w-[1350px]">

              {/* ================================================= */}
              {/* HERO */}
              {/* ================================================= */}

              <section className="relative mb-8 overflow-hidden rounded-[30px] bg-[#292722] shadow-[0_18px_45px_rgba(41,39,34,0.13)]">
                {/* Decorative shapes */}

                <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#c1502e]/20" />

                <div className="pointer-events-none absolute -bottom-28 right-36 h-52 w-52 rounded-full bg-[#e4a15b]/10" />

                <div className="pointer-events-none absolute left-[45%] top-8 h-28 w-28 rounded-full bg-white/[0.03]" />

                <div className="relative flex flex-col justify-between gap-8 px-6 py-8 sm:px-8 sm:py-9 lg:flex-row lg:items-center lg:px-10">
                  {/* LEFT */}

                  <div className="max-w-2xl">
                    {/* Small label */}

                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 backdrop-blur-sm">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c1502e]">
                        <ClipboardList className="h-3 w-3 text-white" />
                      </span>

                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                        Owner Workspace
                      </span>
                    </div>

                    {/* Heading */}

                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[42px]">
                      Rental Requests
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/55 sm:text-[15px]">
                      Review incoming rental requests and manage bookings for
                      the tools you have listed on ToolShare.
                    </p>
                  </div>

                  {/* RIGHT ACCOUNT CARD */}

                  <div className="shrink-0">
                    <div className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-white/[0.07] px-4 py-3.5 backdrop-blur-sm">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#c1502e]">
                        <ShieldCheck className="h-5 w-5 text-white" />
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">
                          Account
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                          Owner #{owner?.id ?? "—"}
                        </p>
                      </div>

                      <ArrowUpRight className="ml-2 h-4 w-4 text-white/25" />
                    </div>
                  </div>
                </div>
              </section>

              {/* ================================================= */}
              {/* OWNER INFO */}
              {/* ================================================= */}

              {!loading && owner && (
                <section className="mb-8 grid gap-4 md:grid-cols-3">

                  {/* OWNER */}

                  <div className="rounded-[22px] bg-white p-5 shadow-[0_8px_30px_rgba(55,45,30,0.055)]">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#f8e9df]">
                        <UserRound className="h-[18px] w-[18px] text-[#c1502e]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#aaa39a]">
                          Owner
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-[#302e29]">
                          {owner.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* EMAIL */}

                  <div className="rounded-[22px] bg-white p-5 shadow-[0_8px_30px_rgba(55,45,30,0.055)]">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#f3efe7]">
                        <Mail className="h-[18px] w-[18px] text-[#756f66]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#aaa39a]">
                          Email
                        </p>

                        <p className="mt-1 truncate text-sm font-medium text-[#4c4841]">
                          {owner.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* WORKSPACE STATUS */}

                  <div className="rounded-[22px] bg-white p-5 shadow-[0_8px_30px_rgba(55,45,30,0.055)]">
                    <div className="flex items-center gap-3.5">
                      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#eaf4eb]">
                        <CircleCheck className="h-[19px] w-[19px] text-[#4f8a58]" />
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#aaa39a]">
                          Workspace
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#4f6852]">
                          Active
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* ================================================= */}
              {/* ORDERS HEADER */}
              {/* ================================================= */}

              <section>
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c1502e]">
                      Manage Bookings
                    </p>

                    <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-[#302e29]">
                      Incoming Rental Requests
                    </h2>
                  </div>

                  <p className="text-xs text-[#99938a]">
                    Review each request before approving
                  </p>
                </div>

                {/* ================================================= */}
                {/* LOADING */}
                {/* ================================================= */}

                {loading ? (
                  <div className="flex min-h-[360px] items-center justify-center rounded-[28px] bg-white shadow-[0_10px_35px_rgba(55,45,30,0.06)]">
                    <div className="flex flex-col items-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#faf0e8]">
                        <Loader2 className="h-6 w-6 animate-spin text-[#c1502e]" />
                      </div>

                      <p className="mt-4 text-sm font-semibold text-[#555047]">
                        Loading your requests
                      </p>

                      <p className="mt-1 text-xs text-[#a39d94]">
                        Please wait a moment...
                      </p>
                    </div>
                  </div>
                ) : owner ? (
                  /* ================================================= */
                  /* ORDERS */
                  /* ================================================= */

                  <div className="rounded-[28px] bg-white p-4 shadow-[0_10px_35px_rgba(55,45,30,0.06)] sm:p-5 lg:p-6">
                    <OwnerOrders ownerId={owner.id} />
                  </div>
                ) : (
                  /* ================================================= */
                  /* OWNER NOT FOUND */
                  /* ================================================= */

                  <div className="flex min-h-[360px] items-center justify-center rounded-[28px] bg-white px-6 shadow-[0_10px_35px_rgba(55,45,30,0.06)]">
                    <div className="max-w-sm text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#f8ece6]">
                        <ClipboardList className="h-6 w-6 text-[#c1502e]" />
                      </div>

                      <h3 className="mt-4 text-base font-bold text-[#302e29]">
                        Owner information not found
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#8c877f]">
                        We could not load your owner information. Please login
                        again and try once more.
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* ================================================= */}
              {/* BOTTOM NOTE */}
              {/* ================================================= */}

              {!loading && owner && (
                <div className="mt-8 flex items-center justify-center gap-2.5">
                  <div className="h-1 w-1 rounded-full bg-[#c1502e]" />

                  <p className="text-[11px] text-[#9a948b]">
                    Only requests related to your tools are shown here.
                  </p>

                  <div className="h-1 w-1 rounded-full bg-[#c1502e]" />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </OwnerProtected>
  );
}
