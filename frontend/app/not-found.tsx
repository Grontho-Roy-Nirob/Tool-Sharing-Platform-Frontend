"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 py-12 text-slate-900">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-40 -top-40 size-96 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 size-96 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="relative w-full max-w-xl">
        {/* Main Card */}
        <div className="rounded-[32px] border border-slate-200/80 bg-white px-6 py-12 text-center shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:px-12 sm:py-14">

          {/* 404 */}
          <div className="relative mx-auto w-fit">
            <div className="text-[110px] font-black leading-none tracking-[-0.1em] text-blue-600 sm:text-[150px]">
              404
            </div>

            {/* Decorative Line */}
            <div className="mx-auto mt-2 h-1.5 w-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />

            {/* Decorative Dots */}
            <div className="absolute -right-5 top-2 size-3 rounded-full bg-indigo-500" />
            <div className="absolute -left-5 bottom-4 size-2 rounded-full bg-blue-300" />
          </div>

          {/* Badge */}
          <div className="mx-auto mt-7 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
            <span className="size-1.5 rounded-full bg-blue-600" />
            Error 404
          </div>

          {/* Heading */}
          <h1 className="mt-5 text-3xl font-bold tracking-[-0.05em] text-slate-950 sm:text-4xl">
            Page not found
          </h1>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-500 sm:text-base">
            Sorry, we couldn't find the page you're looking for. It may have
            been moved, deleted, or the URL might be incorrect.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {/* Go Home */}
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(37,99,235,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-[0_16px_30px_rgba(37,99,235,0.28)] active:translate-y-0"
            >
              <Home className="size-4" />
              Go Home
            </Link>

            {/* Go Back */}
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 active:translate-y-0"
            >
              <ArrowLeft className="size-4" />
              Go Back
            </button>
          </div>
        </div>

        {/* Branding */}
        <div className="mt-7 flex items-center justify-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.20)]">
            T
          </div>

          <span className="text-sm font-bold tracking-[-0.02em] text-slate-500">
            ToolShare
          </span>
        </div>
      </div>
    </main>
  );
}