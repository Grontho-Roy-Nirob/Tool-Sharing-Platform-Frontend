"use client";

import { Menu } from "lucide-react";
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
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#090a0c]/90 px-5 backdrop-blur-xl lg:px-8">
      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-white/60 transition hover:bg-white/10 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <p className="text-sm text-white/40">Administration</p>

          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium">{admin?.full_name || "Admin"}</p>

          <p className="text-xs text-white/40">
            {admin?.email || "Administrator"}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-sm font-semibold">
          {initials}
        </div>
      </div>
    </header>
  );
}
