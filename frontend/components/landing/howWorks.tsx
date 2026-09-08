"use client";

import { motion } from "motion/react";
import { Search, Handshake, Wrench, RotateCcw } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find a Tool",
    description:
      "Search for the tool you need and discover available tools shared by people in your community.",
  },
  {
    number: "02",
    icon: Handshake,
    title: "Request to Borrow",
    description:
      "Choose a tool, select when you need it, and send a borrowing request to the owner.",
  },
  {
    number: "03",
    icon: Wrench,
    title: "Get the Job Done",
    description:
      "Meet the owner, collect the tool, and use it for your project without buying one.",
  },
  {
    number: "04",
    icon: RotateCcw,
    title: "Return & Share",
    description:
      "Return the tool on time and keep the sharing cycle going for the next person.",
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

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-[1152px] px-4 py-24 sm:px-8 sm:py-32"
    >
      {/* Section Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="text-balance text-4xl font-medium tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
          How ToolShire works
        </h2>

        <p className="mt-6 text-pretty text-base leading-7 tracking-[-0.01em] text-[#96979f] sm:text-lg">
          Getting the tool you need should be simple. ToolShire connects people
          who have tools with people who need them.
        </p>
      </motion.div>

      {/* Steps */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <motion.div
              key={step.number}
              variants={cardVariants}
              whileHover={{
                y: -6,
                transition: {
                  duration: 0.2,
                },
              }}
              className="group relative rounded-3xl border border-[#292b30] bg-[#0d0e10] p-6 transition-colors duration-300 hover:border-[#45474d] hover:bg-[#101114]"
            >
              {/* Number + Icon */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium tracking-wider text-[#686a72]">
                  {step.number}
                </span>

                <motion.div
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="flex size-11 items-center justify-center rounded-full border border-[#292b30] bg-[#151619] transition-colors group-hover:border-[#55575e]"
                >
                  <Icon className="size-5 text-white" strokeWidth={1.7} />
                </motion.div>
              </div>

              {/* Content */}
              <div className="mt-10">
                <h3 className="text-xl font-medium tracking-[-0.03em] text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#7d7f87]">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default HowItWorks;
