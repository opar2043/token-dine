"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, type Column } from "@/components/DataTable";
import { StatCard } from "@/components/StatCard";
import { mockBonuses } from "@/lib/mockData";
import type { Bonus } from "@/lib/types";

const columns: Column<Bonus>[] = [
  { key: "id", header: "Bonus ID" },
  { key: "worker", header: "Worker" },
  { key: "amount", header: "Amount (BDT)", align: "right", render: (b) => `৳ ${b.amount.toLocaleString()}` },
  { key: "date", header: "Date" },
  { key: "reason", header: "Reason" },
];

export default function AdminBonusesPage() {
  const total = mockBonuses.reduce((sum, b) => sum + b.amount, 0);

  return (
    <DashboardShell role="admin">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Bonuses</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Performance-based bonus history.
          </p>
        </div>
        <button className="btn-primary" type="button">
          Assign new bonus
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Paid" value={`৳ ${total.toLocaleString()}`} />
        <StatCard label="Entries" value={mockBonuses.length} />
        <StatCard label="Average" value={`৳ ${Math.round(total / mockBonuses.length).toLocaleString()}`} />
      </div>

      <DataTable<Bonus> columns={columns} rows={mockBonuses} />
    </DashboardShell>
  );
}
