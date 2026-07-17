import type { Role } from "@/lib/types";

/**
 * Where each role lands after login. Workers and managers have no overview
 * page — they go straight to their primary working screen.
 */
export function roleLanding(role: Role | string): string {
  switch (String(role).toLowerCase()) {
    case "worker":
      return "/dashboard/worker/new-client";
    case "manager":
      return "/dashboard/manager/daily-progress";
    default:
      return "/dashboard/admin";
  }
}
