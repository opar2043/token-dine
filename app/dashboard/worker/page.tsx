"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, type Column } from "@/components/DataTable";
import { StatCard } from "@/components/StatCard";
import { useAuth } from "@/context/AuthContext";
import { attendanceService, clientsService, salesService } from "@/lib/services";
import { buildLookup, formatDate, formatId } from "@/lib/format";
import type { AttendanceEntry, Client, TokenSale } from "@/lib/types";

export default function WorkerDashboardPage() {
  const { user } = useAuth();
  const [sales, setSales] = useState<TokenSale[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const [s, c, a] = await Promise.all([
          salesService.getSales({ workerId: user.id }),
          clientsService.getClients({ limit: 100 }),
          attendanceService.getAttendance({ workerId: user.id }),
        ]);
        if (cancelled) return;
        setSales(s);
        setClients(c.items);
        setAttendance(a);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const clientMap = useMemo(() => buildLookup(clients), [clients]);
  const totalAmount = sales.reduce((sum, s) => sum + s.amount, 0);
  const totalTokens = sales.reduce((sum, s) => sum + s.tokens, 0);

  const attendanceRate = useMemo(() => {
    if (!attendance.length) return 0;
    const present = attendance.filter((a) => a.status === "present" || a.status === "late").length;
    return Math.round((present / attendance.length) * 100);
  }, [attendance]);

  const columns: Column<TokenSale>[] = [
    { key: "id", header: "Txn ID", render: (s) => formatId(s.id) },
    { key: "date", header: "Date", render: (s) => formatDate(s.date) },
    {
      key: "client",
      header: "Client",
      render: (s) => clientMap.get(s.clientId)?.name ?? s.client ?? formatId(s.clientId),
    },
    { key: "tokens", header: "Tokens", align: "right" },
    {
      key: "amount",
      header: "Amount (BDT)",
      align: "right",
      render: (s) => s.amount.toLocaleString(),
    },
  ];

  return (
    <DashboardShell role="worker">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Your overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track your sales, attendance, and assigned clients.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Clients Served" value={clients.length} />
        <StatCard label="Tokens Sold" value={totalTokens} />
        <StatCard label="Sales (BDT)" value={`৳ ${totalAmount.toLocaleString()}`} />
        <StatCard label="Attendance" value={`${attendanceRate}%`} hint="All time" />
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Recent sales</h2>
        <DataTable<TokenSale>
          columns={columns}
          rows={sales}
          emptyMessage={loading ? "Loading sales…" : "No sales yet."}
        />
      </section>
    </DashboardShell>
  );
}
