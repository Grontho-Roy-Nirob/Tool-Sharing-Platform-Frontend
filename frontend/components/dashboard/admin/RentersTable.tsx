"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, Phone, User, Users } from "lucide-react";
import adminApi from "@/lib/adminAxios";

interface Renter {
  renterId: number;
  fullName: string;
  email: string;
  phone?: string | null;
  profileImage?: string | null;
  nidNumber?: string | null;
  role: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// PROFILE IMAGE URL
// ==========================================

function getRenterImage(image?: string | null) {
  if (!image) {
    return "";
  }

  // যদি backend already full URL দেয়
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

  // যদি image-এর মধ্যে /uploads/ already থাকে
  if (image.startsWith("/uploads/")) {
    return `${API_URL}${image}`;
  }

  // শুধু filename হলে
  return `${API_URL}/uploads/${image}`;
}

export default function RentersTable() {
  const [renters, setRenters] = useState<Renter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRenters = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await adminApi.get("/renter");

        setRenters(Array.isArray(response.data) ? response.data : []);
      } catch (error: any) {
        console.error("Failed to fetch renters:", error);

        setError(error?.response?.data?.message || "Failed to load renters.");
      } finally {
        setLoading(false);
      }
    };

    fetchRenters();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[#e7dfd4] bg-white">
        <div className="flex items-center gap-3 text-sm text-[#8b8177]">
          <Loader2 className="h-5 w-5 animate-spin text-[#e8a33d]" />
          Loading renters...
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

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

  // ==========================================
  // EMPTY
  // ==========================================

  if (renters.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[#e7dfd4] bg-white px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3efe7]">
          <Users className="h-6 w-6 text-[#8b8177]" />
        </div>

        <h3 className="mt-4 font-medium text-[#211f1c]">No renters found</h3>

        <p className="mt-1 text-sm text-[#8b8177]">
          There are currently no registered renters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e7dfd4] bg-white shadow-[0_8px_30px_rgba(33,31,28,0.04)]">
      {/* =====================================================
          DESKTOP TABLE
      ===================================================== */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-[#e7dfd4] bg-[#f3efe7]/60 text-left">
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#8b8177]">
                Renter
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
            {renters.map((renter) => {
              const imageUrl = getRenterImage(renter.profileImage);

              return (
                <tr
                  key={renter.renterId}
                  className="border-b border-[#eee8df] last:border-0 transition-colors hover:bg-[#faf8f4]"
                >
                  {/* =================================================
                      RENTER
                  ================================================= */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={renter.fullName}
                          className="h-10 w-10 rounded-full border border-[#e7dfd4] object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";

                            const fallback =
                              event.currentTarget.nextElementSibling;

                            if (fallback instanceof HTMLElement) {
                              fallback.classList.remove("hidden");
                            }
                          }}
                        />
                      ) : null}

                      {/* IMAGE FALLBACK */}

                      <div
                        className={`${
                          imageUrl ? "hidden" : "flex"
                        } h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8a33d]/15 text-sm font-semibold text-[#9a5b13]`}
                      >
                        {renter.fullName?.charAt(0).toUpperCase() || "R"}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#211f1c]">
                          {renter.fullName}
                        </p>

                        <p className="text-xs text-[#9a9188]">
                          ID #{renter.renterId}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* =================================================
                      CONTACT
                  ================================================= */}

                  <td className="px-5 py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-[#514c47]">
                        <Mail className="h-3.5 w-3.5 text-[#e8a33d]" />

                        <span className="truncate">{renter.email}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#8b8177]">
                        <Phone className="h-3.5 w-3.5 text-[#b2a99f]" />

                        {renter.phone || "Not provided"}
                      </div>
                    </div>
                  </td>

                  {/* =================================================
                      NID
                  ================================================= */}

                  <td className="px-5 py-4 text-sm text-[#5f5953]">
                    {renter.nidNumber || "Not provided"}
                  </td>

                  {/* =================================================
                      ROLE
                  ================================================= */}

                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full border border-[#e8a33d]/25 bg-[#e8a33d]/10 px-2.5 py-1 text-xs font-medium text-[#9a5b13]">
                      Renter
                    </span>
                  </td>

                  {/* =================================================
                      JOINED
                  ================================================= */}

                  <td className="px-5 py-4 text-sm text-[#8b8177]">
                    {renter.createdAt
                      ? new Date(renter.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          MOBILE CARDS
      ===================================================== */}

      <div className="divide-y divide-[#eee8df] md:hidden">
        {renters.map((renter) => {
          const imageUrl = getRenterImage(renter.profileImage);

          return (
            <div
              key={renter.renterId}
              className="p-5 transition-colors hover:bg-[#faf8f4]"
            >
              <div className="flex items-start gap-3">
                {/* =================================================
                    PROFILE IMAGE
                ================================================= */}

                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={renter.fullName}
                    className="h-11 w-11 shrink-0 rounded-full border border-[#e7dfd4] object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";

                      const fallback = event.currentTarget.nextElementSibling;

                      if (fallback instanceof HTMLElement) {
                        fallback.classList.remove("hidden");
                      }
                    }}
                  />
                ) : null}

                {/* IMAGE FALLBACK */}

                <div
                  className={`${
                    imageUrl ? "hidden" : "flex"
                  } h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8a33d]/15 font-semibold text-[#9a5b13]`}
                >
                  {renter.fullName?.charAt(0).toUpperCase() || "R"}
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-[#211f1c]">
                    {renter.fullName}
                  </p>

                  <p className="text-xs text-[#9a9188]">
                    ID #{renter.renterId}
                  </p>
                </div>
              </div>

              {/* =================================================
                  CONTACT INFORMATION
              ================================================= */}

              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-[#5f5953]">
                  <Mail className="h-4 w-4 shrink-0 text-[#e8a33d]" />

                  <span className="truncate">{renter.email}</span>
                </div>

                <div className="flex items-center gap-2 text-[#706961]">
                  <Phone className="h-4 w-4 shrink-0 text-[#b2a99f]" />

                  {renter.phone || "Not provided"}
                </div>

                <div className="flex items-center gap-2 text-[#706961]">
                  <User className="h-4 w-4 shrink-0 text-[#b2a99f]" />

                  {renter.nidNumber || "NID not provided"}
                </div>
              </div>

              {/* =================================================
                  ROLE + JOINED
              ================================================= */}

              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full border border-[#e8a33d]/25 bg-[#e8a33d]/10 px-2.5 py-1 text-xs font-medium text-[#9a5b13]">
                  Renter
                </span>

                <span className="text-xs text-[#9a9188]">
                  {renter.createdAt
                    ? new Date(renter.createdAt).toLocaleDateString()
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
