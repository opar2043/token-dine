"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, StatusBadge, type Column } from "@/components/DataTable";
import { mockWorkers } from "@/lib/mockData";
import type { Worker } from "@/lib/types";

const columns: Column<Worker>[] = [
  { key: "id", header: "ID" },
  { key: "name", header: "Name" },
  { key: "mobile", header: "Mobile" },
  { key: "table", header: "Table", render: (w) => w.table ?? "—" },
  { key: "attendanceRate", header: "Attend %", align: "right", render: (w) => `${w.attendanceRate}%` },
  { key: "tokensSold", header: "Tokens Sold", align: "right" },
  { key: "bonus", header: "Bonus (BDT)", align: "right", render: (w) => w.bonus.toLocaleString() },
  { key: "rating", header: "Rating", align: "right", render: (w) => w.rating.toFixed(1) },
  { key: "status", header: "Status", render: (w) => <StatusBadge status={w.status} /> },
];

export default function ManagerWorkersPage() {
  return (
    <DashboardShell role="manager">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Workers</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track performance, attendance, and bonuses.
        </p>
      </div>
      <DataTable<Worker> columns={columns} rows={mockWorkers} />
    </DashboardShell>
  );
}
