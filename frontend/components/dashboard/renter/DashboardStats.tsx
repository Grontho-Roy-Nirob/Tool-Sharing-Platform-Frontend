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
            className="rounded-2xl border border-[#292b30] bg-[#0d0e10] p-5 transition hover:border-[#3a3c42]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#71717a]">{stat.label}</p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                  {values[stat.key]}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#17181b] text-[#d4d4d8]">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
