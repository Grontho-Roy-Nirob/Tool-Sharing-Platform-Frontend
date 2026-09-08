"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090a0c] px-6 text-white">
      <div className="w-full max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl border border-[#292b30] bg-[#0d0e10]">
          <AlertTriangle className="size-9 text-[#a5a5ab]" />
        </div>

        {/* Error Code */}
        <p className="mt-8 text-sm font-medium uppercase tracking-[0.2em] text-[#71717a]">
          Something went wrong
        </p>

        {/* Title */}
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
          Unexpected error
        </h1>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-[#a5a5ab]">
          We ran into an unexpected problem while loading this page. Please try
          again or return to the ToolShare homepage.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#101114] transition hover:bg-[#e4e4e7] active:scale-[0.98]"
          >
            <RefreshCw className="size-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#292b30] bg-[#0d0e10] px-6 py-3 text-sm font-medium text-white transition hover:bg-white/5 active:scale-[0.98]"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </div>

        {/* Branding */}
        <div className="mt-12 flex items-center justify-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-white text-xs font-bold text-[#101114]">
            T
          </span>

          <span className="text-sm font-semibold text-[#71717a]">
            ToolShare
          </span>
        </div>
      </div>
    </main>
  );
}
