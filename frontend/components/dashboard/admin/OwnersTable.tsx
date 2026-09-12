"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, Phone, UserRound, Users } from "lucide-react";

import adminApi from "@/lib/adminAxios";

interface Owner {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  profile_image?: string | null;
  role: string;
  nid_number?: string | null;
  created_at: string;
  updated_at: string;
}

export default function OwnersTable() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await adminApi.get("/owner/listall");

        setOwners(Array.isArray(response.data) ? response.data : []);
      } catch (error: any) {
        console.error("Failed to fetch owners:", error);

        setError(error?.response?.data?.message || "Failed to load owners.");
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="flex items-center gap-3 text-sm text-white/40">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading owners...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <p className="text-sm font-medium text-red-400">{error}</p>

        <p className="mt-1 text-xs text-white/40">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  if (owners.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
          <Users className="h-6 w-6 text-white/40" />
        </div>

        <h3 className="mt-4 font-medium">No owners found</h3>

        <p className="mt-1 text-sm text-white/40">
          There are currently no registered owners.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      {/* Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-white/30">
                Owner
              </th>

              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-white/30">
                Contact
              </th>

              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-white/30">
                NID
              </th>

              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-white/30">
                Role
              </th>

              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-white/30">
                Joined
              </th>
            </tr>
          </thead>

          <tbody>
            {owners.map((owner) => (
              <tr
                key={owner.id}
                className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
              >
                {/* Owner */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {owner.profile_image ? (
                      <img
                        src={owner.profile_image}
                        alt={owner.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                        {owner.name?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium">{owner.name}</p>

                      <p className="text-xs text-white/30">ID #{owner.id}</p>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-5 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Mail className="h-3.5 w-3.5 text-white/30" />
                      {owner.email}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Phone className="h-3.5 w-3.5 text-white/30" />
                      {owner.phone || "Not provided"}
                    </div>
                  </div>
                </td>

                {/* NID */}
                <td className="px-5 py-4 text-sm text-white/60">
                  {owner.nid_number || "Not provided"}
                </td>

                {/* Role */}
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60">
                    {owner.role || "Owner"}
                  </span>
                </td>

                {/* Joined */}
                <td className="px-5 py-4 text-sm text-white/40">
                  {owner.created_at
                    ? new Date(owner.created_at).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="divide-y divide-white/5 md:hidden">
        {owners.map((owner) => (
          <div key={owner.id} className="p-5">
            <div className="flex items-start gap-3">
              {owner.profile_image ? (
                <img
                  src={owner.profile_image}
                  alt={owner.name}
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 font-semibold">
                  {owner.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0">
                <p className="font-medium">{owner.name}</p>

                <p className="text-xs text-white/30">ID #{owner.id}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-white/60">
                <Mail className="h-4 w-4 text-white/30" />
                <span className="truncate">{owner.email}</span>
              </div>

              <div className="flex items-center gap-2 text-white/50">
                <Phone className="h-4 w-4 text-white/30" />
                {owner.phone || "Not provided"}
              </div>

              <div className="flex items-center gap-2 text-white/50">
                <UserRound className="h-4 w-4 text-white/30" />
                {owner.nid_number || "NID not provided"}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/50">
                {owner.role || "Owner"}
              </span>

              <span className="text-xs text-white/30">
                {owner.created_at
                  ? new Date(owner.created_at).toLocaleDateString()
                  : "—"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
