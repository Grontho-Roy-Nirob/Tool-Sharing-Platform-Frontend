"use client";

import { Bell, Menu } from "lucide-react";
import Link from "next/link";

interface RenterHeaderProps {
  renter?: {
    fullName?: string;
    email?: string;
    profileImage?: string;
  } | null;
  onMenuClick?: () => void;
}

export default function RenterHeader({
  renter,
  onMenuClick,
}: RenterHeaderProps) {
  const name = renter?.fullName || "Renter";
  const email = renter?.email || "";
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-[#292b30] bg-[#090a0c]/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#292b30] bg-[#0d0e10] text-[#9ca3af] transition hover:text-white lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Page heading */}
          <div>
            <h1 className="text-lg font-semibold text-white sm:text-xl">
              Dashboard
            </h1>

            <p className="hidden text-sm text-[#71717a] sm:block">
              Manage your ToolShire account
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#292b30] bg-[#0d0e10] text-[#9ca3af] transition hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />

            {/* Notification indicator */}
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-white" />
          </button>

          {/* Profile */}
          <Link
            href="/renter/profile"
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-[#17181b]"
          >
            {/* Avatar */}
            {renter?.profileImage ? (
              <img
                src={renter.profileImage}
                alt={name}
                className="h-10 w-10 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-black">
                {initial}
              </div>
            )}

            {/* User information */}
            <div className="hidden text-left sm:block">
              <p className="max-w-32 truncate text-sm font-medium text-white">
                {name}
              </p>

              <p className="max-w-40 truncate text-xs text-[#71717a]">
                {email}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
