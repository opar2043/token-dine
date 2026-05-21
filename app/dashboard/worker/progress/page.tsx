"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, type Column } from "@/components/DataTable";
import { StatCard } from "@/components/StatCard";
import { mockDailyProgress, mockSales } from "@/lib/mockData";
import type { DailyProgress } from "@/lib/types";

const columns: Column<DailyProgress>[] = [
  { key: "date", header: "Date" },
  { key: "table", header: "Table" },
  { key: "tokenGiven", header: "Given", align: "right" },
  { key: "tokenSold", header: "Sold", align: "right" },
  {
    key: "balance",
    header: "Balance",
    align: "right",
    render: (row) => (
      <span
        className={
          row.balance < 0
            ? "font-semibold text-rose-600 dark:text-rose-400"
            : "text-slate-700 dark:text-slate-200"
        }
      >
        {row.balance}
      </span>
    ),
  },
  { key: "notes", header: "Notes", render: (row) => row.notes ?? "—" },
];

export default function WorkerProgressPage() {
  const me = "Hasan Worker"; // demo: in real backend, pulled from auth
  const myProgress = mockDailyProgress.filter((p) => p.worker === me);
  const mySales = mockSales.filter((s) => s.worker === me);

  const tokensSold = mySales.reduce((sum, s) => sum + s.tokens, 0);
  const revenue = mySales.reduce((sum, s) => sum + s.amount, 0);

  return (
    <DashboardShell role="worker">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">My progress</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your sales, tokens, and daily token balance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tokens Sold" value={tokensSold} />
        <StatCard label="Revenue" value={`৳ ${revenue.toLocaleString()}`} />
        <StatCard label="Transactions" value={mySales.length} />
        <StatCard label="Attendance" value="96%" hint="Last 30 days" />
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Daily history</h2>
        <DataTable<DailyProgress>
          columns={columns}
          rows={myProgress}
          emptyMessage="No daily progress recorded for you yet."
        />
      </section>
    </DashboardShell>
  );
}
