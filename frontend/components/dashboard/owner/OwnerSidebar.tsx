"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronRight,
  FolderOpen,
  Hammer,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingBag,
  Share2,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function OwnerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      href: "/owner/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Tools",
      href: "/owner/mytools",
      icon: Hammer,
    },
    {
      label: "Orders",
      href: "/owner/orders",
      icon: ShoppingBag,
    },
    {
      label: "Profile",
      href: "/owner/profile",
      icon: UserRound,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("login_success");

    toast.success("Logged out successfully.");

    router.push("/login");
  };

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-[68px] items-center justify-between bg-[#F3EFE7] px-4 shadow-[0_1px_10px_rgba(33,31,28,0.06)] lg:hidden">
        {/* Mobile Brand */}

        <Link
          href="/owner/dashboard"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5"
        >
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden border-2 border-[#211F1C] bg-[#E8A33D] text-[#211F1C] shadow-[2px_2px_0_#211F1C]">
            <Hammer className="relative z-10 h-[17px] w-[17px] -rotate-12 stroke-[2.5]" />

            <span className="absolute bottom-0.5 right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-[#211F1C] text-[#F3EFE7]">
              <Share2 className="h-[7px] w-[7px] stroke-[2.5]" />
            </span>
          </span>

          <div>
            <p className="font-[family-name:var(--font-display)] text-[15px] font-bold leading-none text-[#211F1C]">
              ToolShare
            </p>

            <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#8B8177]">
              Owner Workspace
            </p>
          </div>
        </Link>

        {/* Mobile Menu Button */}

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open owner menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#211F1C] shadow-[0_2px_8px_rgba(33,31,28,0.06)] transition-all duration-200 active:scale-95"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>


      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[60] bg-[#211F1C]/35 backdrop-blur-[2px] lg:hidden"
        />
      )}


      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-[70] flex h-screen w-[285px] flex-col bg-[#F3EFE7] shadow-[12px_0_35px_rgba(33,31,28,0.12)] transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* MOBILE SIDEBAR HEADER */}

        <div className="flex h-[82px] shrink-0 items-center justify-between border-b border-[#211F1C]/10 px-5">
          <Link
            href="/owner/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3"
          >
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden border-2 border-[#211F1C] bg-[#E8A33D] text-[#211F1C] shadow-[3px_3px_0_#211F1C]">
              <Hammer className="relative z-10 h-5 w-5 -rotate-12 stroke-[2.5]" />

              <span className="absolute bottom-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#211F1C] text-[#F3EFE7]">
                <Share2 className="h-2 w-2 stroke-[2.5]" />
              </span>
            </span>

            <div>
              <p className="font-[family-name:var(--font-display)] text-[18px] font-bold leading-none text-[#211F1C]">
                ToolShare
              </p>

              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#8B8177]">
                Owner Workspace
              </p>
            </div>
          </Link>

          {/* Close */}

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close owner menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#6B6A66] shadow-sm transition-all duration-200 hover:bg-[#fff0ed] hover:text-[#C1502E] active:scale-95"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* MOBILE NAVIGATION */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8B8177]">
            Workspace
          </p>

          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#E8A33D]/25 text-[#9A5B13] shadow-sm"
                      : "text-[#6B6A66] hover:bg-[#E8A33D]/15 hover:text-[#9A5B13]"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[#C1502E]" />
                  )}

                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-[#E8A33D] text-[#211F1C] shadow-sm"
                        : "bg-white/75 text-[#6B6A66] group-hover:bg-[#F6D7A9] group-hover:text-[#9A5B13]"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>

                  <span>{item.label}</span>

                  {isActive && (
                    <ChevronRight className="ml-auto h-4 w-4 text-[#C17A28]" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* MOBILE BOTTOM */}

        <div className="shrink-0 p-4">
          {/* Workspace Card */}

          <div className="relative mb-3 overflow-hidden rounded-2xl bg-white/75 p-4 shadow-[0_3px_12px_rgba(33,31,28,0.04)]">
            <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full border-[9px] border-[#E8A33D]/20" />

            <div className="absolute -bottom-8 -left-6 h-16 w-16 rounded-full bg-[#E8A33D]/10" />

            <div className="relative">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8A33D]/20">
                <FolderOpen className="h-4 w-4 text-[#C17A28]" />
              </div>

              <p className="text-xs font-bold text-[#211F1C]">
                Owner Workspace
              </p>

              <p className="mt-1 text-[10px] leading-4 text-[#6B6A66]">
                Manage your tools, orders and profile from here.
              </p>
            </div>
          </div>

          {/* Logout */}

          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#C1502E] transition-all duration-200 hover:bg-[#C1502E]/10 hover:text-[#B13F25]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C1502E]/10 text-[#C1502E] transition-all duration-200 group-hover:bg-[#C1502E]/20 group-hover:text-[#B13F25]">
              <LogOut className="h-[17px] w-[17px]" />
            </span>

            <span>Logout</span>
          </button>
        </div>
      </aside>


      {/* DESKTOP SIDEBAR — ORIGINAL DESIGN */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[280px] border-r border-[#211F1C]/10 bg-[#F3EFE7] lg:flex lg:flex-col">
        {/* LOGO */}

        <div className="flex h-[88px] items-center border-b border-[#211F1C]/10 px-6">
          <Link
            href="/owner/dashboard"
            aria-label="ToolShare owner dashboard"
            className="group flex shrink-0 items-center gap-3"
          >
            {/* Logo Icon */}

            <span className="relative flex size-11 items-center justify-center overflow-hidden border-2 border-[#211F1C] bg-[#E8A33D] text-[#211F1C] shadow-[3px_3px_0_#211F1C] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0_#211F1C]">
              <Hammer className="relative z-10 size-5 -rotate-12 stroke-[2.5] transition-transform duration-300 group-hover:rotate-0" />

              <span className="absolute bottom-1 right-1 flex size-4 items-center justify-center rounded-full bg-[#211F1C] text-[#F3EFE7] transition-transform duration-300 group-hover:scale-110">
                <Share2 className="size-2.5 stroke-[2.5]" />
              </span>
            </span>

            {/* Brand */}

            <div>
              <span className="block font-[family-name:var(--font-display)] text-[19px] font-bold leading-none text-[#211F1C]">
                ToolShare Platform
              </span>

              <span className="mt-1 block text-[10px] font-medium tracking-[0.14em] text-[#6B6A66]">
                Owner Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* NAVIGATION */}

        <nav className="px-4 py-7">
          <p className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8B8177]">
            Workspace
          </p>

          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#E8A33D]/25 text-[#9A5B13] shadow-sm"
                      : "text-[#6B6A66] hover:bg-[#E8A33D]/15 hover:text-[#9A5B13]"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-[#C1502E]" />
                  )}

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-[#E8A33D] text-[#211F1C] shadow-sm"
                        : "bg-white/70 text-[#6B6A66] group-hover:bg-[#F6D7A9] group-hover:text-[#9A5B13]"
                    }`}
                  >
                    <Icon className="h-[17px] w-[17px]" />
                  </span>

                  <span>{item.label}</span>

                  {isActive && (
                    <ChevronRight className="ml-auto h-4 w-4 text-[#C17A28]" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* BOTTOM */}

        <div className="mt-auto p-4">
          {/* Workspace Card */}

          <div className="relative mb-3 overflow-hidden rounded-2xl border border-[#211F1C]/10 bg-white/70 p-4">
            <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full border-[9px] border-[#E8A33D]/20" />

            <div className="absolute -bottom-8 -left-6 h-16 w-16 rounded-full bg-[#E8A33D]/10" />

            <div className="relative">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8A33D]/20">
                <FolderOpen className="h-4 w-4 text-[#C17A28]" />
              </div>

              <p className="text-xs font-bold text-[#211F1C]">
                Owner Workspace
              </p>

              <p className="mt-1 text-[10px] leading-4 text-[#6B6A66]">
                Manage your tools, orders and profile from here.
              </p>
            </div>
          </div>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#C1502E] transition-all duration-200 hover:bg-[#C1502E]/10 hover:text-[#B13F25]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C1502E]/10 text-[#C1502E] transition-all duration-200 group-hover:bg-[#C1502E]/20 group-hover:text-[#B13F25]">
              <LogOut className="h-[17px] w-[17px]" />
            </span>

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
