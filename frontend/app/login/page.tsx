import Link from "next/link";
import { ArrowRight, ShieldCheck, User, Wrench } from "lucide-react";

const loginOptions = [
  {
    title: "User / Renter",
    description: "Find and borrow tools from people in your community.",
    href: "/login/renter",
    icon: User,
  },
  {
    title: "Tool Owner",
    description: "Manage your tools and share them with others.",
    href: "/login/owner",
    icon: Wrench,
  },
  {
    title: "Admin",
    description: "Manage the ToolShire platform and its users.",
    href: "/login/admin",
    icon: ShieldCheck,
  },
];

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090a0c] px-4 py-12 text-white">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-3"
            aria-label="ToolShire home"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-white text-lg font-semibold text-[#101114]">
              T
            </span>

            <span className="text-xl font-semibold tracking-[-0.04em]">
              ToolShire
            </span>
          </Link>

          <h1 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
            Welcome back
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#777980] sm:text-base">
            Choose how you want to continue.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-[28px] border border-[#292b30] bg-[#0d0e10] p-4 shadow-[0_10px_50px_rgba(0,0,0,0.25)] sm:p-6">
          <div className="mb-5 px-2">
            <p className="text-sm font-medium text-white">Login as</p>

            <p className="mt-1 text-sm text-[#686a72]">
              Select your account type to continue.
            </p>
          </div>

          <div className="space-y-3">
            {loginOptions.map((option) => {
              const Icon = option.icon;

              return (
                <Link
                  key={option.title}
                  href={option.href}
                  className="group flex items-center gap-4 rounded-2xl border border-[#292b30] bg-[#101114] p-4 transition-all duration-200 hover:border-[#45474d] hover:bg-[#151619]"
                >
                  {/* Icon */}
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#292b30] bg-[#151619] text-[#a5a5ab] transition-colors duration-200 group-hover:text-white">
                    <Icon className="size-5" strokeWidth={1.7} />
                  </div>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-medium text-white sm:text-base">
                      {option.title}
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-[#686a72] sm:text-sm">
                      {option.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="size-4 shrink-0 text-[#55575e] transition-all duration-200 group-hover:translate-x-1 group-hover:text-white" />
                </Link>
              );
            })}
          </div>

          {/* Register */}
          <div className="mt-6 border-t border-[#292b30] pt-6 text-center">
            <p className="text-sm text-[#686a72]">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-white transition-colors hover:text-[#c9c9cc]"
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
            className="text-sm text-[#55575e] transition-colors hover:text-white"
          >
            ← Back to ToolShire
          </Link>
        </div>
      </div>
    </main>
  );
}
