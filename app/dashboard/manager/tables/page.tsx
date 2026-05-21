"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, StatusBadge, type Column } from "@/components/DataTable";
import { mockTables } from "@/lib/mockData";
import type { TableAssignment } from "@/lib/types";

const columns: Column<TableAssignment>[] = [
  { key: "id", header: "Assignment" },
  { key: "table", header: "Table" },
  { key: "worker", header: "Worker" },
  { key: "assignedOn", header: "Assigned on" },
  { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
];

export default function ManagerTablesPage() {
  return (
    <DashboardShell role="manager">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Tables</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Assign tables to workers and monitor status.
          </p>
        </div>
        <button type="button" className="btn-primary">Assign table</button>
      </div>
      <DataTable<TableAssignment> columns={columns} rows={mockTables} />
    </DashboardShell>
  );
}
