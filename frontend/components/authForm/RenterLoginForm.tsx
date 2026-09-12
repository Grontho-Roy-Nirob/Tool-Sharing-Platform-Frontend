"use client";

import axios from "axios";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/schemas/renterAuthSc";
import { loginRenter } from "@/app/(renter)/_actions/authAction";
import { toast } from "sonner";

const RenterLoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  //const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    //setError("");
    const formData = new FormData(event.currentTarget);
    // ==================== ZOD VALIDATION ====================
    const result = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Invalid input.";
      toast.error(message);
      setLoading(false);
      return;
    }

    // ==================== API CALL ====================

    try {
      const response = await loginRenter(result.data);

      console.log("Login successful:", response);
      // Store token
      localStorage.setItem("access_token", response.access_token);

      // Success toast
      toast.success("Login successful!", {
        description: "Welcome back to ToolShire.",
      });

      // Redirect
      //router.push("/renter/dashboard");
      setTimeout(() => {
        router.push("/renter/dashboard");
      }, 500);
    } catch (error) {
      console.error("Renter login error:", error);

      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
          toast.error(message[0] ?? "Login failed.");
        } else {
          toast.error(message ?? "Invalid email or password.");
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-3"
          aria-label="ToolShire home"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-white text-lg font-semibold text-[#101114]">
            T
          </span>

          <span className="text-xl font-semibold tracking-[-0.04em] text-white">
            ToolShire
          </span>
        </Link>
      </div>

      {/* Card */}
      <div className="rounded-[28px] border border-[#292b30] bg-[#0d0e10] p-6 shadow-[0_10px_50px_rgba(0,0,0,0.25)] sm:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium tracking-[-0.04em] text-white sm:text-3xl">
            Welcome back
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#686a72]">
            Login to your ToolShire renter account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              disabled={loading}
              className="w-full rounded-xl border border-[#292b30] bg-[#101114] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#55575e] focus:border-[#55575e] focus:ring-1 focus:ring-[#45474d] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#d1d1d4]"
              >
                Password
              </label>

              <Link
                href="/renter/forgot-password"
                className="text-xs text-[#777980] transition-colors hover:text-white"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
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

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-medium text-[#101114] transition-all duration-200 hover:scale-[1.01] hover:bg-[#e7e7e8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-[#101114]/30 border-t-[#101114]" />
                Logging in...
              </>
            ) : (
              <>
                Login
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Registration */}
        <div className="mt-7 border-t border-[#292b30] pt-6 text-center">
          <p className="text-sm text-[#686a72]">
            Don&apos;t have a renter account?{" "}
            <Link
              href="/renter/registration"
              className="font-medium text-white transition-colors hover:text-[#c9c9cc]"
            >
              Create account
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

export default RenterLoginForm;
