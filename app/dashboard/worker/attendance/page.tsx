"use client";

import { useState } from "react";
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

export default function WorkerAttendancePage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <DashboardShell role="worker">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Attendance</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Submit your attendance with a single click.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          disabled={submitted}
          className="btn-primary"
        >
          {submitted ? "Marked present" : "Mark me present"}
        </button>
      </div>

      <DataTable<AttendanceEntry> columns={columns} rows={mockAttendance} />
    </DashboardShell>
  );
}
