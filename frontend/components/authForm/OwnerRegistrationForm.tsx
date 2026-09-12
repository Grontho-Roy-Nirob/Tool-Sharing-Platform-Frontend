"use client";

import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/schemas/ownerAuthSc";
import { registerOwner } from "@/app/(owner)/_actions/ownerAuthAction";
import { toast } from "sonner";

const OwnerRegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const result = registerSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone"),
      nidNumber: formData.get("nidNumber"),
      profile_image: formData.get("myfile"),
    });

    // Zod validation - ager motoi
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input.");
      setLoading(false);
      return;
    }

    try {
      await registerOwner(result.data);

      // Only successful registration hole toast
      toast.success("Registration successful!", {
        description: "Your ToolShare owner account has been created.",
      });

      router.push("/owner");
    } catch (error) {
      setError("Registration failed. Please try again.");
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
            Create owner account
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#686a72]">
            Create your account and start sharing your tools.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-[#d1d1d4]"
              >
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your full name"
                disabled={loading}
                className="w-full rounded-xl border border-[#292b30] bg-[#101114] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#55575e] focus:border-[#55575e] focus:ring-1 focus:ring-[#45474d] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

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
                  autoComplete="new-password"
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full rounded-xl border border-[#292b30] bg-[#101114] px-4 py-3 pr-11 text-sm text-white outline-none transition-all placeholder:text-[#55575e] focus:border-[#55575e] focus:ring-1 focus:ring-[#45474d] disabled:cursor-not-allowed disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={loading}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
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

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-[#d1d1d4]"
              >
                Phone number
              </label>

              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="Your phone number"
                disabled={loading}
                className="w-full rounded-xl border border-[#292b30] bg-[#101114] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#55575e] focus:border-[#55575e] focus:ring-1 focus:ring-[#45474d] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* NID */}
            <div>
              <label
                htmlFor="nidNumber"
                className="mb-2 block text-sm font-medium text-[#d1d1d4]"
              >
                NID number
              </label>

              <input
                id="nidNumber"
                name="nidNumber"
                type="text"
                placeholder="10 digit NID number"
                disabled={loading}
                className="w-full rounded-xl border border-[#292b30] bg-[#101114] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#55575e] focus:border-[#55575e] focus:ring-1 focus:ring-[#45474d] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Profile Image */}
            <div>
              <label
                htmlFor="myfile"
                className="mb-2 block text-sm font-medium text-[#d1d1d4]"
              >
                Profile image
              </label>

              <input
                id="myfile"
                name="myfile"
                type="file"
                accept="image/*"
                disabled={loading}
                className="w-full rounded-xl border border-[#292b30] bg-[#101114] px-4 py-3 text-sm text-[#d1d1d4] outline-none transition-all file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#101114] hover:file:bg-[#e7e7e8] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-medium text-[#101114] transition-all duration-200 hover:scale-[1.01] hover:bg-[#e7e7e8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? "Creating account..." : "Create account"}

              {!loading && (
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              )}
            </button>
          </div>
        </form>

        {/* Login */}
        <div className="mt-7 border-t border-[#292b30] pt-6 text-center">
          <p className="text-sm text-[#686a72]">
            Already have an owner account?{" "}
            <Link
              href="/owner"
              className="font-medium text-white transition-colors hover:text-[#c9c9cc]"
            >
              Login
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

export default OwnerRegistrationForm;