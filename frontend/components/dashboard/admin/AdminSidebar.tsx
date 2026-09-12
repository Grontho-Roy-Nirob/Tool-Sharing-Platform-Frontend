"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserRoundCog,
  FolderTree,
  ShieldCheck,
  LogOut,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Renters",
    href: "/admin/renters",
    icon: Users,
  },
  {
    label: "Owners",
    href: "/admin/owners",
    icon: UserRoundCog,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    label: "Admins",
    href: "/admin/admins",
    icon: ShieldCheck,
  },
];

export default function AdminSidebar({
  mobileOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_user");

    toast.success("Logged out successfully.");

    router.replace("/admin");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64
          flex-col border-r border-white/10
          bg-[#0b0c0f]
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3"
            onClick={onClose}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black">
              T
            </div>

            <div>
              <p className="text-sm font-bold">ToolShire</p>

              <p className="text-[11px] text-white/40">Admin Panel</p>
            </div>
          </Link>

          {/* Mobile close */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/30">
            Management
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 rounded-xl px-3 py-2.5
                  text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-white text-black"
                      : "text-white/50 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon className="h-4.5 w-4.5" />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4.5 w-4.5" />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
