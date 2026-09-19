import {
  Search,
  CalendarCheck2,
  Wrench,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find a tool",
    text: "Browse tools based on category, location and rental price.",
  },
  {
    number: "02",
    icon: CalendarCheck2,
    title: "Book easily",
    text: "Choose your rental dates and send your booking request.",
  },
  {
    number: "03",
    icon: Wrench,
    title: "Use & return",
    text: "Use the tool responsibly and return it on time.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#F3EFE7] py-24 sm:py-28"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-24 top-20 size-64 rounded-full bg-[#E8A33D]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 size-72 rounded-full bg-[#C1502E]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            {/* Small label */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#211F1C]/15 bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#211F1C]">
              <Sparkles className="size-3.5 text-[#C1502E]" />
              How it works
            </div>

            <h2 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.08] tracking-tight text-[#211F1C] sm:text-5xl">
              From finding a tool
              <br />
              <span className="text-[#C1502E]">to getting the job done.</span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#5F5B55] sm:text-lg">
              Renting tools with ToolShare is simple. Find what you need, book
              it when you need it, and return it when the job is done.
            </p>
          </div>

          {/* Small side text */}
          <div className="hidden max-w-[220px] lg:block">
            <div className="border-l-2 border-[#C1502E] pl-5">
              <p className="text-sm leading-6 text-[#6B6862]">
                A simple rental experience designed for everyday projects.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="relative mt-14">
          {/* Connecting line */}
          <div className="absolute left-[16.66%] right-[16.66%] top-[92px] hidden h-px bg-[#211F1C]/15 lg:block" />

          <div className="grid gap-5 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="group relative">
                  {/* Step card */}
                  <div
                    className="
                      relative
                      h-full
                      overflow-hidden
                      rounded-[28px]
                      border
                      border-[#211F1C]/10
                      bg-white
                      p-7
                      shadow-[0_10px_30px_rgba(33,31,28,0.05)]
                      transition-all
                      duration-300
                      group-hover:-translate-y-2
                      group-hover:border-[#211F1C]/20
                      group-hover:shadow-[0_20px_45px_rgba(33,31,28,0.10)]
                      sm:p-8
                    "
                  >
                    {/* Large background number */}
                    <span
                      className="
                        pointer-events-none
                        absolute
                        -right-3
                        -top-8
                        font-[family-name:var(--font-display)]
                        text-[120px]
                        font-black
                        leading-none
                        text-[#211F1C]/[0.035]
                        transition-transform
                        duration-500
                        group-hover:scale-110
                      "
                    >
                      {step.number}
                    </span>

                    {/* Top row */}
                    <div className="relative flex items-center justify-between">
                      {/* Icon */}
                      <div
                        className="
                          flex
                          size-16
                          items-center
                          justify-center
                          rounded-2xl
                          border
                          border-[#211F1C]/10
                          bg-[#E8A33D]/20
                          text-[#211F1C]
                          transition-all
                          duration-300
                          group-hover:rotate-3
                          group-hover:bg-[#E8A33D]
                        "
                      >
                        <Icon className="size-7 stroke-[1.8]" />
                      </div>

                      {/* Step number */}
                      <span className="rounded-full bg-[#211F1C] px-3 py-1.5 font-[family-name:var(--font-display)] text-xs font-bold tracking-wider text-[#F3EFE7]">
                        STEP {step.number}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="relative mt-8">
                      <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[#211F1C]">
                        {step.title}
                      </h3>

                      <p className="mt-3 max-w-sm leading-7 text-[#6B6862]">
                        {step.text}
                      </p>
                    </div>

                    {/* Bottom line */}
                    <div className="mt-8 flex items-center justify-between border-t border-[#211F1C]/10 pt-5">
                      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8A857D]">
                        ToolShare
                      </span>

                      <div
                        className="
                          flex
                          size-9
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-[#211F1C]/10
                          text-[#211F1C]/50
                          transition-all
                          duration-300
                          group-hover:border-[#C1502E]
                          group-hover:bg-[#C1502E]
                          group-hover:text-white
                        "
                      >
                        <ArrowUpRight className="size-4" />
                      </div>
                    </div>
                  </div>

                  {/* Connector arrow */}
                  {index !== steps.length - 1 && (
                    <div className="absolute -right-5 top-[76px] z-10 hidden size-10 items-center justify-center rounded-full border border-[#211F1C]/10 bg-[#F3EFE7] lg:flex">
                      <ArrowUpRight className="size-4 rotate-45 text-[#C1502E]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom statement */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-[24px] border border-[#211F1C]/10 bg-[#211F1C] px-6 py-5 sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#F3EFE7]">
              Ready to get started?
            </p>
            <p className="mt-1 text-sm text-[#F3EFE7]/60">
              Find the right tool for your next project.
            </p>
          </div>

          <a
            href="/tools"
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#E8A33D]
              px-5
              py-2.5
              text-sm
              font-bold
              text-[#211F1C]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-[#F0B554]
            "
          >
            Browse tools
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
