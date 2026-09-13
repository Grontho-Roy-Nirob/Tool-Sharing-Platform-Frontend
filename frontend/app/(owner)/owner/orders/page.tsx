"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import OwnerProtected from "@/components/authForm/OwnerProtected";
import OwnerSidebar from "@/components/dashboard/owner/OwnerSidebar";
import OwnerHeader from "@/components/dashboard/owner/OwnerHeader";
import OwnerOrders from "@/components/dashboard/owner/OwnerOrders";

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
  iat?: number;
  exp?: number;
}

// ================= PAGE =================

export default function OwnerOrdersPage() {
  const [owner, setOwner] = useState<Owner | null>(null);

  const [loading, setLoading] = useState(true);

  // ================= GET OWNER =================

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        setLoading(true);

        // ================= TOKEN =================

        const token = localStorage.getItem("access_token");

        if (!token) {
          toast.error("Please login first");
          return;
        }

        // ================= DECODE TOKEN =================

        const decoded = jwtDecode<OwnerToken>(token);

        const email = decoded.email;

        if (!email) {
          toast.error("Owner email not found");
          return;
        }

        // ================= GET OWNERS =================

        const response = await api.get<Owner[]>(
          "/owner/listall",
        );

        // ================= FIND CURRENT OWNER =================

        const ownerData = response.data.find(
          (item) => item.email === email,
        );

        if (!ownerData) {
          toast.error("Owner information not found");
          return;
        }

        setOwner(ownerData);
      } catch (error) {
        console.error("Failed to load owner:", error);

        toast.error("Failed to load owner information");
      } finally {
        setLoading(false);
      }
    };

    fetchOwner();
  }, []);

  // ================= UI =================

  return (
    <OwnerProtected>
      <div className="min-h-screen bg-[#08090b] text-white">

        {/* ================= SIDEBAR ================= */}

        <OwnerSidebar />

        {/* ================= MAIN ================= */}

        <div className="lg:ml-[280px]">

          {/* ================= HEADER ================= */}

          <OwnerHeader owner={owner} />

          {/* ================= CONTENT ================= */}

          <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-10">

            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">

                <Loader2 className="h-6 w-6 animate-spin text-white/50" />

              </div>
            ) : owner ? (
              <OwnerOrders ownerId={owner.id} />
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">

                <p className="text-sm text-white/50">
                  Owner information not found.
                </p>

              </div>
            )}

          </main>

        </div>

      </div>
    </OwnerProtected>
  );
}