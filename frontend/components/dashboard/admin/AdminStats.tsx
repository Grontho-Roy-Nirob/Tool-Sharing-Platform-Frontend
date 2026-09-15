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
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/40">{title}</p>

          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60">
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
      <div className="flex h-32 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
        <Loader2 className="h-5 w-5 animate-spin text-white/40" />
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
