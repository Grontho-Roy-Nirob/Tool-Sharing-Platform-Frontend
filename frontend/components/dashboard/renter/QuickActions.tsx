import Link from "next/link";
import { ArrowRight, ClipboardList, Search, User } from "lucide-react";

const actions = [
  {
    title: "Find a Tool",
    description: "Explore tools available for rental",
    href: "/tools",
    icon: Search,
  },
  {
    title: "View My Orders",
    description: "Track your rental requests",
    href: "/renter/orders",
    icon: ClipboardList,
  },
  {
    title: "Update Profile",
    description: "Manage your account information",
    href: "/renter/profile",
    icon: User,
  },
];

export default function QuickActions() {
  return (
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        <p className="mt-1 text-sm text-[#71717a]">
          Quickly access the things you use most
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group rounded-2xl border border-[#292b30] bg-[#0d0e10] p-5 transition hover:border-[#3a3c42] hover:bg-[#111214]"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17181b] text-[#d4d4d8] transition group-hover:bg-white group-hover:text-black">
                  <Icon className="h-5 w-5" />
                </div>

                <ArrowRight className="h-5 w-5 text-[#52525b] transition group-hover:translate-x-1 group-hover:text-white" />
              </div>

              <div className="mt-5">
                <h3 className="font-medium text-white">{action.title}</h3>

                <p className="mt-1 text-sm leading-6 text-[#71717a]">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
