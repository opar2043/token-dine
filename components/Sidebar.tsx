"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
}

const navByRole: Record<Role, NavItem[]> = {
  admin: [
    { label: "Overview", href: "/dashboard/admin" },
    { label: "Users", href: "/dashboard/admin/users" },
    { label: "Clients", href: "/dashboard/admin/clients" },
    { label: "Products", href: "/dashboard/admin/products" },
    { label: "Tables", href: "/dashboard/admin/tables" },
    { label: "Product Flow", href: "/dashboard/admin/product-flow" },
    { label: "Transactions", href: "/dashboard/admin/transactions" },
    { label: "Attendance", href: "/dashboard/admin/attendance" },
    { label: "Bonuses", href: "/dashboard/admin/bonuses" },
    { label: "Complaints", href: "/dashboard/admin/complaints" },
  ],
  manager: [
    // { label: "Overview", href: "/dashboard/manager" },
    { label: "Workers", href: "/dashboard/manager/workers" },
    { label: "Daily Progress", href: "/dashboard/manager/daily-progress" },
    { label: "Tables", href: "/dashboard/manager/tables" },
    { label: "Attendance", href: "/dashboard/manager/attendance" },
    { label: "Inventory", href: "/dashboard/manager/inventory" },
    { label: "Sales", href: "/dashboard/manager/sales" },
    { label: "Bonuses", href: "/dashboard/manager/bonuses" },
  ],
  worker: [
    { label: "Clients", href: "/dashboard/worker/clients" },
    { label: "New Client", href: "/dashboard/worker/new-client" },
    { label: "Sell Token", href: "/dashboard/worker/sell-token" },
    { label: "Sales", href: "/dashboard/worker/sales" },
    // { label: "My Progress", href: "/dashboard/worker/progress" },
    // { label: "Attendance", href: "/dashboard/worker/attendance" },
    { label: "Complaints", href: "/dashboard/worker/complaints" },
  ],
};

interface SidebarProps {
  role: Role;
  onNavigate?: () => void;
}

export function Sidebar({ role, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const items = navByRole[role];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
          R
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Restaurant</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{role} portal</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 text-xs text-slate-400 dark:text-slate-500">
        v0.1.0 • Demo data
      </div>
    </aside>
  );
}
