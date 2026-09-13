"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, MapPin, Loader2 } from "lucide-react";
import { getPublicTools, PublicTool } from "@/lib/toolapi";

const headerVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut" as const,
    },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

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

        // Show only the first 3 on the landing page
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
      className="mx-auto max-w-1152px px-4 py-24 sm:px-8 sm:py-32"
    >
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
      >
        <div>
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#292b30] bg-[#0d0e10] px-4 py-2 text-sm text-[#a5a5ab]">
            <span
              className="size-1.5 rounded-full bg-white"
              aria-hidden="true"
            />
            Explore the community
          </div>

          {/* Heading */}
          <h2 className="max-w-xl text-4xl font-medium tracking-[-0.06em] text-white sm:text-5xl">
            Tools ready when you need them.
          </h2>

          {/* Description */}
          <p className="mt-5 max-w-xl text-base leading-7 text-[#96979f] sm:text-lg">
            Discover useful tools shared by people around you and borrow exactly
            what you need.
          </p>
        </div>

        {/* View All */}
        <Link
          href="/tools"
          className="group flex shrink-0 items-center gap-2 text-sm font-medium text-white"
        >
          View all tools
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-3xl border border-[#292b30] bg-[#0d0e10]"
            >
              <div className="aspect-4/3 animate-pulse bg-[#151619]" />

              <div className="space-y-4 p-5">
                <div className="h-3 w-24 animate-pulse rounded bg-[#202126]" />
                <div className="h-6 w-40 animate-pulse rounded bg-[#202126]" />

                <div className="flex justify-between">
                  <div className="h-4 w-28 animate-pulse rounded bg-[#202126]" />
                  <div className="h-4 w-20 animate-pulse rounded bg-[#202126]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mt-12 rounded-3xl border border-[#292b30] bg-[#0d0e10] px-6 py-12 text-center">
          <p className="text-sm text-[#96979f]">
            We couldn't load the tools right now.
          </p>

          <Link
            href="/tools"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white"
          >
            Browse all tools
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && tools.length === 0 && (
        <div className="mt-12 rounded-3xl border border-[#292b30] bg-[#0d0e10] px-6 py-12 text-center">
          <p className="text-sm text-[#96979f]">
            No approved tools are available yet.
          </p>

          <Link
            href="/tools"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white"
          >
            Explore tools
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      )}

      {/* Tool Cards */}
      {!loading && !error && tools.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {tools.map((tool) => {
            const imageUrl = tool.tool_image
              ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${tool.tool_image}`
              : "/placeholder-tool.jpg";

            return (
              <motion.div
                key={tool.id}
                variants={cardVariants}
                whileHover={{
                  y: -6,
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                <Link
                  href={`/tools/${tool.id}`}
                  className="group block overflow-hidden rounded-3xl border border-[#292b30] bg-[#0d0e10] transition-colors duration-300 hover:border-[#45474d]"
                >
                  {/* Image */}
                  <div className="aspect-4/3 overflow-hidden bg-[#151619]">
                    <img
                      src={imageUrl}
                      alt={tool.tool_name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wider text-[#686a72]">
                          {tool.category?.name ?? "Uncategorized"}
                        </p>

                        <h3 className="mt-2 truncate text-xl font-medium tracking-[-0.03em] text-white">
                          {tool.tool_name}
                        </h3>
                      </div>

                      <ArrowUpRight className="size-5 shrink-0 text-[#686a72] transition-colors group-hover:text-white" />
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-1.5 text-sm text-[#7d7f87]">
                        <MapPin className="size-4 shrink-0" />

                        <span className="truncate">{tool.location}</span>
                      </div>

                      <span className="shrink-0 text-sm font-medium text-white">
                        ৳{Number(tool.rental_price_per_day).toLocaleString()}
                        /day
                      </span>
                    </div>
                  </div>
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
