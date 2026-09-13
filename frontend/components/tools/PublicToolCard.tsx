"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { PublicTool } from "@/lib/toolapi";

interface PublicToolCardProps {
  tool: PublicTool;
}

export default function PublicToolCard({ tool }: PublicToolCardProps) {
  const imageUrl = tool.tool_image
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${tool.tool_image}`
    : "/placeholder-tool.jpg";

  return (
    <Link
      href={`/tools/${tool.id}`}
      className="group block overflow-hidden rounded-3xl border border-[#292b30] bg-[#0d0e10] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#45474d]"
    >
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-[#151619]">
        <img
          src={imageUrl}
          alt={tool.tool_name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Availability */}
        <div className="absolute left-4 top-4">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-md ${
              tool.is_available
                ? "border-white/10 bg-black/60 text-white"
                : "border-white/10 bg-black/60 text-[#888991]"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                tool.is_available ? "bg-emerald-400" : "bg-[#686a72]"
              }`}
            />
            {tool.is_available ? "Available" : "Unavailable"}
          </span>
        </div>

        {/* Arrow */}
        <div className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-[#686a72]">
              {tool.category?.name ?? "Uncategorized"}
            </p>

            <h2 className="mt-2 truncate text-xl font-medium tracking-[-0.03em] text-white">
              {tool.tool_name}
            </h2>
          </div>

          <span className="shrink-0 text-sm font-medium text-white">
            ৳{Number(tool.rental_price_per_day).toLocaleString()}
            <span className="text-[#686a72]">/day</span>
          </span>
        </div>

        {/* Meta */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-1.5 text-sm text-[#7d7f87]">
            <MapPin className="size-4 shrink-0" />

            <span className="truncate">{tool.location}</span>
          </div>

          <span className="shrink-0 text-xs text-[#686a72]">{tool.brand}</span>
        </div>
      </div>
    </Link>
  );
}
