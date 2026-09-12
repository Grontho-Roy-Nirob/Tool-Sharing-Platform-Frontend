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
      <Link
        href="/admin/dashboard"
        className="mb-4 inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

      <p className="mt-2 text-sm text-white/40">{description}</p>
    </div>
  );
}
