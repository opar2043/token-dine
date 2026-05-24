"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, type Column } from "@/components/DataTable";
import { useAuth } from "@/context/AuthContext";
import { clientsService, salesService } from "@/lib/services";
import { buildLookup, formatDate, formatId } from "@/lib/format";
import type { Client, TokenSale } from "@/lib/types";

export default function WorkerSalesPage() {
  const { user } = useAuth();
  const [sales, setSales] = useState<TokenSale[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const [s, c] = await Promise.all([
          salesService.getSales({ workerId: user.id }),
          clientsService.getClients({ limit: 200 }),
        ]);
        if (cancelled) return;
        setSales(s);
        setClients(c.items);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load sales.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const clientMap = useMemo(() => buildLookup(clients), [clients]);

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
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">My sales</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Token sales you have processed.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      <DataTable<TokenSale>
        columns={columns}
        rows={sales}
        emptyMessage={loading ? "Loading sales…" : "No sales yet."}
      />
    </DashboardShell>
  );
}
