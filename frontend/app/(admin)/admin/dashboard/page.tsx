"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, FolderTree, UserRound, Users } from "lucide-react";

import AdminProtected from "@/components/authForm/AdminProtected";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import AdminHeader from "@/components/dashboard/admin/AdminHeader";
import AdminStats from "@/components/dashboard/admin/AdminStats";

export default function AdminDashboardPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <AdminProtected>
      <div className="min-h-screen bg-[#090a0c] text-white">
        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <main className="min-h-screen lg:ml-64">
          <AdminHeader onMenuClick={() => setMobileSidebarOpen(true)} />

          <div className="p-5 lg:p-8">
            {/* Welcome */}
            <section className="mb-8">
              <p className="text-sm text-white/40">Overview</p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                Welcome back, Admin
              </h2>

              <p className="mt-2 max-w-2xl text-sm text-white/45">
                Manage ToolShire users, owners, categories, and administrators
                from one place.
              </p>
            </section>

            {/* Stats */}
            <section className="mb-10">
              <AdminStats />
            </section>

            {/* Quick Actions */}
            <section>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Quick Actions</h3>

                <p className="mt-1 text-sm text-white/40">
                  Quickly access the main management areas.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {/* Renters */}
                <Link
                  href="/admin/renters"
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">
                      <Users className="h-5 w-5 text-white/70" />
                    </div>

                    <ArrowRight className="h-4 w-4 text-white/30 transition group-hover:translate-x-1 group-hover:text-white" />
                  </div>

                  <h4 className="mt-5 font-medium">Manage Renters</h4>

                  <p className="mt-1 text-sm text-white/40">
                    View all registered renters.
                  </p>
                </Link>

                {/* Owners */}
                <Link
                  href="/admin/owners"
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">
                      <UserRound className="h-5 w-5 text-white/70" />
                    </div>

                    <ArrowRight className="h-4 w-4 text-white/30 transition group-hover:translate-x-1 group-hover:text-white" />
                  </div>

                  <h4 className="mt-5 font-medium">Manage Owners</h4>

                  <p className="mt-1 text-sm text-white/40">
                    View all registered tool owners.
                  </p>
                </Link>

                {/* Categories */}
                <Link
                  href="/admin/categories"
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">
                      <FolderTree className="h-5 w-5 text-white/70" />
                    </div>

                    <ArrowRight className="h-4 w-4 text-white/30 transition group-hover:translate-x-1 group-hover:text-white" />
                  </div>

                  <h4 className="mt-5 font-medium">Manage Categories</h4>

                  <p className="mt-1 text-sm text-white/40">
                    Create and manage tool categories.
                  </p>
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </AdminProtected>
  );
}
