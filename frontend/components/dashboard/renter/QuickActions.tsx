import Link from "next/link";
import { ArrowRight, ClipboardList, Search, User } from "lucide-react";

const actions = [
  {
    title: "Find a Tool",
    description: "Explore tools available for rental",
    href: "/tools",
    icon: Search,
  },
  {
    title: "View My Orders",
    description: "Track your rental requests",
    href: "/renter/orders",
    icon: ClipboardList,
  },
  {
    title: "Update Profile",
    description: "Manage your account information",
    href: "/renter/profile",
    icon: User,
  },
];

export default function QuickActions() {
  return (
    <section className="mt-8">
      {/* ================= HEADER ================= */}

      <div className="mb-5">
        <div className="mt-1 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-[#492828]">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-[#806666]">
              Quickly access the things you use most
            </p>
          </div>
        </div>
      </div>

      {/* ================= ACTION CARDS ================= */}

      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-[#e4d5d5]
                bg-white
                p-5
                shadow-[0_4px_16px_rgba(73,40,40,0.06)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#492828]
                hover:shadow-[0_10px_28px_rgba(73,40,40,0.14)]
              "
            >
              {/* ================= TOP ACCENT ================= */}

              <div
                className="
                  absolute
                  left-5
                  right-5
                  top-0
                  h-[2px]
                  rounded-full
                  bg-[#e7dada]
                  transition-all
                  duration-300
                  group-hover:bg-[#492828]
                "
              />

              {/* ================= ICON + ARROW ================= */}

              <div className="relative flex items-center justify-between">
                {/* Icon */}

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#e1d0d0]
                    bg-[#faf7f7]
                    text-[#492828]
                    shadow-sm
                    transition-all
                    duration-300
                    group-hover:border-[#492828]
                    group-hover:bg-[#492828]
                    group-hover:text-white
                    group-hover:shadow-[0_5px_14px_rgba(73,40,40,0.18)]
                  "
                >
                  <Icon
                    className="
                      h-5
                      w-5
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  />
                </div>

                {/* Arrow */}

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#e4d7d7]
                    bg-white
                    text-[#806666]
                    shadow-sm
                    transition-all
                    duration-300
                    group-hover:border-[#492828]
                    group-hover:bg-[#492828]
                    group-hover:text-white
                    group-hover:shadow-[0_4px_12px_rgba(73,40,40,0.16)]
                  "
                >
                  <ArrowRight
                    className="
                      h-4
                      w-4
                      transition-transform
                      duration-300
                      group-hover:translate-x-0.5
                    "
                  />
                </div>
              </div>

              {/* ================= CONTENT ================= */}

              <div className="relative mt-6">
                <h3
                  className="
                    text-[15px]
                    font-semibold
                    text-[#492828]
                    transition-colors
                    duration-300
                    group-hover:text-[#492828]
                  "
                >
                  {action.title}
                </h3>

                <p
                  className="
                    mt-1.5
                    text-sm
                    leading-6
                    text-[#806666]
                    transition-colors
                    duration-300
                    group-hover:text-[#694848]
                  "
                >
                  {action.description}
                </p>
              </div>

              {/* ================= BOTTOM LINE ================= */}

              <div
                className="
                  mt-5
                  h-px
                  w-full
                  bg-[#eee4e4]
                  transition-all
                  duration-300
                  group-hover:bg-[#d5bebe]
                "
              />

              {/* ================= FOOTER ================= */}

              <div className="mt-3 flex items-center justify-between">
                <span
                  className="
                    text-xs
                    font-semibold
                    text-[#492828]
                    transition-colors
                    duration-300
                  "
                >
                  Open
                </span>

                <span
                  className="
                    text-xs
                    text-[#a18c8c]
                    transition-colors
                    duration-300
                    group-hover:text-[#806666]
                  "
                >
                  ToolShare
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
