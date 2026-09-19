"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowDownUp,
  ChevronDown,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

import { getPublicTools, PublicTool } from "@/lib/toolapi";
import PublicToolCard from "@/components/tools/PublicToolCard";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut" as const,
    },
  },
};

export default function ToolsPage() {
  const [tools, setTools] = useState<PublicTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        setError(false);

        const data = await getPublicTools();
        setTools(data);
      } catch (err) {
        console.error("Failed to load tools:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  /* ================= FILTER OPTIONS ================= */

  const categories = useMemo(() => {
    return Array.from(
      new Map(
        tools
          .filter((tool) => tool.category)
          .map((tool) => [tool.category!.id, tool.category!.name]),
      ).values(),
    );
  }, [tools]);

  const locations = useMemo(() => {
    return Array.from(
      new Set(tools.map((tool) => tool.location).filter(Boolean)),
    );
  }, [tools]);

  /* ================= FILTER + SEARCH + SORT ================= */

  const filteredTools = useMemo(() => {
    let result = [...tools];

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((tool) =>
        [
          tool.tool_name,
          tool.brand,
          tool.description,
          tool.location,
          tool.category?.name,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query)),
      );
    }

    if (category !== "all") {
      result = result.filter((tool) => tool.category?.name === category);
    }

    if (location !== "all") {
      result = result.filter((tool) => tool.location === location);
    }

    if (availability === "available") {
      result = result.filter((tool) => tool.is_available);
    }

    if (availability === "unavailable") {
      result = result.filter((tool) => !tool.is_available);
    }

    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.rental_price_per_day) - Number(b.rental_price_per_day),
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.rental_price_per_day) - Number(a.rental_price_per_day),
      );
    }

    if (sort === "name") {
      result.sort((a, b) => a.tool_name.localeCompare(b.tool_name));
    }

    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }

    return result;
  }, [tools, search, category, location, availability, sort]);

  const hasFilters =
    search ||
    category !== "all" ||
    location !== "all" ||
    availability !== "all" ||
    sort !== "newest";

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setLocation("all");
    setAvailability("all");
    setSort("newest");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-[#FCF9FF] to-[#F3CCFF]/25 px-4 pb-24 pt-32 text-[#281832] sm:px-8">
      {/* ================= BACKGROUND GLOW ================= */}

      <div className="pointer-events-none absolute left-[-180px] top-[120px] h-[380px] w-[380px] rounded-full bg-[#E9D5FF]/30 blur-[120px]" />

      <div className="pointer-events-none absolute right-[-180px] top-[450px] h-[420px] w-[420px] rounded-full bg-[#FFF7D6]/35 blur-[130px]" />

      <div className="pointer-events-none absolute bottom-[100px] left-[35%] h-[300px] w-[300px] rounded-full bg-[#E9D5FF]/20 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-[1280px]">
        {/* ================= HEADER ================= */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D8C2F0] bg-white/80 px-4 py-2 text-sm font-semibold text-[#7C3AED] shadow-[0_8px_25px_rgba(124,58,237,0.08)] backdrop-blur-xl">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-2 animate-ping rounded-full bg-[#A855F7]/40" />
              <span className="relative size-2 rounded-full bg-[#A855F7]" />
            </span>
            Community marketplace
          </div>

          <h1 className="max-w-3xl text-4xl font-medium tracking-[-0.06em] text-[#281832] sm:text-6xl">
            Find the{" "}
            <span className="bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#C084FC] bg-clip-text text-transparent">
              right tool
            </span>{" "}
            for the job.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#6d5c76] sm:text-lg">
            Browse tools shared by people in your community. Search, filter, and
            find exactly what you need.
          </p>
        </motion.div>

        {/* ================================================= */}
        {/* PREMIUM SEARCH + FILTER AREA */}
        {/* ================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-10"
        >
          {/* ================= SEARCH ================= */}

          <div className="relative">
            {/* Gradient border */}
            <div className="absolute -inset-[1px] rounded-[24px] bg-gradient-to-r from-[#C084FC]/70 via-[#E9D5FF] to-[#FDE68A]/70 opacity-80 blur-[1px]" />

            <div className="relative flex items-center rounded-[23px] border border-white/80 bg-white/95 px-4 shadow-[0_16px_45px_rgba(124,58,237,0.10)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_20px_55px_rgba(124,58,237,0.14)] focus-within:border-[#A855F7]/60 focus-within:shadow-[0_20px_55px_rgba(124,58,237,0.16)]">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F3E8FF] to-[#EDE9FE] text-[#7C3AED] shadow-sm">
                <Search className="size-5" />
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools, brands, locations..."
                className="h-16 w-full bg-transparent px-4 text-sm font-medium text-[#281832] outline-none placeholder:text-[#A298A9]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#F3E8FF] text-[#806D8D] transition-all duration-300 hover:rotate-90 hover:bg-[#E9D5FF] hover:text-[#7C3AED]"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          {/* ================= FILTER PANEL ================= */}

          <div className="relative mt-4 overflow-hidden rounded-[26px] border border-[#E4D5EF] bg-white/75 p-3 shadow-[0_14px_40px_rgba(92,45,130,0.08)] backdrop-blur-xl">
            {/* top gradient line */}
            <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#A855F7] to-transparent opacity-70" />

            <div className="mb-3 flex items-center gap-2 px-1">
              <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#F3E8FF] to-[#FFF7D6] text-[#7C3AED]">
                <SlidersHorizontal className="size-4" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#3C3043]">
                  Refine your search
                </p>

                <p className="text-[10px] text-[#998DA0]">
                  Filter tools by category, location and availability
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {/* ================= CATEGORY ================= */}

              <div className="group relative">
                <div className="mb-1.5 flex items-center gap-1.5 px-1">
                  <Tag className="size-3 text-[#A855F7]" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#817487]">
                    Category
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-[#E2D3ED] bg-gradient-to-br from-white to-[#FBF8FF] px-4 pr-11 text-sm font-semibold text-[#4E4155] shadow-[0_5px_15px_rgba(92,45,130,0.05)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C084FC] hover:shadow-[0_10px_22px_rgba(124,58,237,0.10)] focus:border-[#A855F7] focus:ring-4 focus:ring-[#E9D5FF]/60"
                  >
                    <option value="all">All categories</option>

                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg bg-[#F3E8FF] text-[#7C3AED]">
                    <ChevronDown className="size-3.5" />
                  </div>
                </div>
              </div>

              {/* ================= LOCATION ================= */}

              <div className="group relative">
                <div className="mb-1.5 flex items-center gap-1.5 px-1">
                  <MapPin className="size-3 text-[#A855F7]" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#817487]">
                    Location
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-[#E2D3ED] bg-gradient-to-br from-white to-[#FBF8FF] px-4 pr-11 text-sm font-semibold text-[#4E4155] shadow-[0_5px_15px_rgba(92,45,130,0.05)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C084FC] hover:shadow-[0_10px_22px_rgba(124,58,237,0.10)] focus:border-[#A855F7] focus:ring-4 focus:ring-[#E9D5FF]/60"
                  >
                    <option value="all">All locations</option>

                    {locations.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg bg-[#F3E8FF] text-[#7C3AED]">
                    <ChevronDown className="size-3.5" />
                  </div>
                </div>
              </div>

              {/* ================= AVAILABILITY ================= */}

              <div className="group relative">
                <div className="mb-1.5 flex items-center gap-1.5 px-1">
                  <Sparkles className="size-3 text-[#A855F7]" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#817487]">
                    Availability
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-[#E2D3ED] bg-gradient-to-br from-white to-[#FBF8FF] px-4 pr-11 text-sm font-semibold text-[#4E4155] shadow-[0_5px_15px_rgba(92,45,130,0.05)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C084FC] hover:shadow-[0_10px_22px_rgba(124,58,237,0.10)] focus:border-[#A855F7] focus:ring-4 focus:ring-[#E9D5FF]/60"
                  >
                    <option value="all">Any availability</option>

                    <option value="available">Available</option>

                    <option value="unavailable">Unavailable</option>
                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg bg-[#F3E8FF] text-[#7C3AED]">
                    <ChevronDown className="size-3.5" />
                  </div>
                </div>
              </div>

              {/* ================= SORT ================= */}

              <div className="group relative">
                <div className="mb-1.5 flex items-center gap-1.5 px-1">
                  <ArrowDownUp className="size-3 text-[#A855F7]" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#817487]">
                    Sort by
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-[#E2D3ED] bg-gradient-to-br from-white to-[#FBF8FF] px-4 pr-11 text-sm font-semibold text-[#4E4155] shadow-[0_5px_15px_rgba(92,45,130,0.05)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C084FC] hover:shadow-[0_10px_22px_rgba(124,58,237,0.10)] focus:border-[#A855F7] focus:ring-4 focus:ring-[#E9D5FF]/60"
                  >
                    <option value="newest">Newest</option>

                    <option value="price-low">Price: Low to High</option>

                    <option value="price-high">Price: High to Low</option>

                    <option value="name">Name: A-Z</option>
                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg bg-[#F3E8FF] text-[#7C3AED]">
                    <ChevronDown className="size-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= ACTIVE FILTER ================= */}

          {hasFilters && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center justify-between rounded-2xl border border-[#E4D5A7] bg-gradient-to-r from-[#FFFBEA] via-white to-[#F7F0FF] px-4 py-3 shadow-[0_8px_25px_rgba(124,58,237,0.06)]"
            >
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-[#FFF1B8]">
                  <Sparkles className="size-3.5 text-[#9A7B16]" />
                </div>

                <p className="text-sm font-medium text-[#6D6172]">
                  <span className="font-bold text-[#281832]">
                    {filteredTools.length}
                  </span>{" "}
                  {filteredTools.length === 1 ? "tool" : "tools"} found
                </p>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-[#D8C2F0] bg-white px-3.5 py-2 text-xs font-bold text-[#7C3AED] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#A855F7] hover:bg-[#F8F1FF] hover:shadow-md"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-[26px] border border-[#E4D5EF] bg-white shadow-[0_10px_30px_rgba(92,45,130,0.07)]"
              >
                <div className="aspect-[4/3] animate-pulse bg-gradient-to-br from-[#EDE9FE] via-white to-[#FFF7D6]" />

                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 animate-pulse rounded-full bg-[#D8C2F0]" />

                  <div className="h-5 w-32 animate-pulse rounded-full bg-[#EDE9FE]" />

                  <div className="flex justify-between">
                    <div className="h-3 w-24 animate-pulse rounded-full bg-[#EDE9FE]" />

                    <div className="h-3 w-16 animate-pulse rounded-full bg-[#FFF7D6]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= ERROR ================= */}

        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-8 overflow-hidden rounded-[28px] border border-[#D8C2F0] bg-gradient-to-br from-[#F3E8FF] via-white to-[#FFF7D6] px-6 py-16 text-center shadow-[0_18px_50px_rgba(124,58,237,0.10)]"
          >
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#D8C2F0] bg-white shadow-md">
              <X className="size-6 text-[#7C3AED]" />
            </div>

            <p className="mt-5 text-lg font-bold text-[#281832]">
              Unable to load tools.
            </p>

            <p className="mt-2 text-sm text-[#6d5c76]">
              Please make sure the backend is running and try again.
            </p>
          </motion.div>
        )}

        {/* ================= EMPTY ================= */}

        {!loading && !error && filteredTools.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-8 overflow-hidden rounded-[28px] border border-[#D8C2F0] bg-gradient-to-br from-[#FFFBEA] via-white to-[#F3E8FF] px-6 py-16 text-center shadow-[0_18px_50px_rgba(124,58,237,0.09)]"
          >
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#D8C2F0] bg-white shadow-md">
              <Search className="size-6 text-[#7C3AED]" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#281832]">
              No tools found
            </h2>

            <p className="mt-2 text-sm text-[#6d5c76]">
              Try changing your search or filters.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#7C3AED] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(124,58,237,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(124,58,237,0.32)]"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        )}

        {/* ================= TOOLS ================= */}

        {!loading && !error && filteredTools.length > 0 && (
          <div className="relative mt-9">
            <div className="pointer-events-none absolute inset-x-10 top-0 h-32 rounded-full bg-[#E9D5FF]/20 blur-3xl" />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredTools.map((tool) => (
                <motion.div
                  key={tool.id}
                  variants={cardVariants}
                  className="group min-w-0 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="rounded-[26px] transition-all duration-300 group-hover:shadow-[0_22px_55px_rgba(124,58,237,0.13)]">
                    <PublicToolCard tool={tool} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}
