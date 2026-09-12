"use client";

import AdminProtected from "@/components/authForm/AdminProtected";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import AdminHeader from "@/components/dashboard/admin/AdminHeader";
import AdminPageHeader from "@/components/dashboard/admin/AdminPageHeader";
import OwnersTable from "@/components/dashboard/admin/OwnersTable";

export default function AdminOwnersPage() {
  return (
    <AdminProtected>
      <div className="min-h-screen bg-[#090a0c] text-white">
        <AdminSidebar />
        <main className="min-h-screen lg:ml-64">
          <AdminHeader />
          <div className="p-5 lg:p-8">
            <AdminPageHeader
              title="Owners"
              description="View all registered tool owners on the ToolShire platform."
            />
            <OwnersTable />
          </div>
        </main>
      </div>
    </AdminProtected>
  );
}
