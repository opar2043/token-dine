"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, type Column } from "@/components/DataTable";
import { mockBonuses, mockWorkers } from "@/lib/mockData";
import type { Bonus, Worker } from "@/lib/types";

const recommendationColumns: Column<Worker>[] = [
  { key: "name", header: "Worker" },
  { key: "attendanceRate", header: "Attendance %", align: "right", render: (w) => `${w.attendanceRate}%` },
  { key: "tokensSold", header: "Tokens Sold", align: "right" },
  { key: "rating", header: "Rating", align: "right", render: (w) => w.rating.toFixed(1) },
  {
    key: "recommend",
    header: "Suggestion",
    render: (w) => {
      const eligible = w.attendanceRate >= 90 && w.tokensSold >= 250 && w.rating >= 4;
      return eligible ? (
        <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          Recommend bonus
        </span>
      ) : (
        <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          Not yet
        </span>
      );
    },
  },
];

const bonusColumns: Column<Bonus>[] = [
  { key: "id", header: "ID" },
  { key: "worker", header: "Worker" },
  { key: "amount", header: "Amount (BDT)", align: "right", render: (b) => `৳ ${b.amount.toLocaleString()}` },
  { key: "date", header: "Date" },
  { key: "reason", header: "Reason" },
];

export default function ManagerBonusesPage() {
  return (
    <DashboardShell role="manager">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Bonus recommendations</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Auto-suggestions based on attendance, sales, and rating. Final approval is by admin.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Your team
        </h2>
        <DataTable<Worker> columns={recommendationColumns} rows={mockWorkers} />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Recent bonuses paid
        </h2>
        <DataTable<Bonus> columns={bonusColumns} rows={mockBonuses} />
      </section>
    </DashboardShell>
  );
}
