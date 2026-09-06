"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, MapPin } from "lucide-react";

const tools = [
  {
    name: "Cordless Drill",
    category: "Power Tools",
    location: "Mirpur, Dhaka",
    price: "৳150/day",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pressure Washer",
    category: "Cleaning",
    location: "Dhanmondi, Dhaka",
    price: "৳300/day",
    image:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Circular Saw",
    category: "Power Tools",
    location: "Uttara, Dhaka",
    price: "৳250/day",
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
  },
];

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
  return (
    <section
      id="tools"
      className="mx-auto max-w-[1152px] px-4 py-24 sm:px-8 sm:py-32"
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

      {/* Tool Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        {tools.map((tool) => (
          <motion.div
            key={tool.name}
            variants={cardVariants}
            whileHover={{
              y: -6,
              transition: {
                duration: 0.2,
              },
            }}
          >
            <Link
              href="/tools"
              className="group block overflow-hidden rounded-3xl border border-[#292b30] bg-[#0d0e10] transition-colors duration-300 hover:border-[#45474d]"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden bg-[#151619]">
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#686a72]">
                      {tool.category}
                    </p>

                    <h3 className="mt-2 text-xl font-medium tracking-[-0.03em] text-white">
                      {tool.name}
                    </h3>
                  </div>

                  <ArrowUpRight className="size-5 text-[#686a72] transition-colors group-hover:text-white" />
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm text-[#7d7f87]">
                    <MapPin className="size-4" />
                    {tool.location}
                  </div>

                  <span className="text-sm font-medium text-white">
                    {tool.price}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturedTools;
