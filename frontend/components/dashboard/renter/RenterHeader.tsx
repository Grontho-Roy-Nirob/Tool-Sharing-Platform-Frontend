"use client";

import Link from "next/link";

interface RenterHeaderProps {
  renter?: {
    fullName?: string;
    email?: string;
    profileImage?: string;
  } | null;
}

export default function RenterHeader({ renter }: RenterHeaderProps) {
  const name = renter?.fullName || "Renter";
  const email = renter?.email || "";

  return (
    <header className="sticky top-0 z-30 border-b border-[#e7dfd4] bg-[#faf8f3]/95 backdrop-blur-xl">
      <div className="flex min-h-[82px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LEFT SIDE */}

        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          {/* PAGE HEADING */}

          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#c1502e]">
              Renter Workspace
            </p>

            <h1 className="mt-1 truncate text-lg font-bold text-[#292722] sm:text-xl">
              Manage your ToolShare account
            </h1>

            <p className="mt-1 hidden text-xs font-medium text-[#77736d] sm:block">
              Browse tools, manage rentals and keep your profile up to date.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <Link
          href="/renter/profile"
          className="ml-3 hidden min-w-0 rounded-2xl bg-white/70 px-4 py-2.5 shadow-sm transition-all hover:bg-white hover:shadow-md sm:block"
        >
          <p className="max-w-[180px] truncate text-[15px] font-bold leading-tight text-[#292722]">
            {name}
          </p>

          <p
            className="mt-1 max-w-[210px] truncate text-[12px] font-medium leading-tight text-[#77736d]"
            title={email}
          >
            {email}
          </p>
        </Link>
      </div>
    </header>
  );
}
