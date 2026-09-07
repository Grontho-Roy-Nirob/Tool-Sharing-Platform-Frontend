"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RenterProtected({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/renter");
    }
  }, [router]);

  return <>{children}</>;
}
