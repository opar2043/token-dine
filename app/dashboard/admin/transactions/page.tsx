"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, type Column } from "@/components/DataTable";
import { clientsService, salesService, usersService } from "@/lib/services";
import { buildLookup, formatDate, formatId } from "@/lib/format";
import type { Client, TokenSale, User } from "@/lib/types";

export default function AdminTransactionsPage() {
  const [sales, setSales] = useState<TokenSale[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, c, u] = await Promise.all([
          salesService.getSales(),
          clientsService.getClients({ limit: 100 }),
          usersService.getUsers({ limit: 100 }),
        ]);
        if (cancelled) return;
        setSales(s);
        setClients(c.items);
        setUsers(u.items);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load transactions.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const clientMap = useMemo(() => buildLookup(clients), [clients]);
  const userMap = useMemo(() => buildLookup(users), [users]);

  const columns: Column<TokenSale>[] = [
    { key: "id", header: "Txn ID", render: (s) => formatId(s.id) },
    { key: "date", header: "Date", render: (s) => formatDate(s.date) },
    {
      key: "client",
      header: "Client",
      render: (s) => clientMap.get(s.clientId)?.name ?? s.client ?? formatId(s.clientId),
    },
    {
      key: "worker",
      header: "Sold by",
      render: (s) => userMap.get(s.workerId)?.name ?? s.worker ?? formatId(s.workerId),
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
    <DashboardShell role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Transactions</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Token sales across all workers and clients.
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
        emptyMessage={loading ? "Loading transactions…" : "No transactions yet."}
      />
    </DashboardShell>
  );
}
