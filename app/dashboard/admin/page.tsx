"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, StatusBadge, type Column } from "@/components/DataTable";
import { StatCard } from "@/components/StatCard";
import {
  mockClients,
  mockProducts,
  mockSales,
  mockUsers,
} from "@/lib/mockData";
import type { User } from "@/lib/types";

const userColumns: Column<User>[] = [
  { key: "id", header: "ID" },
  { key: "name", header: "Name" },
  { key: "role", header: "Role", render: (u) => <span className="capitalize">{u.role}</span> },
  { key: "contact", header: "Contact", render: (u) => u.email ?? u.mobile ?? "—" },
  { key: "joinedOn", header: "Joined" },
  { key: "status", header: "Status", render: (u) => <StatusBadge status={u.status} /> },
];

function sumAmount(dates: string[]) {
  return mockSales
    .filter((s) => dates.includes(s.date))
    .reduce((sum, s) => sum + s.amount, 0);
}

export default function AdminDashboardPage() {
  const totalRevenue = mockSales.reduce((sum, s) => sum + s.amount, 0);
  const totalCost = mockProducts.reduce((sum, p) => sum + p.costPrice * (50 - p.stock), 0);
  const profit = totalRevenue - Math.max(totalCost, 0);

  const daily = sumAmount(["2026-05-21"]);
  const weekly = sumAmount(["2026-05-18", "2026-05-19", "2026-05-20", "2026-05-21"]);
  const monthly = totalRevenue;

  const referralCount = mockClients.filter((c) => c.referral).length;
  const lowStock = mockProducts.filter((p) => p.status !== "in-stock").length;
  const totalTokensSold = mockSales.reduce((sum, s) => sum + s.tokens, 0);

  return (
    <DashboardShell role="admin">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Admin overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Full visibility into revenue, users, inventory and operations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={`৳ ${totalRevenue.toLocaleString()}`} hint="All time" />
        <StatCard label="Daily Revenue" value={`৳ ${daily.toLocaleString()}`} hint="Today" />
        <StatCard label="Weekly Revenue" value={`৳ ${weekly.toLocaleString()}`} hint="Last 7 days" />
        <StatCard label="Monthly Revenue" value={`৳ ${monthly.toLocaleString()}`} hint="This month" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Clients" value={mockClients.length} />
        <StatCard label="Active Clients" value={mockClients.filter((c) => c.balance > 0).length} hint="With token balance" />
        <StatCard label="Total Workers" value={mockUsers.filter((u) => u.role === "worker").length} />
        <StatCard label="Tokens Sold" value={totalTokensSold} hint="All workers" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Profit (est.)" value={`৳ ${profit.toLocaleString()}`} hint="Revenue − cost basis" />
        <StatCard label="Stock Alerts" value={lowStock} hint="Low or out of stock" />
        <StatCard label="Referrals" value={referralCount} hint="Clients invited by others" />
        <StatCard label="Product Sales" value={mockSales.length} hint="Transactions" />
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">All system users</h2>
        </div>
        <DataTable<User> columns={userColumns} rows={mockUsers} />
      </section>
    </DashboardShell>
  );
}
