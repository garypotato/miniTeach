"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to companions tab by default
    router.replace("/dashboard/companions");
  }, [router]);

  return null;
}