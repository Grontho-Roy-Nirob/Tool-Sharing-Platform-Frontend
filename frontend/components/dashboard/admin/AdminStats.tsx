"use client";

import { useEffect, useState } from "react";
import {
  FolderTree,
  Loader2,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import adminApi from "@/lib/adminAxios";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#e7dfd4] bg-white/70 p-4 shadow-[0_3px_14px_rgba(33,31,28,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d8cabb] hover:bg-white hover:shadow-[0_8px_22px_rgba(33,31,28,0.07)]">
      {/* DECORATIVE CIRCLE */}

      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full border-[8px] border-[#e8a33d]/10 transition-transform duration-300 group-hover:scale-110" />

      {/* CONTENT */}

      <div className="relative flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8b8177]">
            {title}
          </p>

          <p className="mt-2 text-[28px] font-bold leading-none tracking-tight text-[#292722]">
            {value}
          </p>

          <p className="mt-2 text-[10px] font-medium text-[#a19a91]">
            Current platform total
          </p>
        </div>

        {/* ICON */}

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#e7dfd4] bg-[#f3efe7] text-[#c17a28] shadow-sm transition-all duration-200 group-hover:border-[#e8a33d]/40 group-hover:bg-[#f6d7a9]/40">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AdminStats() {
  const [stats, setStats] = useState({
    renters: 0,
    owners: 0,
    categories: 0,
    admins: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);

      // Check Admin Token
      console.log("ADMIN TOKEN:", localStorage.getItem("admin_access_token"));

      // =========================
      // RENTERS
      // =========================

      try {
        const response = await adminApi.get("/renter");

        console.log("Renters response:", response.data);

        setStats((previous) => ({
          ...previous,
          renters: Array.isArray(response.data) ? response.data.length : 0,
        }));
      } catch (error) {
        console.error("Failed to load renters:", error);
      }

      // =========================
      // OWNERS
      // =========================

      try {
        const response = await adminApi.get("/owner/listall");

        console.log("Owners response:", response.data);

        setStats((previous) => ({
          ...previous,
          owners: Array.isArray(response.data) ? response.data.length : 0,
        }));
      } catch (error) {
        console.error("Failed to load owners:", error);
      }

      // =========================
      // CATEGORIES
      // =========================

      try {
        const response = await adminApi.get("/admin/categories");

        console.log("Categories response:", response.data);

        setStats((previous) => ({
          ...previous,
          categories: Array.isArray(response.data) ? response.data.length : 0,
        }));
      } catch (error) {
        console.error("Failed to load categories:", error);
      }

      // =========================
      // ADMINS
      // =========================

      try {
        const response = await adminApi.get("/admin/listall");

        console.log("Admins response:", response.data);

        setStats((previous) => ({
          ...previous,
          admins: Array.isArray(response.data) ? response.data.length : 0,
        }));
      } catch (error) {
        console.error("Failed to load admins:", error);
      }

      setLoading(false);
    };

    loadStats();
  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="flex h-[122px] items-center justify-center rounded-2xl border border-[#e7dfd4] bg-white/70 shadow-[0_3px_14px_rgba(33,31,28,0.04)]"
          >
            <Loader2 className="h-5 w-5 animate-spin text-[#c17a28]" />
          </div>
        ))}
      </div>
    );
  }

  // =========================
  // STAT CARDS
  // =========================

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Renters"
        value={stats.renters}
        icon={<Users className="h-5 w-5" />}
      />

      <StatCard
        title="Total Owners"
        value={stats.owners}
        icon={<UserRound className="h-5 w-5" />}
      />

      <StatCard
        title="Total Categories"
        value={stats.categories}
        icon={<FolderTree className="h-5 w-5" />}
      />

      <StatCard
        title="Total Admins"
        value={stats.admins}
        icon={<ShieldCheck className="h-5 w-5" />}
      />
    </div>
  );
}
