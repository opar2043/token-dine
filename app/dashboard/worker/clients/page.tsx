"use client";

import { useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, type Column } from "@/components/DataTable";
import { mockClients } from "@/lib/mockData";
import type { Client } from "@/lib/types";

const columns: Column<Client>[] = [
  { key: "id", header: "Client ID" },
  { key: "name", header: "Name" },
  { key: "mobile", header: "Mobile" },
  { key: "nid", header: "NID" },
  { key: "tokensBought", header: "Bought", align: "right" },
  { key: "tokensSpent", header: "Spent", align: "right" },
  { key: "balance", header: "Balance", align: "right" },
  { key: "createdAt", header: "Joined" },
];

export default function WorkerClientsPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockClients;
    return mockClients.filter(
      (c) =>
        c.mobile.toLowerCase().includes(q) ||
        c.nid.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <DashboardShell role="worker">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Clients</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Search existing clients by mobile or NID.
        </p>
      </div>

      <div className="mb-4">
        <input
          className="input max-w-md"
          placeholder="Search by name, mobile or NID…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <DataTable<Client>
        columns={columns}
        rows={filtered}
        emptyMessage="No clients match your search."
      />
    </DashboardShell>
  );
}
