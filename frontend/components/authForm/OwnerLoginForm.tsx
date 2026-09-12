"use client";

import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
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
          className="inline-flex items-center gap-3"
          aria-label="ToolShare home"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-white text-lg font-semibold text-[#101114]">
            T
          </span>

          <span className="text-xl font-semibold tracking-[-0.04em] text-white">
            ToolShare
          </span>
        </Link>
      </div>

      {/* Card */}
      <div className="rounded-[28px] border border-[#292b30] bg-[#0d0e10] p-6 shadow-[0_10px_50px_rgba(0,0,0,0.25)] sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-medium tracking-[-0.04em] text-white sm:text-3xl">
            Welcome back
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#686a72]">
            Login to manage your tools and rental requests.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#d1d1d4]"
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
                className="w-full rounded-xl border border-[#292b30] bg-[#101114] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#55575e] focus:border-[#55575e] focus:ring-1 focus:ring-[#45474d] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#d1d1d4]"
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
                  className="w-full rounded-xl border border-[#292b30] bg-[#101114] px-4 py-3 pr-11 text-sm text-white outline-none transition-all placeholder:text-[#55575e] focus:border-[#55575e] focus:ring-1 focus:ring-[#45474d] disabled:cursor-not-allowed disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#686a72] transition-colors hover:text-white disabled:opacity-50"
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
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-medium text-[#101114] transition-all duration-200 hover:scale-[1.01] hover:bg-[#e7e7e8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? "Logging in..." : "Login"}

              {!loading && (
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              )}
            </button>
          </div>
        </form>

        {/* Register */}
        <div className="mt-7 border-t border-[#292b30] pt-6 text-center">
          <p className="text-sm text-[#686a72]">
            Want to share your tools?{" "}
            <Link
              href="/owner/registration"
              className="font-medium text-white transition-colors hover:text-[#c9c9cc]"
            >
              Create owner account
            </Link>
          </p>
        </div>
      </div>

      {/* Back */}
      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm text-[#55575e] transition-colors hover:text-white"
        >
          ← Choose another login
        </Link>
      </div>
    </div>
  );
};

export default OwnerLoginForm;
