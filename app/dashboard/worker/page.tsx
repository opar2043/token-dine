"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { roleLanding } from "@/lib/roles";

// Workers have no overview page — send them straight to New Client.
export default function WorkerIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(roleLanding("worker"));
  }, [router]);

  return null;
}
