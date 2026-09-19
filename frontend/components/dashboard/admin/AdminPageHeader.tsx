"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  description: string;
}

export default function AdminPageHeader({
  title,
  description,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-8">
      {/* BACK TO DASHBOARD */}

      <Link
        href="/admin/dashboard"
        className="group mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#8B8177] transition-all duration-200 hover:bg-[#E8A33D]/10 hover:text-[#9A5B13]"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#E8A33D]/15 transition-all duration-200 group-hover:bg-[#E8A33D]/25">
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
        </span>
        Back to Dashboard
      </Link>

      {/* TITLE */}

      <h1 className="text-2xl font-bold tracking-tight text-[#211F1C] sm:text-3xl">
        {title}
      </h1>

      {/* DESCRIPTION */}

      <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#77716A]">
        {description}
      </p>
    </div>
  );
}
