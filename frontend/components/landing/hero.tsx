"use client";

import Link from "next/link";
import { motion } from "motion/react";

const Hero = () => {
  return (
    <section
      id="hero"
      className="mx-auto flex max-w-[1152px] flex-col items-center px-4 pb-24 pt-28 text-center sm:px-8 sm:pb-32 sm:pt-36"
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#292b30] bg-[#0d0e10] px-4 py-2 text-sm text-[#a5a5ab] shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
      >
        <span className="size-1.5 rounded-full bg-white" />
        Share tools. Build together.
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.1,
        }}
        className="max-w-5xl text-balance text-[clamp(3.5rem,8vw,7.25rem)] font-medium leading-[0.94] tracking-[-0.075em] text-white"
      >
        The tools you need, shared by people around you.
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.25,
        }}
        className="mt-8 max-w-2xl text-pretty text-lg leading-8 tracking-[-0.02em] text-[#96979f] sm:text-xl"
      >
        ToolShire makes it easy to borrow, lend, and discover tools within your
        community—saving money, reducing waste, and helping everyone get the job
        done.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.4,
        }}
        className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
      >
        <Link
          href="/tools"
          className="rounded-full bg-white px-7 py-4 text-base font-medium text-[#101114] transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          Explore Tools
        </Link>

        <Link
          href="#how-it-works"
          className="rounded-full border border-[#292b30] px-7 py-4 text-base font-medium text-white transition-colors hover:bg-[#151619]"
        >
          See how it works
        </Link>
      </motion.div>

      {/* Bottom Label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.6,
        }}
        className="mt-20 flex items-center gap-3 text-sm tracking-wide text-[#686a72]"
      >
        <span className="h-px w-8 bg-[#292b30]" />
        Built for sharing, powered by community
        <span className="h-px w-8 bg-[#292b30]" />
      </motion.div>
    </section>
  );
};

export default Hero;
