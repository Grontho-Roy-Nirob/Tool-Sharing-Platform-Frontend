import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  User,
  Wrench,
  Hammer,
  Share2,
} from "lucide-react";

const loginOptions = [
  {
    title: "Renter",
    description: "Find and borrow tools from people in your community.",
    href: "/renter",
    icon: User,
  },
  {
    title: "Tool Owner",
    description: "Manage your tools and share them with others.",
    href: "/owner",
    icon: Wrench,
  },
  {
    title: "Admin",
    description: "Manage the ToolShare platform and its users.",
    href: "/admin",
    icon: ShieldCheck,
  },
];

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F3EFE7] px-5 py-10 text-[#211F1C] sm:px-8 sm:py-14">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center justify-center">
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
                  flex size-11
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
                    size-5.5
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
                  text-xl
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
                leading-[1.05]
                tracking-tight
                text-[#211F1C]
                sm:text-5xl
              "
            >
              Welcome back.
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#6B6862] sm:text-base">
              Select your account type to continue to your dashboard.
            </p>
          </div>

          {/* Main Card */}
          <div
            className="
              rounded-[32px]
              border
              border-[#211F1C]/10
              bg-white
              p-5
              shadow-[0_18px_50px_rgba(33,31,28,0.08)]
              sm:p-7
            "
          >
            {/* Card Heading */}
            <div className="mb-6">
              <h2
                className="
                  font-[family-name:var(--font-display)]
                  text-xl
                  font-bold
                  text-[#211F1C]
                "
              >
                Continue as
              </h2>

              <p className="mt-1 text-sm text-[#777169]">
                Choose the account you want to sign in with.
              </p>
            </div>

            {/* Login Options */}
            <div className="grid gap-4 md:grid-cols-3">
              {loginOptions.map((option) => {
                const Icon = option.icon;

                return (
                  <Link
                    key={option.title}
                    href={option.href}
                    className="
                      group
                      relative
                      flex
                      min-h-[220px]
                      flex-col
                      overflow-hidden
                      rounded-[24px]
                      border
                      border-[#211F1C]/10
                      bg-[#F8F6F1]
                      p-5
                      transition-all
                      duration-300
                      hover:-translate-y-1.5
                      hover:border-[#211F1C]/20
                      hover:bg-white
                      hover:shadow-[0_18px_35px_rgba(33,31,28,0.10)]
                      sm:p-6
                    "
                  >
                    {/* Top decorative line */}
                    <div
                      className="
                        absolute
                        left-0
                        top-0
                        h-1
                        w-0
                        bg-[#C1502E]
                        transition-all
                        duration-300
                        group-hover:w-full
                      "
                    />

                    {/* Icon */}
                    <div
                      className="
                        flex
                        size-12
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-[#211F1C]/10
                        bg-[#E8A33D]/20
                        text-[#211F1C]
                        transition-all
                        duration-300
                        group-hover:bg-[#E8A33D]
                      "
                    >
                      <Icon
                        className="size-5.5"
                        strokeWidth={1.8}
                      />
                    </div>

                    {/* Text */}
                    <div className="mt-7 flex-1">
                      <h3
                        className="
                          font-[family-name:var(--font-display)]
                          text-xl
                          font-bold
                          text-[#211F1C]
                        "
                      >
                        {option.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#777169]">
                        {option.description}
                      </p>
                    </div>

                    {/* Bottom */}
                    <div
                      className="
                        mt-6
                        flex
                        items-center
                        justify-between
                        border-t
                        border-[#211F1C]/10
                        pt-4
                      "
                    >
                      <span
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-[0.14em]
                          text-[#8A857D]
                          transition-colors
                          duration-300
                          group-hover:text-[#C1502E]
                        "
                      >
                        Continue
                      </span>

                      <span
                        className="
                          flex
                          size-8
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
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Register */}
            <div className="mt-7 border-t border-[#211F1C]/10 pt-6 text-center">
              <p className="text-sm text-[#777169]">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="
                    font-bold
                    text-[#C1502E]
                    transition-colors
                    hover:text-[#211F1C]
                  "
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          {/* Back */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="
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