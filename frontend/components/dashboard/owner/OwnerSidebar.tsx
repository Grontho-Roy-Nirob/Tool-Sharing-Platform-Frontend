"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  Plus,
  UserCircle,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/owner/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Tools",
    href: "/owner/mytools",
    icon: Wrench,
  },
  {
    label: "Profile",
    href: "/owner/profile",
    icon: UserCircle,
  },
];

export default function OwnerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("login_success");

    router.replace("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[280px] border-r border-[#25272c] bg-[#0b0c0e] lg:block">
      {/* LOGO */}
      <div className="flex h-[88px] items-center border-b border-[#25272c] px-7">
        <Link href="/owner/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-black">
            T
          </div>

          <span className="text-xl font-bold text-white">ToolShare</span>
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="px-4 py-6">
        <p className="mb-4 px-5 text-xs font-medium uppercase tracking-wider text-[#555a63]">
          Workspace
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/owner/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-2 flex items-center gap-4 rounded-xl px-5 py-3.5 text-sm font-medium transition ${
                isActive
                  ? "bg-white text-black"
                  : "text-[#9ca3af] hover:bg-[#15171a] hover:text-white"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="absolute bottom-0 left-0 w-full border-t border-[#25272c] p-5">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm text-[#9ca3af] transition hover:bg-[#15171a] hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px]" />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
