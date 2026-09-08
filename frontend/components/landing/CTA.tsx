"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";

const benefits = [
  "Borrow tools without buying them",
  "Share tools and earn from them",
  "Connect with people in your community",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 25,
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

const CTA = () => {
  return (
    <section
      id="get-started"
      className="mx-auto max-w-[1152px] px-4 py-24 sm:px-8 sm:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        whileHover={{
          borderColor: "#3a3c42",
          transition: { duration: 0.3 },
        }}
        className="relative overflow-hidden rounded-[32px] border border-[#292b30] bg-[#0d0e10] px-6 py-16 text-center shadow-[0_10px_50px_rgba(0,0,0,0.25)] sm:px-12 sm:py-20 lg:px-20"
      >
        {/* Background Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: 0.2,
          }}
          className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-3xl"
          aria-hidden="true"
        />

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#292b30] bg-[#151619] px-4 py-2 text-sm text-[#a5a5ab]"
          >
            <motion.span
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="size-1.5 rounded-full bg-white"
              aria-hidden="true"
            />
            Start sharing today
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="mx-auto max-w-3xl text-balance text-4xl font-medium leading-tight tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl"
          >
            Got a tool sitting around? Someone might need it.
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-[#96979f] sm:text-lg"
          >
            Join ToolShire and become part of a community where people share
            useful tools, save money, and help each other get things done.
          </motion.p>

          {/* Benefits */}
          <motion.div
            variants={containerVariants}
            className="mx-auto mt-8 flex max-w-2xl flex-col items-center justify-center gap-3 text-sm text-[#7d7f87] sm:flex-row sm:flex-wrap sm:gap-x-6"
          >
            {benefits.map((benefit) => (
              <motion.div
                key={benefit}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                className="flex items-center gap-2"
              >
                <Check className="size-4 text-white" />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-full bg-white px-7 py-4 text-base font-medium text-[#101114] transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Get Started
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/tools"
              className="rounded-full border border-[#292b30] px-7 py-4 text-base font-medium text-white transition-all duration-200 hover:border-[#45474d] hover:bg-[#151619] hover:scale-[1.02]"
            >
              Explore Tools
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTA;
