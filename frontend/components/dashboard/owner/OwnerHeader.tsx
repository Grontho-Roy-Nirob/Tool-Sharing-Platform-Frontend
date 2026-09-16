"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ChevronDown } from "lucide-react";
import api from "@/lib/axios";

interface Owner {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profile_image?: string;
}

interface OwnerToken {
  email: string;
  sub?: number;
  role?: string;
}

interface OwnerHeaderProps {
  owner: Owner | null;
}

export default function OwnerHeader({ owner }: OwnerHeaderProps) {
  const [headerOwner, setHeaderOwner] = useState<Owner | null>(owner);

  useEffect(() => {
    if (owner) {
      setHeaderOwner(owner);
    }
  }, [owner]);

  useEffect(() => {
    const loadOwner = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) return;

        const decoded = jwtDecode<OwnerToken>(token);

        if (!decoded.email) return;

        const response = await api.get("/owner/listall");

        const owners = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];

        const currentOwner = owners.find(
          (item: Owner) =>
            item.email?.toLowerCase() === decoded.email?.toLowerCase(),
        );

        if (currentOwner) {
          setHeaderOwner(currentOwner);
        }
      } catch (error) {
        console.error("Failed to load owner header data:", error);
      }
    };

    loadOwner();
  }, []);

  const ownerName = headerOwner?.name?.trim() || "Owner";
  const ownerEmail = headerOwner?.email || "Owner account";
  const initial = ownerName.charAt(0).toUpperCase();

  return (
    <header
      className="
        sticky top-0 z-40
        flex min-h-[82px] items-center justify-between
        border-b border-[#e7dfd4]
        bg-[#faf8f3]/95
        px-4
        backdrop-blur-xl
        sm:px-6
        lg:px-8
      "
    >
      {/* ================= LEFT SIDE ================= */}

      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#c1502e]">
          Owner Workspace
        </p>

        <h1 className="mt-1 truncate text-lg font-bold text-[#292722] sm:text-xl">
          Manage your ToolShare account
        </h1>

        <p className="mt-1 hidden text-xs text-[#77736d] sm:block">
          Keep your tools, orders and profile up to date.
        </p>
      </div>

      {/* ================= RIGHT SIDE ================= */}

      <div className="ml-4 flex items-center gap-3 sm:gap-5">

        {/* ================= PROFILE ================= */}

        <div className="flex items-center gap-3 rounded-2xl bg-white/70 px-3 py-2 shadow-sm sm:px-3.5">

          {/* ================= PROFILE IMAGE ================= */}

          <div className="relative shrink-0">

            {headerOwner?.profile_image ? (
              <img
                src={headerOwner.profile_image}
                alt={ownerName}
                className="h-10 w-10 rounded-full bg-[#f1e5d4] object-cover shadow-sm"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#e8a33d] to-[#c1502e] text-sm font-bold text-white shadow-md">
                {initial}
              </div>
            )}

            {/* ================= ONLINE DOT ================= */}

            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#4f7a52] shadow-[0_0_0_2px_#ffffff]" />
          </div>

          {/* ================= OWNER INFO ================= */}

          <div className="hidden min-w-0 sm:block">

            <div className="flex items-center gap-1.5">

              <p className="max-w-[180px] truncate text-[15px] font-bold leading-tight text-[#292722]">
                {ownerName}
              </p>

              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#8f887f]" />

            </div>

            <p
              className="mt-1 max-w-[210px] truncate text-[12px] font-medium leading-tight text-[#77736d]"
              title={ownerEmail}
            >
              {ownerEmail}
            </p>

          </div>
        </div>
      </div>
    </header>
  );
}
