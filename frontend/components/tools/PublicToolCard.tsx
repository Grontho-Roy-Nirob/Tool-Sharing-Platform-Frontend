"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import type { PublicTool } from "@/lib/toolapi";

interface PublicToolCardProps {
  tool: PublicTool;
}

export default function PublicToolCard({ tool }: PublicToolCardProps) {
  const imageUrl = tool.tool_image
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${tool.tool_image}`
    : "/placeholder-tool.jpg";

  return (
    <Link href={`/tools/${tool.id}`} className="group relative block">
      {/* Premium outer glow */}
      <div className="absolute -inset-[1px] rounded-[27px] bg-gradient-to-br from-[#A855F7]/45 via-[#D8B4FE]/20 to-[#FDE68A]/35 opacity-70 blur-[1px] transition-all duration-500 group-hover:opacity-100 group-hover:blur-[2px]" />

      {/* Main Card */}
      <div className="relative overflow-hidden rounded-[26px] border border-[#D8C2F0]/80 bg-white shadow-[0_12px_35px_rgba(92,45,130,0.10)] transition-all duration-500 group-hover:-translate-y-2 group-hover:border-[#A855F7]/60 group-hover:shadow-[0_24px_55px_rgba(124,58,237,0.18)]">
        {/* IMAGE  */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#F3E8FF] via-white to-[#FFF7D6]">
          <img
            src={imageUrl}
            alt={tool.tool_name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
          />

          {/* Premium image overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#281832]/45 via-transparent to-[#7C3AED]/10 opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

          {/* Soft image shine */}
          <div className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-[18deg] bg-white/20 blur-xl transition-all duration-700 group-hover:left-[120%]" />

          {/* Availability */}
          <div className="absolute left-3.5 top-3.5">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold shadow-[0_6px_18px_rgba(0,0,0,0.10)] backdrop-blur-xl ${
                tool.is_available
                  ? "border-white/70 bg-white/90 text-[#7C3AED]"
                  : "border-white/60 bg-white/85 text-[#756A7D]"
              }`}
            >
              <span className="relative flex size-2">
                {tool.is_available && (
                  <span className="absolute inline-flex size-2 animate-ping rounded-full bg-[#A855F7]/50" />
                )}

                <span
                  className={`relative size-2 rounded-full ${
                    tool.is_available ? "bg-[#A855F7]" : "bg-[#AAA2AE]"
                  }`}
                />
              </span>

              {tool.is_available ? "Available" : "Unavailable"}
            </span>
          </div>

          {/* Category badge */}
          <div className="absolute bottom-3.5 left-3.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-[#281832]/65 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white shadow-lg backdrop-blur-xl">
              <Sparkles className="size-3 text-[#FDE68A]" />

              {tool.category?.name ?? "Uncategorized"}
            </span>
          </div>

          {/* Arrow */}
          <div className="absolute right-3.5 top-3.5 flex size-10 translate-y-1 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#7C3AED] opacity-0 shadow-[0_8px_25px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-6" />
          </div>
        </div>

        {/* CONTENT  */}
        <div className="p-4.5 sm:p-5">
          {/* Category + Price */}
          <div className="flex items-center justify-between gap-3">
            {/* Category */}
            <span className="min-w-0 truncate rounded-full border border-[#D8C2F0]/70 bg-gradient-to-r from-[#F3E8FF] to-[#FAF5FF] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#7C3AED] shadow-sm">
              {tool.category?.name ?? "Uncategorized"}
            </span>

            {/* Price */}
            <div className="shrink-0 rounded-xl border border-[#E9D5FF] bg-gradient-to-br from-[#FAF5FF] to-[#FFF7D6]/70 px-3 py-1.5 text-right shadow-sm">
              <span className="text-[15px] font-extrabold tracking-tight text-[#7C3AED]">
                ৳{Number(tool.rental_price_per_day).toLocaleString()}
              </span>

              <span className="ml-1 text-[9px] font-medium text-[#8B7D92]">
                / day
              </span>
            </div>
          </div>

          {/* Tool Name */}
          <h2 className="mt-4 truncate text-[18px] font-bold tracking-[-0.025em] text-[#281832] transition-colors duration-300 group-hover:text-[#7C3AED]">
            {tool.tool_name}
          </h2>

          {/* Description */}
          {tool.description && (
            <p className="mt-1.5 line-clamp-1 text-[11px] leading-5 text-[#817487]">
              {tool.description}
            </p>
          )}

          {/* Premium Divider */}
          <div className="my-4 h-px bg-gradient-to-r from-transparent via-[#D8C2F0]/70 to-transparent" />

          {/* Meta */}
          <div className="flex items-center gap-2">
            {/* Location */}
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#E8DDF0] bg-[#FAF8FC] px-2.5 py-2 transition-all duration-300 group-hover:border-[#D8C2F0] group-hover:bg-[#F8F2FF]">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#EDE9FE] to-[#F3E8FF] text-[#7C3AED] shadow-sm">
                <MapPin className="size-3.5" />
              </span>

              <div className="min-w-0">
                <p className="text-[8px] font-bold uppercase tracking-wider text-[#A298A9]">
                  Location
                </p>

                <p className="truncate text-[10px] font-semibold text-[#5F5365]">
                  {tool.location}
                </p>
              </div>
            </div>

            {/* Brand */}
            <div className="max-w-[95px] shrink-0 rounded-xl border border-[#F1E2A8] bg-gradient-to-br from-[#FFFBEA] to-[#FFF7D6] px-2.5 py-2 text-center shadow-sm">
              <p className="text-[8px] font-bold uppercase tracking-wider text-[#A38D45]">
                Brand
              </p>

              <p className="mt-0.5 truncate text-[10px] font-bold text-[#806D32]">
                {tool.brand}
              </p>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#A49AA9]">
                ToolShare
              </p>

              <p className="mt-0.5 text-[10px] font-medium text-[#766A7C]">
                View tool details
              </p>
            </div>

            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] text-white shadow-[0_8px_20px_rgba(124,58,237,0.25)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_10px_25px_rgba(124,58,237,0.38)]">
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>

        {/* Bottom premium line */}
        <div className="h-[2px] w-0 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#FDE68A] transition-all duration-500 group-hover:w-full" />
      </div>
    </Link>
  );
}
