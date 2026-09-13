"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Loader2 } from "lucide-react";

import OwnerProtected from "@/components/authForm/OwnerProtected";
import OwnerSidebar from "@/components/dashboard/owner/OwnerSidebar";
import OwnerHeader from "@/components/dashboard/owner/OwnerHeader";
import OwnerTools from "@/components/dashboard/owner/OwnerTools";
import api from "@/lib/axios";

// ================= OWNER =================

interface Owner {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profile_image?: string;
}

// ================= JWT =================

interface OwnerToken {
  email?: string;
  password?: string;
  iat?: number;
  exp?: number;
}

// ================= PAGE =================

export default function OwnerToolsPage() {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOwner = async () => {
      try {
        setLoading(true);

        // Get the same token used by the Owner Dashboard
        const token = localStorage.getItem("access_token");

        if (!token) {
          console.error("Owner token not found.");
          return;
        }

        // Decode JWT
        const decoded = jwtDecode<OwnerToken>(token);

        console.log("Decoded owner token:", decoded);

        const email = decoded.email;

        if (!email) {
          console.error("Owner email not found in token.");
          return;
        }

        // Get all owners
        const response = await api.get("/owner/listall");

        console.log("All owners:", response.data);

        // Find currently logged-in owner
        const currentOwner = response.data.find(
          (item: Owner) => item.email === email,
        );

        if (!currentOwner) {
          console.error("Logged-in owner not found.");
          return;
        }

        console.log("Current owner:", currentOwner);

        // Save owner information
        setOwner(currentOwner);

        // Save owner ID
        setOwnerId(currentOwner.id);
      } catch (error) {
        console.error("Failed to load owner:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOwner();
  }, []);

  return (
    <OwnerProtected>
      <div className="min-h-screen bg-[#090a0c] text-white">
        {/* ================= SIDEBAR ================= */}

        <OwnerSidebar />

        {/* ================= MAIN AREA ================= */}

        <div className="lg:ml-[280px]">
          {/* ================= HEADER ================= */}

          <OwnerHeader owner={owner} />

          {/* ================= CONTENT ================= */}

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              {/* ================= PAGE HEADER ================= */}

              {/* ================= LOADING ================= */}

              {loading ? (
                <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-[#292b30] bg-[#0d0e10]">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-7 w-7 animate-spin text-white/50" />

                    <p className="text-sm text-white/40">
                      Loading your tools...
                    </p>
                  </div>
                </div>
              ) : ownerId ? (
                /* ================= OWNER TOOLS ================= */

                <OwnerTools ownerId={ownerId} />
              ) : (
                /* ================= OWNER ERROR ================= */

                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-6">
                  <h2 className="text-base font-semibold text-red-400">
                    Unable to load owner information
                  </h2>

                  <p className="mt-2 text-sm text-red-400/70">
                    We could not identify your owner account. Please login again
                    and try again.
                  </p>

                  <a
                    href="/login"
                    className="mt-5 inline-flex rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                  >
                    Login Again
                  </a>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </OwnerProtected>
  );
}
