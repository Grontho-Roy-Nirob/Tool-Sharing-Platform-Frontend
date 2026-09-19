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

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="flex h-10 items-center justify-center rounded-xl border border-[#e7dfd4] bg-white/70"
          >
            <Loader2 className="h-4 w-4 animate-spin text-[#c17a28]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ================================================= */}
      {/* STATUS TABS */}
      {/* ================================================= */}

      <div className="flex flex-wrap gap-2">
        {[
          { key: "pending", label: "Pending", icon: Clock },
          { key: "approved", label: "Approved", icon: Check },
          { key: "rejected", label: "Rejected", icon: X },
          { key: "all", label: "All", icon: Wrench },
        ].map(({ key, label, icon: Icon }) => {
          const isActive = activeStatus === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveStatus(key as ToolStatus)}
              className={`group flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all duration-200 ${
                isActive
                  ? "border-[#e8a33d]/40 bg-[#e8a33d] text-[#211f1c] shadow-sm"
                  : "border-[#e7dfd4] bg-white/70 text-[#77736d] hover:border-[#d8cabb] hover:bg-white hover:text-[#9a5b13]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />

              <span>{label}</span>

              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  isActive
                    ? "bg-[#211f1c]/10 text-[#211f1c]"
                    : "bg-[#f3efe7] text-[#8b8177]"
                }`}
              >
                {statusCounts[key as ToolStatus]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ================================================= */}
      {/* EMPTY STATE */}
      {/* ================================================= */}

      {filteredTools.length === 0 ? (
        <div className="rounded-2xl border border-[#e7dfd4] bg-white/70 px-6 py-14 text-center shadow-[0_3px_14px_rgba(33,31,28,0.04)]">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3efe7] text-[#c17a28]">
            <Wrench className="h-5 w-5" />
          </div>

          <h3 className="text-base font-bold text-[#292722]">
            No {activeStatus === "all" ? "" : activeStatus} tools
          </h3>

          <p className="mt-1 text-sm text-[#8b8177]">
            There are no tools in this category right now.
          </p>
        </div>
      ) : (
        <>
          {/* ================================================= */}
          {/* DESKTOP TABLE */}
          {/* ================================================= */}

          <div className="hidden overflow-hidden rounded-2xl border border-[#e7dfd4] bg-white/70 shadow-[0_3px_14px_rgba(33,31,28,0.04)] lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e7dfd4] bg-[#f3efe7]/60 text-left">
                    <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8b8177]">
                      Tool
                    </th>

                    <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8b8177]">
                      Brand
                    </th>

                    <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8b8177]">
                      Condition
                    </th>

                    <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8b8177]">
                      Price
                    </th>

                    <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8b8177]">
                      Location
                    </th>

                    <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8b8177]">
                      Status
                    </th>

                    <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#8b8177]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTools.map((tool) => (
                    <tr
                      key={tool.id}
                      className="border-b border-[#e7dfd4]/70 transition-colors last:border-0 hover:bg-[#faf8f3]"
                    >
                      {/* TOOL */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e7dfd4] bg-[#f3efe7]">
                            {tool.tool_image ? (
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${tool.tool_image}`}
                                alt={tool.tool_name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Wrench className="h-5 w-5 text-[#a19a91]" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[190px] truncate text-sm font-bold text-[#292722]">
                              {tool.tool_name}
                            </p>

                            <p className="mt-0.5 max-w-[220px] truncate text-[11px] text-[#9a938a]">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* BRAND */}

                      <td className="px-5 py-4 text-xs font-medium text-[#6f6a63]">
                        {tool.brand}
                      </td>

                      {/* CONDITION */}

                      <td className="px-5 py-4 text-xs font-medium text-[#6f6a63]">
                        {tool.condition}
                      </td>

                      {/* PRICE */}

                      <td className="px-5 py-4 text-xs font-bold text-[#292722]">
                        ৳{Number(tool.rental_price_per_day).toLocaleString()}
                        <span className="font-medium text-[10px] text-[#9a938a]">
                          {" "}
                          /day
                        </span>
                      </td>

                      {/* LOCATION */}

                      <td className="px-5 py-4">
                        <div className="flex max-w-[150px] items-center gap-1.5 truncate text-xs font-medium text-[#77736d]">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#c17a28]" />
                          <span className="truncate">{tool.location}</span>
                        </div>
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">
                        <StatusBadge status={tool.status} />
                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4">
                        {tool.status === "pending" ? (
                          <ActionButtons
                            toolId={tool.id}
                            updatingId={updatingId}
                            onApprove={() => updateStatus(tool.id, "approved")}
                            onReject={() => updateStatus(tool.id, "rejected")}
                          />
                        ) : (
                          <div className="text-right">
                            <span className="text-[10px] font-medium text-[#aaa39a]">
                              No action
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ================================================= */}
          {/* MOBILE / TABLET CARDS */}
          {/* ================================================= */}

          <div className="grid gap-4 lg:hidden">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="rounded-2xl border border-[#e7dfd4] bg-white/70 p-4 shadow-[0_3px_14px_rgba(33,31,28,0.04)]"
              >
                {/* TOP */}

                <div className="flex gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e7dfd4] bg-[#f3efe7]">
                    {tool.tool_image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${tool.tool_image}`}
                        alt={tool.tool_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Wrench className="h-5 w-5 text-[#a19a91]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-[#292722]">
                          {tool.tool_name}
                        </h3>

                        <p className="mt-1 truncate text-xs font-medium text-[#8b8177]">
                          {tool.brand}
                        </p>
                      </div>

                      <StatusBadge status={tool.status} />
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION */}

                <p className="mt-4 line-clamp-2 text-xs leading-5 text-[#77736d]">
                  {tool.description}
                </p>

                {/* INFO */}

                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl border border-[#e7dfd4] bg-[#f3efe7]/60 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#a19a91]">
                      Price
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#292722]">
                      ৳{Number(tool.rental_price_per_day).toLocaleString()}
                      <span className="text-[10px] font-medium text-[#9a938a]">
                        {" "}
                        /day
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#e7dfd4] bg-[#f3efe7]/60 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#a19a91]">
                      Condition
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-[#292722]">
                      {tool.condition}
                    </p>
                  </div>
                </div>

                {/* LOCATION */}

                <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#77736d]">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#c17a28]" />
                  <span className="truncate">{tool.location}</span>
                </div>

                {/* ACTION */}

                {tool.status === "pending" && (
                  <div className="mt-4 border-t border-[#e7dfd4] pt-4">
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

/* ================================================= */
/* STATUS BADGE */
/* ================================================= */

function StatusBadge({
  status,
}: {
  status: "pending" | "approved" | "rejected";
}) {
  const styles = {
    pending: "border-[#e8a33d]/30 bg-[#e8a33d]/10 text-[#a56819]",
    approved: "border-[#4f7a52]/25 bg-[#4f7a52]/10 text-[#4f7a52]",
    rejected: "border-[#c1502e]/25 bg-[#c1502e]/10 text-[#c1502e]",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* ================================================= */
/* ACTION BUTTONS */
/* ================================================= */

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
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#4f7a52]/20 bg-[#4f7a52]/10 px-3 py-2 text-[11px] font-bold text-[#4f7a52] transition-all duration-200 hover:bg-[#4f7a52]/15 disabled:cursor-not-allowed disabled:opacity-40"
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
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#c1502e]/20 bg-[#c1502e]/10 px-3 py-2 text-[11px] font-bold text-[#c1502e] transition-all duration-200 hover:bg-[#c1502e]/15 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <X className="h-3.5 w-3.5" />
        Reject
      </button>
    </div>
  );
}
