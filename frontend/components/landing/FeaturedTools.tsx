"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, MapPin, Loader2, Sparkles } from "lucide-react";
import { getPublicTools, PublicTool } from "@/lib/toolapi";

const FeaturedTools = () => {
  const [tools, setTools] = useState<PublicTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        setError(false);

        const data = await getPublicTools();
        setTools(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch public tools:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  return (
    <section
      id="tools"
      className="mx-auto max-w-[1200px] px-4 py-24 sm:px-8 sm:py-28"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#E8A33D]/20 text-[#C1502E]">
              <Sparkles className="size-4" />
            </span>

            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#C1502E]">
              Featured tools
            </span>
          </div>

          <h2 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight text-[#211F1C] sm:text-5xl">
            Tools ready when
            <br />
            <span className="text-[#C1502E]">you need them.</span>
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-[#5F5D58] sm:text-lg">
            Discover useful tools shared by people around you and borrow exactly
            what you need.
          </p>
        </div>

        <Link
          href="/tools"
          className="
            group
            inline-flex
            w-fit
            items-center
            gap-2
            border-b-2
            border-[#211F1C]
            pb-1.5
            text-sm
            font-bold
            text-[#211F1C]
            transition-colors
            hover:border-[#C1502E]
            hover:text-[#C1502E]
          "
        >
          View all tools
          <ArrowUpRight
            className="
              size-4
              transition-transform
              duration-200
              group-hover:translate-x-1
              group-hover:-translate-y-1
            "
          />
        </Link>
      </div>

      {/* LOADING */}

      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="
                overflow-hidden
                rounded-2xl
                border
                border-[#211F1C]/10
                bg-white
              "
            >
              <div className="aspect-[4/3] animate-pulse bg-[#211F1C]/5" />

              <div className="space-y-5 p-5">
                <div className="h-3 w-24 animate-pulse rounded bg-[#211F1C]/10" />

                <div className="h-6 w-40 animate-pulse rounded bg-[#211F1C]/10" />

                <div className="h-px bg-[#211F1C]/10" />

                <div className="flex justify-between">
                  <div className="h-4 w-28 animate-pulse rounded bg-[#211F1C]/10" />

                  <div className="h-5 w-20 animate-pulse rounded bg-[#211F1C]/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-[#211F1C]/20
            bg-[#F3EFE7]/60
            px-6
            py-14
            text-center
          "
        >
          <p className="text-sm text-[#6B6A66]">
            We couldn't load the tools right now.
          </p>

          <Link
            href="/tools"
            className="
              mt-4
              inline-flex
              items-center
              gap-2
              text-sm
              font-bold
              text-[#211F1C]
              hover:text-[#C1502E]
            "
          >
            Browse all tools
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      )}

      {/* EMPTY */}

      {!loading && !error && tools.length === 0 && (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-[#211F1C]/20
            bg-[#F3EFE7]/60
            px-6
            py-14
            text-center
          "
        >
          <p className="text-sm text-[#6B6A66]">
            No approved tools are available yet.
          </p>

          <Link
            href="/tools"
            className="
              mt-4
              inline-flex
              items-center
              gap-2
              text-sm
              font-bold
              text-[#211F1C]
              hover:text-[#C1502E]
            "
          >
            Explore tools
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      )}

      {/* TOOL CARDS */}

      {!loading && !error && tools.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {tools.map((tool) => {
            const imageUrl = tool.tool_image
              ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${tool.tool_image}`
              : "/placeholder-tool.jpg";

            return (
              <motion.div
                key={tool.id}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 24,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                    },
                  },
                }}
              >
                <Link href={`/tools/${tool.id}`} className="group block h-full">
                  <article
                    className="
                      h-full
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[#211F1C]/10
                      bg-white
                      shadow-[0_4px_20px_rgba(33,31,28,0.05)]
                      transition-all
                      duration-300
                      group-hover:-translate-y-1.5
                      group-hover:border-[#211F1C]/20
                      group-hover:shadow-[0_16px_35px_rgba(33,31,28,0.12)]
                    "
                  >
                    {/* IMAGE */}

                    <div
                      className="
                        relative
                        aspect-[4/3]
                        overflow-hidden
                        bg-[#EDE8DE]
                      "
                    >
                      <img
                        src={imageUrl}
                        alt={tool.tool_name}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-700
                          ease-out
                          group-hover:scale-110
                        "
                      />

                      {/* Image Overlay */}

                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-[#211F1C]/45
                          via-transparent
                          to-transparent
                          opacity-70
                        "
                      />

                      {/* Category */}

                      <div
                        className="
                          absolute
                          left-4
                          top-4
                          rounded-full
                          border
                          border-white/40
                          bg-white/95
                          px-3
                          py-1.5
                          text-[11px]
                          font-bold
                          uppercase
                          tracking-wide
                          text-[#211F1C]
                          shadow-sm
                        "
                      >
                        {tool.category?.name ?? "Uncategorized"}
                      </div>

                      {/* Arrow */}

                      <div
                        className="
                          absolute
                          right-4
                          top-4
                          flex
                          size-10
                          items-center
                          justify-center
                          rounded-full
                          bg-[#211F1C]
                          text-[#F3EFE7]
                          opacity-0
                          shadow-lg
                          transition-all
                          duration-300
                          group-hover:translate-x-0
                          group-hover:opacity-100
                        "
                      >
                        <ArrowUpRight className="size-5" />
                      </div>

                      {/* Bottom Price */}

                      <div
                        className="
                          absolute
                          bottom-4
                          left-4
                          flex
                          items-baseline
                          gap-1
                          rounded-xl
                          bg-white
                          px-3.5
                          py-2
                          shadow-lg
                        "
                      >
                        <span className="text-lg font-black text-[#211F1C]">
                          ৳{Number(tool.rental_price_per_day).toLocaleString()}
                        </span>

                        <span className="text-[11px] font-medium text-[#77736D]">
                          /day
                        </span>
                      </div>
                    </div>

                    {/*  CONTENT */}

                    <div className="p-5">
                      {/* Tool Name */}

                      <div className="flex items-start justify-between gap-4">
                        <h3
                          className="
                            line-clamp-1
                            font-[family-name:var(--font-display)]
                            text-xl
                            font-bold
                            text-[#211F1C]
                            transition-colors
                            group-hover:text-[#C1502E]
                          "
                        >
                          {tool.tool_name}
                        </h3>

                        <ArrowUpRight
                          className="
                            mt-0.5
                            size-5
                            shrink-0
                            text-[#AAA69E]
                            transition-all
                            duration-300
                            group-hover:-translate-y-0.5
                            group-hover:translate-x-0.5
                            group-hover:text-[#C1502E]
                          "
                        />
                      </div>

                      {/* Location */}

                      <div
                        className="
                          mt-4
                          flex
                          items-center
                          gap-2
                          text-sm
                          text-[#77736D]
                        "
                      >
                        <span
                          className="
                            flex
                            size-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#C1502E]/10
                          "
                        >
                          <MapPin className="size-3.5 text-[#C1502E]" />
                        </span>

                        <span className="truncate">{tool.location}</span>
                      </div>

                      {/* Bottom Divider */}

                      <div className="mt-5 border-t border-[#211F1C]/10 pt-4">
                        <div className="flex items-center justify-between">
                          <span
                            className="
                              text-xs
                              font-semibold
                              uppercase
                              tracking-wider
                              text-[#96928B]
                            "
                          >
                            Available for rent
                          </span>

                          <span
                            className="
                              text-xs
                              font-bold
                              text-[#211F1C]
                              transition-colors
                              group-hover:text-[#C1502E]
                            "
                          >
                            View details →
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </section>
  );
};

export default FeaturedTools;
