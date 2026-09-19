"use client";

import AdminProtected from "@/components/authForm/AdminProtected";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import AdminHeader from "@/components/dashboard/admin/AdminHeader";
import AdminPageHeader from "@/components/dashboard/admin/AdminPageHeader";
import RentersTable from "@/components/dashboard/admin/RentersTable";

export default function AdminRentersPage() {
  return (
    <AdminProtected>
      <div className="min-h-screen bg-[#f5f3ef] text-[#25231f]">
        <AdminSidebar />

        <div className="pt-[72px] lg:ml-[280px] lg:pt-0">
          <AdminHeader />

          <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
            <div className="mx-auto max-w-[1280px]">
              {/* HERO HEADER */}
              <section className="relative mb-5 overflow-hidden rounded-[22px] bg-[#292722] shadow-[0_12px_32px_rgba(41,39,34,0.12)]">
                {/* Decorative circles */}
                <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#c1502e]/15" />

                <div className="pointer-events-none absolute -bottom-20 right-28 h-40 w-40 rounded-full bg-[#e4a15b]/8" />

                <div className="pointer-events-none absolute left-[55%] top-8 h-20 w-20 rounded-full bg-white/[0.025]" />

                <div className="pointer-events-none absolute bottom-6 left-[62%] hidden h-12 w-12 rounded-full border border-white/[0.05] sm:block" />

                <div className="relative px-5 py-6 sm:px-7 sm:py-7 lg:px-8">
                  {/* Workspace Badge */}
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#c1502e]">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>

                    <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/65">
                      Admin Workspace
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-[34px]">
                    Renters
                  </h1>

                  <p className="mt-2 max-w-xl text-xs leading-5 text-white/50 sm:text-sm">
                    View and manage all registered renters across the ToolShare
                    platform.
                  </p>
                </div>
              </section>

              {/* RENTERS TABLE */}
              <section className="overflow-hidden rounded-[22px] bg-white shadow-[0_8px_28px_rgba(55,45,30,0.055)]">
                <div className="border-b border-[#eee8e1] px-4 py-4 sm:px-5">
                  <AdminPageHeader
                    title="Manage Renters"
                    description="View all registered renters on the ToolShare platform."
                  />
                </div>

                <div className="p-3.5 sm:p-4">
                  <RentersTable />
                </div>
              </section>

              {/* FOOTER NOTE */}
              <div className="mt-5 flex items-center justify-center gap-2">
                <div className="h-1 w-1 rounded-full bg-[#c1502e]" />

                <p className="text-center text-[10px] text-[#9a948b]">
                  Manage registered renters from your ToolShare admin workspace.
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
