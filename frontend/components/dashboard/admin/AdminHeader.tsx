"use client";

import { ChevronDown, Menu } from "lucide-react";
import { useEffect, useState } from "react";

interface AdminUser {
  id: number;
  full_name: string;
  email: string;
  role: number;
}

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin_user");

    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch {
        setAdmin(null);
      }
    }
  }, []);

  const initials =
    admin?.full_name
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  return (
    <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-[#e7dfd4] bg-[#faf8f3]/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* LEFT SIDE */}

      <div className="flex min-w-0 items-center gap-3">
        {/* MOBILE MENU */}

        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl border border-[#e7dfd4] bg-white/70 p-2 text-[#77736d] shadow-sm transition-all duration-200 hover:border-[#d8cabb] hover:bg-white hover:text-[#c1502e] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* HEADER TEXT */}

        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#c1502e]">
            ToolShare
          </p>

          <h1 className="mt-0.5 truncate text-lg font-bold tracking-tight text-[#292722] sm:text-xl">
            Owner Workspace
          </h1>

          <p className="mt-0.5 hidden truncate text-[11px] font-medium leading-tight text-[#77736d] sm:block">
            Manage your ToolShare account
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="ml-3 flex items-center gap-3 sm:gap-4">
        {/* OWNER PROFILE */}

        <div className="flex items-center gap-2.5 rounded-2xl border border-[#e7dfd4] bg-white/70 px-2.5 py-1.5 shadow-sm sm:px-3">
          {/* AVATAR */}

          <div className="relative shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#e8a33d] to-[#c1502e] text-xs font-bold text-white shadow-md">
              {initials}
            </div>

            {/* ONLINE DOT */}

            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#4f7a52] shadow-[0_0_0_2px_#ffffff]" />
          </div>

          {/* OWNER INFO */}

          <div className="hidden min-w-0 sm:block">
            <div className="flex items-center gap-1.5">
              <p className="max-w-[180px] truncate text-[14px] font-bold leading-tight text-[#292722]">
                {admin?.full_name || "Owner"}
              </p>

              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#8f887f]" />
            </div>

            <p
              className="mt-0.5 max-w-[210px] truncate text-[11px] font-medium leading-tight text-[#77736d]"
              title={admin?.email || "Owner Account"}
            >
              {admin?.email || "Owner Account"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
