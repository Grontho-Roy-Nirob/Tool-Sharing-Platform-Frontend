import {
  Wrench,
  Users,
  Star,
  Clock3,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    value: "500+",
    label: "Tools available",
    description: "Ready to rent",
    icon: Wrench,
  },
  {
    value: "250+",
    label: "Active users",
    description: "Growing community",
    icon: Users,
  },
  {
    value: "4.8/5",
    label: "Average rating",
    description: "Trusted experience",
    icon: Star,
  },
  {
    value: "24/7",
    label: "Platform access",
    description: "Always available",
    icon: Clock3,
  },
];

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-[#F3EFE7] px-5 py-16 sm:px-8 sm:py-20">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 top-1/2 size-72 -translate-y-1/2 rounded-full bg-[#E8A33D]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1200px]">
        {/* Small heading */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#C1502E]">
              ToolShare at a glance
            </p>

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[#211F1C] sm:text-3xl">
              A growing community of tool sharing.
            </h2>
          </div>

          <p className="hidden max-w-xs text-right text-sm leading-6 text-[#6B6862] sm:block">
            Making tools more accessible, affordable and useful for everyone.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-[#211F1C]/10
                  bg-white
                  p-6
                  shadow-[0_8px_25px_rgba(33,31,28,0.04)]
                  transition-all
                  duration-300
                  hover:-translate-y-1.5
                  hover:border-[#211F1C]/20
                  hover:shadow-[0_16px_35px_rgba(33,31,28,0.08)]
                "
              >
                {/* Background number decoration */}
                <span
                  className="
                    pointer-events-none
                    absolute
                    -right-3
                    -top-5
                    font-[family-name:var(--font-display)]
                    text-[90px]
                    font-black
                    leading-none
                    text-[#211F1C]/[0.035]
                    transition-transform
                    duration-500
                    group-hover:scale-110
                  "
                >
                  {stat.value.replace("/", "")}
                </span>

                {/* Top */}
                <div className="relative flex items-center justify-between">
                  <div
                    className="
                      flex
                      size-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#E8A33D]/20
                      text-[#211F1C]
                      transition-all
                      duration-300
                      group-hover:bg-[#E8A33D]
                    "
                  >
                    <Icon className="size-5" />
                  </div>

                  <ArrowUpRight
                    className="
                      size-4
                      text-[#211F1C]/25
                      transition-all
                      duration-300
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                      group-hover:text-[#C1502E]
                    "
                  />
                </div>

                {/* Value */}
                <div className="relative mt-7">
                  <p className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-[#211F1C] sm:text-[42px]">
                    {stat.value}
                  </p>

                  <p className="mt-2 font-[family-name:var(--font-display)] text-base font-bold text-[#211F1C]">
                    {stat.label}
                  </p>

                  <p className="mt-1 text-sm text-[#7A766F]">
                    {stat.description}
                  </p>
                </div>

                {/* Bottom accent */}
                <div className="mt-6 h-1 w-10 rounded-full bg-[#C1502E] transition-all duration-300 group-hover:w-16" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}