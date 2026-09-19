"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  FolderTree,
  UserRound,
  Users,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import AdminProtected from "@/components/authForm/AdminProtected";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import AdminHeader from "@/components/dashboard/admin/AdminHeader";
import AdminStats from "@/components/dashboard/admin/AdminStats";

export default function AdminDashboardPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <AdminProtected>
      <div className="min-h-screen bg-[#f5f3ef] text-[#25231f]">
        {/* SIDEBAR */}
        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* MAIN AREA */}
        <div className="pt-[72px] lg:ml-[280px] lg:pt-0">
          {/* HEADER */}
          <AdminHeader onMenuClick={() => setMobileSidebarOpen(true)} />

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
                      Admin Workspace
                    </span>
                  </div>

                  {/* HEADING */}
                  <h1 className="max-w-3xl text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-[36px]">
                    Welcome back, Admin
                  </h1>

                  {/* DESCRIPTION */}
                  <p className="mt-2 max-w-xl text-xs leading-5 text-white/50 sm:text-sm">
                    Manage ToolShare users, owners, categories, and platform
                    administration from one organized workspace.
                  </p>
                </div>
              </section>

              {/* STATS */}
              <section className="mb-5">
                <div className="overflow-hidden rounded-[22px] bg-white p-3.5 shadow-[0_8px_28px_rgba(55,45,30,0.055)] sm:p-4">
                  <AdminStats />
                </div>
              </section>

              {/* QUICK ACTIONS */}
              <section className="overflow-hidden rounded-[22px] bg-white shadow-[0_8px_28px_rgba(55,45,30,0.055)]">
                {/* SECTION HEADER */}
                <div className="flex flex-col gap-3 border-b border-[#eee8e1] px-4 py-4 sm:px-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#fff0ed] text-[#c1502e]">
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </div>

                      <h2 className="text-base font-bold text-[#211f1c]">
                        Quick Actions
                      </h2>
                    </div>

                    <p className="mt-1.5 text-xs text-[#8c837a]">
                      Quickly access the main management areas.
                    </p>
                  </div>
                </div>

                {/* ACTION CARDS */}
                <div className="grid gap-3 p-3.5 sm:p-4 md:grid-cols-3">
                  {/* RENTERS */}
                  <Link
                    href="/admin/renters"
                    className="group relative overflow-hidden rounded-[20px] border border-[#eee8e1] bg-[#fffdfb] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#e1cdb8] hover:bg-[#fffaf5] hover:shadow-[0_10px_28px_rgba(55,45,30,0.07)]"
                  >
                    <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#e8a33d]/8 transition-transform duration-500 group-hover:scale-125" />

                    <div className="relative flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#fff3dd] text-[#c17a28]">
                        <Users className="h-4.5 w-4.5" />
                      </div>

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f7f4ef] text-[#8c837a] transition-all duration-300 group-hover:bg-[#e8a33d] group-hover:text-[#211f1c]">
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                    </div>

                    <h3 className="relative mt-5 text-sm font-bold text-[#211f1c]">
                      Manage Renters
                    </h3>

                    <p className="relative mt-1.5 text-[11px] leading-5 text-[#8c837a]">
                      View and manage all registered renters.
                    </p>
                  </Link>

                  {/* OWNERS */}
                  <Link
                    href="/admin/owners"
                    className="group relative overflow-hidden rounded-[20px] border border-[#eee8e1] bg-[#fffdfb] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#e1cdb8] hover:bg-[#fffaf5] hover:shadow-[0_10px_28px_rgba(55,45,30,0.07)]"
                  >
                    <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#c1502e]/6 transition-transform duration-500 group-hover:scale-125" />

                    <div className="relative flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#fff0ed] text-[#c1502e]">
                        <UserRound className="h-4.5 w-4.5" />
                      </div>

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f7f4ef] text-[#8c837a] transition-all duration-300 group-hover:bg-[#c1502e] group-hover:text-white">
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                    </div>

                    <h3 className="relative mt-5 text-sm font-bold text-[#211f1c]">
                      Manage Owners
                    </h3>

                    <p className="relative mt-1.5 text-[11px] leading-5 text-[#8c837a]">
                      View and manage all registered tool owners.
                    </p>
                  </Link>

                  {/* CATEGORIES */}
                  <Link
                    href="/admin/categories"
                    className="group relative overflow-hidden rounded-[20px] border border-[#eee8e1] bg-[#fffdfb] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#e1cdb8] hover:bg-[#fffaf5] hover:shadow-[0_10px_28px_rgba(55,45,30,0.07)]"
                  >
                    <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#e8a33d]/8 transition-transform duration-500 group-hover:scale-125" />

                    <div className="relative flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#fff3dd] text-[#c17a28]">
                        <FolderTree className="h-4.5 w-4.5" />
                      </div>

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f7f4ef] text-[#8c837a] transition-all duration-300 group-hover:bg-[#e8a33d] group-hover:text-[#211f1c]">
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                    </div>

                    <h3 className="relative mt-5 text-sm font-bold text-[#211f1c]">
                      Manage Categories
                    </h3>

                    <p className="relative mt-1.5 text-[11px] leading-5 text-[#8c837a]">
                      Create and manage tool categories.
                    </p>
                  </Link>
                </div>
              </section>

              {/* BOTTOM NOTE */}
              <div className="mt-5 flex items-center justify-center gap-2">
                <div className="h-1 w-1 rounded-full bg-[#c1502e]" />

                <p className="text-center text-[10px] text-[#9a948b]">
                  Manage your ToolShare platform from one organized admin
                  workspace.
                </p>

                <div className="h-1 w-1 rounded-full bg-[#c1502e]" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </AdminProtected>
  );
}
