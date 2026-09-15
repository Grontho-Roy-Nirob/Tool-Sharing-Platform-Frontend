"use client";

import axios from "axios";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { loginSchema } from "@/schemas/adminAuthSc";
import { loginAdmin } from "@/app/(admin)/_actions/authAction";

const AdminLoginForm = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ERROR STATE
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // SUBMIT
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);

    // ZOD VALIDATION
    const result = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!result.success) {
      const fieldErrors: {
        email?: string;
        password?: string;
      } = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (
          typeof field === "string" &&
          !fieldErrors[field as keyof typeof fieldErrors]
        ) {
          fieldErrors[field as keyof typeof fieldErrors] = issue.message;
        }
      });

      setErrors(fieldErrors);
      setLoading(false);

      return;
    }

    // API CALL
    try {
      const response = await loginAdmin(result.data);

      console.log("Admin login successful:", response);

      const { access_token, admin } = response;

      // ROLE CHECK
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

      // REDIRECT
      router.replace("/admin/dashboard");
    } catch (error) {
      console.error("Admin login error:", error);

      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
          setErrors({
            email: message[0] ?? "Login failed.",
          });
        } else {
          setErrors({
            email: message ?? "Invalid email or password.",
          });
        }
      } else {
        setErrors({
          email: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/*  LOGO  */}

      <div className="mb-8 text-center">
        <Link
          href="/"
          aria-label="ToolShare home"
          className="group inline-flex items-center gap-3"
        >
          {/* Logo */}
          <span
            className="
              flex size-11
              items-center justify-center
              rounded-xl
              border-2 border-[#211F1C]
              bg-[#211F1C]
              text-white
              shadow-[3px_3px_0_#d1d5db]
              transition-all
              duration-200
              group-hover:-translate-y-0.5
              group-hover:shadow-[4px_4px_0_#d1d5db]
            "
          >
            <ShieldCheck className="size-5 stroke-[2.5]" />
          </span>

          {/* Brand */}
          <div className="text-left">
            <span
              className="
                block
                font-[family-name:var(--font-display)]
                text-[19px]
                font-bold
                leading-none
                tracking-[-0.02em]
                text-[#211F1C]
              "
            >
              ToolShare Platform
            </span>

            <span
              className="
                mt-1
                block
                text-[10px]
                font-semibold
                tracking-[0.14em]
                text-gray-400
              "
            >
              ADMINISTRATION PORTAL
            </span>
          </div>
        </Link>
      </div>

      {/* CARD  */}

      <div
        className="
          relative
          overflow-hidden
          rounded-[28px]
          border border-gray-200
          bg-white
          p-6
          shadow-[0_20px_60px_rgba(0,0,0,0.08)]
          sm:p-8
        "
      >
        {/* Decorative Circle */}

        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            size-48
            rounded-full
            bg-indigo-100/70
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-20
            -left-20
            size-48
            rounded-full
            bg-violet-100/60
            blur-3xl
          "
        />

        <div className="relative">
          {/* HEADER  */}

          <div className="mb-8">
            <div
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                rounded-full
                border border-indigo-100
                bg-indigo-50
                px-3
                py-1.5
                text-xs
                font-semibold
                text-indigo-600
              "
            >
              <ShieldCheck className="size-3.5" />
              Admin Account
            </div>

            <h1
              className="
                text-2xl
                font-bold
                tracking-[-0.04em]
                text-[#211F1C]
                sm:text-3xl
              "
            >
              Welcome back
            </h1>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-gray-500
              "
            >
              Sign in to manage your ToolShare platform.
            </p>
          </div>

          {/* FORM  */}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/*  EMAIL */}

            <div>
              <label
                htmlFor="email"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="admin@toolshare.com"
                disabled={loading}
                className={`
                  w-full
                  rounded-xl
                  border
                  bg-gray-50
                  px-4
                  py-3
                  text-sm
                  text-gray-900
                  outline-none
                  transition-all
                  placeholder:text-gray-400
                  focus:bg-white
                  focus:ring-4
                  disabled:cursor-not-allowed
                  disabled:opacity-50

                  ${
                    errors.email
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-gray-200 hover:border-indigo-300 focus:border-indigo-500 focus:ring-indigo-100"
                  }
                `}
              />

              {/* Email Error */}

              {errors.email && (
                <p
                  className="
                    mt-1.5
                    text-xs
                    font-medium
                    text-red-500
                  "
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* PASSWORD  */}

            <div>
              <label
                htmlFor="password"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  disabled={loading}
                  className={`
                    w-full
                    rounded-xl
                    border
                    bg-gray-50
                    px-4
                    py-3
                    pr-12
                    text-sm
                    text-gray-900
                    outline-none
                    transition-all
                    placeholder:text-gray-400
                    focus:bg-white
                    focus:ring-4
                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    ${
                      errors.password
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-gray-200 hover:border-violet-300 focus:border-violet-500 focus:ring-violet-100"
                    }
                  `}
                />

                {/* Show / Hide Password */}

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    rounded-lg
                    p-1.5
                    text-gray-400
                    transition-all
                    hover:bg-gray-100
                    hover:text-gray-700
                    disabled:opacity-50
                  "
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              {/* Password Error */}

              {errors.password && (
                <p
                  className="
                    mt-1.5
                    text-xs
                    font-medium
                    text-red-500
                  "
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* LOGIN BUTTON  */}

            <button
              type="submit"
              disabled={loading}
              className="
                group
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#211F1C]
                px-5
                py-3.5
                text-sm
                font-semibold
                text-white
                shadow-[0_10px_25px_rgba(33,31,28,0.15)]
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-black
                hover:shadow-[0_14px_30px_rgba(33,31,28,0.20)]
                active:translate-y-0
                disabled:cursor-not-allowed
                disabled:opacity-50
                disabled:hover:translate-y-0
              "
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight
                    className="
                      size-4
                      transition-transform
                      duration-200
                      group-hover:translate-x-1
                    "
                  />
                </>
              )}
            </button>
          </form>

          {/* ADMIN NOTICE  */}

          <div
            className="
              mt-7
              border-t
              border-gray-100
              pt-6
              text-center
            "
          >
            <p
              className="
                text-xs
                leading-5
                text-gray-400
              "
            >
              This area is restricted to authorized administrators only.
            </p>
          </div>
        </div>
      </div>

      {/*  BACK  */}

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="
            text-sm
            font-medium
            text-gray-400
            transition-colors
            hover:text-gray-800
          "
        >
          ← Choose another login
        </Link>
      </div>
    </div>
  );
};

export default AdminLoginForm;
