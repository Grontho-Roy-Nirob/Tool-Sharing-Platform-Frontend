"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Clock, Loader2, MapPin, X, Wrench } from "lucide-react";
import { toast } from "sonner";
import adminApi from "@/lib/adminAxios";

interface Tool {
  id: number;
  tool_name: string;
  description: string;
  brand: string;
  condition: string;
  rental_price_per_day: string | number;
  location: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  status: "pending" | "approved" | "rejected";
  tool_image: string;
  category_id: number;
}

type ToolStatus = "all" | "pending" | "approved" | "rejected";

export default function AdminToolsTable() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [activeStatus, setActiveStatus] = useState<ToolStatus>("pending");

  const fetchTools = async () => {
    try {
      setLoading(true);

      const response = await adminApi.get<Tool[]>("/owner/tools");

      setTools(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tools");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const filteredTools = useMemo(() => {
    if (activeStatus === "all") {
      return tools;
    }

    return tools.filter((tool) => tool.status === activeStatus);
  }, [tools, activeStatus]);

  const updateStatus = async (
    toolId: number,
    status: "approved" | "rejected",
  ) => {
    try {
      setUpdatingId(toolId);

      const response = await adminApi.patch<Tool>(
        `/admin/tools/${toolId}/status`,
        {
          status,
        },
      );

      setTools((currentTools) =>
        currentTools.map((tool) => (tool.id === toolId ? response.data : tool)),
      );

      toast.success(
        status === "approved"
          ? "Tool approved successfully"
          : "Tool rejected successfully",
      );
    } catch (error: any) {
      console.error(error);

      toast.error(error?.response?.data?.message || `Failed to ${status} tool`);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusCounts = {
    all: tools.length,
    pending: tools.filter((tool) => tool.status === "pending").length,
    approved: tools.filter((tool) => tool.status === "approved").length,
    rejected: tools.filter((tool) => tool.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/60" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "pending", label: "Pending", icon: Clock },
          { key: "approved", label: "Approved", icon: Check },
          { key: "rejected", label: "Rejected", icon: X },
          { key: "all", label: "All", icon: Wrench },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveStatus(key as ToolStatus)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              activeStatus === key
                ? "bg-white text-black"
                : "bg-white/[0.05] text-white/60 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />

            {label}

            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeStatus === key
                  ? "bg-black/10 text-black"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {statusCounts[key as ToolStatus]}
            </span>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredTools.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06]">
            <Wrench className="h-5 w-5 text-white/40" />
          </div>

          <h3 className="text-base font-medium text-white">
            No {activeStatus === "all" ? "" : activeStatus} tools
          </h3>

          <p className="mt-1 text-sm text-white/40">
            There are no tools in this category right now.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-white/40">
                      Tool
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-white/40">
                      Brand
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-white/40">
                      Condition
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-white/40">
                      Price
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-white/40">
                      Location
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-white/40">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-white/40">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTools.map((tool) => (
                    <tr
                      key={tool.id}
                      className="border-b border-white/[0.06] last:border-0"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/[0.06]">
                            {tool.tool_image ? (
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${tool.tool_image}`}
                                alt={tool.tool_name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Wrench className="h-5 w-5 text-white/30" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-medium text-white">
                              {tool.tool_name}
                            </p>

                            <p className="mt-0.5 max-w-[220px] truncate text-xs text-white/40">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-white/70">
                        {tool.brand}
                      </td>

                      <td className="px-6 py-5 text-sm text-white/70">
                        {tool.condition}
                      </td>

                      <td className="px-6 py-5 text-sm text-white/70">
                        ৳{Number(tool.rental_price_per_day).toLocaleString()}
                        <span className="text-xs text-white/30"> /day</span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5 text-sm text-white/60">
                          <MapPin className="h-3.5 w-3.5" />
                          {tool.location}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge status={tool.status} />
                      </td>

                      <td className="px-6 py-5">
                        {tool.status === "pending" ? (
                          <ActionButtons
                            toolId={tool.id}
                            updatingId={updatingId}
                            onApprove={() => updateStatus(tool.id, "approved")}
                            onReject={() => updateStatus(tool.id, "rejected")}
                          />
                        ) : (
                          <span className="text-xs text-white/30">
                            No action
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile / Tablet Cards */}
          <div className="grid gap-4 lg:hidden">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/[0.06]">
                    {tool.tool_image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${tool.tool_image}`}
                        alt={tool.tool_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Wrench className="h-5 w-5 text-white/30" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-white">
                          {tool.tool_name}
                        </h3>

                        <p className="mt-1 text-sm text-white/40">
                          {tool.brand}
                        </p>
                      </div>

                      <StatusBadge status={tool.status} />
                    </div>
                  </div>
                </div>

                <p className="mt-4 line-clamp-2 text-sm leading-6 text-white/50">
                  {tool.description}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-white/[0.04] p-3">
                    <p className="text-xs text-white/30">Price</p>
                    <p className="mt-1 text-white/80">
                      ৳{Number(tool.rental_price_per_day).toLocaleString()}
                      /day
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/[0.04] p-3">
                    <p className="text-xs text-white/30">Condition</p>
                    <p className="mt-1 text-white/80">{tool.condition}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-sm text-white/50">
                  <MapPin className="h-3.5 w-3.5" />
                  {tool.location}
                </div>

                {tool.status === "pending" && (
                  <div className="mt-5">
                    <ActionButtons
                      toolId={tool.id}
                      updatingId={updatingId}
                      onApprove={() => updateStatus(tool.id, "approved")}
                      onReject={() => updateStatus(tool.id, "rejected")}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "pending" | "approved" | "rejected";
}) {
  const styles = {
    pending: "bg-yellow-500/10 text-yellow-400",
    approved: "bg-green-500/10 text-green-400",
    rejected: "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function ActionButtons({
  toolId,
  updatingId,
  onApprove,
  onReject,
}: {
  toolId: number;
  updatingId: number | null;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isUpdating = updatingId === toolId;

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        disabled={isUpdating}
        onClick={onApprove}
        className="inline-flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-2 text-xs font-medium text-green-400 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isUpdating ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Check className="h-3.5 w-3.5" />
        )}
        Approve
      </button>

      <button
        type="button"
        disabled={isUpdating}
        onClick={onReject}
        className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <X className="h-3.5 w-3.5" />
        Reject
      </button>
    </div>
  );
}
