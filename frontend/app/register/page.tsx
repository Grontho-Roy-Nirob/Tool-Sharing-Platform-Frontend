import Link from "next/link";
import {
  ArrowRight,
  User,
  Wrench,
  Hammer,
  Share2,
} from "lucide-react";

const registerOptions = [
  {
    title: "Renter",
    description: "Find and borrow tools from people in your community.",
    href: "/renter/registration",
    icon: User,
  },
  {
    title: "Tool Owner",
    description: "Earn money by listing and sharing your tools.",
    href: "/owner/registration",
    icon: Wrench,
  },
];

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#F3EFE7] px-5 py-10 text-[#211F1C] sm:px-8 sm:py-14">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
        <div className="w-full">
          {/* Header */}
          <div className="mb-10 text-center">
            {/* Logo */}
            <Link
              href="/"
              className="group mb-8 inline-flex items-center gap-3"
              aria-label="ToolShare home"
            >
              <span
                className="
                  relative
                  flex size-12
                  items-center justify-center
                  overflow-hidden
                  border-2 border-[#211F1C]
                  bg-[#E8A33D]
                  text-[#211F1C]
                  shadow-[3px_3px_0_#211F1C]
                  transition-all
                  duration-200
                  group-hover:-translate-y-0.5
                  group-hover:shadow-[4px_4px_0_#211F1C]
                "
              >
                <Hammer
                  className="
                    relative z-10
                    size-6
                    -rotate-12
                    stroke-[2.5]
                    transition-transform
                    duration-300
                    group-hover:rotate-0
                  "
                />

                <span
                  className="
                    absolute
                    bottom-1
                    right-1
                    flex size-4
                    items-center justify-center
                    rounded-full
                    bg-[#211F1C]
                    text-[#F3EFE7]
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                >
                  <Share2 className="size-2.5 stroke-[2.5]" />
                </span>
              </span>

              <span
                className="
                  font-[family-name:var(--font-display)]
                  text-2xl
                  font-bold
                  tracking-tight
                  text-[#211F1C]
                "
              >
                ToolShare
              </span>
            </Link>

            {/* Heading */}
            <h1
              className="
                font-[family-name:var(--font-display)]
                text-4xl
                font-bold
                leading-tight
                tracking-tight
                text-[#211F1C]
                sm:text-5xl
              "
            >
              Create your account.
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#6B6862] sm:text-base">
              Choose how you want to use ToolShare and get started in just a
              few steps.
            </p>
          </div>

          {/* Register Card */}
          <div
            className="
              overflow-hidden
              rounded-[30px]
              border
              border-[#211F1C]/10
              bg-white
              p-5
              shadow-[0_20px_60px_rgba(33,31,28,0.10)]
              sm:p-7
            "
          >
            {/* Card Header */}
            <div className="mb-6 flex items-end justify-between gap-4 px-1">
              <div>
                <p
                  className="
                    font-[family-name:var(--font-display)]
                    text-lg
                    font-bold
                    text-[#211F1C]
                  "
                >
                  Choose your role
                </p>

                <p className="mt-1 text-sm text-[#7A756D]">
                  Select an account type to continue.
                </p>
              </div>

              <span
                className="
                  hidden
                  rounded-full
                  bg-[#E8A33D]/20
                  px-3
                  py-1.5
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-[#211F1C]
                  sm:block
                "
              >
                01 / 02
              </span>
            </div>

            {/* Register Options */}
            <div className="space-y-4">
              {registerOptions.map((option) => {
                const Icon = option.icon;

                return (
                  <Link
                    key={option.title}
                    href={option.href}
                    className="
                      group
                      relative
                      flex
                      items-center
                      gap-4
                      overflow-hidden
                      rounded-[22px]
                      border
                      border-[#211F1C]/10
                      bg-[#F8F6F1]
                      p-5
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#211F1C]/20
                      hover:bg-white
                      hover:shadow-[0_14px_35px_rgba(33,31,28,0.09)]
                      sm:p-6
                    "
                  >
                    {/* Decorative Circle */}
                    <div
                      className="
                        pointer-events-none
                        absolute
                        -right-8
                        -top-8
                        size-28
                        rounded-full
                        bg-[#E8A33D]/10
                        transition-transform
                        duration-500
                        group-hover:scale-150
                      "
                    />

                    {/* Icon */}
                    <div
                      className="
                        relative
                        flex
                        size-14
                        shrink-0
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
                      <Icon className="size-6" strokeWidth={1.8} />
                    </div>

                    {/* Text */}
                    <div className="relative min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2
                          className="
                            font-[family-name:var(--font-display)]
                            text-lg
                            font-bold
                            text-[#211F1C]
                          "
                        >
                          {option.title}
                        </h2>

                        {option.title === "Tool Owner" && (
                          <span
                            className="
                              rounded-full
                              bg-[#C1502E]/10
                              px-2
                              py-1
                              text-[10px]
                              font-bold
                              uppercase
                              tracking-wider
                              text-[#C1502E]
                            "
                          >
                            Earn
                          </span>
                        )}
                      </div>

                      <p className="mt-1 max-w-md text-sm leading-6 text-[#777169]">
                        {option.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div
                      className="
                        relative
                        flex
                        size-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#211F1C]/10
                        bg-white
                        text-[#211F1C]/50
                        transition-all
                        duration-300
                        group-hover:border-[#C1502E]
                        group-hover:bg-[#C1502E]
                        group-hover:text-white
                      "
                    >
                      <ArrowRight
                        className="
                          size-4
                          transition-transform
                          duration-300
                          group-hover:translate-x-0.5
                        "
                      />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Login Link */}
            <div className="mt-7 border-t border-[#211F1C]/10 pt-6 text-center">
              <p className="text-sm text-[#777169]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="
                    font-bold
                    text-[#C1502E]
                    transition-colors
                    hover:text-[#211F1C]
                  "
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-[#777169]
                transition-colors
                hover:text-[#211F1C]
              "
            >
              ← Back to ToolShare
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}