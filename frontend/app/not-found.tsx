"use client";
import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090a0c] px-6 text-white">
      <div className="w-full max-w-lg text-center">
        {/* 404 */}
        <div className="relative mx-auto w-fit">
          <span className="select-none text-[120px] font-bold leading-none tracking-[-0.08em] text-white/[0.04] sm:text-[160px]">
            404
          </span>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-20 items-center justify-center rounded-3xl border border-[#292b30] bg-[#0d0e10] shadow-[0_10px_40px_rgba(0,0,0,0.3)] sm:size-24">
              <Search className="size-8 text-[#71717a] sm:size-10" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="mt-8 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#71717a] sm:text-base">
          The page you're looking for doesn't exist or may have been moved
          somewhere else.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#101114] transition hover:bg-[#e4e4e7] active:scale-[0.98]"
          >
            <Home className="size-4" />
            Go Home
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#292b30] bg-[#0d0e10] px-6 py-3 text-sm font-medium text-white transition hover:bg-white/5 active:scale-[0.98]"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>
        </div>

        {/* Branding */}
        <div className="mt-12 flex items-center justify-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-white text-xs font-bold text-[#101114]">
            T
          </span>

          <span className="text-sm font-semibold text-[#52525b]">
            ToolShare
          </span>
        </div>
      </div>
    </main>
  );
}
