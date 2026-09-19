"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Loader2 } from "lucide-react";

import OwnerProtected from "@/components/authForm/OwnerProtected";
import OwnerSidebar from "@/components/dashboard/owner/OwnerSidebar";
import OwnerHeader from "@/components/dashboard/owner/OwnerHeader";
import OwnerTools from "@/components/dashboard/owner/OwnerTools";
import api from "@/lib/axios";

// OWNER 

interface Owner {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profile_image?: string;
}

// JWT 

interface OwnerToken {
  email?: string;
  password?: string;
  iat?: number;
  exp?: number;
}

// PAGE 

export default function OwnerToolsPage() {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [ownerId, setOwnerId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD OWNER 

  useEffect(() => {
    const loadOwner = async () => {
      try {
        setLoading(true);
        setError("");

        // GET TOKEN 

        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("Please login first.");
          return;
        }

        // DECODE TOKEN 

        const decoded = jwtDecode<OwnerToken>(token);
        const email = decoded.email;

        if (!email) {
          setError("Owner email not found. Please login again.");
          return;
        }

        // GET ALL OWNERS 

        const response = await api.get<Owner[]>("/owner/listall");

        //  FIND CURRENT OWNER 

        const currentOwner = response.data.find(
          (item) =>
            item.email?.trim().toLowerCase() === email.trim().toLowerCase(),
        );

        if (!currentOwner) {
          setError("Owner information not found.");
          return;
        }

        // SAVE OWNER 
        setOwner(currentOwner);
        setOwnerId(currentOwner.id);

        localStorage.setItem("owner_data", JSON.stringify(currentOwner));
      } catch (error) {
        console.error("Failed to load owner:", error);
        setError("Failed to load owner information.");
      } finally {
        setLoading(false);
      }
    };

    loadOwner();
  }, []);

  return (
    <OwnerProtected>
      <div className="min-h-screen bg-[#f5f3ef] text-[#25231f]">
        {/* SIDEBAR  */}

        <OwnerSidebar />

        {/* MAIN AREA  */}

        <div className="pt-[68px] lg:ml-[280px] lg:pt-0">
          {/* HEADER  */}

          <OwnerHeader owner={owner} />

          {/* PAGE CONTENT  */}

          <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
            <div className="mx-auto max-w-[1280px]">
              {/* LOADING  */}

              {loading ? (
                <div className="flex min-h-[400px] items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[#c1502e]" />
                </div>
              ) : error ? (
                /* ERROR */
                <div className="rounded-[18px] border border-[#f2c6c2] bg-[#fff5f3] px-4 py-3 text-sm font-medium text-[#c1502e]">
                  {error}
                </div>
              ) : ownerId !== null ? (
                /* TOOLS  */
                <OwnerTools ownerId={ownerId} />
              ) : (
                /*  NO OWNER */
                <div className="rounded-[18px] border border-[#f2c6c2] bg-[#fff5f3] px-4 py-3 text-sm font-medium text-[#c1502e]">
                  Owner information is unavailable.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </OwnerProtected>
  );
}
