"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, StatusBadge, type Column } from "@/components/DataTable";
import { mockAttendance } from "@/lib/mockData";
import type { AttendanceEntry } from "@/lib/types";

const columns: Column<AttendanceEntry>[] = [
  { key: "id", header: "Entry" },
  { key: "worker", header: "Worker" },
  { key: "date", header: "Date" },
  { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
];

export default function AdminAttendancePage() {
  return (
    <DashboardShell role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Attendance</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          All worker attendance entries across the team.
        </p>
      </div>
      <DataTable<AttendanceEntry> columns={columns} rows={mockAttendance} />
    </DashboardShell>
  );
}
