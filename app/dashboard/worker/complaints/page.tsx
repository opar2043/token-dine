"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, StatusBadge, type Column } from "@/components/DataTable";
import { mockComplaints } from "@/lib/mockData";
import type { Complaint } from "@/lib/types";

const columns: Column<Complaint>[] = [
  { key: "id", header: "ID" },
  { key: "by", header: "Submitted by" },
  { key: "subject", header: "Subject" },
  { key: "date", header: "Date" },
  { key: "status", header: "Status", render: (c) => <StatusBadge status={c.status} /> },
];

export default function WorkerComplaintsPage() {
  return (
    <DashboardShell role="worker">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Complaints</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          File issues and track their status.
        </p>
      </div>
      <DataTable<Complaint> columns={columns} rows={mockComplaints} />
    </DashboardShell>
  );
}
