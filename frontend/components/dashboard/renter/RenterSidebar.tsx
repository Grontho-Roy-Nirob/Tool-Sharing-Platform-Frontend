"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ClipboardList, LayoutDashboard, LogOut, User } from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/renter/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Orders",
    href: "/renter/orders",
    icon: ClipboardList,
  },
  {
    label: "Profile",
    href: "/renter/profile",
    icon: User,
  },
];

export default function RenterSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.replace("/renter");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-[#292b30] bg-[#0d0e10] lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-[#292b30] px-6">
        <Link href="/renter/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-bold text-black">
            T
          </div>

          <span className="text-lg font-semibold tracking-tight text-white">
            ToolShire
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-white text-black"
                  : "text-[#9ca3af] hover:bg-[#17181b] hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-[#292b30] p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#9ca3af] transition hover:bg-[#17181b] hover:text-white"
        >
          <LogOut className="h-5 w-5" />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
