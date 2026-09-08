"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SiGithub, SiInstagram, SiX } from "@icons-pack/react-simple-icons";

const footerLinks = {
  Platform: [
    {
      label: "Browse Tools",
      href: "/tools",
    },
    {
      label: "Categories",
      href: "/categories",
    },
    {
      label: "How It Works",
      href: "#how-it-works",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
  ],

  Company: [
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "Contact",
      href: "/contact",
    },
    {
      label: "Careers",
      href: "/careers",
    },
  ],

  Support: [
    {
      label: "Help Center",
      href: "/help",
    },
    {
      label: "Safety",
      href: "/safety",
    },
    {
      label: "Community Guidelines",
      href: "/guidelines",
    },
    {
      label: "Privacy",
      href: "/privacy",
    },
  ],
};

const socialLinks = [
  {
    label: "GitHub",
    href: "#",
    icon: SiGithub,
  },
  {
    label: "X",
    href: "#",
    icon: SiX,
  },
  {
    label: "Instagram",
    href: "#",
    icon: SiInstagram,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const Footer = () => {
  return (
    <footer className="border-t border-[#292b30]">
      <div className="mx-auto max-w-[1152px] px-4 py-16 sm:px-8 sm:py-20">
        {/* Top */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]"
        >
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label="ToolShire home"
            >
              <motion.span
                whileHover={{
                  scale: 1.08,
                  rotate: 4,
                }}
                transition={{ duration: 0.2 }}
                className="flex size-10 items-center justify-center rounded-full bg-white text-lg font-semibold text-[#101114]"
              >
                T
              </motion.span>

              <span className="text-xl font-semibold tracking-[-0.04em] text-white">
                ToolShire
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#686a72]">
              A community-powered platform for borrowing, lending, and sharing
              tools with people around you.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <motion.div
                    key={social.label}
                    variants={itemVariants}
                    whileHover={{
                      y: -3,
                      scale: 1.05,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={social.href}
                      aria-label={social.label}
                      className="flex size-9 items-center justify-center rounded-full border border-[#292b30] text-[#686a72] transition-all duration-200 hover:border-[#45474d] hover:bg-[#151619] hover:text-white"
                    >
                      <Icon size={16} />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <motion.div key={title} variants={itemVariants}>
              <h3 className="text-sm font-medium text-white">{title}</h3>

              <ul className="mt-5 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#686a72] transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.5,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="mt-16 flex flex-col gap-4 border-t border-[#292b30] pt-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-[#686a72]">
            © {new Date().getFullYear()} ToolShire. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/terms"
              className="text-sm text-[#686a72] transition-colors duration-200 hover:text-white"
            >
              Terms
            </Link>

            <Link
              href="/privacy"
              className="text-sm text-[#686a72] transition-colors duration-200 hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/contact"
              className="text-sm text-[#686a72] transition-colors duration-200 hover:text-white"
            >
              Contact
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
