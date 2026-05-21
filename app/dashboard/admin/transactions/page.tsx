"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, type Column } from "@/components/DataTable";
import { mockSales } from "@/lib/mockData";
import type { TokenSale } from "@/lib/types";

const columns: Column<TokenSale>[] = [
  { key: "id", header: "Txn ID" },
  { key: "date", header: "Date" },
  { key: "client", header: "Client" },
  { key: "worker", header: "Sold by" },
  { key: "tokens", header: "Tokens", align: "right" },
  { key: "amount", header: "Amount (BDT)", align: "right", render: (s) => s.amount.toLocaleString() },
];

export default function AdminTransactionsPage() {
  return (
    <DashboardShell role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Transactions</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Token sales across all workers and clients.
        </p>
      </div>
      <DataTable<TokenSale> columns={columns} rows={mockSales} />
    </DashboardShell>
  );
}
