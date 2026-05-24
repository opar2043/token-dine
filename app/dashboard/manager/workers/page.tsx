"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, StatusBadge, type Column } from "@/components/DataTable";
import { attendanceService, salesService, usersService } from "@/lib/services";
import { formatId } from "@/lib/format";
import type { AttendanceEntry, TokenSale, User } from "@/lib/types";

export default function ManagerWorkersPage() {
  const [workers, setWorkers] = useState<User[]>([]);
  const [sales, setSales] = useState<TokenSale[]>([]);
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [w, s, a] = await Promise.all([
          usersService.getUsers({ role: "worker", limit: 100 }),
          salesService.getSales(),
          attendanceService.getAttendance(),
        ]);
        if (cancelled) return;
        setWorkers(w.items);
        setSales(s);
        setAttendance(a);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load workers.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const tokensByWorker = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of sales) m.set(s.workerId, (m.get(s.workerId) ?? 0) + s.tokens);
    return m;
  }, [sales]);

  const attendanceByWorker = useMemo(() => {
    const m = new Map<string, { total: number; present: number }>();
    for (const a of attendance) {
      const c = m.get(a.workerId) ?? { total: 0, present: 0 };
      c.total += 1;
      if (a.status === "present" || a.status === "late") c.present += 1;
      m.set(a.workerId, c);
    }
    return m;
  }, [attendance]);

  const columns: Column<User>[] = [
    { key: "id", header: "ID", render: (w) => formatId(w.id) },
    { key: "name", header: "Name" },
    { key: "mobile", header: "Mobile", render: (w) => w.mobile ?? "—" },
    { key: "table", header: "Table", render: (w) => w.table ?? "—" },
    {
      key: "attendanceRate",
      header: "Attend %",
      align: "right",
      render: (w) => {
        const c = attendanceByWorker.get(w.id);
        return c && c.total ? `${Math.round((c.present / c.total) * 100)}%` : "—";
      },
    },
    {
      key: "tokensSold",
      header: "Tokens Sold",
      align: "right",
      render: (w) => tokensByWorker.get(w.id) ?? 0,
    },
    {
      key: "bonus",
      header: "Bonus (BDT)",
      align: "right",
      render: (w) => (w.bonus ?? 0).toLocaleString(),
    },
    {
      key: "rating",
      header: "Rating",
      align: "right",
      render: (w) => (w.rating ?? 0).toFixed(1),
    },
    { key: "status", header: "Status", render: (w) => <StatusBadge status={w.status} /> },
  ];

  return (
    <DashboardShell role="manager">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Workers</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track performance, attendance, and bonuses.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      <DataTable<User>
        columns={columns}
        rows={workers}
        emptyMessage={loading ? "Loading workers…" : "No workers yet."}
      />
    </DashboardShell>
  );
}
