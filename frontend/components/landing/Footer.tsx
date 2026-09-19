import Link from "next/link";
import {
  ArrowUpRight,
  Hammer,
  Share2,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#211F1C]/15 bg-[#F3EFE7]">
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-12">

          {/* BRAND */}

          <div>
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >
              {/* ToolShare Logo */}

              <span
                className="
                  relative
                  flex size-11
                  items-center justify-center
                  overflow-hidden
                  border-2 border-[#211F1C]
                  bg-[#E8A33D]
                  text-[#211F1C]
                  shadow-[3px_3px_0_#211F1C]
                  transition-all
                  duration-200
                  group-hover:-translate-y-0.5
                  group-hover:shadow-[4px_4px_0_#211F1C]
                "
              >
                {/* Hammer */}

                <Hammer
                  className="
                    relative z-10
                    size-5.5
                    -rotate-12
                    stroke-[2.5]
                    transition-transform
                    duration-300
                    group-hover:rotate-0
                  "
                />

                {/* Share */}

                <span
                  className="
                    absolute
                    bottom-1
                    right-1
                    flex size-4
                    items-center justify-center
                    rounded-full
                    bg-[#211F1C]
                    text-[#F3EFE7]
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                >
                  <Share2 className="size-2.5 stroke-[2.5]" />
                </span>
              </span>

              {/* Brand Name */}

              <span
                className="
                  font-[family-name:var(--font-display)]
                  text-xl
                  font-bold
                  text-[#211F1C]
                "
              >
                ToolShare
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#6B6A66]">
              A simple way to rent useful tools and share the
              equipment you already own.
            </p>

            {/* Social Icons */}

            <div className="mt-6 flex items-center gap-2">
              <Link
                href="/"
                aria-label="Facebook"
                className="
                  flex size-9
                  items-center justify-center
                  border border-[#211F1C]/20
                  bg-white
                  text-xs font-bold
                  text-[#6B6A66]
                  transition-all
                  hover:-translate-y-0.5
                  hover:border-[#211F1C]
                  hover:text-[#211F1C]
                "
              >
                f
              </Link>

              <Link
                href="/"
                aria-label="Instagram"
                className="
                  flex size-9
                  items-center justify-center
                  border border-[#211F1C]/20
                  bg-white
                  text-xs font-bold
                  text-[#6B6A66]
                  transition-all
                  hover:-translate-y-0.5
                  hover:border-[#211F1C]
                  hover:text-[#211F1C]
                "
              >
                ◎
              </Link>

              <Link
                href="/"
                aria-label="LinkedIn"
                className="
                  flex size-9
                  items-center justify-center
                  border border-[#211F1C]/20
                  bg-white
                  text-[11px] font-bold
                  text-[#6B6A66]
                  transition-all
                  hover:-translate-y-0.5
                  hover:border-[#211F1C]
                  hover:text-[#211F1C]
                "
              >
                in
              </Link>
            </div>
          </div>

          {/* PLATFORM */}

          <div>
            <h3 className="text-sm font-semibold text-[#211F1C]">
              Platform
            </h3>

            <div className="mt-5 space-y-3">
              <Link
                href="/tools"
                className="
                  block text-sm
                  text-[#6B6A66]
                  transition-colors
                  hover:text-[#211F1C]
                "
              >
                Browse tools
              </Link>

              <Link
                href="/register"
                className="
                  block text-sm
                  text-[#6B6A66]
                  transition-colors
                  hover:text-[#211F1C]
                "
              >
                Become an owner
              </Link>

              <Link
                href="/login"
                className="
                  block text-sm
                  text-[#6B6A66]
                  transition-colors
                  hover:text-[#211F1C]
                "
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* SUPPORT */}

          <div>
            <h3 className="text-sm font-semibold text-[#211F1C]">
              Support
            </h3>

            <div className="mt-5 space-y-3">
              <Link
                href="/"
                className="
                  group
                  flex items-center gap-1
                  text-sm
                  text-[#6B6A66]
                  transition-colors
                  hover:text-[#211F1C]
                "
              >
                Help center

                <ArrowUpRight
                  className="
                    size-3.5
                    transition-transform
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                />
              </Link>

              <Link
                href="/"
                className="
                  group
                  flex items-center gap-1
                  text-sm
                  text-[#6B6A66]
                  transition-colors
                  hover:text-[#211F1C]
                "
              >
                Privacy

                <ArrowUpRight
                  className="
                    size-3.5
                    transition-transform
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                />
              </Link>

              <Link
                href="/"
                className="
                  group
                  flex items-center gap-1
                  text-sm
                  text-[#6B6A66]
                  transition-colors
                  hover:text-[#211F1C]
                "
              >
                Terms

                <ArrowUpRight
                  className="
                    size-3.5
                    transition-transform
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                />
              </Link>
            </div>
          </div>

          {/* ABOUT */}

          <div>
            <h3 className="text-sm font-semibold text-[#211F1C]">
              About
            </h3>

            <p className="mt-5 text-sm leading-7 text-[#6B6A66]">
              Making local tool sharing easier, more affordable
              and more convenient.
            </p>
          </div>
        </div>

        {/*  BOTTOM */}

        <div
          className="
            mt-12
            flex flex-col gap-3
            border-t border-[#211F1C]/15
            pt-6
            text-sm text-[#8A8983]
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p>
            © 2026 ToolShare. All rights reserved.
          </p>

          <p>
            Built for a smarter sharing community.
          </p>
        </div>
      </div>
    </footer>
  );
}