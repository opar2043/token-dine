"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { roleLanding } from "@/lib/roles";

// Managers have no overview page — send them straight to Daily Progress.
export default function ManagerIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(roleLanding("manager"));
  }, [router]);

  return null;
}
