"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, StatusBadge, type Column } from "@/components/DataTable";
import { StatCard } from "@/components/StatCard";
import { mockSales, mockWorkers } from "@/lib/mockData";
import type { Worker } from "@/lib/types";

const workerColumns: Column<Worker>[] = [
  { key: "id", header: "ID" },
  { key: "name", header: "Worker" },
  { key: "mobile", header: "Mobile" },
  { key: "table", header: "Table", render: (w) => w.table ?? "—" },
  { key: "attendanceRate", header: "Attend %", align: "right", render: (w) => `${w.attendanceRate}%` },
  { key: "tokensSold", header: "Tokens Sold", align: "right" },
  { key: "rating", header: "Rating", align: "right", render: (w) => w.rating.toFixed(1) },
  { key: "status", header: "Status", render: (w) => <StatusBadge status={w.status} /> },
];

export default function ManagerDashboardPage() {
  const totalSales = mockSales.reduce((sum, s) => sum + s.amount, 0);
  const activeWorkers = mockWorkers.filter((w) => w.status === "active").length;
  const avgAttendance = Math.round(
    mockWorkers.reduce((sum, w) => sum + w.attendanceRate, 0) / mockWorkers.length,
  );

  return (
    <DashboardShell role="manager">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Manager overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monitor your team and daily operations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Workers" value={activeWorkers} hint={`of ${mockWorkers.length} total`} />
        <StatCard label="Avg Attendance" value={`${avgAttendance}%`} />
        <StatCard label="Today's Sales" value={`৳ ${totalSales.toLocaleString()}`} />
        <StatCard label="Tables Assigned" value={mockWorkers.filter((w) => w.table).length} />
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Workers</h2>
        <DataTable<Worker> columns={workerColumns} rows={mockWorkers} />
      </section>
    </DashboardShell>
  );
}
