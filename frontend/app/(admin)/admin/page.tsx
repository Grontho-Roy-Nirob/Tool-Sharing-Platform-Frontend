"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import adminApi from "@/lib/adminAxios";

interface AdminLoginResponse {
  message: string;
  access_token: string;
  admin: {
    id: number;
    full_name: string;
    email: string;
    role: number;
  };
}

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await adminApi.post<AdminLoginResponse>(
        "/admin/auth/login",
        {
          email,
          password,
        },
      );

      const { access_token, admin } = response.data;

      if (admin.role !== 1) {
        toast.error("You are not authorized as an admin.");
        return;
      }

      localStorage.setItem("admin_access_token", access_token);

      localStorage.setItem(
        "admin_user",
        JSON.stringify({
          id: admin.id,
          full_name: admin.full_name,
          email: admin.email,
          role: admin.role,
        }),
      );

      toast.success("Login successful!");

      router.replace("/admin/dashboard");
    } catch (error: any) {
      console.error("Admin login error:", error);

      const message =
        error?.response?.data?.message || "Invalid email or password.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090a0c] px-4 text-white">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="mb-6 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-black">
              T
            </div>

            <span className="text-xl font-bold tracking-tight">ToolShire</span>
          </Link>

          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <ShieldCheck className="h-7 w-7" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold">Admin Portal</h1>

          <p className="mt-2 text-sm text-white/50">
            Sign in to manage ToolShire
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-white/80"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="admin@toolshire.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/25 focus:border-white/30 disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-white/80"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 pr-12 text-sm outline-none transition placeholder:text-white/25 focus:border-white/30 disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Back */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-white/40 transition hover:text-white"
          >
            ← Back to ToolShire
          </Link>
        </div>
      </div>
    </main>
  );
}
