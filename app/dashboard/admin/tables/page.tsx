"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, StatusBadge, type Column } from "@/components/DataTable";
import { StatCard } from "@/components/StatCard";
import { mockTables } from "@/lib/mockData";
import type { TableAssignment } from "@/lib/types";

const columns: Column<TableAssignment>[] = [
  { key: "id", header: "Assignment" },
  { key: "table", header: "Table" },
  { key: "worker", header: "Worker" },
  { key: "assignedOn", header: "Assigned on" },
  { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
];

export default function AdminTablesPage() {
  const active = mockTables.filter((t) => t.status === "active").length;
  const free = mockTables.length - active;

  return (
    <DashboardShell role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Table assignments</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Current worker-table relationships and status.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Tables" value={mockTables.length} />
        <StatCard label="Active" value={active} />
        <StatCard label="Free" value={free} />
      </div>

      <DataTable<TableAssignment> columns={columns} rows={mockTables} />
    </DashboardShell>
  );
}
