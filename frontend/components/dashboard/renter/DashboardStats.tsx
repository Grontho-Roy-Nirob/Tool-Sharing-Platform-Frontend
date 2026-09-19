import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  PackageCheck,
} from "lucide-react";

interface DashboardStatsProps {
  totalOrders: number;
  pendingOrders: number;
  activeOrders: number;
  completedOrders: number;
}

const stats = [
  {
    key: "total",
    label: "Total Orders",
    icon: ClipboardList,
  },
  {
    key: "pending",
    label: "Pending Requests",
    icon: Clock3,
  },
  {
    key: "active",
    label: "Active Rentals",
    icon: PackageCheck,
  },
  {
    key: "completed",
    label: "Completed Rentals",
    icon: CheckCircle2,
  },
];

export default function DashboardStats({
  totalOrders,
  pendingOrders,
  activeOrders,
  completedOrders,
}: DashboardStatsProps) {
  const values: Record<string, number> = {
    total: totalOrders,
    pending: pendingOrders,
    active: activeOrders,
    completed: completedOrders,
  };

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.key}
            className="group relative overflow-hidden rounded-2xl border border-[#292b30] bg-[#0d0e10] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3d4047] hover:bg-[#111214]"
          >
            {/* Subtle background glow */}

            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/[0.025] blur-3xl transition group-hover:bg-white/[0.05]" />

            {/* Main content */}

            <div className="relative flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#71717a]">
                  {stat.label}
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                  {values[stat.key]}
                </p>
              </div>

              {/* Icon */}

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#292b30] bg-[#17181b] text-[#a1a1aa] transition-all duration-200 group-hover:border-[#52525b] group-hover:bg-[#e4e4e7] group-hover:text-[#18181b]">
                <Icon className="h-5 w-5" />
              </div>
            </div>

            {/* Bottom divider */}

            <div className="relative mt-5 h-px w-full bg-[#202125] transition-colors group-hover:bg-[#34363c]" />

            {/* Bottom information */}

            <div className="relative mt-3 flex items-center justify-between">
              <span className="text-xs text-[#52525b]">ToolShare</span>

              <span className="text-xs font-medium text-[#3f4147] transition-colors group-hover:text-[#71717a]">
                Overview
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
