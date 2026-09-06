"use client";

import { motion } from "motion/react";
import { Coins, Leaf, ShieldCheck, Users } from "lucide-react";

const benefits = [
  {
    icon: Coins,
    title: "Save Money",
    description:
      "Why buy an expensive tool for a one-time project? Borrow what you need and keep more money in your pocket.",
  },
  {
    icon: Users,
    title: "Share With Your Community",
    description:
      "Connect with people nearby and give useful tools a second life by sharing them with others.",
  },
  {
    icon: Leaf,
    title: "Reduce Waste",
    description:
      "Make better use of the tools that already exist instead of everyone buying the same equipment.",
  },
  {
    icon: ShieldCheck,
    title: "Build With Trust",
    description:
      "Profiles, ratings, reviews, and secure borrowing processes help create a reliable sharing community.",
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
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
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

const WhyToolShare = () => {
  return (
    <section
      id="why-toolshire"
      className="mx-auto max-w-[1152px] px-4 py-24 sm:px-8 sm:py-32"
    >
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-2xl"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#292b30] bg-[#0d0e10] px-4 py-2 text-sm text-[#a5a5ab]">
          <span className="size-1.5 rounded-full bg-white" aria-hidden="true" />
          Why ToolShire
        </div>

        <h2 className="text-balance text-4xl font-medium leading-tight tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
          Own less. Do more.
        </h2>

        <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-[#96979f] sm:text-lg">
          ToolShire makes sharing practical. Get access to the tools you need
          without the cost and hassle of owning everything yourself.
        </p>
      </motion.div>

      {/* Benefits */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-16 grid gap-4 md:grid-cols-2"
      >
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;

          return (
            <motion.div
              key={benefit.title}
              variants={cardVariants}
              whileHover={{
                y: -6,
                transition: {
                  duration: 0.2,
                },
              }}
              className="group rounded-3xl border border-[#292b30] bg-[#0d0e10] p-7 transition-colors duration-300 hover:border-[#45474d] hover:bg-[#101114] sm:p-8"
            >
              {/* Top */}
              <div className="flex items-start justify-between">
                <motion.div
                  whileHover={{
                    scale: 1.08,
                    rotate: 4,
                  }}
                  transition={{ duration: 0.2 }}
                  className="flex size-12 items-center justify-center rounded-2xl border border-[#292b30] bg-[#151619]"
                >
                  <Icon className="size-5 text-white" strokeWidth={1.7} />
                </motion.div>

                <span className="text-sm tracking-wider text-[#4f5158]">
                  0{index + 1}
                </span>
              </div>

              {/* Content */}
              <h3 className="mt-8 text-2xl font-medium tracking-[-0.04em] text-white">
                {benefit.title}
              </h3>

              <p className="mt-3 max-w-lg text-sm leading-7 text-[#7d7f87] sm:text-base">
                {benefit.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default WhyToolShare;
