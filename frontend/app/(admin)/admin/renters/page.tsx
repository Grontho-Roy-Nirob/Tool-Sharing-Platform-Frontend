"use client";

import AdminProtected from "@/components/authForm/AdminProtected";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import AdminHeader from "@/components/dashboard/admin/AdminHeader";
import AdminPageHeader from "@/components/dashboard/admin/AdminPageHeader";
import RentersTable from "@/components/dashboard/admin/RentersTable";

export default function AdminRentersPage() {
  return (
    <AdminProtected>
      <div className="min-h-screen bg-[#090a0c] text-white">
        <AdminSidebar />

        <main className="min-h-screen lg:ml-64">
          <AdminHeader />

          <div className="p-5 lg:p-8">
            <AdminPageHeader
              title="Renters"
              description="View all registered renters on the ToolShire platform."
            />

            <RentersTable />
          </div>
        </main>
      </div>
    </AdminProtected>
  );
}
