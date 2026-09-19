"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminProtected({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_access_token");

    if (!token) {
      router.replace("/admin");
    }
  }, [router]);

  return <main className="min-h-screen bg-slate-50">{children}</main>;
}
