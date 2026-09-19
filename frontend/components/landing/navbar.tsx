"use client";

import Link from "next/link";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  UserRound,
  Hammer,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import api from "@/lib/axios";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Browse Tools", href: "/tools" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Why ToolShare", href: "/#why-toolshare" },
];

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
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Current URL hash
  const [currentHash, setCurrentHash] = useState("");

  /* HASH CHANGE */

  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(window.location.hash);
    };

    updateHash();

    window.addEventListener("hashchange", updateHash);

    return () => {
      window.removeEventListener("hashchange", updateHash);
    };
  }, [pathname]);

  /* AUTH CHECK */

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const tokenCandidates: {
          key: string;
          defaultRole: "admin" | "owner" | "renter";
        }[] = [
          {
            key: "admin_access_token",
            defaultRole: "admin",
          },
          {
            key: "owner_access_token",
            defaultRole: "owner",
          },
          {
            key: "access_token",
            defaultRole: "renter",
          },
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

        let decoded: AuthToken;

        try {
          decoded = jwtDecode<AuthToken>(token);
        } catch {
          localStorage.removeItem(tokenStorageKey);
          setIsLoggedIn(false);
          setAuthLoading(false);
          return;
        }

        // Check token expiration
        if (decoded.exp * 1000 <= Date.now()) {
          localStorage.removeItem(tokenStorageKey);
          setIsLoggedIn(false);
          setAuthLoading(false);
          return;
        }

        const role = decoded.role
          ? resolveRoleFromToken(decoded)
          : detectedRole;

        const dashboardUrl = `/${role}/dashboard`;

        setIsLoggedIn(true);

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

  /* LOGOUT */

  const handleLogout = () => {
    if (user?.tokenStorageKey) {
      localStorage.removeItem(user.tokenStorageKey);
    } else {
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

  /* USER INITIAL */
  const userInitial = user?.fullName?.charAt(0)?.toUpperCase() || "U";

  /* ACTIVE NAV ITEM */
  const isNavItemActive = (item: { label: string; href: string }) => {
    // Home
    if (item.href === "/") {
      return pathname === "/" && currentHash === "";
    }

    // Browse Tools
    if (item.href === "/tools") {
      return pathname.startsWith("/tools");
    }

    // How It Works
    if (item.href === "/#how-it-works") {
      return pathname === "/" && currentHash === "#how-it-works";
    }

    // Why ToolShare
    if (item.href === "/#why-toolshare") {
      return pathname === "/" && currentHash === "#why-toolshare";
    }

    return false;
  };

  return (
    <nav
      className="
    sticky top-0 z-50 w-full
    border-b border-[#211F1C]/10
    bg-[#F3EFE7]/95
    px-4 py-3
    backdrop-blur-xl
    shadow-[0_4px_14px_rgba(33,31,28,0.14)]
    sm:px-6
    lg:px-8
  "
    >
      <div className="mx-auto flex max-w-[1240px] items-center gap-4">
        {/* LOGO */}

        <Link
          href="/"
          aria-label="ToolShare home"
          className="group flex shrink-0 items-center gap-3"
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

          {/* Brand Name */}

          <div className="hidden sm:block">
            <span
              className="
                block
                font-[family-name:var(--font-display)]
                text-[19px]
                font-bold
                leading-none
                text-[#211F1C]
              "
            >
              ToolShare Platform
            </span>

            <span
              className="
                mt-1 block
                text-[10px]
                font-medium
                tracking-[0.14em]
                text-[#6B6A66]
              "
            >
              Rent · Share · Save
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = isNavItemActive(item);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (item.href.includes("#")) {
                      setCurrentHash(
                        item.href.substring(item.href.indexOf("#")),
                      );
                    } else {
                      setCurrentHash("");
                    }
                  }}
                  className={`
                    relative
                    px-3.5 py-2
                    text-[13px]
                    font-medium
                    transition-colors
                    duration-150
                    lg:px-4
                    lg:text-sm
                    ${
                      active
                        ? "text-[#211F1C]"
                        : "text-[#6B6A66] hover:text-[#211F1C]"
                    }
                  `}
                >
                  {item.label}

                  {/* Active Underline */}

                  {active && (
                    <span
                      className="
                        absolute
                        left-1/2
                        bottom-0
                        h-[2px]
                        w-[calc(100%-24px)]
                        -translate-x-1/2
                        bg-[#C1502E]
                      "
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="ml-auto hidden items-center gap-3 md:flex">
          {authLoading ? (
            <div
              className="
                h-10 w-24
                animate-pulse
                border border-[#211F1C]/10
                bg-[#211F1C]/5
              "
            />
          ) : isLoggedIn && user ? (
            <>
              {/* Dashboard */}

              <Link
                href={user.dashboardUrl}
                className="
                  group
                  flex items-center gap-2
                  border border-[#211F1C]/15
                  bg-white
                  px-2.5 py-1.5
                  transition-colors
                  duration-150
                  hover:border-[#211F1C]/40
                "
              >
                {user.profileImage ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.profileImage}`}
                    alt={user.fullName}
                    className="size-8 object-cover"
                  />
                ) : (
                  <span
                    className="
                      flex size-8
                      items-center justify-center
                      bg-[#E8A33D]/30
                      text-xs
                      font-bold
                      text-[#211F1C]
                    "
                  >
                    {userInitial}
                  </span>
                )}

                <div className="hidden xl:block">
                  <p
                    className="
                      max-w-[100px]
                      truncate
                      text-xs
                      font-semibold
                      text-[#211F1C]
                    "
                  >
                    {user.fullName}
                  </p>

                  <p
                    className="
                      text-[10px]
                      capitalize
                      text-[#6B6A66]
                    "
                  >
                    {user.role}
                  </p>
                </div>

                <LayoutDashboard
                  className="
                    size-4
                    text-[#6B6A66]
                    transition-colors
                    group-hover:text-[#211F1C]
                  "
                />
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex items-center gap-2
                  px-3 py-2
                  text-sm font-medium
                  text-[#6B6A66]
                  transition-colors
                  hover:text-[#C1502E]
                "
              >
                <LogOut className="size-4" />

                <span className="hidden lg:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              {/* Sign In */}
              <Link
                href="/login"
                className="
                  px-4 py-2
                  text-sm font-medium
                  text-[#6B6A66]
                  transition-colors
                  hover:text-[#211F1C]
                "
              >
                Sign in
              </Link>

              {/* Get Started */}
              <Link
                href="/register"
                className="
                  border-2
                  border-[#211F1C]
                  bg-[#211F1C]
                  px-5 py-2
                  text-sm font-semibold
                  text-[#F3EFE7]
                  transition-colors
                  hover:border-[#C1502E]
                  hover:bg-[#C1502E]
                "
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="
            ml-auto
            flex size-10
            items-center justify-center
            border-2 border-[#211F1C]
            bg-[#F3EFE7]
            text-[#211F1C]
            md:hidden
          "
        >
          {mobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div
            className="
              absolute
              inset-x-4
              top-[calc(100%+1px)]
              border-2
              border-t-0
              border-[#211F1C]
              bg-[#F3EFE7]
              p-3
              md:hidden
            "
          >
            <div className="flex flex-col gap-1">
              {/* Mobile Nav Items */}
              {navItems.map((item) => {
                const active = isNavItemActive(item);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (item.href.includes("#")) {
                        setCurrentHash(
                          item.href.substring(item.href.indexOf("#")),
                        );
                      } else {
                        setCurrentHash("");
                      }

                      setMobileMenuOpen(false);
                    }}
                    className={`
                      px-4 py-3
                      text-sm font-medium
                      transition-colors
                      ${
                        active
                          ? "bg-[#E8A33D]/25 text-[#211F1C]"
                          : "text-[#6B6A66] hover:bg-[#211F1C]/5 hover:text-[#211F1C]"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="my-2 h-px bg-[#211F1C]/10" />

              {/* Mobile Loading */}
              {authLoading ? (
                <div
                  className="
                    h-12
                    animate-pulse
                    bg-[#211F1C]/5
                  "
                />
              ) : isLoggedIn && user ? (
                <>
                  {/* User Info */}

                  <div
                    className="
                      flex items-center gap-3
                      bg-[#211F1C]/5
                      px-4 py-3
                    "
                  >
                    {user.profileImage ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.profileImage}`}
                        alt={user.fullName}
                        className="size-9 object-cover"
                      />
                    ) : (
                      <span
                        className="
                          flex size-9
                          items-center justify-center
                          bg-[#E8A33D]/30
                          text-sm font-bold
                          text-[#211F1C]
                        "
                      >
                        {userInitial}
                      </span>
                    )}

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-sm
                          font-semibold
                          text-[#211F1C]
                        "
                      >
                        {user.fullName}
                      </p>

                      <p
                        className="
                          truncate
                          text-xs
                          text-[#6B6A66]
                        "
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Dashboard */}
                  <Link
                    href={user.dashboardUrl}
                    onClick={() => setMobileMenuOpen(false)}
                    className="
                      flex items-center gap-3
                      px-4 py-3
                      text-sm font-medium
                      text-[#6B6A66]
                      transition-colors
                      hover:bg-[#211F1C]/5
                      hover:text-[#211F1C]
                    "
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Link>

                  {/* Profile */}
                  <Link
                    href={user.role === "owner" ? "/owner/profile" : "/"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="
                      flex items-center gap-3
                      px-4 py-3
                      text-sm font-medium
                      text-[#6B6A66]
                      transition-colors
                      hover:bg-[#211F1C]/5
                      hover:text-[#211F1C]
                    "
                  >
                    <UserRound className="size-4" />
                    Profile
                  </Link>

                  {/* Logout */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex w-full
                      items-center gap-3
                      px-4 py-3
                      text-sm font-medium
                      text-[#C1502E]
                      transition-colors
                      hover:bg-[#C1502E]/10
                    "
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Sign In */}

                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="
                      px-4 py-3
                      text-sm font-medium
                      text-[#6B6A66]
                      transition-colors
                      hover:bg-[#211F1C]/5
                      hover:text-[#211F1C]
                    "
                  >
                    Sign in
                  </Link>

                  {/* Get Started */}

                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="
                      mt-1
                      border-2
                      border-[#211F1C]
                      bg-[#211F1C]
                      px-4 py-3
                      text-center
                      text-sm font-semibold
                      text-[#F3EFE7]
                      transition-colors
                      hover:border-[#C1502E]
                      hover:bg-[#C1502E]
                    "
                  >
                    Get started
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
