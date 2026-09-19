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
  nidNumber?: string | null;
  created_at: string;
  updated_at: string;
}

export default function OwnersTable() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // PROFILE IMAGE URL
  // --------------------------------------------------

  const getProfileImageUrl = (profileImage?: string | null) => {
    if (!profileImage) {
      return "";
    }

    const image = profileImage.trim();

    if (!image) {
      return "";
    }

    // Already full URL
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    // Remove /uploads/ if backend already sends it
    const cleanImage = image.replace(/^\/+/, "").replace(/^uploads\//i, "");

    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${cleanImage}`;
  };

  // --------------------------------------------------
  // FETCH OWNERS
  // --------------------------------------------------

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await adminApi.get("/owner/listall");

        console.log("Owners API response:", response.data);

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

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[#e7dfd4] bg-white">
        <div className="flex items-center gap-3 text-sm text-[#8b8177]">
          <Loader2 className="h-5 w-5 animate-spin text-[#e8a33d]" />
          Loading owners...
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <div className="rounded-2xl border border-[#c1502e]/20 bg-[#c1502e]/5 p-6">
        <p className="text-sm font-medium text-[#c1502e]">{error}</p>

        <p className="mt-1 text-xs text-[#8b8177]">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // EMPTY
  // --------------------------------------------------

  if (owners.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[#e7dfd4] bg-white px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3efe7]">
          <Users className="h-6 w-6 text-[#8b8177]" />
        </div>

        <h3 className="mt-4 font-medium text-[#211f1c]">No owners found</h3>

        <p className="mt-1 text-sm text-[#8b8177]">
          There are currently no registered owners.
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // TABLE
  // --------------------------------------------------

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e7dfd4] bg-white shadow-[0_8px_30px_rgba(33,31,28,0.04)]">
      {/* DESKTOP */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-[#e7dfd4] bg-[#f3efe7]/60 text-left">
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#8b8177]">
                Owner
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#8b8177]">
                Contact
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#8b8177]">
                NID
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#8b8177]">
                Role
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#8b8177]">
                Joined
              </th>
            </tr>
          </thead>

          <tbody>
            {owners.map((owner) => {
              const imageUrl = getProfileImageUrl(owner.profile_image);

              return (
                <tr
                  key={owner.id}
                  className="border-b border-[#eee8df] transition-colors last:border-0 hover:bg-[#faf8f4]"
                >
                  {/* OWNER */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={owner.name}
                          className="h-10 w-10 rounded-full border border-[#e7dfd4] object-cover"
                          onError={(event) => {
                            console.error(
                              "Owner profile image failed:",
                              imageUrl,
                            );

                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8a33d]/15 text-sm font-semibold text-[#9a5b13]">
                          {owner.name?.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-semibold text-[#211f1c]">
                          {owner.name}
                        </p>

                        <p className="text-xs text-[#9a9188]">ID #{owner.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* CONTACT */}

                  <td className="px-5 py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-[#514c47]">
                        <Mail className="h-3.5 w-3.5 text-[#e8a33d]" />
                        {owner.email}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#8b8177]">
                        <Phone className="h-3.5 w-3.5 text-[#b2a99f]" />
                        {owner.phone || "Not provided"}
                      </div>
                    </div>
                  </td>

                  {/* NID */}

                  <td className="px-5 py-4 text-sm font-medium text-[#5f5953]">
                    {owner.nidNumber || "Not provided"}
                  </td>

                  {/* ROLE */}

                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full border border-[#e8a33d]/25 bg-[#e8a33d]/10 px-2.5 py-1 text-xs font-medium text-[#9a5b13]">
                      {owner.role || "Owner"}
                    </span>
                  </td>

                  {/* JOINED */}

                  <td className="px-5 py-4 text-sm text-[#8b8177]">
                    {owner.created_at
                      ? new Date(owner.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}

      <div className="divide-y divide-[#eee8df] md:hidden">
        {owners.map((owner) => {
          const imageUrl = getProfileImageUrl(owner.profile_image);

          return (
            <div
              key={owner.id}
              className="p-5 transition-colors hover:bg-[#faf8f4]"
            >
              {/* OWNER */}

              <div className="flex items-start gap-3">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={owner.name}
                    className="h-11 w-11 shrink-0 rounded-full border border-[#e7dfd4] object-cover"
                    onError={(event) => {
                      console.error("Owner profile image failed:", imageUrl);

                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8a33d]/15 font-semibold text-[#9a5b13]">
                    {owner.name?.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="font-semibold text-[#211f1c]">{owner.name}</p>

                  <p className="text-xs text-[#9a9188]">ID #{owner.id}</p>
                </div>
              </div>

              {/* INFORMATION */}

              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-[#5f5953]">
                  <Mail className="h-4 w-4 shrink-0 text-[#e8a33d]" />
                  <span className="truncate">{owner.email}</span>
                </div>

                <div className="flex items-center gap-2 text-[#706961]">
                  <Phone className="h-4 w-4 shrink-0 text-[#b2a99f]" />
                  {owner.phone || "Not provided"}
                </div>

                <div className="flex items-center gap-2 text-[#706961]">
                  <UserRound className="h-4 w-4 shrink-0 text-[#b2a99f]" />
                  {owner.nidNumber || "NID not provided"}
                </div>
              </div>

              {/* FOOTER */}

              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full border border-[#e8a33d]/25 bg-[#e8a33d]/10 px-2.5 py-1 text-xs font-medium text-[#9a5b13]">
                  {owner.role || "Owner"}
                </span>

                <span className="text-xs text-[#9a9188]">
                  {owner.created_at
                    ? new Date(owner.created_at).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
