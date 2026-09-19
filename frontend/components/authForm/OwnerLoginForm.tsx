"use client";

import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Hammer, Share2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/schemas/ownerAuthSc";
import { loginOwner } from "@/app/(owner)/_actions/ownerAuthAction";
import { toast } from "sonner";

const OwnerLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const result = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Zod validation
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input.");
      setLoading(false);
      return;
    }

    try {
      const response = await loginOwner(result.data);

      localStorage.setItem("access_token", response.access_token);

      // Only successful login show toast message
      toast.success("Login successful!", {
        description: "Welcome back to ToolShare Platform.",
      });

      router.push("/owner/dashboard");
    } catch (error) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      {/* Logo */}
      <div className="mb-8 text-center">
        <Link
          href="/"
          aria-label="ToolShare home"
          className="group inline-flex items-center gap-3"
        >
          {/* Logo Icon */}
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
            {/* Hammer */}
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

            {/* Share Icon */}
            <span
              className="
          absolute
          bottom-1
          right-1
          flex size-4
          items-center justify-center
          rounded-full
          bg-[#F3EFE7]
          text-[#211F1C]
          transition-transform
          duration-300
          group-hover:scale-110
        "
            >
              <Share2 className="size-2.5 stroke-[2.5]" />
            </span>
          </span>

          {/* Brand Name */}
          <div className="text-left">
            <span
              className="
          block
          font-[family-name:var(--font-display)]
          text-[19px]
          font-bold
          leading-none
          tracking-[-0.02em]
          text-slate-900
        "
            >
              ToolShare Platform
            </span>

            <span
              className="
          mt-1
          block
          text-[10px]
          font-medium
          tracking-[0.14em]
          text-slate-500
        "
            >
              Rent · Share · Save
            </span>
          </div>
        </Link>
      </div>

      {/* Card */}
      <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
        {/* Soft decorative colors */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-indigo-100/70 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -left-20 size-48 rounded-full bg-violet-100/60 blur-3xl" />

        <div className="relative">
          {/* Heading */}
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
              <span className="size-1.5 rounded-full bg-indigo-500" />
              Owner Account
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.04em] text-slate-900 sm:text-3xl">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Login to manage your tools and rental requests.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  placeholder="you@example.com"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-indigo-200 hover:bg-indigo-50/30 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-violet-200 hover:bg-violet-50/20 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    disabled={loading}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-all hover:bg-violet-50 hover:text-violet-600 disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p
                  className="rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600"
                  role="alert"
                >
                  {error}
                </p>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(79,70,229,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 hover:shadow-[0_14px_30px_rgba(79,70,229,0.28)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? "Logging in..." : "Login"}

                {!loading && (
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                )}
              </button>
            </div>
          </form>

          {/* Register */}
          <div className="mt-7 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Want to share your tools?{" "}
              <Link
                href="/owner/registration"
                className="font-semibold text-indigo-600 transition-colors hover:text-violet-600"
              >
                Create owner account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Back */}
      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
        >
          ← Choose another login
        </Link>
      </div>
    </div>
  );
};

export default OwnerLoginForm;
