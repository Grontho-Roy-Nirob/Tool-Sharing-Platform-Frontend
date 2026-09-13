"use client";

import Link from "next/link";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "@/lib/axios";

const navItems = [{ label: "Tools", href: "/tools" }];

interface AuthToken {
  sub: number | string;
  email: string;
  role?: string | number;
  roles?: string[];
  exp: number;
  iat: number;
}

interface UserProfile {
  id: number | string;
  fullName: string;
  email: string;
  profileImage?: string | null;
  role: "admin" | "owner" | "renter";
  dashboardUrl: string;
  tokenStorageKey: string;
}

// Fallback resolver if role is encoded in token claims
const resolveRoleFromToken = (
  token: AuthToken,
): "admin" | "owner" | "renter" => {
  const rawRole = token.role ?? token.roles?.[0];

  if (typeof rawRole === "string") {
    const normalized = rawRole.toLowerCase();
    if (normalized.includes("admin")) return "admin";
    if (normalized.includes("owner")) return "owner";
    return "renter";
  }

  if (rawRole === 1) return "admin";
  if (rawRole === 2) return "owner";
  return "renter";
};

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Search for stored tokens in priority order
        const tokenCandidates: {
          key: string;
          defaultRole: "admin" | "owner" | "renter";
        }[] = [
          { key: "admin_access_token", defaultRole: "admin" },
          { key: "owner_access_token", defaultRole: "owner" },
          { key: "access_token", defaultRole: "renter" },
        ];

        let token: string | null = null;
        let tokenStorageKey = "access_token";
        let detectedRole: "admin" | "owner" | "renter" = "renter";

        for (const candidate of tokenCandidates) {
          const stored = localStorage.getItem(candidate.key);
          if (stored) {
            token = stored;
            tokenStorageKey = candidate.key;
            detectedRole = candidate.defaultRole;
            break;
          }
        }

        if (!token) {
          setIsLoggedIn(false);
          setAuthLoading(false);
          return;
        }

        // 2. Decode JWT
        let decoded: AuthToken;
        try {
          decoded = jwtDecode<AuthToken>(token);
        } catch {
          localStorage.removeItem(tokenStorageKey);
          setIsLoggedIn(false);
          setAuthLoading(false);
          return;
        }

        // 3. Expiration check
        if (decoded.exp * 1000 <= Date.now()) {
          localStorage.removeItem(tokenStorageKey);
          setIsLoggedIn(false);
          setAuthLoading(false);
          return;
        }

        // If the token itself contains role claims, prioritize that
        const role = decoded.role
          ? resolveRoleFromToken(decoded)
          : detectedRole;
        const dashboardUrl = `/${role}/dashboard`;

        setIsLoggedIn(true);

        // 4. Fetch profile
        try {
          const response = await api.get(`/${role}/${decoded.sub}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = response.data;

          setUser({
            id:
              data.id ||
              data.renterId ||
              data.ownerId ||
              data.adminId ||
              decoded.sub,
            fullName: data.fullName || data.name || data.username || "User",
            email: data.email || decoded.email,
            profileImage: data.profileImage || data.avatar || null,
            role,
            dashboardUrl,
            tokenStorageKey,
          });
        } catch {
          // Fallback if the role-specific profile endpoint is unavailable
          setUser({
            id: decoded.sub,
            fullName:
              decoded.email?.split("@")[0] ||
              role.charAt(0).toUpperCase() + role.slice(1),
            email: decoded.email,
            profileImage: null,
            role,
            dashboardUrl,
            tokenStorageKey,
          });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    if (user?.tokenStorageKey) {
      localStorage.removeItem(user.tokenStorageKey);
    } else {
      // Fallback cleanup
      localStorage.removeItem("admin_access_token");
      localStorage.removeItem("owner_access_token");
      localStorage.removeItem("access_token");
    }

    const role = user?.role;
    setIsLoggedIn(false);
    setUser(null);
    setMobileMenuOpen(false);

    window.location.href = role ? `/${role}` : "/";
  };

  const userInitial = user?.fullName?.charAt(0)?.toUpperCase() || "U";

  return (
    <nav
      aria-label="Main navigation"
      className="mx-auto max-w-[1152px] px-4 py-6 sm:px-8 sm:py-8"
    >
      <div className="relative flex min-h-[72px] items-center rounded-full border border-[#292b30] bg-[#0d0e10] px-4 shadow-[0_10px_40px_rgba(0,0,0,0.22)] sm:h-[92px] sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="ToolShare home"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-white text-lg font-semibold text-[#101114] sm:size-12 sm:text-[21px]">
            T
          </span>
          <span className="text-xl font-semibold tracking-[-0.04em] text-white sm:text-[23px]">
            ToolShare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="mx-auto hidden items-center gap-8 md:flex lg:gap-12">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-base tracking-[-0.03em] text-[#a5a5ab] transition-colors hover:text-white lg:text-[18px]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="ml-auto hidden shrink-0 items-center gap-3 md:flex">
          {authLoading ? (
            <div className="size-10 animate-pulse rounded-full bg-white/10" />
          ) : isLoggedIn && user ? (
            <>
              {/* Dashboard */}
              <Link
                href={user.dashboardUrl}
                className="flex items-center gap-2 rounded-full border border-[#292b30] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                {user.profileImage ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.profileImage}`}
                    alt={user.fullName}
                    className="size-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex size-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#101114]">
                    {userInitial}
                  </span>
                )}
                <span className="max-w-[120px] truncate">{user.fullName}</span>
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border border-[#292b30] px-4 py-2.5 text-sm font-medium text-[#a5a5ab] transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-base tracking-[-0.03em] text-[#a5a5ab] transition-colors hover:text-white lg:text-[18px]"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-white px-5 py-2.5 text-base font-medium tracking-[-0.03em] text-[#101114] transition-transform hover:scale-[1.03] active:scale-[0.98] lg:px-6 lg:py-3 lg:text-[18px]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="ml-auto flex size-10 items-center justify-center rounded-full border border-[#292b30] text-white transition-colors hover:bg-white/10 md:hidden"
        >
          {mobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+12px)] rounded-3xl border border-[#292b30] bg-[#0d0e10] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.35)] md:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-[#a5a5ab] transition-colors hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}

              <div className="my-2 h-px bg-[#292b30]" />

              {authLoading ? (
                <div className="h-12 animate-pulse rounded-xl bg-white/5" />
              ) : isLoggedIn && user ? (
                <>
                  <div className="flex items-center gap-3 rounded-xl px-4 py-3">
                    {user.profileImage ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.profileImage}`}
                        alt={user.fullName}
                        className="size-9 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex size-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#101114]">
                        {userInitial}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {user.fullName}
                      </p>
                      <p className="truncate text-xs text-[#686a72]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={user.dashboardUrl}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-[#a5a5ab] transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/renter"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-[#a5a5ab] transition-colors hover:bg-white/5 hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-1 rounded-full bg-white px-4 py-3 text-center font-medium text-[#101114] transition-transform hover:scale-[1.02]"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
