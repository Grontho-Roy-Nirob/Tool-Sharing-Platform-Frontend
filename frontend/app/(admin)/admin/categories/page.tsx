"use client";

import AdminProtected from "@/components/authForm/AdminProtected";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import AdminHeader from "@/components/dashboard/admin/AdminHeader";
import AdminCategoriesTable from "@/components/dashboard/admin/AdminCategoriesTable";

export default function AdminCategoriesPage() {
  return (
    <AdminProtected>
      <div className="min-h-screen bg-[#090a0c] text-white">
        <AdminSidebar />

        <div className="lg:pl-64">
          <AdminHeader />

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8">
                <p className="mb-2 text-sm font-medium text-white/40">
                  Administration
                </p>

                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Categories
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                  Create, update, and manage the categories used for tool
                  listings.
                </p>
              </div>

              <AdminCategoriesTable />
            </div>
          </main>
        </div>
      </div>
    </AdminProtected>
  );
}
