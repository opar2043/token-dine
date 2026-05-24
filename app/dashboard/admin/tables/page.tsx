"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, StatusBadge, type Column } from "@/components/DataTable";
import { StatCard } from "@/components/StatCard";
import { tablesService, usersService } from "@/lib/services";
import { buildLookup, formatDate, formatId } from "@/lib/format";
import type { TableAssignment, User } from "@/lib/types";

export default function AdminTablesPage() {
  const [tables, setTables] = useState<TableAssignment[]>([]);
  const [workers, setWorkers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [t, w] = await Promise.all([
          tablesService.getTables(),
          usersService.getUsers({ role: "worker", limit: 100 }),
        ]);
        if (cancelled) return;
        setTables(t);
        setWorkers(w.items);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load tables.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const workerMap = useMemo(() => buildLookup(workers), [workers]);

  const columns: Column<TableAssignment>[] = [
    { key: "id", header: "Assignment", render: (t) => formatId(t.id) },
    { key: "table", header: "Table" },
    {
      key: "worker",
      header: "Worker",
      render: (t) =>
        t.workerId
          ? workerMap.get(t.workerId)?.name ?? t.worker ?? formatId(t.workerId)
          : "—",
    },
    { key: "assignedOn", header: "Assigned on", render: (t) => formatDate(t.assignedOn) },
    { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
  ];

  const active = tables.filter((t) => t.status === "active").length;
  const free = tables.length - active;

  return (
    <DashboardShell role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Table assignments</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Current worker-table relationships and status.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Tables" value={tables.length} />
        <StatCard label="Active" value={active} />
        <StatCard label="Free" value={free} />
      </div>

      <DataTable<TableAssignment>
        columns={columns}
        rows={tables}
        emptyMessage={loading ? "Loading tables…" : "No tables yet."}
      />
    </DashboardShell>
  );
}
