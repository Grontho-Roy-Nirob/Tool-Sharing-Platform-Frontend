"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Loader2 } from "lucide-react";

interface AdminToken {
  sub: number;
  email: string;
  role: number;
  exp: number;
  iat: number;
}

export default function AdminProtected({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_access_token");

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    try {
      const decoded = jwtDecode<AdminToken>(token);

      const currentTime = Math.floor(Date.now() / 1000);

      // JWT expired
      if (decoded.exp <= currentTime) {
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_user");

        router.replace("/admin/login");
        return;
      }

      // Backend admin role = 1
      if (decoded.role !== 1) {
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_user");

        router.replace("/admin/login");
        return;
      }

      setChecking(false);
    } catch (error) {
      console.error("Invalid admin token:", error);

      localStorage.removeItem("admin_access_token");
      localStorage.removeItem("admin_user");

      router.replace("/admin/login");
    }
  }, [router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090a0c]">
        <Loader2 className="h-7 w-7 animate-spin text-white/60" />
      </main>
    );
  }

  return <>{children}</>;
}
