"use client";

import axios from "axios";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Hammer, Share2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { registerSchema } from "@/schemas/renterAuthSc";
import { registerRenter } from "@/app/(renter)/_actions/authAction";

const RenterRegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    phone?: string;
    nidNumber?: string;
    profileImage?: string;
  }>({});

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);

    const profileImage = formData.get("profileImage");

    const result = registerSchema.safeParse({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone"),
      nidNumber: formData.get("nidNumber"),
      profileImage:
        profileImage instanceof File && profileImage.size > 0
          ? profileImage
          : undefined,
    });

    // ZOD VALIDATION
    if (!result.success) {
      const fieldErrors: {
        fullName?: string;
        email?: string;
        password?: string;
        phone?: string;
        nidNumber?: string;
        profileImage?: string;
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
      const response = await registerRenter(result.data);

      console.log("Registration successful:", response);

      // SUCCESS TOAST 
      toast.success("Registration successful!", {
        description: "Your ToolShare renter account has been created.",
      });

      // GO TO LOGIN PAGE 
      router.push("/renter");
    } catch (error) {
      console.error("Registration error:", error);

      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
          setErrors({
            email: message[0] ?? "Registration failed.",
          });
        } else {
          setErrors({
            email: message ?? "Unable to create your account.",
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
      <div
        className="
          relative
          overflow-hidden
          rounded-[28px]
          border border-slate-200
          bg-white
          p-6
          shadow-[0_20px_60px_rgba(15,23,42,0.08)]
          sm:p-8
        "
      >
        {/* Decorative colors */}
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
          {/* Header */}
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
              <span className="size-1.5 rounded-full bg-indigo-500" />
              Renter Registration
            </div>

            <h1
              className="
                text-2xl
                font-bold
                tracking-[-0.04em]
                text-slate-900
                sm:text-3xl
              "
            >
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Join ToolShare and start borrowing tools from your community.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Mahib Alam Khan"
                  disabled={loading}
                  className={`
                    w-full
                    rounded-xl
                    border
                    bg-slate-50
                    px-4 py-3
                    text-sm
                    text-slate-900
                    outline-none
                    transition-all
                    placeholder:text-slate-400
                    focus:bg-white
                    focus:ring-4
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    ${
                      errors.fullName
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 focus:border-indigo-400 focus:ring-indigo-100"
                    }
                  `}
                />

                {errors.fullName && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
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
                  className={`
                    w-full
                    rounded-xl
                    border
                    bg-slate-50
                    px-4 py-3
                    text-sm
                    text-slate-900
                    outline-none
                    transition-all
                    placeholder:text-slate-400
                    focus:bg-white
                    focus:ring-4
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    ${
                      errors.email
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 focus:border-indigo-400 focus:ring-indigo-100"
                    }
                  `}
                />

                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
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
                    className={`
                      w-full
                      rounded-xl
                      border
                      bg-slate-50
                      px-4 py-3 pr-11
                      text-sm
                      text-slate-900
                      outline-none
                      transition-all
                      placeholder:text-slate-400
                      focus:bg-white
                      focus:ring-4
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      ${
                        errors.password
                          ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                          : "border-slate-200 hover:border-violet-200 hover:bg-violet-50/20 focus:border-violet-400 focus:ring-violet-100"
                      }
                    `}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    disabled={loading}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      rounded-lg
                      p-1.5
                      text-slate-400
                      transition-all
                      hover:bg-violet-50
                      hover:text-violet-600
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

                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Phone number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="text"
                  autoComplete="tel"
                  placeholder="017XXXXXXXX"
                  disabled={loading}
                  className={`
                    w-full
                    rounded-xl
                    border
                    bg-slate-50
                    px-4 py-3
                    text-sm
                    text-slate-900
                    outline-none
                    transition-all
                    placeholder:text-slate-400
                    focus:bg-white
                    focus:ring-4
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    ${
                      errors.phone
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 focus:border-indigo-400 focus:ring-indigo-100"
                    }
                  `}
                />

                {errors.phone && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* NID */}
              <div>
                <label
                  htmlFor="nidNumber"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  NID Number
                </label>

                <input
                  id="nidNumber"
                  name="nidNumber"
                  type="text"
                  placeholder="Enter your NID number"
                  disabled={loading}
                  className={`
                    w-full
                    rounded-xl
                    border
                    bg-slate-50
                    px-4 py-3
                    text-sm
                    text-slate-900
                    outline-none
                    transition-all
                    placeholder:text-slate-400
                    focus:bg-white
                    focus:ring-4
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    ${
                      errors.nidNumber
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 focus:border-indigo-400 focus:ring-indigo-100"
                    }
                  `}
                />

                {errors.nidNumber && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.nidNumber}
                  </p>
                )}
              </div>

              {/* Profile Image */}
              <div>
                <label
                  htmlFor="profileImage"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Profile image
                </label>

                <input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  disabled={loading}
                  className="
                    w-full
                    cursor-pointer
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4 py-2.5
                    text-sm
                    text-slate-600
                    outline-none
                    transition-all
                    file:mr-4
                    file:rounded-lg
                    file:border-0
                    file:bg-slate-900
                    file:px-3
                    file:py-1.5
                    file:text-sm
                    file:font-medium
                    file:text-white
                    hover:border-indigo-200
                    hover:file:bg-indigo-600
                    focus:border-indigo-400
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                />

                <p className="mt-2 text-xs text-slate-400">
                  JPG, JPEG, PNG or WEBP. Maximum 2MB.
                </p>

                {errors.profileImage && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.profileImage}
                  </p>
                )}
              </div>

              {/* Submit */}
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
                  bg-gradient-to-r
                  from-indigo-600
                  to-violet-600
                  px-5
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_10px_25px_rgba(79,70,229,0.22)]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:from-indigo-700
                  hover:to-violet-700
                  hover:shadow-[0_14px_30px_rgba(79,70,229,0.28)]
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  disabled:hover:translate-y-0
                "
              >
                {loading ? "Creating Account..." : "Create Account"}

                {!loading && (
                  <ArrowRight
                    className="
                      size-4
                      transition-transform
                      duration-200
                      group-hover:translate-x-1
                    "
                  />
                )}
              </button>
            </div>
          </form>

          {/* Login */}
          <div
            className="
              mt-7
              border-t
              border-slate-200
              pt-6
              text-center
            "
          >
            <p className="text-sm text-slate-500">
              Already have a renter account?{" "}
              <Link
                href="/renter"
                className="
                  font-semibold
                  text-indigo-600
                  transition-colors
                  hover:text-violet-600
                "
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Back */}
      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="
            text-sm
            font-medium
            text-slate-500
            transition-colors
            hover:text-indigo-600
          "
        >
          ← Choose another login
        </Link>
      </div>
    </div>
  );
};

export default RenterRegistrationForm;
