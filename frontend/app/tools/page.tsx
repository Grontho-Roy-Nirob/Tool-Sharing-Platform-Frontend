"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowDownUp, Search, SlidersHorizontal, X } from "lucide-react";

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

  /* -------------------------
     Filter options
  ------------------------- */

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

  /* -------------------------
     Filter + Search + Sort
  ------------------------- */

  const filteredTools = useMemo(() => {
    let result = [...tools];

    // Search
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

    // Category
    if (category !== "all") {
      result = result.filter((tool) => tool.category?.name === category);
    }

    // Location
    if (location !== "all") {
      result = result.filter((tool) => tool.location === location);
    }

    // Availability
    if (availability === "available") {
      result = result.filter((tool) => tool.is_available);
    }

    if (availability === "unavailable") {
      result = result.filter((tool) => !tool.is_available);
    }

    // Sorting
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
    <main className="min-h-screen bg-[#090a0c] px-4 pb-24 pt-32 text-white sm:px-8">
      <div className="mx-auto max-w-1152px">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#292b30] bg-[#0d0e10] px-4 py-2 text-sm text-[#a5a5ab]">
            <span className="size-1.5 rounded-full bg-white" />
            Community marketplace
          </div>

          <h1 className="max-w-3xl text-4xl font-medium tracking-[-0.06em] sm:text-6xl">
            Find the right tool for the job.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#96979f] sm:text-lg">
            Browse tools shared by people in your community. Search, filter, and
            find exactly what you need.
          </p>
        </motion.div>

        {/* Search + Filters */}
        <div className="mt-12 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[#686a72]" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools, brands, locations..."
              className="h-14 w-full rounded-2xl border border-[#292b30] bg-[#0d0e10] pl-13 pr-12 text-sm text-white outline-none transition-colors placeholder:text-[#686a72] focus:border-[#45474d]"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#686a72] transition-colors hover:text-white"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="flex flex-1 items-center gap-3 overflow-x-auto">
              <SlidersHorizontal className="hidden size-4 shrink-0 text-[#686a72] lg:block" />

              {/* Category */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 min-w-[160px] rounded-xl border border-[#292b30] bg-[#0d0e10] px-4 text-sm text-[#a5a5ab] outline-none focus:border-[#45474d]"
              >
                <option value="all">All categories</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* Location */}
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-11 min-w-[160px] rounded-xl border border-[#292b30] bg-[#0d0e10] px-4 text-sm text-[#a5a5ab] outline-none focus:border-[#45474d]"
              >
                <option value="all">All locations</option>

                {locations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* Availability */}
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="h-11 min-w-[150px] rounded-xl border border-[#292b30] bg-[#0d0e10] px-4 text-sm text-[#a5a5ab] outline-none focus:border-[#45474d]"
              >
                <option value="all">Any availability</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowDownUp className="size-4 text-[#686a72]" />

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#292b30] bg-[#0d0e10] px-4 text-sm text-[#a5a5ab] outline-none focus:border-[#45474d] lg:w-[180px]"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>
          </div>

          {/* Active filters */}
          {hasFilters && (
            <div className="flex items-center justify-between border-t border-[#1d1e22] pt-4">
              <p className="text-sm text-[#686a72]">
                {filteredTools.length}{" "}
                {filteredTools.length === 1 ? "tool" : "tools"} found
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-[#a5a5ab] transition-colors hover:text-white"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
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
          <div className="mt-10 rounded-3xl border border-[#292b30] bg-[#0d0e10] px-6 py-16 text-center">
            <p className="text-white">Unable to load tools.</p>

            <p className="mt-2 text-sm text-[#686a72]">
              Please make sure the backend is running and try again.
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredTools.length === 0 && (
          <div className="mt-10 rounded-3xl border border-[#292b30] bg-[#0d0e10] px-6 py-16 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-[#292b30] bg-[#151619]">
              <Search className="size-5 text-[#686a72]" />
            </div>

            <h2 className="mt-5 text-lg font-medium text-white">
              No tools found
            </h2>

            <p className="mt-2 text-sm text-[#686a72]">
              Try changing your search or filters.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 text-sm font-medium text-white underline underline-offset-4"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Tools */}
        {!loading && !error && filteredTools.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredTools.map((tool) => (
              <motion.div key={tool.id} variants={cardVariants}>
                <PublicToolCard tool={tool} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
