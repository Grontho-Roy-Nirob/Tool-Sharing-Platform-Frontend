"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "Pricing",
    href: "#pricing",
  },
  {
    label: "Docs",
    href: "#docs",
  },
  {
    label: "Blog",
    href: "#blog",
  },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      aria-label="Main navigation"
      className="mx-auto max-w-[1152px] px-4 py-6 sm:px-8 sm:py-8"
    >
      <div className="relative flex min-h-[72px] items-center rounded-full border border-[#292b30] bg-[#0d0e10] px-4 shadow-[0_10px_40px_rgba(0,0,0,0.22)] sm:h-[92px] sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="ToolShare home"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-white text-lg font-semibold text-[#101114] sm:size-12 sm:text-[21px]">
            T
          </span>

          <span className="text-xl font-semibold tracking-[-0.04em] text-white sm:text-[23px]">
            ToolShare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="mx-auto hidden items-center gap-8 md:flex lg:gap-12">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-base tracking-[-0.03em] text-[#a5a5ab] transition-colors hover:text-white lg:text-[18px]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="ml-auto hidden shrink-0 items-center gap-4 sm:gap-6 md:flex">
          <Link
            href="/login"
            className="text-base tracking-[-0.03em] text-[#a5a5ab] transition-colors hover:text-white lg:text-[18px]"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="rounded-full bg-white px-5 py-2.5 text-base font-medium tracking-[-0.03em] text-[#101114] transition-transform hover:scale-[1.03] active:scale-[0.98] lg:px-6 lg:py-3 lg:text-[18px]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="ml-auto flex size-10 items-center justify-center rounded-full border border-[#292b30] text-white transition-colors hover:bg-white/10 md:hidden"
        >
          {mobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+12px)] rounded-3xl border border-[#292b30] bg-[#0d0e10] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.35)] md:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-[#a5a5ab] transition-colors hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}

              <div className="my-2 h-px bg-[#292b30]" />

              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-[#a5a5ab] transition-colors hover:bg-white/5 hover:text-white"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-1 rounded-full bg-white px-4 py-3 text-center font-medium text-[#101114] transition-transform hover:scale-[1.02]"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
