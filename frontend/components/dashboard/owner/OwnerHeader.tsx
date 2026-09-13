"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

interface Owner {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profile_image?: string;
}

interface OwnerHeaderProps {
  owner: Owner | null;
}

export default function OwnerHeader({ owner }: OwnerHeaderProps) {
  const ownerName = owner?.name || "Owner";

  const initial = ownerName.charAt(0).toUpperCase() || "O";

  return (
    <header className="sticky top-0 z-40 flex h-[88px] items-center justify-between border-b border-[#25272c] bg-[#08090b]/95 px-6 backdrop-blur sm:px-8">
      {/* LEFT */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-[#555a63]">
          Owner Panel
        </p>

        <h1 className="mt-1 text-xl font-bold sm:text-2xl">
          Manage your ToolShare account
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 sm:gap-5">
        {/* Notification */}
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#25272c] bg-[#0d0f11] text-[#a1a5ad] transition hover:bg-[#15171a] hover:text-white"
        >
          <Bell className="h-[18px] w-[18px]" />
        </button>

        {/* Owner Profile */}
        <Link href="/owner/profile" className="flex items-center gap-3">
          {owner?.profile_image ? (
            <img
              src={owner.profile_image}
              alt={ownerName}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#202226] text-sm font-semibold text-white">
              {initial}
            </div>
          )}

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white">{ownerName}</p>

            <p className="mt-0.5 text-xs text-[#737780]">
              {owner?.email || ""}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
